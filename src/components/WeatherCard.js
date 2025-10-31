import React from "react";

function WeatherCard({ weather }) {
  return (
    <div className="weather-card">
      <h2>{weather.name}, {weather.sys.country}</h2>
      <p>Température : {weather.main.temp} °C</p>
      <p>Météo : {weather.weather[0].description}</p>
      <p>Humidité : {weather.main.humidity} %</p>
      <p>Vent : {weather.wind.speed} m/s</p>
    </div>
  );
}

export default WeatherCard;
