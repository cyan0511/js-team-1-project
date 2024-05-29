var swiper = new Swiper(".mySwiper", {
    slidesPerView: 3,
    spaceBetween: 30,
    
    centeredSlides: false,
    loop: true,
    autoplay:
    {
    delay: 1500,
    disableOnInteraction: false,
    },
    pagination: {
        el: ".swiper-pagination",
        
    clickable: true, 
    },
    navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
    },
    
});