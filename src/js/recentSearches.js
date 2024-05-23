const apiKey = '43704076-e4399805efcc0ad689cbb211a';
const defaultImageUrl = 'https://via.placeholder.com/800x600?text=No+Image+Available'; // Default image URL

function getRandomImageUrl(hits) {
    const randomIndex = Math.floor(Math.random() * hits.length);
    return hits[randomIndex].largeImageURL;
}

async function searchCity(cityName) {
    try {
        const url = `https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(cityName)}&category=places&image_type=photo&order=popular&safesearch=true`;
        console.log(`Fetching images for ${cityName} with URL: ${url}`);
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(`API Response: `, data);
        
        if (data.hits && data.hits.length > 0) {
            const imageUrl = getRandomImageUrl(data.hits);
            console.log(`Selected random image URL: ${imageUrl}`);
            displayCityImage(imageUrl);
        } else {
            console.log(`No images found for ${cityName}`);
            displayCityImage(defaultImageUrl);
            displayNoResultsMessage(cityName);
        }
    } catch (error) {
        console.error('Error fetching images:', error);
        displayCityImage(defaultImageUrl);
        displayErrorMessage(cityName);
    }
}

function displayCityImage(imageUrl) {
    const cityImageElement = document.getElementById('city-image');
    if (cityImageElement) {
        cityImageElement.src = imageUrl;
        cityImageElement.style.display = 'block';
        cityImageElement.style.objectFit = 'cover';
        cityImageElement.style.width = '100%';
        cityImageElement.style.height = '100%';
        console.log(`Displayed image: ${imageUrl}`);
    } else {
        console.error('City image element not found');
    }
}

function displayNoResultsMessage(cityName) {
    console.log(`No images found for ${cityName}`);
}

function displayErrorMessage(cityName) {
    console.log(`Error fetching images for ${cityName}`);
}

document.getElementById('search-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const cityName = document.getElementById('search-input').value.trim();
    if (cityName) {
        searchCity(cityName);
    } else {
        alert('Please enter a city name');
    }
});

window.onload = function() {};
