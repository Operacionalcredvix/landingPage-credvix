// Caminho: script/main.js
import { initHeroSwiper } from './hero-swiper.js'; // Alterado
import { initTestimonialSwiper } from './testimonial-swiper.js'; // Alterado
import { initStoreLocator } from './storeLocator.js';
import { initJobBoard } from './jobBoard.js';
import { initModalHandler } from './modalHandler.js';
import { observeElements } from './animations.js';
import { loadHeader, loadFooter } from './components.js';

function initializePage() {
    console.log("Página carregando, inicializando módulos...");

    // Carrega componentes reutilizáveis primeiro
    loadHeader();
    loadFooter();

    // Módulos que devem rodar em quase todas as páginas
    initModalHandler();
    observeElements();

    // --- Verificações condicionais ---
    // Só inicializa o Swiper do Hero se o elemento existir
    if (document.querySelector('.hero-swiper')) {
        console.log("Inicializando Swiper do Hero...");
        initHeroSwiper(); // Alterado
    }

    // Só inicializa o Swiper de Depoimentos se o elemento existir
    if (document.querySelector('.testimonial-swiper')) {
        console.log("Inicializando Swiper de Depoimentos...");
        initTestimonialSwiper();
    }

    // Só inicializa o Localizador de Lojas se o elemento existir
    if (document.getElementById('store-list')) {
        console.log("Inicializando Localizador de Lojas...");
        initStoreLocator();
    }

    // Só inicializa o Mural de Vagas se o elemento existir
    if (document.getElementById('job-list')) {
        console.log("Inicializando Mural de Vagas...");
        initJobBoard();
    }
    
    // Atualiza o ano no rodapé
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
    
    console.log("Módulos principais inicializados.");
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePage);
} else {
    initializePage();
}