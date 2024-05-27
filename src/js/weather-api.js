import axios from 'axios';
import { WEATHER_API_ENDPOINT, WEATHER_API_KEY } from './api';

export async function fetchCurrentWeather(...args) {
  let url = `${WEATHER_API_ENDPOINT}/data/2.5/weather?appid=${WEATHER_API_KEY}&units=metric`;
  url += args.length === 1 ? `&q=${args[0]}` : `&lon=${args[0]}&lat=${args[1]}`;

  const response = await axios.get(url);
  if (response.status !== 200) throw new Error('Failed to fetch weather data');
  return response.data;
}

// Get five days weather forecasts from API
export async function fetchFiveDaysWeather(...args) {
  let url = `${WEATHER_API_ENDPOINT}/data/2.5/forecast?appid=${WEATHER_API_KEY}&units=metric`;
  url += args.length === 1 ? `&q=${args[0]}` : `&lon=${args[0]}&lat=${args[1]}`;
  const response = await axios.get(url);
  if (response.status !== 200) throw new Error('Failed to fetch weather data');
  return response.data;
}