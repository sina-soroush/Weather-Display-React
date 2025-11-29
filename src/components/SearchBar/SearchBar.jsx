import './SearchBar.scss';

const SearchBar = ({ 
  value,
  placeholder = 'Search for...',
  onChange,
  onSearch,
  className = ''
}) => {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(value);
    }
  };

  return (
    <div className={`search ${className}`}>
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
      />
    </div>
  );
};

export default SearchBar;
