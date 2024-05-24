import axios from 'axios';
import moment from 'moment/moment';

const WEATHER_API_URL = 'http://api.openweathermap.org/data/2.5/forecast/';
const GEOCODING_API_URL = 'http://api.openweathermap.org/geo/1.0/direct';
const WEATHER_API_KEY = '4aee0cf8f0201927f9fbb837746b0770';

const WEATHER_API_OPTIONS = {
  params: {
    lat: 0,
    lon: 0,
    appid: WEATHER_API_KEY,
  },
};

const GEOCODING_API_OPTIONS = {
  params: {
    q: '',
    limit: 1,
    appid: WEATHER_API_KEY,
  },
};

const searchInputEl = document.getElementById('search-input');
const searchFormEl = document.getElementById('search-form');

async function handleFiveDaysView(event) {
  event.preventDefault();

  try {
    let res = await getSearchCityCoordinates();

    if (res.data.length > 0) {
      WEATHER_API_OPTIONS.params.lat = res.data[0].lat;
      WEATHER_API_OPTIONS.params.lon = res.data[0].lon;

      console.log(res.data[0].lat + '--' + res.data[0].lon);

      res = await getWeatherFiveDays();
      console.log(res);

      const moreInfoEl = document.querySelector('.more-info-container');
      let moreInfoMarkup = '<ul class="more-info-list">';

      moreInfoMarkup += res.data.list
        .map(({ dt_txt, weather, rain, main, wind }) => {
          const date = moment(dt_txt).format('dddd-DD-MMM-LT').split('-');

          return `
          <li class="more-info-item">
            <h3 class="time">${date[0]} ${date[1]} ${date[2]} ${date[3]}</h3>
            <div class="weather-icon">
              <img src=" https://openweathermap.org/img/wn/${
                weather[0].icon
              }@2x.png" alt="${weather[0].description}" width="50"/>
            </div>
            <h2 class="temperature">${main.temp_min}</h2>
            <ul class="measurement-list">
              <li class="measurement-item">
                <span class="icon">
                  ${
                    document.querySelector(
                      '.more-info-container .icon-barometer'
                    ).innerHTML
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

      // for (const element of res.data.list) {
      // console.log(
      //   `${date[0]} -- ${date[1]} -- ${date[2]} -- ${date[3]}
      //   Weather: ${element.weather[0].description}
      //   Min: ${element.main.temp_min}
      //   Max: ${element.main.temp_max}`
      // );
      // weatherInfoEl += `<li style="border:1px solid white; border-radius:5px; padding: 5px">
      //       <h5>${date[0]}</h5>
      //       <h6>${date[1]} ${date[2]}</h6>
      //       <img src=" https://openweathermap.org/img/wn/${element.weather[0].icon}@2x.png" alt="${element.weather[0].description}" width="50"/>
      //       <h6>${element.weather[0].description}</span></h6>
      //       <h6>Min <span>${element.main.temp_min}</span></h6>
      //       <h6>Max <span>${element.main.temp_max}</span></h6>
      //     </li>`;
      // }

      // res.data.list.forEach(element => {
      //   console.log(element.dt + ' -- ' + moment(element.dt_txt.split(' ')[0])   + '  -- ' + element.dt_txt);
      // });
      // var cars = [{ make: 'audi', model: 'r8', year: '2012' }, { make: 'audi', model: 'rs5', year: '2013' }, { make: 'ford', model: 'mustang', year: '2012' }, { make: 'ford', model: 'fusion', year: '2015' }, { make: 'kia', model: 'optima', year: '2012' }],
      // result = Object.groupBy(cars, ({ make }) => make);
      // console.log(result);

      moreInfoMarkup += '</ul>';
      moreInfoEl.insertAdjacentHTML('afterbegin', moreInfoMarkup);
    } else {
      alert('NO LOCATION');
    }
  } catch (error) {
    console.log(1 + error);
  }
}

async function getSearchCityCoordinates() {
  if (searchInputEl.value === '') return;
  GEOCODING_API_OPTIONS.params.q = searchInputEl.value.trim();

  try {
    return await axios.get(GEOCODING_API_URL, GEOCODING_API_OPTIONS);
  } catch (e) {
    console.log(2 + error);
  }
}

async function getWeatherFiveDays() {
  try {
    return await axios.get(WEATHER_API_URL, WEATHER_API_OPTIONS);
  } catch (e) {
    throw e;
  }
}

searchFormEl.addEventListener('submit', handleFiveDaysView);
