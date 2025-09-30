import React, { useState, useEffect, useRef } from 'react';
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
  const tagInputRef = useRef<HTMLInputElement>(null);

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
    const parts = input.split('/').filter(p => p);

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
      } as Tag;
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
      // Build the parent path
      const currentDepth = parts.length - 1;
      const parentPath = currentDepth === 0 ? null : '/' + parts.slice(0, currentDepth).join('/');
      const searchTerm = parts[parts.length - 1];

      // Filter tags at the appropriate level
      const suggestions = combinedTags.filter(t => {
        if (t.parentPath !== parentPath) return false;
        if (!t.name) return false;
        return t.name.toLowerCase().includes(searchTerm);
      });

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
        setSelectedIndex((prev) =>
          prev < filteredSuggestions.length - 1 ? prev + 1 : prev
        );
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
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

  return (
    <div className={className}>
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

        {/* Suggestions Dropdown */}
        {showSuggestions && filteredSuggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-base-100 border border-base-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {filteredSuggestions.map((tag, index) => (
              <button
                key={tag.id || tag.path}
                type="button"
                onClick={() => selectTag(tag)}
                className={`w-full text-left px-4 py-2 flex items-center justify-between ${
                  index === selectedIndex ? 'bg-base-200' : 'hover:bg-base-200'
                }`}
              >
                <span className="font-medium">{tag.path}</span>
                {tag.description && (
                  <span className="text-xs opacity-60 ml-2">{tag.description}</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      <label className="label">
        <span className="label-text-alt opacity-70">
          Start typing to search existing tags or create new ones. Press Enter to add.
        </span>
      </label>
    </div>
  );
};

export default TagInput;
