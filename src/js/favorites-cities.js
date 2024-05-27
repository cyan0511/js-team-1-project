import { Notify } from "notiflix";
import { WEATHER_API_KEY, WEATHER_API_ENDPOINT } from './api';


// const favoriteIcon = document.querySelector('.fovourite-icon');
const searchData = document.querySelector('#search-input');
const favoriteCityList = document.querySelector('.favorite_city-list');

// favoriteBtn.addEventListener('click', addToFavorite);



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
    
    const weatherDataUrl = `${WEATHER_API_ENDPOINT}/data/2.5/weather?q=${searchValue}&appid=${WEATHER_API_KEY}`;
   
    fetch(weatherDataUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error("There is no such city!");
        }
        return response.json();
    })
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
};


export function updateCityList(){
    const storedCities = JSON.parse(localStorage.getItem('city')) || [];
    favoriteCityList.innerHTML = ''; 
    storedCities.forEach(city =>{
            const listItem = `
            <li class="favorite-list_item">
            <p class="favorite-list_link">${city.toUpperCase()}</p>
            <button class="favorite_list-close" type="button"></button>
            </li>
        `;
        favoriteCityList.insertAdjacentHTML('beforeend', listItem);
    })
    const removeButtons = document.querySelectorAll('.favorite_list-close');
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
updateCityList();
