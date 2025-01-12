import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');
  const [aboutVisible, setAboutVisible] = useState(false);
  const [time, setTime] = useState('');

  // Saat bilgisini güncelleme
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const seconds = now.getSeconds().toString().padStart(2, '0');
      setTime(`${hours}:${minutes}:${seconds}`);
    }, 1000);

    return () => clearInterval(interval); // Cleanup function
  }, []);

  const handleCityChange = (event) => {
    setCity(event.target.value);
  };

  const fetchWeather = async () => {
    setError('');
    setWeather(null);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=12f2448f809b4baf06e6ea80f48d83da&units=metric`
      );
      const data = await response.json();
      if (data.cod === '404') {
        setError('Şehir bulunamadı.');
      } else {
        setWeather(data);
      }
    } catch (error) {
      setError('Hava durumu verisi alınamadı.');
    }
  };

  const getTemperatureClass = () => {
    if (!weather || !weather.main) return '';
    const temp = weather.main.temp;
    if (temp <= 0) return 'weather-cold';
    if (temp > 0 && temp <= 15) return 'weather-cool';
    if (temp > 15 && temp <= 25) return 'weather-warm';
    if (temp > 25) return 'weather-hot';
    return '';
  };

  const getWeatherDescription = () => {
    if (!weather || !weather.weather) return '';
    const description = weather.weather[0].main.toLowerCase();
    const windSpeed = weather.wind.speed;

    if (description.includes('rain')) return 'Yağmurlu';
    if (description.includes('cloud')) return 'Bulutlu';
    if (description.includes('clear') && windSpeed > 5) return 'Güneşli ve Rüzgârlı';
    if (description.includes('clear')) return 'Güneşli';
    if (description.includes('snow')) return 'Karlı';
    return 'Hava durumu net değil';
  };

  const toggleAbout = () => {
    setAboutVisible(!aboutVisible);
  };

  return (
    <div
      className={`App ${getTemperatureClass()}`}
    >
      <header className="App-header">
        <h1>Hava Durumu Uygulaması</h1>
        <input
          type="text"
          value={city}
          onChange={handleCityChange}
          placeholder="Bir şehir ismi girin."
        />
        <button onClick={fetchWeather}>Bak!</button>
        {error && <p>{error}</p>}
        {weather && weather.main ? (
          <div>
            <h3>{weather.name}</h3>
            <p>Sıcaklık: {weather.main.temp}°C</p>
            <p>Nem: {weather.main.humidity}%</p>
            <p>Rüzgar Hızı: {weather.wind.speed} m/s</p>
            <p>Hava Durumu: {getWeatherDescription()}</p>
          </div>
        ) : null}

        {/* Saat Bilgisi */}
        <div className="time">{time}</div>
      </header>

      <button className="about-button" onClick={toggleAbout}>
        Hakkında
      </button>
      {aboutVisible && (
        <footer>
          <p>Tasarımcı: Gizem Yılmaz</p>
          <p>2220780054</p>
        </footer>
      )}
    </div>
  );
}

export default App;
