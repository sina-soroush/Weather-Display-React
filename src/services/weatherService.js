const BASE_URL = 'https://api.open-meteo.com/v1/forecast';
const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';

const getWeatherCondition = (weatherCode) => {
  if (weatherCode === 0) return { main: 'Clear', description: 'clear sky' };
  if (weatherCode <= 3) return { main: 'Clouds', description: 'partly cloudy' };
  if (weatherCode <= 48) return { main: 'Fog', description: 'foggy' };
  if (weatherCode <= 67) return { main: 'Rain', description: 'rainy' };
  if (weatherCode <= 77) return { main: 'Snow', description: 'snowy' };
  if (weatherCode <= 82) return { main: 'Rain', description: 'rain showers' };
  if (weatherCode <= 86) return { main: 'Snow', description: 'snow showers' };
  if (weatherCode <= 99) return { main: 'Thunderstorm', description: 'thunderstorm' };
  return { main: 'Clear', description: 'clear' };
};

const getWeatherIcon = (weatherCode, isDay = true) => {
  const condition = getWeatherCondition(weatherCode);
  const timeCode = isDay ? 'd' : 'n';
  
  const iconMap = {
    'Clear': `01${timeCode}`,
    'Clouds': `03${timeCode}`,
    'Rain': `10${timeCode}`,
    'Snow': `13${timeCode}`,
    'Thunderstorm': `11${timeCode}`,
    'Fog': `50${timeCode}`,
  };
  
  return iconMap[condition.main] || `01${timeCode}`;
};

export const getCurrentWeather = async (latitude, longitude, units = 'metric') => {
  try {
    const tempUnit = units === 'imperial' ? 'fahrenheit' : 'celsius';
    const windSpeedUnit = units === 'imperial' ? 'mph' : 'ms';
    
    const response = await fetch(
      `${BASE_URL}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m&temperature_unit=${tempUnit}&wind_speed_unit=${windSpeedUnit}&timezone=auto`
    );

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }

    const data = await response.json();
    const current = data.current;
    const condition = getWeatherCondition(current.weather_code);
    const isDay = new Date().getHours() >= 6 && new Date().getHours() < 20;
    
    let cityName = 'Unknown';
    try {
      const geoResponse = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
      );
      if (geoResponse.ok) {
        const geoData = await geoResponse.json();
        cityName = geoData.address.city || geoData.address.town || geoData.address.village || 'Unknown';
      }
    } catch (e) {
      console.warn('Failed to get city name:', e);
    }
    
    return {
      temperature: Math.round(current.temperature_2m),
      feelsLike: Math.round(current.apparent_temperature),
      tempMin: Math.round(current.temperature_2m - 2),
      tempMax: Math.round(current.temperature_2m + 2),
      humidity: current.relative_humidity_2m,
      pressure: Math.round(current.pressure_msl || current.surface_pressure),
      description: condition.description,
      main: condition.main,
      icon: getWeatherIcon(current.weather_code, isDay),
      windSpeed: current.wind_speed_10m,
      windDeg: current.wind_direction_10m,
      clouds: current.cloud_cover,
      visibility: 10000,
      sunrise: null,
      sunset: null,
      timezone: 0,
      cityName: cityName,
      country: '',
      timestamp: Math.floor(new Date(current.time).getTime() / 1000),
    };
  } catch (error) {
    throw new Error(`Failed to fetch weather data: ${error.message}`);
  }
};

export const getWeatherForecast = async (latitude, longitude, units = 'metric') => {
  try {
    const tempUnit = units === 'imperial' ? 'fahrenheit' : 'celsius';
    const windSpeedUnit = units === 'imperial' ? 'mph' : 'ms';
    
    const response = await fetch(
      `${BASE_URL}?latitude=${latitude}&longitude=${longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,rain_sum,showers_sum,snowfall_sum,wind_speed_10m_max&hourly=temperature_2m,weather_code&temperature_unit=${tempUnit}&wind_speed_unit=${windSpeedUnit}&timezone=auto&forecast_days=7`
    );

    if (!response.ok) {
      throw new Error(`Forecast API error: ${response.status}`);
    }

    const data = await response.json();
    
    const forecast = data.daily.time.slice(0, 5).map((date, index) => {
      const condition = getWeatherCondition(data.daily.weather_code[index]);
      return {
        date: Math.floor(new Date(date).getTime() / 1000),
        tempMin: Math.round(data.daily.temperature_2m_min[index]),
        tempMax: Math.round(data.daily.temperature_2m_max[index]),
        tempAvg: Math.round((data.daily.temperature_2m_max[index] + data.daily.temperature_2m_min[index]) / 2),
        condition: condition.main,
        icon: getWeatherIcon(data.daily.weather_code[index], true),
        humidity: 0,
        windSpeed: data.daily.wind_speed_10m_max[index].toFixed(1),
        precipitation: data.daily.precipitation_sum[index] || 0,
        rain: data.daily.rain_sum[index] || 0,
      };
    });
    
    const hourly = data.hourly.time.slice(0, 8).map((time, index) => {
      const condition = getWeatherCondition(data.hourly.weather_code[index]);
      return {
        time: Math.floor(new Date(time).getTime() / 1000),
        temp: Math.round(data.hourly.temperature_2m[index]),
        icon: getWeatherIcon(data.hourly.weather_code[index], true),
        description: condition.description,
      };
    });
    
    return {
      city: 'Location',
      country: '',
      forecast: forecast,
      hourly: hourly,
    };
  } catch (error) {
    throw new Error(`Failed to fetch forecast data: ${error.message}`);
  }
};

export const getWeatherByCity = async (cityName, units = 'metric') => {
  try {
    const geoResponse = await fetch(
      `${GEOCODING_URL}?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`
    );

    if (!geoResponse.ok) {
      throw new Error(`Geocoding error: ${geoResponse.status}`);
    }

    const geoData = await geoResponse.json();
    
    if (!geoData.results || geoData.results.length === 0) {
      throw new Error(`City "${cityName}" not found.`);
    }

    const location = geoData.results[0];
    const tempUnit = units === 'imperial' ? 'fahrenheit' : 'celsius';
    const windSpeedUnit = units === 'imperial' ? 'mph' : 'ms';
    
    const weatherResponse = await fetch(
      `${BASE_URL}?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&temperature_unit=${tempUnit}&wind_speed_unit=${windSpeedUnit}`
    );

    if (!weatherResponse.ok) {
      throw new Error(`Weather API error: ${weatherResponse.status}`);
    }

    const weatherData = await weatherResponse.json();
    const current = weatherData.current;
    const condition = getWeatherCondition(current.weather_code);
    const isDay = new Date().getHours() >= 6 && new Date().getHours() < 20;
    
    return {
      temperature: Math.round(current.temperature_2m),
      feelsLike: Math.round(current.apparent_temperature),
      description: condition.description,
      main: condition.main,
      icon: getWeatherIcon(current.weather_code, isDay),
      humidity: current.relative_humidity_2m,
      windSpeed: current.wind_speed_10m,
      cityName: location.name,
      country: location.country || '',
      latitude: location.latitude,
      longitude: location.longitude,
    };
  } catch (error) {
    throw new Error(`Failed to fetch weather for city: ${error.message}`);
  }
};

export const getWeatherIconUrl = (iconCode, size = '2x') => {
  return `https://openweathermap.org/img/wn/${iconCode}@${size}.png`;
};

export const getWindDirection = (degrees) => {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
};

export const formatTime = (timestamp, timezone = 0) => {
  const date = new Date((timestamp + timezone) * 1000);
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    timeZone: 'UTC'
  });
};

export const getWeatherIconPath = (condition) => {
  const iconMap = {
    Clear: '/icons/sunny.png',
    Clouds: '/icons/cloudy.png',
    Rain: '/icons/rainy.png',
    Drizzle: '/icons/rainy.png',
    Thunderstorm: '/icons/storm.png',
    Snow: '/icons/snow.png',
    Mist: '/icons/fog.png',
    Fog: '/icons/fog.png',
    Haze: '/icons/fog.png',
  };
  return iconMap[condition] || '/icons/sunny.png';
};
