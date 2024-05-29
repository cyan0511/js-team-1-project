import { WEATHER_ICON_ENDPOINT } from './api';

export function renderTodayWeatherData(data) {
  document.querySelector(
    '.city'
  ).textContent = `${data.name}, ${data.sys.country}`;
  document.querySelector('.current-temp').innerHTML = `${Math.round(
    data.main.temp
  )}°`;
  document.querySelector('.min-temp').innerHTML = `${Math.round(
    data.main.temp_min
  )}°`;
  document.querySelector('.max-temp').innerHTML = `${Math.round(
    data.main.temp_max
  )}°`;

  const weatherIconElement = document.querySelector('.weather-icon');
  const iconCode = data.weather[0].icon;
  const iconUrl = `${WEATHER_ICON_ENDPOINT}/img/wn/${iconCode}@2x.png`; // URL to the weather icon
  weatherIconElement.src = iconUrl;
  weatherIconElement.alt = data.weather[0].description; // Set alt text to the weather description
}
