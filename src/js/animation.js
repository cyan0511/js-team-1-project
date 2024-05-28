import { lightningStart, lightningStop } from './lightning';
import { makeItRain, rainStop } from './rain';
import { snowStop, startSnow } from './snow';

export function startAnimation(data) {
  data?.weather.forEach(weather => {
    switch (weather.main) {
      case 'Thunderstorm':
        lightningStart();
        break;
      case 'Rain':
        makeItRain();
        break;
      case 'Snow':
        startSnow();
        break;
    }
  });
}

export function stopAnimation() {
  lightningStop();
  rainStop();
  snowStop();
}
