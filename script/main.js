// Caminho: script/main.js
import { initSwiper } from './swiper.js';
import { initStoreLocator } from './storeLocator.js';
import { initJobBoard } from './jobBoard.js';
import { initModalHandler } from './modalHandler.js';
import { observeElements } from './animations.js';

function initializePage() {
    console.log("Página carregando, inicializando módulos...");

    // Módulos que carregam instantaneamente
    initSwiper();
    initStoreLocator();
    initModalHandler();
    observeElements();

    // O mural de vagas agora carrega de forma independente
    // e não trava a página se falhar.
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