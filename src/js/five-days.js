import axios from 'axios';
import moment from 'moment/moment';

import {
  WEATHER_API_ENDPOINT,
  WEATHER_API_MORE_INFO_ENDPOINT,
  WEATHER_API_OPTIONS,
  GEOCODING_API_ENDPOINT,
  GEOCODING_API_OPTIONS,
} from './api';

const searchInputEl = document.getElementById('search-input');
const searchFormEl = document.getElementById('search-form');

// Main function for five days view and more info
async function handleFiveDaysViewAndMoreInfo(e) {
  e.preventDefault();

  try {
    let res = await getSearchCityCoordinates();

    if (res.data.length > 0) {
      const moreInfoEl = document.querySelector('.more-info-container');

      // Set city coordinates
      WEATHER_API_OPTIONS.params.lat = res.data[0].lat;
      WEATHER_API_OPTIONS.params.lon = res.data[0].lon;

      // console.log(res.data[0].lat + '--' + res.data[0].lon);

      res = await getWeatherFiveDays();
      // console.log(res);

      // Set five days view
      const fiveDaysViewMarkup = getFiveDaysViewMarkup(res);
      moreInfoEl.insertAdjacentHTML('afterbegin', fiveDaysViewMarkup);

      // Set event listener for for more info
      const moreInfoLink = document.querySelectorAll('.more-info-link');
      moreInfoLink.forEach(link => {
        link.addEventListener('click', toggleMoreInfoView);
      });

      // Set more info view
      const moreInfoMarkup = getMoreInfoMarkup(res);
      moreInfoEl.insertAdjacentHTML('beforeend', moreInfoMarkup);
    } else {
      alert('NO LOCATION');
    }
  } catch (error) {
    console.log(1 + error);
  }
}

// Convert city name to latitude and longitude coordinates from API
async function getSearchCityCoordinates() {
  if (searchInputEl.value === '') return;
  GEOCODING_API_OPTIONS.params.q = searchInputEl.value.trim();

  try {
    return await axios.get(
      WEATHER_API_ENDPOINT + GEOCODING_API_ENDPOINT,
      GEOCODING_API_OPTIONS
    );
  } catch (e) {
    console.log(2 + error);
  }
}

// Get five days weather forecasts from API
async function getWeatherFiveDays() {
  try {
    return await axios.get(
      WEATHER_API_ENDPOINT + WEATHER_API_MORE_INFO_ENDPOINT,
      WEATHER_API_OPTIONS
    );
  } catch (e) {
    throw e;
  }
}

// Logic and markup for Five Days View
function getFiveDaysViewMarkup(res) {
  let markup = '<ul class="five-days-view-list">';

  // get five days dates
  const fiveDays = res.data.list
    .map(({ dt_txt }) => {
      return dt_txt.split(' ')[0];
    })
    .filter((date, index, array) => array.indexOf(date) === index);

  // loop through the five days and get the weather forcasts for each day
  fiveDays.forEach(day => {
    // console.log(day);

    const formattedDate = moment(day).format('dddd-DD-MMM-LT').split('-');
    const weatherToday = {};

    weatherToday.fullDate = day;
    weatherToday.dayOfTheWeek = formattedDate[0];
    weatherToday.day = formattedDate[1];
    weatherToday.month = formattedDate[2];

    // get the forcasts of this day
    const forcastsOfTheDayArray = Object.groupBy(res.data.list, ({ dt_txt }) =>
      dt_txt.includes(day)
    )['true'];

    // console.log(forcastOfTheDayArray);

    // get the min and max temperature of this day among the temperatures of the forecasts
    const temperatureArray = forcastsOfTheDayArray.flatMap(({ main }) => {
      return [main.temp_min, main.temp_max];
    });
    // console.log(temperatureArray);
    weatherToday.min = Math.min(...temperatureArray);
    weatherToday.max = Math.max(...temperatureArray);

    // find the most occurrences of weather icons in the forecast to be declared as weather of this day
    const weatherArray = forcastsOfTheDayArray.map(({ weather }) => weather[0]);
    // console.log(weatherArray);
    weatherToday.weather = getWeatherMode(weatherArray);
    // console.log(weatherToday);

    markup += createFiveDaysMarkup(weatherToday);
  });
  markup += '</ul>';

  return markup;
}

// Logic and markup for More Info
function getMoreInfoMarkup(res) {
  let moreInfoMarkup = '<ul class="more-info-list">';

  moreInfoMarkup += res.data.list
    .map(({ dt_txt, weather, rain, main, wind }) => {
      const formattedDate = moment(dt_txt).format('dddd-DD-MMM-LT').split('-');

      return `
      <li class="more-info-item visually-hidden" data-date="${
        dt_txt.split(' ')[0]
      }">
        <h3 class="time">${formattedDate[0]} ${formattedDate[1]} ${
        formattedDate[2]
      } ${formattedDate[3]}</h3>
        <div class="weather-icon">
          <img src=" https://openweathermap.org/img/w/${
            weather[0].icon
          }.png" alt="${weather[0].description}" title="${
        weather[0].description
      } - ${weather[0].id}" width="50"/>
        </div>
        <h2 class="temperature">${main.temp_min}°C</h2>
        <ul class="measurement-list">
          <li class="measurement-item">
            <span class="icon">
              ${
                document.querySelector('.more-info-container .icon-barometer')
                  .innerHTML
              }
            </span>
            <span class="barometer">${
              rain === null || rain === undefined
                ? '0 '
                : rain[Object.keys(rain)[0]]
            } mm</span>
          </li>
          <li class="measurement-item">
            <span class="icon">
            ${
              document.querySelector('.more-info-container .icon-humidity')
                .innerHTML
            }
            </span>
            <span class="humidity">${main.humidity}%</span>
          </li>
          <li class="measurement-item">
            <span class="icon">
            ${
              document.querySelector('.more-info-container .icon-wind')
                .innerHTML
            }
            </span>
            <span class="wind">${wind.speed} m/s</span>
          </li>
        </ul>
      </li>`;
    })
    .join('');

  moreInfoMarkup += '</ul>';

  return moreInfoMarkup;
}

// Markup for five days view
function createFiveDaysMarkup(weatherToday) {
  return `<li class="more-info-item">
   <h3 class="time">${weatherToday.dayOfTheWeek}</h3>
   <h2>${weatherToday.day} ${weatherToday.month}</h2>
   <div class="weather-icon">
     <img src=" https://openweathermap.org/img/w/${weatherToday.weather.icon}.png" alt="${weatherToday.weather.description}" title="${weatherToday.weather.description}" width="50"/>
      </div>
      <h2 class="temperature">${weatherToday.min}°C | ${weatherToday.max}°C</h2>
      <a class="more-info-link" href="#" data-date="${weatherToday.fullDate}">More Info</a>
    </li>`;
}

// Toggle more info view for each day
function toggleMoreInfoView(e) {
  e.preventDefault();

  const moreInfoEl = document.querySelectorAll(
    '.more-info-list .more-info-item'
  );

  moreInfoEl.forEach(info => {
    info.classList.add('visually-hidden');
    if (info.dataset.date === e.target.dataset.date) {
      info.classList.remove('visually-hidden');
    }
  });
}

// Get the weather of the day with the most occurrences by comparing the weather icons
function getWeatherMode(weatherArray) {
  // Object to store the frequency of each element
  let mode = {};
  // Variable to store the frequency of the current mode
  let maxCount = 0;
  // Array to store the modes
  let modes = [];

  // Iterate through each element of the input array
  weatherArray.forEach(function (weather) {
    if (mode[weather.icon] == null) {
      mode[weather.icon] = 1;
    } else {
      mode[weather.icon]++;
    }

    if (mode[weather.icon] > maxCount) {
      // Update the current mode and its frequency
      modes = [weather];
      maxCount = mode[weather.icon];
    } else if (mode[weather.icon] === maxCount) {
      modes.push(weather);
    }
  });
  // console.log(modes);
  // return first occurrence
  return modes[0];
}

searchFormEl.addEventListener('submit', handleFiveDaysViewAndMoreInfo);
