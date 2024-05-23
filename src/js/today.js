const WEATHER_API_KEY = 'bb62771caae00d80a1cdcf2a46703e53';
const WEATHER_API_ENDPOINT = 'http://api.openweathermap.org/data/2.5/weather';

async function fetchWeatherData(city) {
  const response = await fetch(`${WEATHER_API_ENDPOINT}?q=${city}&appid=${WEATHER_API_KEY}&units=metric`);
  if (!response.ok) throw new Error('Failed to fetch weather data');
  return response.json();
}

function renderWeatherData(data) {
  document.querySelector('.city').textContent = `${data.name}, ${data.sys.country}`;
  document.querySelector('.current-temp').textContent = `${Math.round(data.main.temp)}°C`;
  document.querySelector('.min-temp').textContent = `${Math.round(data.main.temp_min)}°C`;
  document.querySelector('.max-temp').textContent = `${Math.round(data.main.temp_max)}°C`;

  const weatherIconElement = document.querySelector('.weather-icon');
  const iconCode = data.weather[0].icon;
  const iconUrl = `http://openweathermap.org/img/wn/${iconCode}@2x.png`; // URL to the weather icon
  weatherIconElement.src = iconUrl;
  weatherIconElement.alt = data.weather[0].description; // Set alt text to the weather description
}

document.addEventListener('DOMContentLoaded', () => {
  const searchForm = document.getElementById('search-form');

  searchForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const city = document.getElementById('search-input').value.trim();
    if (city) {
      try {
        renderWeatherData(await fetchWeatherData(city));
      } catch (error) {
        console.error(error);
        alert('Failed to fetch weather data. Please try again.');
      }
    }
  });

  fetchWeatherData('Manila')
    .then(renderWeatherData)
    .catch(error => {
      console.error(error);
      alert('Failed to fetch default weather data.');
    });
});