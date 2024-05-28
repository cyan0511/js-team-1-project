import { getRandomPlacePhoto, preloadImage } from './google-places-api';

export async function searchGoogleImage(cityName) {
  // console.log(`Searching for image of city: ${cityName}`);
  try {
    const placePhotoUrl = await getRandomPlacePhoto(cityName);
    //console.log(`Place photo URL found: ${placePhotoUrl}`);
    const preloadedImage = await preloadImage(placePhotoUrl);
    //console.log(`Image preloaded: ${preloadedImage}`);
    return preloadedImage;
  } catch (placePhotoError) {
    console.error('Error fetching place photo:', placePhotoError.message);
    throw new Error('Failed to fetch place photo.');
  }
}
