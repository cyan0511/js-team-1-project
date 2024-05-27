const divContainer = document.querySelector('#more-info-data');

    let isClicked = true;

    function hideShow(event) {
        if (isClicked) {
            divContainer.style.display = 'block';
            isClicked = false;
        } else {
            divContainer.style.display = 'none';
            isClicked = true;
        }
    }