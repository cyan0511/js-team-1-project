import { Notify } from 'notiflix';
import { fetchCurrentWeather } from './weather-api';
import { renderWeatherData } from './today';
import { getCurrentLocation } from './current-location';
import { searchImage } from './google-places-image-api'; 

const elQuote = document.querySelector('.quote');
const elAuthor = document.querySelector('.quote-author');

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
  resetElements();
  typeText();
}

function resetElements() {
  index = 0;
  elQuote.innerHTML = '';
  elAuthor.innerHTML = '';
}

function changeBackground(newBg) {
  document.body.style.backgroundImage = `linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0) 70%,
      rgba(0, 0, 0, 0.9)
    ), url(${newBg})`;
}

// TODO: use API for random quotes
const text =
  "Who cares about the clouds when we're together? Just sing a song and bring the sunny weather.";
const author = 'Dale Evans';
const delay = 50; // Delay between each character (in milliseconds)
let index = 0;

function typeText() {
  if (index < text.length) {
    elQuote.innerHTML += text.charAt(index);
    index++;
    setTimeout(typeText, delay);
  } else {
    elAuthor.innerHTML = author;
  }
}

searchForm.addEventListener('submit', async event => {
  event.preventDefault();
  const city = document.getElementById('search-input').value.trim();
  if (city) {
    try {
      await getCurrentWeather(city);
    } catch (error) {
      console.error(error);
      Notify.failure('City not found.');
    }
  }
});

async function getCurrentWeather(...args) {
  showLoader();
  try {
    const data = await fetchCurrentWeather(...args);
    renderWeatherData(data);
    weatherInfoContainer.classList.remove('visually-hidden');
    try {
      const bgImage = await searchImage(data.name);
      changeBackground(bgImage);
    } catch (imageError) {
      console.error('Error fetching image:', imageError.response ? imageError.response.data : imageError.message);
      Notify.failure('Failed to fetch image.');
    }
  } catch (ex) {
    weatherInfoContainer.classList.add('visually-hidden');
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

document.addEventListener('DOMContentLoaded', async () => {
  resetElements();
  typeText();
  showLoader();

  try {
    const { coords: { longitude, latitude } } = await getCurrentLocation();
    await getCurrentWeather(longitude, latitude);
  } catch (locationError) {
    Notify.failure(locationError.message);
    try {
      const bgImage = await searchImage('sunset');
      changeBackground(bgImage);
    } catch (imageError) {
      console.error('Error fetching random image:', imageError.response ? imageError.response.data : imageError.message);
    }
  } finally {
    hideLoader();
  }
});
