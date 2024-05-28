import { Notify } from "notiflix";
import { fetchCurrentWeather } from './weather-api';

const searchData = document.querySelector('#search-input');
const favoriteCityList = document.querySelector('.favorite-city-list');

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
        Notify.info(error.message || 'An error occurred while fetching the weather data.');
        console.error('Fetch error:', error);
    });
}

export function updateCityList(){
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
}
export function removeFavorite(event) {
    const index = event.target.getAttribute('data-index');
    let search_array = JSON.parse(localStorage.getItem('city')) || [];
    search_array.splice(index, 1);
    localStorage.setItem('city', JSON.stringify(search_array));
    Notify.info(`Removed to favorites!`);
    updateCityList();
}
