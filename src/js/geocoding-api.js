import axios from 'axios';
import { WEATHER_API_ENDPOINT, WEATHER_API_KEY } from './api';

export async function getCityName(lon, lat) {
  const response = await axios.get(
    `${WEATHER_API_ENDPOINT}/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${WEATHER_API_KEY}`
  );
  if (response.status !== 200) throw new Error('Failed to fetch city name.');
  return response.data;
}
