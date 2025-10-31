import { useState } from "react";
import axios from "axios";

const Weather = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");

  const apiKey = "dc8cc9fc502c3c04a3fca6d3948119f5";

  const getWeather = async () => {
    if (!city) return;
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      );
      setWeather(response.data);
      setError("");
    } catch (err) {
      setError("Ville non trouvée");
      setWeather(null);
    }
  };

  return (
      <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-50 flex flex-col items-center justify-center p-4 m-0">
      <h1 className="text-4xl font-extrabold mb-8 text-blue-700">Weather App</h1>

      <div className="flex mb-6">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Entrez une ville"
          className="p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={getWeather}
          className="bg-blue-600 text-white px-6 rounded-r-lg hover:bg-blue-700 transition-colors"
        >
          Rechercher
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {weather && (
        <div className="bg-white p-8 rounded-2xl shadow-lg w-80 text-center transition-transform transform hover:scale-105">
          <h2 className="text-2xl font-bold mb-2">{weather.name}</h2>
          <p className="text-xl mb-1">{weather.weather[0].main} 🌤️</p>
          <p className="text-4xl font-bold mb-2">{Math.round(weather.main.temp)}°C</p>
          <div className="flex justify-around text-sm text-gray-600 mt-4">
            <p>Humidité: {weather.main.humidity}%</p>
            <p>Vent: {weather.wind.speed} m/s</p>
          </div>
        </div>
      )}
    </div>
 
    
  );
};

export default Weather;
