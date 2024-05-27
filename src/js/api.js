export const WEATHER_API_KEY = 'bb62771caae00d80a1cdcf2a46703e53';
export const PIXABAY_API_KEY = '43554291-045e76b825ecd08fdbf56f121';

export const PIXABAY_API_ENDPOINT = 'https://pixabay.com/api';
export const WEATHER_API_ENDPOINT = 'https://api.openweathermap.org';
export const WEATHER_ICON_ENDPOINT = 'https://openweathermap.org';

export const GEOCODING_API_ENDPOINT = '/geo/1.0/direct'; // url endpoint to convert city name to latitude and longitude
export const WEATHER_API_MORE_INFO_ENDPOINT = '/data/2.5/forecast/'; // url endpoint for more info / 5 days view

export const GEOCODING_API_OPTIONS = {
  params: {
    q: '',
    limit: 1,
    appid: WEATHER_API_KEY,
  },
}; // geocoding API url parameters

export const WEATHER_API_OPTIONS = {
  params: {
    lat: 0,
    lon: 0,
    units: 'metric',
    appid: WEATHER_API_KEY,
  },
}; // weather API url parameters
