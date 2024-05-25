import { lightningStart, lightningStop } from './lightning';

export function startAnimation(data) {
  switch (data?.weather[0].main) {
    case 'Thunderstorm':
      lightningStart();
      break;
    case 'Clouds':
      // lightningStart();
      break;
  }
}

export function stopAnimation() {
  lightningStop();
}
