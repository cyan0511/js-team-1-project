import moment from 'moment/moment';
import { WEATHER_ICON_ENDPOINT } from './api';
import { startAnimation, stopAnimation } from './animation';

const nextBtn = document.getElementById('next-btn');
const prevBtn = document.getElementById('prev-btn');

let contentX = 0;

export function initFiveDayViewButtons() {
  nextBtn.addEventListener('click', () => {
    const cardContent = document.querySelector('.weather-wrap .card-content');
    if (contentX <= 70) {
      contentX += 20;
    }
    cardContent.style.transform = `translateX(-${contentX}%)`;
    cardContent.style.transition = 'transform 0.3s ease';
  });

  prevBtn.addEventListener('click', () => {
    const cardContent = document.querySelector('.weather-wrap .card-content');
    if (contentX >= 0) {
      contentX -= 20;
    }
    cardContent.style.transform = `translateX(-${contentX}%)`;
    cardContent.style.transition = 'transform 0.3s ease';
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

export function renderFiveDaysData(fiveDaysWeather) {
  const formattedObject = fiveDaysWeather.list
    .map(weather => moment(weather.dt_txt).format('yy-MM-DD'))
    .filter((x, i, a) => a.indexOf(x) == i)
    .map(date => ({
      key: date,
      list: fiveDaysWeather.list.filter(
        w => moment(w.dt_txt).format('yy-MM-DD') === date
      ),
    }));

  const data = formattedObject.map(obj => ({
    ...obj,
    day: moment(obj.key, 'yy-MM-DD').format('dddd'),
    date: moment(obj.key, 'yy-MM-DD').format('DD MMM'),
    min: Math.min(...obj.list.map(l => l.main.temp_min)),
    max: Math.max(...obj.list.map(l => l.main.temp_max)),
    icon: obj.list[0].weather[0].icon,
    weatherName: obj.list[0].weather[0].main,
  }));

  if (data.length > 5) {
    data.pop();
  }

  const cityElement = document.querySelector('.city-fiveday-view');
  cityElement.textContent = `${fiveDaysWeather.city.name}, ${fiveDaysWeather.city.country}`;
  const weatherWrapElement = document.querySelector('.weather-wrap');
  const ul = `
  <ul class="card-content">
    ${Array.from(
      data.map(
        weather =>
          `<li data-key="${weather.key}" class="card" id="card">
                  <p id="day" class="day" tabindex="0">${weather.day}</p>
                  <p class="fivedays-date">${weather.date}</p>
                  <img src="${WEATHER_ICON_ENDPOINT}/img/wn/${
            weather.icon
          }@2x.png" alt="" class="fivedays-icon">
                  <div class="temp-info">
                    <div class="box">
                      <p class="text-min">min</p>
                      <p class="num-min"> ${Math.floor(weather.min)}°</p>
                    </div>
                    <div class="separator"></div>
                    <div class="box">
                      <p class="text-max">max</p>
                      <p class="num-max"> ${Math.floor(weather.max)}°</p>
                    </div>
                  </div>
                  <button data-key="${
                    weather.key
                  }" class="fiveday-more-info">more info</button>
                </li>`
      )
    ).join('')}
              </ul>
  `;

  let activeKey;
  const activeLi = document.querySelector(`li.active`);
  if (activeLi) {
    activeKey = activeLi.dataset.key;
  }

  weatherWrapElement.innerHTML = ul;

  data.forEach(d => {
    const btn = document.querySelector(`button[data-key="${d.key}"]`);
    btn.addEventListener('click', e => {
      e.preventDefault();
      stopAnimation();
      renderMoreInfo(d.key, d.list);
      startAnimation({ weather: [{ main: d.weatherName }] });
    });
  });

  if (activeKey) {
    renderMoreInfo(activeKey, data.find(d => d.key === activeKey).list);
  }
}

function renderMoreInfo(key, list) {
  const moreInfoDataElement = document.getElementById('more-info-data');
  moreInfoDataElement.innerHTML = '';

  if (list.length === 0) {
    return;
  }

  const li = document.querySelector(`li[data-key="${key}"]`);
  if (li.classList.contains('active')) {
    li.classList.toggle('active');
    return;
  }

  const activeLi = document.querySelector(`li.active`);
  if (activeLi) {
    activeLi.classList.toggle('active');
  }

  li.classList.add('active');

  const divMoreInfo = `<div class='more-info-container' data-aos='fade-down' data-aos-delay='100' data-aos-duration='600'>
      <ul class='more-info-list'>
        ${Array.from(
    list.map(
      item =>
        `<li class='more-info-item'>
                <h3 class='time'>${moment(item.dt_txt).format('HH:mm')}</h3>
                <img src='${WEATHER_ICON_ENDPOINT}/img/wn/${
          item.weather[0].icon
        }.png' alt='' class='icon'>
                <h2 class='temperature'>${Math.floor(item.main.temp)}°</h2>
                    <ul class='measurement-list'>
                      <li class='measurement-item'>
                        <span class='icon'>
                          <svg width='20' height='20'>
                            <use href='/icons.adfc4680.svg#barometer'></use>
                          </svg>
                        </span>
                        <span class='barometer'>${item.main.pressure} mm</span>
                      </li>
                      <li class='measurement-item'>
                        <span class='icon'>
                          <svg width='20' height='20'>
                            <use href='/icons.adfc4680.svg#humidity'></use>
                          </svg>
                        </span>
                        <span class='humidity'>${item.main.humidity}%</span>
                      </li>
                      <li class='measurement-item'>
                        <span class='icon'>
                          <svg width='20' height='20'>
                            <use href='/icons.adfc4680.svg#wind'></use>
                          </svg>
                        </span>
                        <span class='wind'>${item.wind.speed} m/s</span>
                      </li>
                    </ul>
              </li>`
    )
  ).join('')}
            </ul>
            <button class='nextBtn-moreInfo nextBtn round'></button>
            </div>`;
  moreInfoDataElement.innerHTML = divMoreInfo;

  const moreInfoElement = document.querySelector('.nextBtn-moreInfo');
  const moreInfoList = document.querySelector('.more-info-container .more-info-list');

  moreInfoElement.addEventListener('click', () => {

    moreInfoX += 20;

    if (moreInfoX >= (moreInfoList.children.length * 100 / 5)) {
      moreInfoX = 0;
    }

    moreInfoList.style.transform = `translateX(-${moreInfoX}%)`;
    moreInfoList.style.transition = 'transform 0.3s ease';
  })



}

let moreInfoX = 0;

