import { useState, useEffect } from 'react';
import { getLocation, getLocationByCity } from '../services/locationService';

/**
 * Custom hook for handling geolocation
 * Automatically fetches user's location on mount
 * Provides methods to search for locations by city name
 */
const useGeolocation = (autoFetch = true) => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch user's current location
   */
  const fetchLocation = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const locationData = await getLocation();
      setLocation(locationData);
      return locationData;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Search for a location by city name
   * @param {string} cityName 
   */
  const searchCity = async (cityName) => {
    if (!cityName || cityName.trim() === '') {
      setError('Please enter a city name');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const locationData = await getLocationByCity(cityName);
      setLocation({ ...locationData, method: 'search' });
      return locationData;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Clear current location and error
   */
  const clearLocation = () => {
    setLocation(null);
    setError(null);
  };

  /**
   * Retry fetching location
   */
  const retry = () => {
    setError(null);
    fetchLocation();
  };

  // Auto-fetch location on mount if enabled
  useEffect(() => {
    if (autoFetch) {
      fetchLocation();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    location,
    loading,
    error,
    fetchLocation,
    searchCity,
    clearLocation,
    retry,
  };
};

export default useGeolocation;
