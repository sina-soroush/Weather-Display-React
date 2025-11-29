import { useState, useEffect, useRef } from 'react';
import './SearchBar.scss';

const SearchBar = ({ 
  value,
  placeholder = 'Search for...',
  onChange,
  onSearch,
  onSuggestionSelect,
  suggestions = [],
  showSuggestions = false,
  loading = false,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    setIsOpen(showSuggestions && suggestions.length > 0 && value.length > 0);
  }, [showSuggestions, suggestions, value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(value);
      setIsOpen(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    if (onSuggestionSelect) {
      onSuggestionSelect(suggestion);
    }
    setIsOpen(false);
  };

  return (
    <div className={`search ${className}`} ref={searchRef}>
      <svg className="search__icon icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
        <path d="M18 3C26.3 3 33.1 9.7 33.1 18 33.1 21.5 31.9 24.7 29.9 27.3L37 34.4 34.4 37 27.3 29.9C24.7 31.9 21.5 33.1 18 33.1 9.7 33.1 3 26.3 3 18 3 9.7 9.7 3 18 3ZM18.1 6.9C11.9 6.9 6.9 11.9 6.9 18.1 6.9 24.2 11.9 29.2 18.1 29.2 24.2 29.2 29.2 24.2 29.2 18.1 29.2 11.9 24.2 6.9 18.1 6.9Z"/>
      </svg>
      <input 
        className="search__input oval-xlg"
        type="text" 
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyPress={handleKeyPress}
        onFocus={() => setIsOpen(showSuggestions && suggestions.length > 0)}
      />
      {loading && (
        <div className="search__loading">
          <div className="search__spinner"></div>
        </div>
      )}
      {isOpen && (
        <div className="search__suggestions">
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              className="search__suggestion-item"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <div className="suggestion-icon">📍</div>
              <div className="suggestion-content">
                <div className="suggestion-name">{suggestion.name}</div>
                <div className="suggestion-details">
                  {[suggestion.state, suggestion.country].filter(Boolean).join(', ')}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
