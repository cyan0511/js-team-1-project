import { Notify } from "notiflix";
import { fetchCurrentWeather } from './weather-api';
import { getWeather } from './main';

const searchData = document.querySelector('#search-input');


// next button function


const nextBtn = document.querySelector('.nextBtn');
const itemsPerPage = 4;

let currentIndex = 0;


nextBtn.addEventListener('click', () => {
    const favoriteCityList = document.querySelector('.favorite-city-list');
    const items = Array.from(favoriteCityList.children);
    const totalItems = items.length;
    currentIndex += itemsPerPage;
    if (currentIndex >= totalItems) {
        currentIndex = 0;
    }
    updateListPosition(favoriteCityList);
});

function updateListPosition(list) {
    const offset = -currentIndex * 100 / itemsPerPage;

    list.style.transform = `translateX(${offset}%)`;
    list.style.transition = 'transform 0.3s ease';
}

export function addToFavorite() {
    const searchValue = searchData.value.trim();

    if (searchValue === "") {
        Notify.info("Please enter a city!");
        return;
    }

    let searchArray = JSON.parse(localStorage.getItem('city')) || [];

    if (searchArray.map(item => item.toUpperCase()).includes(searchValue.toUpperCase())) {
        Notify.info("Already added to favorites!");
        return;
    }

   fetchCurrentWeather(searchValue)
    .then(data => {
        searchArray.push(searchValue);
        localStorage.setItem('city', JSON.stringify(searchArray));
        searchData.value = '';
        updateCityList();
        Notify.info("Added to favorites!");
    })
    .catch(error => {
        if (error.response?.status === 404 ) {
            Notify.info("There is no such city!");
            return;
        }
        Notify.info(error.message || 'An error occurred while fetching the weather data.');
        console.error('Fetch error:', error);
    });
}

export function updateCityList(){
    const favoriteCityList = document.querySelector('.favorite-city-list');
    const storedCities = JSON.parse(localStorage.getItem('city')) || [];
    favoriteCityList.innerHTML = '';
    storedCities.forEach((city, i) =>{
            const listItem = `
            <li class="favorite-list-item">
            <p class="favorite-list-link">${city.toUpperCase()}</p>
            <button class="favorite-list-close" data-index=${i} type="button"></button>
            </li>
        `;
        favoriteCityList.insertAdjacentHTML('beforeend', listItem);
    })
    const removeButtons = document.querySelectorAll('.favorite-list-close');
    removeButtons.forEach(button => {
        button.addEventListener('click', removeFavorite);
    });

    const favoriteListItems = document.querySelectorAll('.favorite-list-item');
    favoriteListItems.forEach(li => {
        const cityElement = li.querySelector('p');
        li.addEventListener('click', (e) => {
            e.preventDefault();
            search(cityElement.innerText)
        });
    });
}

function search(city) {
    const searchInput = document.getElementById('search-input');
    const value = toTitleCase(city);
    searchInput.value = value;
    void getWeather(value);
}

function toTitleCase(str) {
    return str.replace(
      /\w\S*/g,
      function(txt) {
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
    );
}

export function removeFavorite(event) {
    event.stopPropagation();
    const index = event.target.getAttribute('data-index');
    let search_array = JSON.parse(localStorage.getItem('city')) || [];
    search_array.splice(index, 1);
    localStorage.setItem('city', JSON.stringify(search_array));
    Notify.info(`Removed to favorites!`);
    updateCityList();
}
