import quotes from '../json/quote.json';

export function initializeQuoteSlider() {
  let currentQuoteIndex = 0;
  const quoteElement = document.getElementById('quote');
  const authorElement = document.getElementById('quote-author');

  function displayQuote() {
    const quote = quotes[currentQuoteIndex];
    quoteElement.textContent = quote.quote;
    authorElement.textContent = quote.author;
  }

  function fadeOutElements(callback) {
    quoteElement.style.transition = 'opacity 1s';
    authorElement.style.transition = 'opacity 1s';
    quoteElement.style.opacity = 0;
    authorElement.style.opacity = 0;
    setTimeout(callback, 1000);
  }

  function fadeInElements() {
    quoteElement.style.transition = 'opacity 1s';
    authorElement.style.transition = 'opacity 1s';
    quoteElement.style.opacity = 1;
    authorElement.style.opacity = 1;
  }

  function showNextQuote() {
    fadeOutElements(() => {
      currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length;
      displayQuote();
      fadeInElements();
    });
  }

  displayQuote();
  setInterval(showNextQuote, 5000);
}
