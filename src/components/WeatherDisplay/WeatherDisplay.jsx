import { useState, useEffect, useCallback } from 'react';
import useGeolocation from '../../hooks/useGeolocation';
import useWeather from '../../hooks/useWeather';
import { getWeatherIconUrl, getWindDirection, formatTime, getWeatherIconPath } from '../../services/weatherService';
import { searchCities } from '../../services/locationService';
import Button from '../Button/Button';
import SearchBar from '../SearchBar/SearchBar';
import Toggle from '../Toggle/Toggle';
import Graph from '../Graph/Graph';
import './WeatherDisplay.scss';

const WeatherDisplay = () => {
  const { location, loading: locationLoading, error: locationError, searchCity } = useGeolocation(true);
  const { weather, forecast, loading: weatherLoading, error: weatherError, fetchWeatherByCity, changeUnits } = useWeather(location, 'metric', true);
  
  const [searchValue, setSearchValue] = useState('');
  const [units, setUnits] = useState('metric');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  // Debounce function for search
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  // Fetch city suggestions
  const fetchSuggestions = useCallback(
    debounce(async (query) => {
      if (query.trim().length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      setSearchLoading(true);
      try {
        const results = await searchCities(query, 5);
        setSuggestions(results);
        setShowSuggestions(results.length > 0);
      } catch (error) {
        console.error('Failed to fetch suggestions:', error);
        setSuggestions([]);
      } finally {
        setSearchLoading(false);
      }
    }, 400),
    []
  );

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    fetchSuggestions(value);
  };

  // Handle suggestion selection
  const handleSuggestionSelect = async (suggestion) => {
    setSearchValue(suggestion.name);
    setSuggestions([]);
    setShowSuggestions(false);
    
    try {
      // Use the coordinates from the suggestion
      await fetchWeatherByCity(suggestion.city, units);
    } catch (error) {
      console.error('Failed to fetch weather:', error);
    }
  };

  const handleSearch = async () => {
    if (searchValue.trim()) {
      try {
        setShowSuggestions(false);
        await searchCity(searchValue);
        await fetchWeatherByCity(searchValue, units);
      } catch (error) {
        console.error('Search failed:', error);
      }
    }
  };

  const handleUnitToggle = async (isImperial) => {
    const newUnits = isImperial ? 'imperial' : 'metric';
    setUnits(newUnits);
    await changeUnits(newUnits);
  };

  const refreshIcon = (
    <svg className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
      <path d="M20 4C28.8 4 36 11.2 36 20 36 28.8 28.8 36 20 36 11.2 36 4 28.8 4 20 4 15.6 6 11.6 9.2 8.8L12 11.6C9.6 13.6 8 16.6 8 20 8 26.6 13.4 32 20 32 26.6 32 32 26.6 32 20 32 13.4 26.6 8 20 8L20 12 14 6 20 0 20 4Z"/>
    </svg>
  );

  const loading = locationLoading || weatherLoading;
  const error = locationError || weatherError;
  const isApiKeyError = error && (typeof error === 'string' ? error.includes('API key') : false);

  return (
    <div className="weather-display">
      <div className="weather-display__header">
        <div className="header-controls-row">
          <h1>Weather Display</h1>
        <div className="header-icon-row">
          <img src="/icons/thermometer.png" alt="Thermometer" className="header-icon" />
        </div>
          <div className="units-toggle">
            <span className={!units || units === 'metric' ? 'active' : ''}>°C</span>
            <Toggle 
              checked={units === 'imperial'}
              onChange={handleUnitToggle}
            />
            <span className={units === 'imperial' ? 'active' : ''}>°F</span>
          </div>

        </div>
      </div>

      <div className="weather-display__search">
        <SearchBar 
          value={searchValue}
          onChange={handleSearchChange}
          onSearch={handleSearch}
          onSuggestionSelect={handleSuggestionSelect}
          suggestions={suggestions}
          showSuggestions={showSuggestions}
          loading={searchLoading}
          placeholder="Search for a city... (type at least 2 characters)"
        />
      </div>

      {loading && (
        <div className="weather-display__loading">
          <div className="spinner"></div>
          <p>Loading weather data...</p>
        </div>
      )}

      {error && !loading && !isApiKeyError && (
        <div className="weather-display__error">
          <h3>❌ Error</h3>
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && weather && (
        <>
          <div className="weather-display__current">
            <div className="location-info">
              <h2>{weather.cityName || location?.city}</h2>
              <p className="country">{weather.country || location?.country}</p>
            </div>

            <div className="temperature-main">
              <img 
                src={getWeatherIconPath(weather.main)} 
                alt={weather.description}
                className="weather-icon"
              />
              <div className="temp-display">
                <span className="temp-value">{weather.temperature}°</span>
                <span className="temp-unit">{units === 'metric' ? 'C' : 'F'}</span>
              </div>
            </div>

            <p className="weather-description">
              {weather.description}
            </p>

            <div className="weather-details">
              <div className="detail-item">
                <span className="label">Feels Like</span>
                <span className="value">{weather.feelsLike}°</span>
              </div>
              <div className="detail-item">
                <span className="label">Humidity</span>
                <span className="value">{weather.humidity}%</span>
              </div>
              <div className="detail-item">
                <span className="label">Wind Speed</span>
                <span className="value">{weather.windSpeed} {units === 'metric' ? 'm/s' : 'mph'}</span>
              </div>
              <div className="detail-item">
                <span className="label">Wind Direction</span>
                <span className="value">{getWindDirection(weather.windDeg)} ({weather.windDeg}°)</span>
              </div>
              <div className="detail-item">
                <span className="label">Pressure</span>
                <span className="value">{weather.pressure} hPa</span>
              </div>
              <div className="detail-item">
                <span className="label">Visibility</span>
                <span className="value">{(weather.visibility / 1000).toFixed(1)} km</span>
              </div>
            </div>

            {weather.sunrise && weather.sunset && (
              <div className="sun-times">
                <div className="sun-time">
                  <span className="label">🌅 Sunrise</span>
                  <span className="value">{formatTime(weather.sunrise, weather.timezone)}</span>
                </div>
                <div className="sun-time">
                  <span className="label">🌇 Sunset</span>
                  <span className="value">{formatTime(weather.sunset, weather.timezone)}</span>
                </div>
              </div>
            )}
          </div>

          {forecast && forecast.forecast && (
            <div className="weather-display__forecast">
              <h3>5-Day Forecast</h3>
              <div className="forecast-container">
                {forecast.forecast.map((day, index) => {
                  const maxTemp = Math.max(...forecast.forecast.map(d => d.tempMax));
                  const barHeight = Math.round((day.tempMax / maxTemp) * 100);
                  
                  return (
                    <div key={index} className="forecast-day">
                      <div 
                        className="graph__line"
                        style={{
                          height: `${barHeight}%`
                        }}
                      >
                        <div 
                          className="graph__fill"
                          style={{
                            height: `${Math.max(barHeight - 8, 0)}%`
                          }}
                        ></div>
                      </div>
                      <span className="day-name">
                        {new Date(day.date * 1000).toLocaleDateString('en-US', { weekday: 'short' })}
                      </span>
                      <span className="day-temp">{day.tempMax}°/{day.tempMin}°</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default WeatherDisplay;
