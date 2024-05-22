import { Notify } from "notiflix";

const favorite_btn = document.querySelector('.btn-favourite');
const favorite_icon = document.querySelector('.fovourite-icon');
const search_data = document.querySelector('#search-input');
const favorite_city_list = document.querySelector('.favorite_city-list');

favorite_btn.addEventListener('click', addToFavorite);
favorite_icon.addEventListener('click', addToFavorite);

function addToFavorite (){
    if (search_data.value === ""){
        Notify.info("Please enter a city!")
    }else {
        if(search_data.value === localStorage.getItem('city')){
            Notify.info("already added to favorites!")
        }else{
             localStorage.setItem('city', search_data.value)
        const city = localStorage.getItem('city').toUpperCase();
        const listItem = `
            <li class="favorite-list_item">
            <p class="favorite-list_link">${city}</p>
            <button class="favorite_list-close" type="button"></button>
            </li>
        `
        favorite_city_list.insertAdjacentHTML('beforeend', listItem);
        }
    }
}
