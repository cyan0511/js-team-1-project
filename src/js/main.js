import { Notify } from 'notiflix';
import { searchImage, searchRandomImage } from './pixabay-api';
import { fetchCurrentWeather } from './weather-api';
import { renderWeatherData } from './today';
import { getCurrentLocation } from './current-location';
import { initializeQuoteSlider } from './quote-slider.js';
import { initializeWeatherChart } from './weather-chart.js';
import { initializeWeatherTime } from './weather-time.js';

// Initialize Page
document.addEventListener('DOMContentLoaded', () => {
  showLoader();
  initializeQuoteSlider();
  initializeWeatherChart();

  // Current Location
  getCurrentLocation()
    .then(({ coords: { longitude, latitude } }) => {
      getCurrentWeather(longitude, latitude).then(data => {
        initializeWeatherTime(data.name);
      });
    })
    .catch(Notify.failure)
    .then(async () => {
      changeBackground(await searchRandomImage());
    })
    .finally(hideLoader);
});

const btnToday = document.querySelector('#btn-today');
const btnFiveDays = document.querySelector('#btn-five-days');

const elTodayView = document.querySelector('.today-view');
const elFiveDayView = document.querySelector('.five-day-view');

const weatherInfoContainer = document.querySelector('.weather-info-container');
const searchForm = document.getElementById('search-form');
const loaderContainer = document.querySelector('.loader-container');

btnToday.addEventListener('click', () => toggleView());
btnFiveDays.addEventListener('click', () => toggleView());

function toggleView() {
  elTodayView.classList.toggle('visually-hidden');
  elFiveDayView.classList.toggle('visually-hidden');
}

function changeBackground(newBg) {
  document.body.style.backgroundImage = `linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0) 70%,
      rgba(0, 0, 0, 0.9)
    ), url(${newBg})`;
}

searchForm.addEventListener('submit', async event => {
  event.preventDefault();
  const city = document.getElementById('search-input').value.trim();
  if (city) {
    try {
      getCurrentWeather(city).then(data => {
        initializeWeatherTime(city); // Pass the searched city
      });
    } catch (error) {
      console.error(error);
      Notify.failure('City not found.');
    }
  }
});

function getCurrentWeather(...args) {
  showLoader();
  return fetchCurrentWeather(...args)
    .then(async data => {
      renderWeatherData(data);
      weatherInfoContainer.classList.remove('visually-hidden');
      changeBackground(await searchImage(data.name));
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

function showLoader() {
  loaderContainer.classList.remove('visually-hidden');
}

function hideLoader() {
  loaderContainer.classList.add('visually-hidden');
}

Notify.init({
  position: 'left-top',
});
