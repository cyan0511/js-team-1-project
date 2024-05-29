import { WEATHER_API_KEY, WEATHER_API_ENDPOINT } from './api';
import { Notify } from 'notiflix';

let timeInterval;

// Function to fetch the weather data including time information
export async function fetchWeatherTime(city) {
  const response = await fetch(
    `${WEATHER_API_ENDPOINT}/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}`
  );
  if (!response.ok) {
    throw new Error('Failed to fetch weather data');
  }
  const data = await response.json();
  return data;
}

// Function to format time in military format with seconds
function formatTimeWithSeconds(unixTime, timezone) {
  const date = new Date((unixTime + timezone) * 1000);
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

// Function to format time without seconds (for sunrise and sunset)
function formatTime(unixTime, timezone) {
  const date = new Date((unixTime + timezone) * 1000);
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

// Function to initialize and display the weather time information
export async function initializeWeatherTime(data) {
  try {
    // const data = await fetchWeatherTime(city);
    const timezone = data.timezone;

    // Clear previous time interval
    if (timeInterval) {
      clearInterval(timeInterval);
    }

    // Update time every second
    timeInterval = setInterval(() => {
      const currentTime = formatTimeWithSeconds(
        Math.floor(Date.now() / 1000),
        timezone
      );
      document.getElementById('current-time').textContent = currentTime;
    }, 1000);

    const sunriseTime = formatTime(data.sys.sunrise, timezone);
    const sunsetTime = formatTime(data.sys.sunset, timezone);

    document.getElementById('sunrise-time').textContent = sunriseTime;
    document.getElementById('sunset-time').textContent = sunsetTime;

    const date = new Date();
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const dayOfWeek = date.toLocaleString('default', { weekday: 'short' });
    document.getElementById(
      'current-date'
    ).innerHTML = `${day}<sup>${getDaySuffix(day)}</sup> ${dayOfWeek}`;
    document.getElementById('current-month').textContent = month;
  } catch (error) {
    console.error(error);
    Notify.failure('Failed to initialize weather time');
  }
}

// Day suffix identifier
function getDaySuffix(day) {
  if (day > 3 && day < 21) return 'th';
  switch (day % 10) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
}
