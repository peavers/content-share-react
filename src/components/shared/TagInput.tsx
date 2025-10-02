import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import type { Tag } from '../../generated';

interface TagInputProps {
  allTags: Tag[];
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  placeholder?: string;
  className?: string;
}

const TagInput: React.FC<TagInputProps> = ({
  allTags,
  selectedTags,
  onTagsChange,
  placeholder = "Type to search tags (e.g., /news or /news/americas)",
  className = ""
}) => {
  const [tagInput, setTagInput] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState<Tag[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const tagInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Update dropdown position when shown
  useEffect(() => {
    if (showSuggestions && tagInputRef.current) {
      const rect = tagInputRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
  }, [showSuggestions]);

  useEffect(() => {
    // Reset selected index when suggestions change
    setSelectedIndex(-1);

    // Filter suggestions based on input
    if (!tagInput.trim()) {
      setFilteredSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const input = tagInput.toLowerCase();
    const endsWithSlash = input.endsWith('/');

    // Split but don't filter empty parts yet - we need to know if there's a trailing slash
    const allParts = input.split('/');
    const parts = allParts.filter(p => p); // Filtered parts for path building

    // Build a combined list of existing tags + locally selected tags
    const localTags = selectedTags.map(path => {
      const pathParts = path.split('/').filter(p => p);
      const name = pathParts[pathParts.length - 1];
      const depth = pathParts.length - 1;
      const parentPath = depth === 0 ? null : '/' + pathParts.slice(0, depth).join('/');

      return {
        id: undefined,
        path,
        name,
        depth,
        parentPath
      } as unknown as Tag;
    });

    // Combine and deduplicate (prefer existing tags)
    const existingPaths = new Set(allTags.map(t => t.path));
    const combinedTags = [
      ...allTags,
      ...localTags.filter(t => !existingPaths.has(t.path))
    ];

    if (parts.length === 0) {
      // Show root tags
      const suggestions = combinedTags.filter(t => t.depth === 0);
      setFilteredSuggestions(suggestions);
      setShowSuggestions(suggestions.length > 0);
    } else {
      // If input ends with '/', we want to show children of the complete path typed so far
      let parentPath: string | null;
      let searchTerm: string;

      if (endsWithSlash) {
        // User typed "/gaming/" - show all children of /gaming
        parentPath = '/' + parts.join('/');
        searchTerm = '';
      } else {
        // User typed "/gaming/fps" - show children of /gaming that match "fps"
        const currentDepth = parts.length - 1;
        parentPath = currentDepth === 0 ? null : '/' + parts.slice(0, currentDepth).join('/');
        searchTerm = parts[parts.length - 1];
      }

      console.log('[TagInput] Search:', { input, parentPath, searchTerm, endsWithSlash });

      // Filter tags at the appropriate level
      const suggestions = combinedTags.filter(t => {
        if (t.parentPath !== parentPath) return false;
        if (!t.name) return false;

        // If no search term (trailing slash), show all children
        if (searchTerm === '') {
          return true;
        }

        return t.name.toLowerCase().includes(searchTerm);
      });

      console.log('[TagInput] Found suggestions:', suggestions.map(s => s.path));

      setFilteredSuggestions(suggestions);
      setShowSuggestions(suggestions.length > 0);
    }
  }, [tagInput, allTags, selectedTags]);

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Ensure it starts with /
    if (value && !value.startsWith('/')) {
      setTagInput('/' + value);
    } else {
      setTagInput(value);
    }
  };

  const selectTag = (tag: Tag) => {
    if (tag.path && !selectedTags.includes(tag.path)) {
      onTagsChange([...selectedTags, tag.path]);
    }
    setTagInput('');
    setShowSuggestions(false);
    setSelectedIndex(-1);
    tagInputRef.current?.focus();
  };

  const removeTag = (tagPath: string) => {
    onTagsChange(selectedTags.filter(t => t !== tagPath));
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (filteredSuggestions.length > 0) {
        setShowSuggestions(true);
        setSelectedIndex((prev) =>
          prev < filteredSuggestions.length - 1 ? prev + 1 : prev
        );
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (filteredSuggestions.length > 0) {
        setShowSuggestions(true);
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
      }
    } else if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();

      // If a suggestion is selected via keyboard, use it
      if (selectedIndex >= 0 && filteredSuggestions[selectedIndex]) {
        selectTag(filteredSuggestions[selectedIndex]);
      } else if (filteredSuggestions.length === 1) {
        // If there's exactly one suggestion, use it
        selectTag(filteredSuggestions[0]);
      } else {
        // Create new tag with the input
        const newTagPath = tagInput.trim();
        if (!selectedTags.includes(newTagPath)) {
          onTagsChange([...selectedTags, newTagPath]);
        }
        setTagInput('');
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  };

  // Render dropdown using portal
  const renderDropdown = () => {
    if (!showSuggestions || filteredSuggestions.length === 0) return null;

    return createPortal(
      <>
        {/* Invisible backdrop to close dropdown */}
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9998
          }}
          onClick={() => setShowSuggestions(false)}
        />
        {/* Dropdown menu */}
        <div
          style={{
            position: 'fixed',
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`,
            width: `${dropdownPosition.width}px`,
            zIndex: 9999
          }}
          className="mt-1 shadow-2xl"
        >
          <ul className="menu bg-base-100 rounded-box border border-base-300 max-h-80 overflow-y-auto p-2">
            {filteredSuggestions.map((tag, index) => (
              <li key={tag.id || tag.path}>
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    selectTag(tag);
                  }}
                  className={`flex items-start justify-between gap-3 ${index === selectedIndex ? 'active' : ''}`}
                >
                  <div className="flex flex-col items-start flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      <span className="font-medium truncate">{tag.path}</span>
                    </div>
                    {tag.description && (
                      <span className="text-xs opacity-60 ml-6 truncate w-full">{tag.description}</span>
                    )}
                  </div>
                  <kbd className="kbd kbd-sm">↵</kbd>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </>,
      document.body
    );
  };

  return (
    <div ref={containerRef} className={className}>
      {/* Selected Tags */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedTags.map((tag) => (
            <div key={tag} className="badge badge-primary gap-2 p-3">
              <span>{tag}</span>
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="hover:text-error"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Tag Input with Autocomplete */}
      <div className="relative">
        <input
          ref={tagInputRef}
          type="text"
          placeholder={placeholder}
          className="input input-bordered w-full"
          value={tagInput}
          onChange={handleTagInputChange}
          onKeyDown={handleTagInputKeyDown}
          onFocus={() => tagInput && setShowSuggestions(filteredSuggestions.length > 0)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        />
      </div>

      <label className="label">
        <span className="label-text-alt opacity-70 text-wrap break-words">
          Type "/" to browse tags. Add "/" at the end to show children (e.g., /gaming/). Press Enter to select.
        </span>
      </label>

      {/* Render dropdown via portal */}
      {renderDropdown()}
    </div>
  );
};

export default TagInput;
