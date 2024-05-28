let increment = 0;

export const makeItRain = () => {
  const container = document.querySelector('.animation-container');

  const divFront = document.createElement('div');
  const divBack = document.createElement('div');
  divFront.classList.add('rain','front-row');
  divBack.classList.add('rain', 'back-row');
  container.appendChild(divFront);
  container.appendChild(divBack);

  //clear out everything

  const rainElements = document.querySelectorAll('.rain');


  let drops = '';
  let backDrops = '';
  increment = 0;

  while (increment < 100) {
    //couple random numbers to use for various randomizations
    //random number between 98 and 1
    var randoHundo = Math.floor(Math.random() * (98 - 1 + 1) + 1);
    //random number between 5 and 2
    var randoFiver = Math.floor(Math.random() * (5 - 2 + 1) + 2);
    //increment
    increment += randoFiver;
    //add in a new raindrop with various randomizations to certain CSS properties
    drops += `<div class="drop" style="
        left: ${increment}%;
        bottom: ${randoFiver + randoFiver - 1 + 100}%;
        animation-delay: 0.${randoHundo}s;
        animation-duration: 0.5${randoHundo}s;">
          <div class="stem" style="
            animation-delay: 0.${randoHundo}s;
            animation-duration: 0.5${randoHundo}s;">
          </div>
          <div class="splat" style="
            animation-delay: 0.${randoHundo}s;
            animation-duration: 0.5${randoHundo}s;">
          </div>
        </div>`;
    backDrops += `<div class="drop" style="
         right: ${increment}%;
         bottom: ${randoFiver + randoFiver - 1 + 100}%;
         animation-delay: 0.${randoHundo}s;
         animation-duration: 0.5${randoHundo}s;">
         <div class="stem" style="
          animation-delay: 0.${randoHundo}s;
          animation-duration: 0.5${randoHundo}s;">
         </div>
         <div class="splat" style="
          animation-delay: 0.${randoHundo}s;
          animation-duration: 0.5${randoHundo}s;">
         </div>
      </div>`;
  }

  const rainFrontRowElements = document.querySelectorAll('.rain.front-row');
  rainFrontRowElements.forEach(element => {
    element.innerHTML = drops;
  });

  const rainBackRowElements = document.querySelectorAll('.rain.back-row');
  rainBackRowElements.forEach(element => {
    element.innerHTML = backDrops;
  });
};

export function rainStop() {
  const rainElements = document.querySelectorAll('.rain');
  // Iterate over each element and clear its content
  rainElements.forEach(element => {
    element.innerHTML = '';
  });

  increment = 101;
}

