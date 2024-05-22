//Hide and Show

const divContainer = document.querySelector('#more-info-data');
let isClicked = true;


let hideShow = function () {
    if(isClicked){
    divContainer.style.display = "block";
    isClicked = false;    
    } else {
        divContainer.style.display = 'none';
        isClicked = true;
    }
}