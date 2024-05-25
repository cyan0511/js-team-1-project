import axios from 'axios';
import { PIXABAY_API_KEY, PIXABAY_API_ENDPOINT } from './api';

export async function searchImage(cityName) {
  const url = `${PIXABAY_API_ENDPOINT}/?image_type=photo&orientation=horizontal&category=places&order=popular&safesearch=true&q=${cityName}&per_page=80&key=${PIXABAY_API_KEY}`;
  const response = await axios.get(url);
  if (response.status !== 200) throw new Error('Failed to fetch data.');
  if (response.data.hits.length === 0) {
    return await searchRandomImage();
  }
  const hits = response.data.hits;
  const index = Math.floor(Math.random() * hits.length);

  return hits[index].largeImageURL;
}

export async function searchRandomImage() {
  const url = `${PIXABAY_API_ENDPOINT}/?image_type=photo&orientation=horizontal&category=places&q=sunset&page=1&per_page=10&key=${PIXABAY_API_KEY}`;
  const response = await axios.get(url);
  if (response.status !== 200) throw new Error('Failed to fetch data.');
  const hits = response.data.hits;
  const index = Math.floor(Math.random() * hits.length);
  return hits[index].largeImageURL;
}
