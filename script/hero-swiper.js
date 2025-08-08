// script/hero-swiper.js

export function initHeroSwiper() {
    new Swiper('.hero-swiper', {
        // --- Efeitos e Transições ---
        loop: true,
        effect: 'fade', 
        fadeEffect: {
            crossFade: true 
        },
        parallax: true, 
        watchSlidesProgress: true,

        // --- Autoplay e Navegação ---
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
            
            pauseOnMouseEnter: true, 
        },
        pagination: {
            el: '.hero-pagination',
            clickable: true,
            
            type: 'progressbar',
        },
        navigation: {
            nextEl: '.hero-nav-next',
            prevEl: '.hero-nav-prev',
        },
        // --- Animação do conteúdo do slide ---
        on: {
            slideChange: function () {
                const activeSlide = this.slides[this.activeIndex];
                // Remove a classe de animação de todos os slides
                this.slides.forEach(slide => {
                    slide.querySelector('.slide-content').classList.remove('slide-content-visible');
                });
                // Adiciona a classe de animação apenas ao slide ativo
                activeSlide.querySelector('.slide-content').classList.add('slide-content-visible');
            },
            init: function () {
                 // Garante que o primeiro slide já comece com a animação
                const activeSlide = this.slides[this.activeIndex];
                activeSlide.querySelector('.slide-content').classList.add('slide-content-visible');
            }
        }
    });
}