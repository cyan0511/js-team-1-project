const apiKey = '43704076-e4399805efcc0ad689cbb211a';
const maxRecentSearches = 5;

async function searchCity(cityName) {
    try {
        const response = await fetch(`https://pixabay.com/api/?key=${apiKey}&q=${cityName}&image_type=all`);
        const data = await response.json();
        if (data.hits.length > 0) {
            const imageUrl = data.hits[0].largeImageURL; 
            displayCityImage(imageUrl);
            addRecentSearch(cityName);
        } else {
            console.log('No images found for the city');
        }
    } catch (error) {
        console.error('Error fetching images:', error);
    }
}


function displayCityImage(imageUrl) {
    const cityImageElement = document.getElementById('city-image');
    cityImageElement.src = imageUrl;
    cityImageElement.style.display = 'block';
}

document.getElementById('search-form').addEventListener('submit', function(event) {
    event.preventDefault();
    console.log('Form submitted'); // Debugging line
    const cityName = document.getElementById('search-input').value;
    searchCity(cityName);
});

function addRecentSearch(cityName) {
    let recentSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];
    if (recentSearches.includes(cityName)) {
        recentSearches = recentSearches.filter(item => item !== cityName);
    }
    recentSearches.unshift(cityName);
    if (recentSearches.length > maxRecentSearches) {
        recentSearches.pop();
    }
    localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
    displayRecentSearches();
}

// Function to display recent searches
function displayRecentSearches() {
    const recentSearchesContainer = document.getElementById('recent-searches');
    recentSearchesContainer.innerHTML = '';
    const recentSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];
    recentSearches.forEach(cityName => {
        const searchItem = document.createElement('div');
        searchItem.className = 'recent-search-item';
        searchItem.textContent = cityName;

        // Add remove icon
        const removeIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        removeIcon.setAttribute('width', '16');
        removeIcon.setAttribute('height', '16');
        removeIcon.innerHTML = '<use href="./images/icons.svg#close"></use>';
        removeIcon.addEventListener('click', (event) => {
            event.stopPropagation();
            removeRecentSearch(cityName);
        });

        searchItem.appendChild(removeIcon);
        searchItem.addEventListener('click', () => searchCity(cityName));
        recentSearchesContainer.appendChild(searchItem);
    });
}
// Function to remove recent search
function removeRecentSearch(cityName) {
    let recentSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];
    recentSearches = recentSearches.filter(item => item !== cityName);
    localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
    displayRecentSearches();
}

window.onload = function() {
    displayRecentSearches();
};
