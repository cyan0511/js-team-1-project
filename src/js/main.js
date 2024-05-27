import { Notify } from 'notiflix';
import AOS from 'aos';
import moment from 'moment';
import { searchImage, searchRandomImage } from './pixabay-api';
import { fetchCurrentWeather, fetchFiveDaysWeather } from './weather-api';
import { renderTodayWeatherData } from './today';
import { getCurrentLocation } from './current-location';
import { initializeQuoteSlider } from './quote-slider.js';
import { initializeWeatherChart } from './weather-chart.js';
import { initializeWeatherTime } from './weather-time.js';
import { startAnimation, stopAnimation } from './animation';
import { setupToggleChart } from './hide-show';

import 'aos/dist/aos.css';
import '../css/more-info.css';
import '../css/five-days.css';
import { renderFiveDaysData } from './five-days';

// Initialize Page
document.addEventListener('DOMContentLoaded', async () => {
  showLoader();
  initializeQuoteSlider();
  setupToggleChart();

  try {
    // Current Location
    const {
      coords: { longitude, latitude },
    } = await getCurrentLocation();
    void getCurrentWeather(longitude, latitude);
  } catch (ex) {
    Notify.failure(ex);
    weatherInfoContainer.classList.add('visually-hidden');
    changeBackground(await searchRandomImage(currentWeather?.weather[0].main));
  } finally {
    hideLoader();
  }
});

const btnToday = document.querySelector('#btn-today');
const btnFiveDays = document.querySelector('#btn-five-days');

const elTodayView = document.querySelector('.today-view');
const elFiveDayView = document.querySelector('.five-day-view');

const weatherInfoContainer = document.querySelector('.weather-info-container');
const dateCardContainer = document.querySelector('.date-card-container');
const searchForm = document.getElementById('search-form');
const loaderContainer = document.querySelector('.loader-container');
const cityElement = document.querySelector('.city');

let currentWeather;

btnToday.addEventListener('click', () => {
  toggleView();
  startAnimation(currentWeather);
});
btnFiveDays.addEventListener('click', () => {
  toggleView();
  stopAnimation();
});

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
      void getCurrentWeather(city);
    } catch (error) {
      console.error(error);
      Notify.failure('City not found.');
    }
  }
});

async function getCurrentWeather(...args) {
  showLoader();
  stopAnimation();
  try {
    currentWeather = await fetchCurrentWeather(...args);
    renderTodayWeatherData(currentWeather);

    const fiveDaysWeather = await fetchFiveDaysWeather(...args);
    window.fiveDaysWeather = fiveDaysWeather;
    renderFiveDaysData(fiveDaysWeather);

    weatherInfoContainer.classList.remove('visually-hidden');
    dateCardContainer.classList.remove('visually-hidden');
    const weather = currentWeather.weather[0].main;
    let image = await searchImage(`${currentWeather.name} ${weather}`);
    if (!image) {
      image = await searchRandomImage(weather);
    }
    changeBackground(image);
    startAnimation(currentWeather);
    // Weather Time
    void initializeWeatherTime(currentWeather);
    void initializeWeatherChart(currentWeather.name);
  } catch (ex) {
    weatherInfoContainer.classList.add('visually-hidden');
    dateCardContainer.classList.add('visually-hidden');
    Notify.failure('City not found.');
  } finally {
    hideLoader();
  }
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

AOS.init();

window.moment = moment;
window.stopAnimation = stopAnimation;
window.startAnimation = startAnimation;

window.makeThunderStorm = () => {
  startAnimation({ weather: [{ main: 'Thunderstorm' }] });
};

window.makeRain = () => {
  startAnimation({ weather: [{ main: 'Rain' }] });
};
