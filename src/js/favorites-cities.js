import { Notify } from "notiflix";

const favoriteBtn = document.querySelector('.btn-favourite');
const favoriteIcon = document.querySelector('.fovourite-icon');
const searchData = document.querySelector('#search-input');
const favoriteCityList = document.querySelector('.favorite_city-list');
const favorite_list_close = document.querySelector('.favorite_list-close');

favoriteBtn.addEventListener('click', addToFavorite);
favoriteIcon.addEventListener('click', addToFavorite);


function addToFavorite (){
    if (searchData.value === ""){
        Notify.info("Please enter a city!");
        return;
    }else{
        let search_array = JSON.parse(localStorage.getItem('city')) || [];
        if(search_array.map(item => item.toUpperCase()).includes(searchData.value.toUpperCase())){
            return Notify.info("Already added to favorites!");
        }else{
        search_array.push(searchData.value);
        localStorage.setItem('city', JSON.stringify(search_array));
        searchData.value = '';
        updateCityList(); 
        Notify.info("Added to favorites!");
        }
       
    }}
function updateCityList(){
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
function removeFavorite(event) {
    const index = event.target.getAttribute('data-index');
    let search_array = JSON.parse(localStorage.getItem('city')) || [];
    search_array.splice(index, 1);
    localStorage.setItem('city', JSON.stringify(search_array));
    Notify.info(`Removed to favorites!`);
    updateCityList();
}
updateCityList();