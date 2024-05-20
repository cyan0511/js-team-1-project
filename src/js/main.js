// TODO: use pixabay api
import backgroundImage from '../images/background.png';
import backgroundImage2 from '../images/city.png';

const elQuote = document.querySelector('.quote');
const elAuthor = document.querySelector('.quote-author');

const btnToday = document.querySelector('#btn-today');
const btnFiveDays = document.querySelector('#btn-five-days');

const elTodayView = document.querySelector('.today-view');
const elFiveDayView = document.querySelector('.five-day-view');

btnToday.addEventListener('click', () => toggleView());
btnFiveDays.addEventListener('click', () => toggleView());

let toggled = false;
function toggleView() {
  elTodayView.classList.toggle('visually-hidden');
  elFiveDayView.classList.toggle('visually-hidden');
  changeBackground(toggled ? backgroundImage2 : backgroundImage);
  resetElements();
  typeText();
}

function resetElements() {
  index = 0;
  elQuote.innerHTML = '';
  elAuthor.innerHTML = '';
}

function changeBackground(newBg) {
  document.body.style.backgroundImage = `linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0) 70%,
      rgba(0, 0, 0, 0.9)
    ), url(${newBg})`;
  toggled = !toggled;
}

// TODO: use API for random quotes
const text =
  "Who cares about the clouds when we're together? Just sing a song and bring the sunny weather.";
const author = 'Dale Evans';
const delay = 50; // Delay between each character (in milliseconds)
let index = 0;

function typeText() {
  if (index < text.length) {
    elQuote.innerHTML += text.charAt(index);
    index++;
    setTimeout(typeText, delay);
  } else {
    elAuthor.innerHTML = author;
  }
}

// Start typing the text when the page loads
window.onload = function () {
  resetElements();
  typeText();
};
