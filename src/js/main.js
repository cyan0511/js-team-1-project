const elQuote = document.querySelector('.quote');
const elAuthor = document.querySelector('.quote-author');
elQuote.innerHTML = '';
elAuthor.innerHTML = '';

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
  typeText();
};
