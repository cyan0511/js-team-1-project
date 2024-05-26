import axios from 'axios';
import { GOOGLE_API_KEY } from './api';

export async function searchPlacePhotos(cityName) {
  const corsProxy = 'https://api.allorigins.win/get?url=';
  const placeSearchUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${cityName}&inputtype=textquery&fields=photos&key=${GOOGLE_API_KEY}`;
  try {
    const response = await axios.get(`${corsProxy}${encodeURIComponent(placeSearchUrl)}`);
    const responseData = JSON.parse(response.data.contents);
    if (responseData.status !== 'OK' || !responseData.candidates || responseData.candidates.length === 0) {
      throw new Error('No place photos found.');
    }

    const photoReferences = responseData.candidates[0].photos.map(photo => photo.photo_reference);
    return photoReferences;
  } catch (error) {
    console.error('Google Place Photo API Error:', error.response ? error.response.data : error.message);
    throw error;
  }
}

export async function getRandomPlacePhoto(cityName) {
  const photoReferences = await searchPlacePhotos(cityName);
  const randomIndex = Math.floor(Math.random() * photoReferences.length);
  const photoReference = photoReferences[randomIndex];
  const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1600&photoreference=${photoReference}&key=${GOOGLE_API_KEY}`;

  return photoUrl;
}

// Preloads the image before applying as background
export function preloadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = url;
    img.onload = () => resolve(url);
    img.onerror = reject;
  });
}
