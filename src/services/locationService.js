/**
 * Location Service
 * Handles getting user's geographic location using browser Geolocation API
 * with IP-based fallback for when permission is denied or unavailable
 */

/**
 * Get user's location using browser Geolocation API
 * @returns {Promise<{latitude: number, longitude: number, city?: string, country?: string}>}
 */
export const getUserLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        // Try to get city name from coordinates using reverse geocoding
        try {
          const cityInfo = await reverseGeocode(location.latitude, location.longitude);
          resolve({ ...location, ...cityInfo });
        } catch (error) {
          // Return location without city info if reverse geocoding fails
          resolve(location);
        }
      },
      (error) => {
        let errorMessage = 'Unable to retrieve your location';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission denied. Using fallback method...';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
        }
        
        reject(new Error(errorMessage));
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000, // Cache for 5 minutes
      }
    );
  });
};

/**
 * Get user's location using IP address (fallback method)
 * Uses ipapi.co free API (no key required, 1000 requests/day)
 * @returns {Promise<{latitude: number, longitude: number, city: string, country: string}>}
 */
export const getLocationByIP = async () => {
  try {
    const response = await fetch('https://ipapi.co/json/');
    
    if (!response.ok) {
      throw new Error('Failed to fetch location from IP');
    }
    
    const data = await response.json();
    
    return {
      latitude: data.latitude,
      longitude: data.longitude,
      city: data.city,
      country: data.country_name,
      region: data.region,
    };
  } catch (error) {
    throw new Error(`IP-based location failed: ${error.message}`);
  }
};

/**
 * Reverse geocode coordinates to get city/country information
 * Uses OpenStreetMap Nominatim API (free, no key required)
 * @param {number} latitude 
 * @param {number} longitude 
 * @returns {Promise<{city: string, country: string}>}
 */
export const reverseGeocode = async (latitude, longitude) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`
    );
    
    if (!response.ok) {
      throw new Error('Reverse geocoding failed');
    }
    
    const data = await response.json();
    
    return {
      city: data.address.city || data.address.town || data.address.village || data.address.county || 'Unknown',
      country: data.address.country || 'Unknown',
      region: data.address.state || data.address.region || '',
    };
  } catch (error) {
    console.warn('Reverse geocoding error:', error);
    return { city: 'Unknown', country: 'Unknown' };
  }
};

/**
 * Get location with automatic fallback
 * Tries browser geolocation first, falls back to IP-based location
 * @returns {Promise<{latitude: number, longitude: number, city: string, country: string, method: string}>}
 */
export const getLocation = async () => {
  try {
    const location = await getUserLocation();
    return { ...location, method: 'geolocation' };
  } catch (error) {
    console.warn('Geolocation failed, using IP fallback:', error.message);
    
    try {
      const location = await getLocationByIP();
      return { ...location, method: 'ip' };
    } catch (ipError) {
      throw new Error(`All location methods failed: ${ipError.message}`);
    }
  }
};

/**
 * Get location by city name (for search functionality)
 * Uses OpenStreetMap Nominatim API
 * @param {string} cityName 
 * @returns {Promise<{latitude: number, longitude: number, city: string, country: string}>}
 */
export const getLocationByCity = async (cityName) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cityName)}&limit=1`
    );
    
    if (!response.ok) {
      throw new Error('City search failed');
    }
    
    const data = await response.json();
    
    if (data.length === 0) {
      throw new Error(`City "${cityName}" not found`);
    }
    
    const result = data[0];
    
    return {
      latitude: parseFloat(result.lat),
      longitude: parseFloat(result.lon),
      city: result.name,
      country: result.display_name.split(', ').pop(),
      displayName: result.display_name,
    };
  } catch (error) {
    throw new Error(`Failed to find city: ${error.message}`);
  }
};

/**
 * Search for cities with autocomplete suggestions (like Google Maps)
 * Uses OpenStreetMap Nominatim API
 * @param {string} query - The search query
 * @param {number} limit - Maximum number of results (default: 5)
 * @returns {Promise<Array<{id: string, name: string, displayName: string, latitude: number, longitude: number, type: string}>>}
 */
export const searchCities = async (query, limit = 5) => {
  if (!query || query.trim().length < 2) {
    return [];
  }

  try {
    // Add addressdetails for better formatting and restrict to cities/towns
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?` +
      `format=json&` +
      `q=${encodeURIComponent(query)}&` +
      `limit=${limit}&` +
      `addressdetails=1&` +
      `featuretype=city`
    );
    
    if (!response.ok) {
      throw new Error('City search failed');
    }
    
    const data = await response.json();
    
    return data.map(result => ({
      id: result.place_id.toString(),
      name: result.name || result.address?.city || result.address?.town || result.address?.village,
      displayName: result.display_name,
      latitude: parseFloat(result.lat),
      longitude: parseFloat(result.lon),
      type: result.type,
      city: result.address?.city || result.address?.town || result.address?.village || result.name,
      state: result.address?.state || result.address?.region || '',
      country: result.address?.country || '',
    }));
  } catch (error) {
    console.warn('City search error:', error);
    return [];
  }
};
