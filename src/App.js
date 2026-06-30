import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  WiDaySunny, WiCloudy, WiRain, WiDaySprinkle,
  WiThunderstorm, WiSnow, WiFog, WiDaySunnyOvercast,
  WiHumidity, WiBarometer, WiSunrise, WiSunset, WiDust
} from 'react-icons/wi';
import { FiSearch, FiMapPin, FiStar, FiX, FiEye, FiWind } from 'react-icons/fi';

const API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;

const weatherThemes = {
  Clear: { bg: 'linear-gradient(160deg, #f7931e 0%, #f9a825 40%, #1a91e8 100%)', card: 'rgba(255,255,255,0.18)', accent: '#FFD700' },
  Clouds: { bg: 'linear-gradient(160deg, #4a5568 0%, #718096 50%, #a0aec0 100%)', card: 'rgba(255,255,255,0.15)', accent: '#e2e8f0' },
  Rain: { bg: 'linear-gradient(160deg, #1a202c 0%, #2d3748 50%, #4a5568 100%)', card: 'rgba(255,255,255,0.12)', accent: '#90cdf4' },
  Drizzle: { bg: 'linear-gradient(160deg, #2c3e7a 0%, #3a5298 50%, #5b7fd4 100%)', card: 'rgba(255,255,255,0.15)', accent: '#bee3f8' },
  Thunderstorm: { bg: 'linear-gradient(160deg, #0f1923 0%, #1a202c 50%, #2d3748 100%)', card: 'rgba(255,255,255,0.1)', accent: '#faf089' },
  Snow: { bg: 'linear-gradient(160deg, #ebf4ff 0%, #bee3f8 50%, #90cdf4 100%)', card: 'rgba(255,255,255,0.35)', accent: '#63b3ed' },
  default: { bg: 'linear-gradient(160deg, #0f2862 0%, #185FA5 50%, #2b8dd4 100%)', card: 'rgba(255,255,255,0.15)', accent: '#90cdf4' }
};

const getTheme = (main) => weatherThemes[main] || weatherThemes.default;
const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const aqiLabels = ['', 'Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'];
const aqiColors = ['', '#16a34a', '#65a30d', '#ca8a04', '#dc2626', '#7c3aed'];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -24 },
  transition: { duration: 0.4, ease: 'easeOut' }
};
const stagger = { animate: { transition: { staggerChildren: 0.08 } } };

const sampleCities = ['Lagos', 'London', 'Tokyo', 'New York'];

const getDailyForecast = (items = []) => Object.values(items.reduce((daysByDate, item) => {
  const dateKey = item.dt_txt.split(' ')[0];

  if (!daysByDate[dateKey]) {
    daysByDate[dateKey] = {
      dt: item.dt,
      weather: item.weather,
      main: {
        temp_min: item.main.temp_min,
        temp_max: item.main.temp_max
      },
      descriptions: {}
    };
  }

  const day = daysByDate[dateKey];
  day.main.temp_min = Math.min(day.main.temp_min, item.main.temp_min);
  day.main.temp_max = Math.max(day.main.temp_max, item.main.temp_max);

  const description = item.weather[0].description;
  day.descriptions[description] = (day.descriptions[description] || 0) + 1;

  if (item.dt_txt.includes('12:00:00')) {
    day.dt = item.dt;
    day.weather = item.weather;
  }

  return daysByDate;
}, {})).map((day) => {
  const description = Object.entries(day.descriptions).sort((a, b) => b[1] - a[1])[0]?.[0];

  return {
    dt: day.dt,
    main: day.main,
    weather: description ? [{ ...day.weather[0], description }] : day.weather
  };
}).slice(0, 5);

const getWeatherIcon = (main, size = 48) => {
  const props = { size, color: 'white' };
  const icons = {
    Clear: <WiDaySunny {...props} />, Clouds: <WiCloudy {...props} />,
    Rain: <WiRain {...props} />, Drizzle: <WiDaySprinkle {...props} />,
    Thunderstorm: <WiThunderstorm {...props} />, Snow: <WiSnow {...props} />,
    Mist: <WiFog {...props} />, Fog: <WiFog {...props} />, Haze: <WiFog {...props} />
  };
  return icons[main] || <WiDaySunnyOvercast {...props} />;
};

// Background animations

function SunRays() {
  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      {[...Array(12)].map((_, i) => (
        <motion.div key={i}
          animate={{ opacity: [0.08, 0.2, 0.08] }}
          transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
          style={{
            position: 'absolute',
            top: '0px',
            left: '50%',
            width: '60px',
            height: '100vh',
            background: 'linear-gradient(to bottom, rgba(255,220,80,0.4), transparent)',
            transformOrigin: 'top center',
            transform: `translateX(-50%) rotate(${i * 30}deg)`,
          }} />
      ))}
      <motion.div
        animate={{ scale: [1, 1.12, 1], opacity: [0.6, 0.85, 0.6] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', top: '-100px', left: '50%',
          transform: 'translateX(-50%)',
          width: '300px', height: '300px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,220,80,0.45) 0%, transparent 70%)'
        }} />
    </div>
  );
}

function RainDrops() {
  const drops = useMemo(() => [...Array(40)].map(() => ({
    left: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 0.6 + Math.random() * 0.6,
    size: 1 + Math.random() * 1.5,
    height: 12 + Math.random() * 16
  })), []);
  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      {drops.map((d, i) => (
        <motion.div key={i}
          animate={{ y: ['0vh', '110vh'], opacity: [0, 0.7, 0] }}
          transition={{ duration: d.duration, repeat: Infinity, delay: d.delay, ease: 'linear' }}
          style={{ position: 'absolute', top: '-5%', left: d.left + '%', width: d.size + 'px', height: d.height + 'px', borderRadius: '99px', background: 'rgba(150,200,255,0.6)' }} />
      ))}
    </div>
  );
}

function SnowFlakes() {
  const flakes = useMemo(() => [...Array(35)].map(() => ({
    left: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 4 + Math.random() * 4,
    size: 4 + Math.random() * 8,
    drift: (Math.random() - 0.5) * 60
  })), []);
  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      {flakes.map((f, i) => (
        <motion.div key={i}
          animate={{ y: ['0vh', '110vh'], x: [0, f.drift], opacity: [0, 0.85, 0], rotate: [0, 360] }}
          transition={{ duration: f.duration, repeat: Infinity, delay: f.delay, ease: 'linear' }}
          style={{ position: 'absolute', top: '-2%', left: f.left + '%', width: f.size + 'px', height: f.size + 'px', borderRadius: '50%', background: 'rgba(255,255,255,0.9)' }} />
      ))}
    </div>
  );
}

function CloudDrift() {
  const clouds = [...Array(5)].map((_, i) => ({
    top: 5 + i * 15,
    size: 120 + i * 40,
    duration: 25 + i * 10,
    delay: i * 4,
    opacity: 0.08 + i * 0.03
  }));
  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      {clouds.map((c, i) => (
        <motion.div key={i}
          animate={{ x: ['-20%', '120%'] }}
          transition={{ duration: c.duration, repeat: Infinity, delay: c.delay, ease: 'linear' }}
          style={{ position: 'absolute', top: c.top + '%', left: '-20%', width: c.size + 'px', height: c.size * 0.6 + 'px', borderRadius: '50%', background: 'rgba(255,255,255,' + c.opacity + ')' }} />
      ))}
    </div>
  );
}

function LightningFlash() {
  const [flash, setFlash] = useState(false);
  const [boltPos, setBoltPos] = useState(40);
  const drops = useMemo(() => [...Array(30)].map(() => ({
    left: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 0.5 + Math.random() * 0.5,
    size: 1 + Math.random(),
    height: 10 + Math.random() * 14
  })), []);

  useEffect(() => {
    const trigger = () => {
      setBoltPos(20 + Math.random() * 60);
      setFlash(true);
      setTimeout(() => setFlash(false), 120);
      setTimeout(() => {
        setFlash(true);
        setTimeout(() => setFlash(false), 80);
      }, 180);
    };
    const schedule = () => {
      const delay = 2500 + Math.random() * 3500;
      return setTimeout(() => { trigger(); schedule(); }, delay);
    };
    const t = schedule();
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>

      {/* Screen flash */}
      <AnimatePresence>
        {flash && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.18 }} exit={{ opacity: 0 }} transition={{ duration: 0.06 }}
            style={{ position: 'absolute', inset: 0, background: 'white', zIndex: 2 }} />
        )}
      </AnimatePresence>

      {/* Lightning bolt SVG */}
      <AnimatePresence>
        {flash && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.06 }}
            style={{ position: 'absolute', top: 0, left: boltPos + '%', transform: 'translateX(-50%)', zIndex: 3 }}>
            <svg width="40" height="300" viewBox="0 0 40 300">
              <polyline
                points="22,0 10,130 22,130 8,300"
                fill="none"
                stroke="rgba(255,255,180,0.95)"
                strokeWidth="3"
                strokeLinejoin="round"
              />
              <polyline
                points="22,0 10,130 22,130 8,300"
                fill="none"
                stroke="rgba(255,255,255,0.4)"
                strokeWidth="8"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rain drops */}
      {drops.map((d, i) => (
        <motion.div key={i}
          animate={{ y: ['0vh', '110vh'], opacity: [0, 0.5, 0] }}
          transition={{ duration: d.duration, repeat: Infinity, delay: d.delay, ease: 'linear' }}
          style={{ position: 'absolute', top: '-5%', left: d.left + '%', width: d.size + 'px', height: d.height + 'px', borderRadius: '99px', background: 'rgba(150,200,255,0.5)' }} />
      ))}
    </div>
  );
}

function FogLayer() {
  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      {[...Array(4)].map((_, i) => (
        <motion.div key={i}
          animate={{ x: ['-10%', '10%', '-10%'], opacity: [0.06, 0.12, 0.06] }}
          transition={{ duration: 8 + i * 3, repeat: Infinity, ease: 'easeInOut', delay: i * 2 }}
          style={{ position: 'absolute', top: (15 + i * 20) + '%', left: '-10%', width: '120%', height: '80px', background: 'rgba(255,255,255,0.15)', filter: 'blur(20px)', borderRadius: '50%' }} />
      ))}
    </div>
  );
}

function WeatherBackground({ condition }) {
  if (condition === 'Clear') return <SunRays />;
  if (condition === 'Rain' || condition === 'Drizzle') return <RainDrops />;
  if (condition === 'Snow') return <SnowFlakes />;
  if (condition === 'Clouds') return <CloudDrift />;
  if (condition === 'Thunderstorm') return <LightningFlash />;
  if (['Mist', 'Fog', 'Haze'].includes(condition)) return <FogLayer />;
  return null;
}

export default function App() {
  const [city, setCity] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [airQuality, setAirQuality] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [unit, setUnit] = useState('metric');
  const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem('wn_history') || '[]'));
  const [favourites, setFavourites] = useState(() => JSON.parse(localStorage.getItem('wn_favourites') || '[]'));
  const [locating, setLocating] = useState(false);
  const [theme, setTheme] = useState(weatherThemes.default);
  const [condition, setCondition] = useState(null);
  const [lastRequest, setLastRequest] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const debounceRef = useRef(null);
  const suggestRef = useRef(null);

  useEffect(() => { localStorage.setItem('wn_history', JSON.stringify(history)); }, [history]);
  useEffect(() => { localStorage.setItem('wn_favourites', JSON.stringify(favourites)); }, [favourites]);

  useEffect(() => {
    const handleClick = (e) => { if (suggestRef.current && !suggestRef.current.contains(e.target)) setShowSuggestions(false); };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const fetchSuggestions = async (q) => {
    if (!q || q.length < 2) { setSuggestions([]); return; }
    if (!API_KEY) { setSuggestions([]); return; }
    try {
      const res = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(q)}&limit=5&appid=${API_KEY}`);
      const data = await res.json();
      setSuggestions(data || []);
      setShowSuggestions(true);
    } catch { setSuggestions([]); }
  };

  const handleCityChange = (e) => {
    const val = e.target.value;
    setCity(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(val), 350);
  };

  const fetchWeather = async (q, isCoords = false, selectedUnit = unit) => {
    if (!API_KEY) {
      setError('Missing OpenWeatherMap API key. Add REACT_APP_OPENWEATHER_API_KEY to your .env file.');
      return;
    }

    setLoading(true);
    setError('');
    setWeather(null);
    setForecast([]);
    setAirQuality(null);
    setLastUpdated(null);
    setShowSuggestions(false);
    setSuggestions([]);
    setLastRequest({ q, isCoords });

    try {
      const baseQuery = isCoords ? `lat=${q.lat}&lon=${q.lon}` : `q=${encodeURIComponent(q)}`;
      const [weatherRes, forecastRes] = await Promise.all([
        fetch(`https://api.openweathermap.org/data/2.5/weather?${baseQuery}&appid=${API_KEY}&units=${selectedUnit}`),
        fetch(`https://api.openweathermap.org/data/2.5/forecast?${baseQuery}&appid=${API_KEY}&units=${selectedUnit}`)
      ]);

      if (!weatherRes.ok) { setError('City not found. Please check the spelling and try again.'); setLoading(false); return; }

      const weatherData = await weatherRes.json();
      const forecastData = await forecastRes.json();

      const aqRes = await fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${weatherData.coord.lat}&lon=${weatherData.coord.lon}&appid=${API_KEY}`);
      const aqData = await aqRes.json();
      setAirQuality(aqData.list?.[0]);
      setWeather(weatherData);

      const main = weatherData.weather[0].main;
      setTheme(getTheme(main));
      setCondition(main);

      const daily = getDailyForecast(forecastData.list);
      setForecast(daily);
      setLastUpdated(new Date());

      const cityName = weatherData.name;
      setHistory(prev => {
        const filtered = prev.filter(c => c.toLowerCase() !== cityName.toLowerCase());
        return [cityName, ...filtered].slice(0, 6);
      });

    } catch { setError('Something went wrong. Check your connection.'); }
    setLoading(false);
  };

  const search = () => { if (city.trim()) fetchWeather(city.trim()); };
  const handleKey = (e) => { if (e.key === 'Enter') { setShowSuggestions(false); search(); } };

  const selectSuggestion = (s) => {
    setCity(s.name);
    setShowSuggestions(false);
    fetchWeather({ lat: s.lat, lon: s.lon }, true);
  };

  const detectLocation = () => {
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => { setLocating(false); fetchWeather({ lat: pos.coords.latitude, lon: pos.coords.longitude }, true); },
      () => { setLocating(false); setError('Could not detect location. Please allow location access.'); }
    );
  };

  const toggleFavourite = () => {
    if (!weather) return;
    setFavourites(prev => prev.includes(weather.name) ? prev.filter(f => f !== weather.name) : [...prev, weather.name]);
  };

  const isFav = weather && favourites.includes(weather.name);
  const convertTemp = (t) => `${Math.round(t)}°${unit === 'metric' ? 'C' : 'F'}`;
  const formatTime = (unix) => new Date(unix * 1000).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  const formatUpdated = (date) => date?.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  const windUnit = unit === 'metric' ? 'm/s' : 'mph';

  const toggleUnit = () => {
    const nextUnit = unit === 'metric' ? 'imperial' : 'metric';
    setUnit(nextUnit);
    if (lastRequest) fetchWeather(lastRequest.q, lastRequest.isCoords, nextUnit);
  };

  const glassStyle = {
    background: theme.card, backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
    borderRadius: '20px', padding: '1.25rem', color: 'white', marginBottom: '1rem',
    border: '1px solid rgba(255,255,255,0.25)', boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
  };

  const chipStyle = {
    background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.3)',
    borderRadius: '99px', padding: '6px 14px', color: 'white', fontSize: '13px',
    cursor: 'pointer', fontFamily: 'inherit'
  };

  return (
    <motion.div animate={{ background: theme.bg }} transition={{ duration: 1 }}
      style={{ minHeight: '100vh', padding: '1.5rem 1rem', fontFamily: "'Segoe UI', Arial, sans-serif", position: 'relative' }}>

      {/* Background animation */}
      <WeatherBackground condition={condition} />

      <div style={{ maxWidth: '480px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <motion.div {...fadeUp} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: 'white', letterSpacing: '-0.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <WiDaySunny size={34} color={theme.accent} /> WeatherNow
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.65)', marginTop: '2px' }}>Real-time weather anywhere</div>
          </div>
          <motion.button whileTap={{ scale: 0.95 }} onClick={toggleUnit} aria-label={`Switch to ${unit === 'metric' ? 'Fahrenheit' : 'Celsius'}`}
            style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.35)', borderRadius: '10px', padding: '9px 16px', color: 'white', fontWeight: '700', cursor: 'pointer', fontSize: '15px', fontFamily: 'inherit' }}>
            °{unit === 'metric' ? 'C' : 'F'}
          </motion.button>
        </motion.div>

        {/* Search */}
        <motion.div {...fadeUp} style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <div style={{ flex: 1, position: 'relative' }} ref={suggestRef}>
              <FiSearch size={16} color="#9ca3af" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              <input value={city} onChange={handleCityChange} onKeyDown={handleKey} onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                aria-label="Search for a city"
                placeholder="Search city..."
                style={{ width: '100%', padding: '13px 16px 13px 40px', borderRadius: '12px', border: 'none', fontSize: '15px', outline: 'none', background: 'rgba(255,255,255,0.95)', fontFamily: 'inherit', boxSizing: 'border-box' }} />

              {/* Suggestions dropdown */}
              <AnimatePresence>
                {showSuggestions && suggestions.length > 0 && (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }}
                    style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, background: 'white', borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.15)', overflow: 'hidden', zIndex: 100 }}>
                    {suggestions.map((s, i) => (
                      <div key={i} onClick={() => selectSuggestion(s)}
                        style={{ padding: '11px 16px', cursor: 'pointer', borderBottom: i < suggestions.length - 1 ? '1px solid #f3f4f6' : 'none', transition: 'background 0.1s' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
                        onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                        <div style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>{s.name}</div>
                        <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>
                          {[s.state, s.country].filter(Boolean).join(', ')}
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.button whileTap={{ scale: 0.92 }} onClick={search} aria-label="Search weather"
              style={{ padding: '0 16px', borderRadius: '12px', border: 'none', background: theme.accent || 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
              <FiSearch size={18} color="#185FA5" />
            </motion.button>
            <motion.button whileTap={{ scale: 0.92 }} onClick={detectLocation} aria-label="Use current location"
              style={{ padding: '0 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.2)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              {locating
                ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}><FiMapPin size={18} color="white" /></motion.div>
                : <FiMapPin size={18} color="white" />}
            </motion.button>
          </div>
        </motion.div>

        {/* Favourites & History */}
        <AnimatePresence>
          {!weather && (
            <motion.div {...fadeUp}>
              {history.length === 0 && favourites.length === 0 && (
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.55)', marginBottom: '6px', fontWeight: '600', letterSpacing: '0.8px' }}>TRY A CITY</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {sampleCities.map(sample => (
                      <motion.button key={sample} whileTap={{ scale: 0.95 }} onClick={() => { setCity(sample); fetchWeather(sample); }} style={chipStyle}>{sample}</motion.button>
                    ))}
                  </div>
                </div>
              )}
              {favourites.length > 0 && (
                <div style={{ marginBottom: '0.75rem' }}>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.55)', marginBottom: '6px', fontWeight: '600', letterSpacing: '0.8px' }}>FAVOURITES</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {favourites.map(f => (
                      <motion.button key={f} whileTap={{ scale: 0.95 }} onClick={() => { setCity(f); fetchWeather(f); }}
                        style={{ ...chipStyle, background: 'rgba(255,215,0,0.2)', border: '1px solid rgba(255,215,0,0.45)', color: '#FFD700' }}>
                        <FiStar size={11} style={{ marginRight: '5px', verticalAlign: '-1px' }} />{f}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}
              {history.length > 0 && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.55)', marginBottom: '6px', fontWeight: '600', letterSpacing: '0.8px' }}>RECENT</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {history.map(h => (
                      <motion.button key={h} whileTap={{ scale: 0.95 }} onClick={() => { setCity(h); fetchWeather(h); }} style={chipStyle}>{h}</motion.button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading */}
        <AnimatePresence>
          {loading && (
            <motion.div {...fadeUp} style={{ textAlign: 'center', padding: '3rem 0' }}>
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }} style={{ display: 'inline-block' }}>
                <WiDaySunny size={56} color="white" />
              </motion.div>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '15px', marginTop: '12px' }}>Fetching weather...</div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div {...fadeUp} style={{ ...glassStyle, background: 'rgba(220,38,38,0.3)', border: '1px solid rgba(220,38,38,0.5)', textAlign: 'center', fontSize: '14px' }}>
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Weather content */}
        <AnimatePresence>
          {weather && (
            <motion.div variants={stagger} initial="initial" animate="animate">

              <motion.div variants={fadeUp} style={{ ...glassStyle, padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: '20px', fontWeight: '700', color: 'white' }}>{weather.name}, {weather.sys.country}</div>
                    <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', textTransform: 'capitalize', marginTop: '3px' }}>{weather.weather[0].description}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <motion.button whileTap={{ scale: 0.9 }} onClick={toggleFavourite} aria-label={isFav ? 'Remove from favourites' : 'Add to favourites'}
                      style={{ background: isFav ? 'rgba(255,215,0,0.25)' : 'rgba(255,255,255,0.15)', border: `1px solid ${isFav ? 'rgba(255,215,0,0.5)' : 'rgba(255,255,255,0.25)'}`, borderRadius: '10px', padding: '8px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                      <FiStar size={16} color={isFav ? '#FFD700' : 'white'} fill={isFav ? '#FFD700' : 'none'} />
                    </motion.button>
                    <motion.button whileTap={{ scale: 0.9 }} onClick={() => { setWeather(null); setCity(''); setTheme(weatherThemes.default); setCondition(null); setLastUpdated(null); }} aria-label="Clear weather result"
                      style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: '10px', padding: '8px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                      <FiX size={16} color="white" />
                    </motion.button>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '1.25rem 0 0.5rem' }}>
                  <motion.div initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 180, delay: 0.1 }}>
                    {getWeatherIcon(weather.weather[0].main, 72)}
                  </motion.div>
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                    style={{ fontSize: '76px', fontWeight: '800', color: 'white', lineHeight: 1, letterSpacing: '-2px' }}>
                    {convertTemp(weather.main.temp)}
                  </motion.div>
                </div>

                <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', marginBottom: '1.25rem' }}>
                  Feels like {convertTemp(weather.main.feels_like)} | High {convertTemp(weather.main.temp_max)} | Low {convertTemp(weather.main.temp_min)}
                  {lastUpdated && <> | Updated {formatUpdated(lastUpdated)}</>}
                </div>

                <div style={{ height: '2px', background: `linear-gradient(90deg, ${theme.accent}, transparent)`, borderRadius: '99px', marginBottom: '1.25rem', opacity: 0.6 }} />

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  {[
                    [<WiHumidity size={26} color={theme.accent} />, 'Humidity', weather.main.humidity + '%'],
                    [<FiWind size={18} color={theme.accent} />, 'Wind', weather.wind.speed + ` ${windUnit}`],
                    [<FiEye size={18} color={theme.accent} />, 'Visibility', weather.visibility ? (weather.visibility / 1000).toFixed(1) + ' km' : 'N/A'],
                    [<WiBarometer size={26} color={theme.accent} />, 'Pressure', weather.main.pressure + ' hPa'],
                    [<WiSunrise size={26} color={theme.accent} />, 'Sunrise', formatTime(weather.sys.sunrise)],
                    [<WiSunset size={26} color={theme.accent} />, 'Sunset', formatTime(weather.sys.sunset)]
                  ].map(([icon, label, val]) => (
                    <motion.div key={label} variants={fadeUp}
                      style={{ background: 'rgba(0,0,0,0.15)', borderRadius: '12px', padding: '12px 8px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '5px' }}>{icon}</div>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: 'white' }}>{val}</div>
                      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.55)', marginTop: '2px' }}>{label}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {airQuality && (
                <motion.div variants={fadeUp} style={glassStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <WiDust size={26} color={theme.accent} />
                    <div style={{ fontSize: '13px', fontWeight: '700', color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Air Quality</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                    <div style={{ fontSize: '22px', fontWeight: '700', color: 'white' }}>{aqiLabels[airQuality.main.aqi]}</div>
                    <div style={{ background: aqiColors[airQuality.main.aqi], borderRadius: '99px', padding: '4px 14px', fontSize: '12px', fontWeight: '700', color: 'white' }}>
                      AQI {airQuality.main.aqi}
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                    {[['PM2.5', airQuality.components.pm2_5], ['PM10', airQuality.components.pm10], ['CO', airQuality.components.co], ['NO2', airQuality.components.no2], ['O3', airQuality.components.o3], ['SO2', airQuality.components.so2]].map(([label, val]) => (
                      <div key={label} style={{ background: 'rgba(0,0,0,0.15)', borderRadius: '10px', padding: '8px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <div style={{ fontSize: '13px', fontWeight: '700', color: 'white' }}>{Math.round(val)}</div>
                        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.55)' }}>{label}</div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {forecast.length > 0 && (
                <motion.div variants={fadeUp} style={glassStyle}>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '1rem' }}>5-Day Forecast</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {forecast.map((item, i) => {
                      const date = new Date(item.dt * 1000);
                      return (
                        <motion.div key={i} variants={fadeUp}
                          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: i < forecast.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
                          <div style={{ width: '40px', fontSize: '14px', fontWeight: '700', color: 'white' }}>{days[date.getDay()]}</div>
                          <div style={{ display: 'flex', alignItems: 'center' }}>{getWeatherIcon(item.weather[0].main, 30)}</div>
                          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.65)', flex: 1, paddingLeft: '10px', textTransform: 'capitalize' }}>{item.weather[0].description}</div>
                          <div style={{ fontSize: '14px', fontWeight: '700', color: 'white' }}>
                            {convertTemp(item.main.temp_max)}&nbsp;
                            <span style={{ color: 'rgba(255,255,255,0.45)', fontWeight: '400', fontSize: '13px' }}>{convertTemp(item.main.temp_min)}</span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {history.filter(h => h !== weather.name).length > 0 && (
                <motion.div variants={fadeUp} style={{ marginBottom: '1rem' }}>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginBottom: '6px', fontWeight: '600', letterSpacing: '0.8px' }}>RECENT</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {history.filter(h => h !== weather.name).slice(0, 5).map(h => (
                      <motion.button key={h} whileTap={{ scale: 0.95 }} onClick={() => { setCity(h); fetchWeather(h); }} style={chipStyle}>{h}</motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

            </motion.div>
          )}
        </AnimatePresence>

        <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.35)', fontSize: '12px', marginTop: '2rem', fontStyle: 'italic' }}>
          <div>© 2026 WeatherNow</div>
          <div style={{ marginTop: '2px' }}>Built by Joseph - OMTECH INNOVATORS</div>
        </div>

      </div>
    </motion.div>
  );
}
