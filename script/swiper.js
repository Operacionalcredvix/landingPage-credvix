
export function initSwiper() {
    new Swiper('.hero-swiper', {
        // --- Efeitos e Transições ---
        loop: true,
        effect: 'fade', // Mude para 'fade' para uma transição suave
        fadeEffect: {
            crossFade: true // Evita o "piscar" entre os slides
        },
        parallax: true, // Habilita o efeito parallax
        watchSlidesProgress: true,

        // --- Autoplay e Navegação ---
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
            // Pausa o autoplay quando o mouse está sobre o slider
            pauseOnMouseEnter: true, 
        },
        pagination: {
            el: '.hero-pagination',
            clickable: true,
            // Renderiza a paginação como uma barra de progresso
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