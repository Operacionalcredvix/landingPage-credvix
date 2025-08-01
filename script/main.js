
import { initSwiper, initTestimonialSwiper } from './swiper.js';
import { initStoreLocator } from './storeLocator.js';
import { initJobBoard } from './jobBoard.js';
import { initModalHandler } from './modalHandler.js';
import { observeElements } from './animations.js';
import { loadFooter } from './components.js'; // Importa a função do rodapé

function initializePage() {
    console.log("Página carregando, inicializando módulos...");

    // Módulos que carregam instantaneamente
    initSwiper();
    initTestimonialSwiper();
    initStoreLocator();
    initModalHandler();
    observeElements();
    loadFooter(); // Carrega o rodapé

    // O mural de vagas agora carrega de forma independente
    initJobBoard();

    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
    
    console.log("Módulos principais inicializados. Vagas carregando em paralelo.");
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePage);
} else {
    initializePage();
}