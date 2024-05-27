import { WEATHER_ICON_ENDPOINT } from './api';
import { startAnimation, stopAnimation } from './animation';
import { fetchCurrentWeather } from './weather-api';
import { searchImage, searchRandomImage } from './pixabay-api';
import { initializeWeatherTime } from './weather-time';
import { Notify } from 'notiflix';

function getCurrentWeather(...args) {
  showLoader();
  stopAnimation();
  return fetchCurrentWeather(...args)
    .then(async data => {
      currentWeather = data;
      renderTodayWeatherData(data);
      weatherInfoContainer.classList.remove('visually-hidden');
      const weather = currentWeather.weather[0].main;
      let image = await searchImage(`${data.name} ${weather}`);
      if (!image) {
        image = await searchRandomImage(weather);
      }
      changeBackground(image);
      startAnimation(currentWeather);
      // Weather Time
      initializeWeatherTime(data.name);
      return data;
    })
    .catch(ex => {
      weatherInfoContainer.classList.add('visually-hidden');
      Notify.failure('City not found.');
      throw ex;
    })
    .finally(hideLoader);
}

export function renderTodayWeatherData(data) {
  document.querySelector(
    '.city'
  ).textContent = `${data.name}, ${data.sys.country}`;
  document.querySelector('.current-temp').innerHTML = `${Math.round(
    data.main.temp
  )}°<sup>c</sup>`;
  document.querySelector('.min-temp').innerHTML = `${Math.round(
    data.main.temp_min
  )}°<sup>c</sup>`;
  document.querySelector('.max-temp').innerHTML = `${Math.round(
    data.main.temp_max
  )}°<sup>c</sup>`;

  const weatherIconElement = document.querySelector('.weather-icon');
  const iconCode = data.weather[0].icon;
  const iconUrl = `${WEATHER_ICON_ENDPOINT}/img/wn/${iconCode}@2x.png`; // URL to the weather icon
  weatherIconElement.src = iconUrl;
  weatherIconElement.alt = data.weather[0].description; // Set alt text to the weather description
}
