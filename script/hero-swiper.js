// script/hero-swiper.js
// Importar apenas os módulos necessários do Swiper via ESM
import Swiper from 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs';

// Função para atualizar imagem de fundo baseada no tamanho da tela
function updateBackgroundImages() {
    const isMobile = window.innerWidth <= 768;
    
    // Slide 1: Crédito Consignado
    const slide1 = document.querySelector('.slide-banner');
    if (slide1) {
        if (isMobile) {
            slide1.style.backgroundImage = "url('img/banner-mobile.webp')";
        } else {
            slide1.style.backgroundImage = "url('img/banner.webp')";
        }
    }
    
    // Slide 2: Quem Somos
    const slide2 = document.querySelector('.slide-quem-somos');
    if (slide2) {
        if (isMobile) {
            slide2.style.backgroundImage = "url('img/quem-somos-mobile.webp')";
        } else {
            slide2.style.backgroundImage = "url('img/quem-somos.webp')";
        }
    }
    
    // Slide 3: Trabalhe Conosco
    const slide3 = document.querySelector('.slide-trabalhe-conosco');
    if (slide3) {
        if (isMobile) {
            slide3.style.backgroundImage = "url('img/somos-help-mobile.webp')";
        } else {
            slide3.style.backgroundImage = "url('img/somos-help.webp')";
        }
    }
}

export function initHeroSwiper() {
    // Atualiza imagens na inicialização
    updateBackgroundImages();
    
    // Atualiza imagens quando redimensionar a janela
    window.addEventListener('resize', updateBackgroundImages);
    
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
                
                // Atualiza informações dinâmicas do hero
                updateHeroDynamicData();
            }
        }
    });
}

// Atualiza dados dinâmicos no hero (anos de empresa e lojas)
async function updateHeroDynamicData() {
    // Calcula anos desde fundação (10/08/2011)
    const foundationDate = new Date('2011-08-10');
    const today = new Date();
    let yearsInBusiness = today.getFullYear() - foundationDate.getFullYear();
    
    const hasPassedAnniversary = (today.getMonth() > foundationDate.getMonth()) || 
        (today.getMonth() === foundationDate.getMonth() && today.getDate() >= foundationDate.getDate());
    
    if (!hasPassedAnniversary) {
        yearsInBusiness--;
    }
    
    // Atualiza elementos de anos
    const heroYearsElement = document.getElementById('hero-years');
    const heroYearsTitleElement = document.getElementById('hero-years-title');
    const heroBadgeYearsElement = document.getElementById('hero-badge-years');
    
    if (heroYearsElement) heroYearsElement.textContent = yearsInBusiness;
    if (heroYearsTitleElement) heroYearsTitleElement.textContent = `${yearsInBusiness} Anos`;
    if (heroBadgeYearsElement) heroBadgeYearsElement.textContent = `Desde 2011`;
    
    // Busca quantidade de lojas (excluindo Matriz)
    try {
        const { supabase } = await import('./supabase-client.js');
        const { data, error } = await supabase
            .from('lojas')
            .select('nome');
        
        if (!error && data) {
            // Filtrar lojas excluindo "Matriz"
            const filteredStores = data.filter(store => 
                !store.nome.toLowerCase().includes('matriz')
            );
            
            const heroStoresElement = document.getElementById('hero-stores');
            if (heroStoresElement) {
                heroStoresElement.textContent = `+${filteredStores.length}`;
            }
        }
    } catch (error) {
        console.error('Erro ao buscar contagem de lojas no hero:', error);
    }
}