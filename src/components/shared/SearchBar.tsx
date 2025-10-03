import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSearch } from '../../hooks';
import type { VideoSearchDocument, UserSearchDocument, OrganizationSearchDocument } from '../../generated';

interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = 'Search videos, users, organizations...',
  className = ''
}) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const { results, loading, search } = useSearch();

  // Instant results for dropdown (limit to 4 videos, 3 users, 2 orgs)
  const instantResults = {
    videos: results?.videos?.slice(0, 4) || [],
    users: results?.users?.slice(0, 3) || [],
    organizations: results?.organizations?.slice(0, 2) || []
  };

  const hasResults = instantResults.videos.length > 0 ||
                     instantResults.users.length > 0 ||
                     instantResults.organizations.length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setShowDropdown(false);
      if (onSearch) {
        onSearch(query);
      } else {
        navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      }
    }
  };

  const handleClear = () => {
    setQuery('');
    setShowDropdown(false);
    inputRef.current?.focus();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setShowDropdown(value.trim().length > 0);

    // Debounce API calls
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (value.trim().length > 0) {
      debounceTimerRef.current = setTimeout(() => {
        search(value, 10);
      }, 300); // 300ms debounce
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (query.trim().length > 0) {
      setShowDropdown(true);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Delay hiding dropdown to allow clicking on results
    setTimeout(() => setShowDropdown(false), 200);
  };

  // Keyboard shortcut: Cmd+K or Ctrl+K to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
      // Escape to close dropdown
      if (e.key === 'Escape') {
        setShowDropdown(false);
        inputRef.current?.blur();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      // Cleanup debounce timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const formatDuration = (seconds: number | null | undefined): string => {
    if (!seconds) return '0:00';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSubmit}>
        <div className={`relative flex items-center transition-all duration-200 rounded-full bg-base-100 border ${
          isFocused ? 'border-primary shadow-lg' : 'border-base-300'
        } hover:border-base-content/30`}>
          {/* Search Icon */}
          <button
            type="submit"
            className="btn btn-ghost btn-sm btn-circle ml-2 flex-shrink-0"
            aria-label="Search"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-base-content/60"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>

          {/* Input */}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            className="input input-ghost w-full px-2 focus:outline-none text-sm bg-transparent border-none"
          />

          {/* Keyboard Shortcut Hint (when not focused and empty) */}
          {!isFocused && !query && (
            <div className="hidden sm:flex items-center gap-1 mr-3 text-xs text-base-content/40 flex-shrink-0">
              <kbd className="kbd kbd-xs">⌘</kbd>
              <kbd className="kbd kbd-xs">K</kbd>
            </div>
          )}

          {/* Clear Button (when has text) */}
          {query && (
            <button
              type="button"
              onMouseDown={handleClear} // Use onMouseDown instead of onClick to fire before blur
              className="btn btn-ghost btn-sm btn-circle mr-2 flex-shrink-0"
              aria-label="Clear search"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-base-content/60"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      </form>

      {/* Instant Results Dropdown */}
      {showDropdown && query.trim() && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 bg-base-100 rounded-2xl shadow-2xl border border-base-300 overflow-hidden z-50 max-h-[70vh] overflow-y-auto"
        >
          {loading ? (
            <div className="p-8 text-center">
              <span className="loading loading-spinner loading-md"></span>
            </div>
          ) : !hasResults ? (
            <div className="p-8 text-center">
              <p className="text-base-content/60">No results found</p>
            </div>
          ) : (
            <div className="py-2">
              {/* Videos */}
              {instantResults.videos.length > 0 && (
                <div className="px-3 py-2">
                  <div className="text-xs font-semibold text-base-content/50 uppercase tracking-wider mb-2 px-2">
                    Videos
                  </div>
                  {instantResults.videos.map(video => (
                    <Link
                      key={video.videoId}
                      to={`/video/${video.videoId}`}
                      className="flex items-start gap-3 p-2 rounded-lg hover:bg-base-200 transition-colors"
                      onMouseDown={(e) => {
                        // Prevent blur from happening before navigation
                        e.preventDefault();
                        navigate(`/video/${video.videoId}`);
                        setShowDropdown(false);
                        setQuery('');
                      }}
                    >
                      {/* Thumbnail */}
                      <div className="w-28 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center flex-shrink-0 relative">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-8 w-8 text-base-content/30"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {video.durationSeconds && (
                          <span className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 rounded font-mono">
                            {formatDuration(video.durationSeconds)}
                          </span>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm line-clamp-2 mb-1">
                          {video.title || 'Untitled Video'}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-base-content/60">
                          <span>{video.userFullName || video.userUsername}</span>
                          {video.organizationName && (
                            <>
                              <span>•</span>
                              <span>{video.organizationName}</span>
                            </>
                          )}
                        </div>
                        {video.tags && video.tags.length > 0 && (
                          <div className="flex gap-1 mt-1">
                            {video.tags.slice(0, 2).map((tag, idx) => (
                              <span key={idx} className="badge badge-xs badge-ghost">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Users */}
              {instantResults.users.length > 0 && (
                <div className="px-3 py-2 border-t border-base-300">
                  <div className="text-xs font-semibold text-base-content/50 uppercase tracking-wider mb-2 px-2">
                    Users
                  </div>
                  {instantResults.users.map(user => (
                    <div
                      key={user.userId}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-base-200 transition-colors cursor-pointer"
                    >
                      <div className="avatar placeholder">
                        <div className="bg-primary text-primary-content rounded-full w-10 h-10">
                          <span className="text-sm">
                            {user.firstName?.[0] || user.username[0].toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm">{user.fullName}</div>
                        <div className="text-xs text-base-content/60">@{user.username}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Organizations */}
              {instantResults.organizations.length > 0 && (
                <div className="px-3 py-2 border-t border-base-300">
                  <div className="text-xs font-semibold text-base-content/50 uppercase tracking-wider mb-2 px-2">
                    Organizations
                  </div>
                  {instantResults.organizations.map(org => (
                    <div
                      key={org.organizationId}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-base-200 transition-colors cursor-pointer"
                    >
                      <div className="avatar placeholder">
                        <div className="bg-secondary text-secondary-content rounded-lg w-10 h-10">
                          <span className="text-sm">
                            {org.name[0].toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm">{org.name}</div>
                        {org.organizationType && (
                          <div className="text-xs text-base-content/60">{org.organizationType}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* View All Results Link */}
              <div className="px-3 py-2 border-t border-base-300">
                <Link
                  to={`/search?q=${encodeURIComponent(query.trim())}`}
                  className="flex items-center justify-center gap-2 p-3 rounded-lg hover:bg-base-200 transition-colors text-sm font-semibold text-primary"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
                    setShowDropdown(false);
                  }}
                >
                  <span>View all results</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
