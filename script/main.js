// Caminho: script/main.js
import { initModalHandler } from './modalHandler.js';
import { observeElements } from './animations.js';
import { loadHeader, loadFooter } from './components.js';
import { initAccessibility } from './accessibility.js';

function initializePage() {
    console.log("Página carregando, inicializando módulos...");

    // Carrega componentes reutilizáveis primeiro
    loadHeader();
    loadFooter();
    
    // Inicializa acessibilidade
    initAccessibility();

    // Módulos que devem rodar em quase todas as páginas
    initModalHandler();
    observeElements();

    // --- Verificações condicionais com imports dinâmicos ---
    // Só inicializa o Swiper do Hero se o elemento existir
    if (document.querySelector('.hero-swiper')) {
        console.log("Inicializando Swiper do Hero...");
        import('./hero-swiper.js').then(module => module.initHeroSwiper());
    }

    // Só inicializa o Swiper de Depoimentos se o elemento existir
    if (document.querySelector('.testimonial-swiper')) {
        console.log("Inicializando Swiper de Depoimentos...");
        import('./testimonial-swiper.js').then(module => module.initTestimonialSwiper());
    }

    // Só inicializa o Localizador de Lojas se o elemento existir
    if (document.getElementById('store-list')) {
        console.log("Inicializando Localizador de Lojas...");
        import('./storeLocator.js').then(module => module.initStoreLocator());
    }

    // Só inicializa o Mural de Vagas se o elemento existir
    if (document.getElementById('job-list')) {
        console.log("Inicializando Mural de Vagas...");
        import('./jobBoard.js').then(module => module.initJobBoard());
    }

    // Só inicializa o formulário do Banco de Talentos se existir
    if (document.getElementById('talent-bank-form')) {
        console.log("Inicializando formulário Banco de Talentos...");
        import('./jobBoard.js').then(module => module.initializeTalentBankForm());
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