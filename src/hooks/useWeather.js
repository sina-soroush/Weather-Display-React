import { useState, useEffect } from 'react';
import { getCurrentWeather, getWeatherForecast, getWeatherByCity } from '../services/weatherService';

/**
 * Custom hook for fetching weather data
 * @param {Object} location - Location object with latitude/longitude
 * @param {string} units - 'metric' or 'imperial'
 * @param {boolean} autoFetch - Whether to fetch automatically when location changes
 */
const useWeather = (location = null, units = 'metric', autoFetch = true) => {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch current weather and forecast for coordinates
   */
  const fetchWeather = async (lat, lon, unit = units) => {
    if (!lat || !lon) {
      setError('Invalid coordinates');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch both current weather and forecast in parallel
      const [currentData, forecastData] = await Promise.all([
        getCurrentWeather(lat, lon, unit),
        getWeatherForecast(lat, lon, unit),
      ]);

      setWeather(currentData);
      setForecast(forecastData);
      return { weather: currentData, forecast: forecastData };
    } catch (err) {
      setError(err.message);
      setWeather(null);
      setForecast(null);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch weather by city name
   */
  const fetchWeatherByCity = async (cityName, unit = units) => {
    if (!cityName || cityName.trim() === '') {
      setError('Please enter a city name');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const weatherData = await getWeatherByCity(cityName, unit);
      
      // Fetch forecast using the coordinates from weather data
      const forecastData = await getWeatherForecast(
        weatherData.latitude,
        weatherData.longitude,
        unit
      );

      setWeather(weatherData);
      setForecast(forecastData);
      return { weather: weatherData, forecast: forecastData };
    } catch (err) {
      setError(err.message);
      setWeather(null);
      setForecast(null);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Refresh weather data
   */
  const refresh = () => {
    if (location && location.latitude && location.longitude) {
      fetchWeather(location.latitude, location.longitude);
    }
  };

  /**
   * Clear weather data and error
   */
  const clearWeather = () => {
    setWeather(null);
    setForecast(null);
    setError(null);
  };

  /**
   * Change temperature units
   */
  const changeUnits = async (newUnits) => {
    if (location && location.latitude && location.longitude) {
      await fetchWeather(location.latitude, location.longitude, newUnits);
    } else if (weather && weather.latitude && weather.longitude) {
      await fetchWeather(weather.latitude, weather.longitude, newUnits);
    }
  };

  // Auto-fetch when location changes
  useEffect(() => {
    if (autoFetch && location && location.latitude && location.longitude) {
      fetchWeather(location.latitude, location.longitude);
    }
  }, [location?.latitude, location?.longitude]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    weather,
    forecast,
    loading,
    error,
    fetchWeather,
    fetchWeatherByCity,
    refresh,
    clearWeather,
    changeUnits,
  };
};

export default useWeather;
