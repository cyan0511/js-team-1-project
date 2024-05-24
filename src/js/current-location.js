export function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(resolve, onError(reject));
    } else {
      reject('Geolocation is not supported by this browser.');
    }
  });
}

const onError = reject => error => {
  let errorMessage = '';
  switch (error.code) {
    case error.PERMISSION_DENIED:
      errorMessage = 'User denied the request for Geolocation.';
      break;
    case error.POSITION_UNAVAILABLE:
      errorMessage = 'Location information is unavailable.';
      break;
    case error.TIMEOUT:
      errorMessage = 'The request to get user location timed out.';
      break;
    case error.UNKNOWN_ERROR:
      errorMessage = 'An unknown error occurred.';
      break;
  }
  reject(errorMessage);
};
