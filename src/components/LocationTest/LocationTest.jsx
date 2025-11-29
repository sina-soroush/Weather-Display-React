import { useState } from 'react';
import useGeolocation from '../../hooks/useGeolocation';
import Button from '../Button/Button';
import SearchBar from '../SearchBar/SearchBar';
import './LocationTest.scss';

const LocationTest = () => {
  const { location, loading, error, searchCity, retry } = useGeolocation(true);
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = () => {
    if (searchValue.trim()) {
      searchCity(searchValue);
    }
  };

  const refreshIcon = (
    <svg className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
      <path d="M20 4C28.8 4 36 11.2 36 20 36 28.8 28.8 36 20 36 11.2 36 4 28.8 4 20 4 15.6 6 11.6 9.2 8.8L12 11.6C9.6 13.6 8 16.6 8 20 8 26.6 13.4 32 20 32 26.6 32 32 26.6 32 20 32 13.4 26.6 8 20 8L20 12 14 6 20 0 20 4Z"/>
    </svg>
  );

  return (
    <div className="location-test">
      <div className="location-test__header">
        <h2>Geolocation Test</h2>
        <p className="subtitle">Step 3: Location API Integration</p>
      </div>

      <div className="location-test__search">
        <SearchBar 
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onSearch={handleSearch}
          placeholder="Search for a city..."
        />
      </div>

      {loading && (
        <div className="location-test__card loading">
          <div className="spinner"></div>
          <p>Getting your location...</p>
        </div>
      )}

      {error && !loading && (
        <div className="location-test__card error">
          <h3>❌ Error</h3>
          <p>{error}</p>
          <Button variant="oval-sm" onClick={retry} icon={refreshIcon}>
            Retry
          </Button>
        </div>
      )}

      {location && !loading && (
        <div className="location-test__card success">
          <h3>✓ Location Found</h3>
          <div className="location-info">
            <div className="info-row">
              <span className="label">City:</span>
              <span className="value">{location.city || 'Unknown'}</span>
            </div>
            <div className="info-row">
              <span className="label">Country:</span>
              <span className="value">{location.country || 'Unknown'}</span>
            </div>
            <div className="info-row">
              <span className="label">Latitude:</span>
              <span className="value">{location.latitude.toFixed(4)}°</span>
            </div>
            <div className="info-row">
              <span className="label">Longitude:</span>
              <span className="value">{location.longitude.toFixed(4)}°</span>
            </div>
            <div className="info-row">
              <span className="label">Method:</span>
              <span className="value method">
                {location.method === 'geolocation' && '📍 Browser Geolocation'}
                {location.method === 'ip' && '🌐 IP-based'}
                {location.method === 'search' && '🔍 City Search'}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="location-test__info">
        <h4>How it works:</h4>
        <ul>
          <li>✓ Tries browser Geolocation API first (requires permission)</li>
          <li>✓ Falls back to IP-based location if permission denied</li>
          <li>✓ Search for any city using the search bar above</li>
          <li>✓ Coordinates will be used for weather API in Step 4</li>
        </ul>
      </div>
    </div>
  );
};

export default LocationTest;
