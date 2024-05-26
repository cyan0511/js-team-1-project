import { lightningStart, lightningStop } from './lightning';
import { makeItRain, rainStop } from './rain';

export function startAnimation(data) {
  data?.weather.forEach(weather => {
    switch (weather.main) {
      case 'Thunderstorm':
        lightningStart();
        break;
      case 'Rain':
        makeItRain();
        break;
    }
  });
}

export function stopAnimation() {
  lightningStop();
  rainStop();
}
