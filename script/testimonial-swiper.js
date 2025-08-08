// script/testimonial-swiper.js

export function initTestimonialSwiper() {
    new Swiper('.testimonial-swiper', {
        loop: true,
        grabCursor: true,

        autoplay: {
            delay: 6000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true, 
        },

        pagination: {
            el: '.testimonial-pagination',
            clickable: true,
        },

        navigation: {
            nextEl: '.testimonial-nav-next',
            prevEl: '.testimonial-nav-prev',
        },

        // Esta parte é a mais importante para os cards ficarem lado a lado
        breakpoints: {
            // Telas de celular: 1 card
            320: {
                slidesPerView: 1,
                spaceBetween: 20,
            },
            // Telas de tablet e maiores: 2 cards
            768: {
                slidesPerView: 2,
                spaceBetween: 30,
            }
        },
    });
}