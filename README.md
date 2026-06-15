# WeatherNow ⛅

> A real-time weather application with immersive animated weather backgrounds, city autocomplete, air quality index, 5-day forecasts, favourite cities, and Celsius/Fahrenheit toggle — built with React and OpenWeatherMap API.

**Live Demo:** [weatherapp-5got.vercel.app](https://weatherapp-5got.vercel.app)
**GitHub:** [github.com/CARNAGE-TECH/weatherapp](https://github.com/CARNAGE-TECH/weatherapp)

---

## Overview

WeatherNow goes beyond showing a temperature number. It delivers a fully immersive experience where the entire background transforms based on the current weather — falling raindrops for rain, lightning flashes for thunderstorms, drifting snowflakes for snow, and pulsing sun rays for clear skies. Built with performance and visual quality in mind.

---

## Features

### Real-Time Weather Data
- Current weather for any city worldwide
- Temperature display in Celsius or Fahrenheit (toggle anytime)
- Feels like temperature, daily high and low
- Humidity, wind speed, visibility, atmospheric pressure
- Sunrise and sunset times with formatted display

### 5-Day Forecast
- Daily weather forecast for the next 5 days
- High and low temperatures per day
- Weather condition icons and descriptions per day

### Air Quality Index
- Real-time AQI powered by OpenWeatherMap Air Pollution API
- AQI level label: Good, Fair, Moderate, Poor, Very Poor
- Color-coded AQI badge
- Full pollutant breakdown: PM2.5, PM10, CO, NO₂, O₃, SO₂

### Smart City Search
- City search with **live autocomplete dropdown** via Geocoding API
- Shows city, state, and country for disambiguation
- **Detect my location** using browser geolocation API
- Search history — remembers your last 6 searched cities
- Favourite cities — star any city for instant access

### Animated Weather Backgrounds
Each weather condition has its own unique background animation:
- ☀️ **Clear** — radiating sun rays with glowing orb
- 🌧️ **Rain / Drizzle** — falling animated raindrops
- ⛈️ **Thunderstorm** — lightning bolt SVG with screen flash effect and rain
- ❄️ **Snow** — drifting rotating snowflakes
- ☁️ **Clouds** — slow drifting cloud shapes
- 🌫️ **Mist/Fog/Haze** — layered animated fog bands

### Design & UX
- Glassmorphism card design with backdrop blur
- Smooth page transitions and entrance animations with Framer Motion
- Professional SVG weather icons via React Icons Weather Icons set
- Fully mobile responsive layout
- Color-coded theme per weather condition

---

## Tech Stack

| Technology | Purpose |
|---|---|
| React | Frontend framework |
| OpenWeatherMap API | Weather, forecast, AQI, geocoding data |
| Framer Motion | Animations and weather background transitions |
| React Icons (Weather Icons) | Professional weather and UI icons |
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
npm start
```

Replace the API key in `src/App.js`:
```js
const API_KEY = 'your_openweathermap_api_key_here';
```

---

## Project Structure

src/

└── App.js    # Complete application — all logic, animations, and UI in one file

---

## Roadmap

- [ ] Hourly forecast breakdown (next 24 hours)
- [ ] Severe weather alerts
- [ ] Multi-city side-by-side comparison
- [ ] PWA support with offline caching
- [ ] Weather history for past days
- [ ] Embeddable weather widget

---

## Author

**Joseph Omokwale**
Freelance Web Developer & Designer
OMTECH INNOVATORS — *The Future of Tech...*
📍 Edo State, Nigeria
🌐 [omtech-portfolio.vercel.app](https://omtech-portfolio.vercel.app)
💼 [github.com/CARNAGE-TECH](https://github.com/CARNAGE-TECH)
📱 WhatsApp: [+234 807 638 4453](https://wa.me/2348076384453)

---

## License
MIT License