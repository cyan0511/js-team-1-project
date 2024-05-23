import { Notify } from "notiflix";

const favorite_btn = document.querySelector('.btn-favourite');
const favorite_icon = document.querySelector('.fovourite-icon');
const search_data = document.querySelector('#search-input');
const favorite_city_list = document.querySelector('.favorite_city-list');
const favorite_list_close = document.querySelector('.favorite_list-close');

favorite_btn.addEventListener('click', addToFavorite);
favorite_icon.addEventListener('click', addToFavorite);


function addToFavorite (){
    if (search_data.value === ""){
        Notify.info("Please enter a city!");
        return;
    }else{
        let search_array = JSON.parse(localStorage.getItem('city')) || [];
        if(search_array.map(item => item.toUpperCase()).includes(search_data.value.toUpperCase())){
            return Notify.info("Already added to favorites!");
        }else{
        search_array.push(search_data.value);
        localStorage.setItem('city', JSON.stringify(search_array));
        search_data.value = '';
        updateCityList(); 
        Notify.info("Added to favorites!");
        }
       
    }}
function updateCityList(){
    const storedCities = JSON.parse(localStorage.getItem('city')) || [];
    favorite_city_list.innerHTML = ''; 
    storedCities.forEach(city =>{
            const listItem = `
            <li class="favorite-list_item">
            <p class="favorite-list_link">${city.toUpperCase()}</p>
            <button class="favorite_list-close" type="button"></button>
            </li>
        `;
        favorite_city_list.insertAdjacentHTML('beforeend', listItem);
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