# WeatherNow

> A real-time weather application with immersive animated weather backgrounds, city autocomplete, air quality index, 5-day forecasts, favourite cities, and Celsius/Fahrenheit toggle. Built with React and OpenWeatherMap API.

**Live Demo:** [weatherapp-5got.vercel.app](https://weatherapp-5got.vercel.app)
**GitHub:** [github.com/CARNAGE-TECH/weatherapp](https://github.com/CARNAGE-TECH/weatherapp)

---

## Overview

WeatherNow goes beyond showing a temperature number. It delivers an immersive experience where the background transforms based on the current weather: falling raindrops for rain, lightning flashes for thunderstorms, drifting snowflakes for snow, and pulsing sun rays for clear skies.

---

## Features

### Real-Time Weather Data
- Current weather for any city worldwide
- Temperature display in Celsius or Fahrenheit
- Feels-like temperature, daily high, and daily low
- Humidity, wind speed, visibility, atmospheric pressure
- Sunrise and sunset times
- Last-updated timestamp after each successful fetch

### 5-Day Forecast
- Daily forecast for the next 5 days
- Day-level high and low temperatures calculated from all 3-hour forecast entries
- Weather condition icons and descriptions per day

### Air Quality Index
- Real-time AQI powered by OpenWeatherMap Air Pollution API
- AQI level label: Good, Fair, Moderate, Poor, Very Poor
- Color-coded AQI badge
- Pollutant breakdown: PM2.5, PM10, CO, NO2, O3, SO2

### Smart City Search
- Live city autocomplete via OpenWeatherMap Geocoding API
- City, state, and country disambiguation
- Browser geolocation support
- Search history for the last 6 searched cities
- Favourite cities for quick access
- Empty-state sample cities for first-time users

### Animated Weather Backgrounds
- Clear: radiating sun rays with glowing orb
- Rain / Drizzle: falling animated raindrops
- Thunderstorm: lightning bolt SVG with screen flash and rain
- Snow: drifting rotating snowflakes
- Clouds: slow drifting cloud shapes
- Mist/Fog/Haze: layered animated fog bands

### Design & UX
- Glassmorphism card design with backdrop blur
- Smooth transitions with Framer Motion
- Weather and UI icons via React Icons
- Mobile-responsive layout
- Accessible labels on icon-only controls
- Color-coded theme per weather condition

---

## Tech Stack

| Technology | Purpose |
|---|---|
| React | Frontend framework |
| OpenWeatherMap API | Weather, forecast, AQI, and geocoding data |
| Framer Motion | Animations and weather background transitions |
| React Icons | Weather and UI icons |
| localStorage | Search history and favourite cities |
| Vercel | Deployment |

---

## Getting Started

### Prerequisites
- Node.js v16+
- npm
- Free OpenWeatherMap API key from [openweathermap.org](https://openweathermap.org)

### Installation

```bash
git clone https://github.com/CARNAGE-TECH/weatherapp.git
cd weatherapp
npm install
```

Create a local `.env` file:

```bash
cp .env.example .env
```

Then add your OpenWeatherMap key:

```env
REACT_APP_OPENWEATHER_API_KEY=your_openweathermap_api_key_here
```

Start the app:

```bash
npm start
```

---

## Project Structure

```text
src/
  App.js    # Application logic, weather animations, and UI
```

---

## Roadmap

- [ ] Hourly forecast breakdown for the next 24 hours
- [ ] Severe weather alerts
- [ ] Multi-city side-by-side comparison
- [ ] PWA support with offline caching
- [ ] Weather history for past days
- [ ] Embeddable weather widget

---

## Author

**Joseph Omokwale**

Freelance Web Developer & Designer

OMTECH INNOVATORS - The Future of Tech...

- Edo State, Nigeria
- [omtech-portfolio.vercel.app](https://omtech-portfolio.vercel.app)
- [github.com/CARNAGE-TECH](https://github.com/CARNAGE-TECH)
- [WhatsApp: +234 807 638 4453](https://wa.me/2348076384453)

---

## License

MIT License
