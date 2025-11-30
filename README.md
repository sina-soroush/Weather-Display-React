# 🌤️ Weather Display React

A modern, responsive weather application built with React and Vite. Features real-time weather data, 5-day forecasts, and an intuitive city search with autocomplete suggestions powered by OpenStreetMap.

![Weather Display](https://img.shields.io/badge/React-18.3.1-blue)
![Vite](https://img.shields.io/badge/Vite-6.0.3-purple)
![License](https://img.shields.io/badge/license-MIT-green)

## 🔗 Preview

You can view the live version of this project here:  
👉 https://weather-display-react.vercel.app/

<img width="1920" height="1330" alt="Weather-Display" src="https://github.com/user-attachments/assets/6b57139d-c598-4ddf-9471-f7847fdd556e" />

## ✨ Features

- 🌍 **Automatic Location Detection** - Uses GPS or IP-based location fallback
- 🔍 **Smart City Search** - Google Maps-style autocomplete with real-time suggestions
- 🌡️ **Unit Toggle** - Switch between Celsius and Fahrenheit
- 📊 **5-Day Forecast** - Visual graph showing temperature trends
- 🎨 **Modern UI** - Neumorphic design with smooth animations
- 📱 **Responsive** - Works perfectly on all device sizes
- ⚡ **Fast & Lightweight** - Optimized performance with Vite

## 🖼️ Weather Information

- Current temperature with "feels like"
- Weather conditions with icons
- Humidity and pressure
- Wind speed and direction
- Visibility
- Sunrise and sunset times
- Min/max temperatures
- 5-day forecast with daily highs/lows

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- OpenWeatherMap API key (free tier available)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/sina-soroush/Weather-Display-React.git
   cd Weather-Display-React
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_OPENWEATHER_API_KEY=your_api_key_here
   ```

   Get your free API key from [OpenWeatherMap](https://openweathermap.org/api)

4. **Start the development server**
   ```bash
   npm run dev
   ```

   The app will open at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The optimized build will be in the `dist/` folder, ready for deployment.

## 📁 Project Structure

```
Weather-Display-React/
├── public/              # Static assets
├── src/
│   ├── assets/         # Images and icons
│   ├── components/     # React components
│   │   ├── Button/
│   │   ├── Graph/
│   │   ├── Input/
│   │   ├── ProgressBar/
│   │   ├── Radio/
│   │   ├── SearchBar/
│   │   ├── Toggle/
│   │   └── WeatherDisplay/
│   ├── hooks/          # Custom React hooks
│   │   ├── useGeolocation.js
│   │   └── useWeather.js
│   ├── services/       # API services
│   │   ├── locationService.js
│   │   └── weatherService.js
│   ├── styles/         # Global styles
│   │   ├── global.scss
│   │   └── variables.scss
│   └── icons/          # Weather icons
├── .env                # Environment variables
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 🔧 Technologies Used

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **SCSS** - Styling with variables and mixins
- **OpenWeatherMap API** - Weather data
- **OpenStreetMap Nominatim** - Geocoding and city search
- **Geolocation API** - Browser location detection

## 🌐 APIs Used

1. **OpenWeatherMap API**
   - Current weather data
   - 5-day forecast
   - Weather icons

2. **OpenStreetMap Nominatim**
   - City autocomplete search
   - Reverse geocoding
   - Location coordinates

3. **IP Geolocation (ipapi.co)**
   - Fallback location detection

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎨 Features in Detail

### City Search Autocomplete
Type at least 2 characters to see real-time suggestions. The autocomplete displays:
- City name
- State/Region
- Country
- Location icon

### Unit Toggle
Seamlessly switch between:
- Celsius (°C) / Fahrenheit (°F)
- Meters per second / Miles per hour (wind speed)

### 5-Day Forecast Graph
Visual representation of temperature trends with:
- Daily high/low temperatures
- Day names
- Interactive bar chart

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👤 Author

**Sina Soroush**
- GitHub: [@sina-soroush](https://github.com/sina-soroush)

## 🙏 Acknowledgments

- Weather data provided by [OpenWeatherMap](https://openweathermap.org/)
- Geocoding by [OpenStreetMap](https://www.openstreetmap.org/)
- Icons and design inspiration from modern weather apps

---

⭐ Star this repo if you find it helpful!
