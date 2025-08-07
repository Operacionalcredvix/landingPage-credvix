// admin/modules/ui.js

import * as dom from './dom.js';
import { loadJobs } from './jobs.js';
import { loadResumesByStore } from './resumes.js';
import { loadStores, getLoadedStores } from './stores.js'; // Importa getLoadedStores

// Mapeia o ID da tela à sua função de carregamento de dados
const viewLoaders = {
    'vagas': loadJobs,
    'curriculos': loadResumesByStore,
    'lojas': loadStores,
};

/**
 * Exibe a tela solicitada, esconde as outras e guarda o estado na sessão.
 * @param {string} viewId - O ID da tela a ser exibida ('vagas', 'curriculos', 'lojas').
 */
export function showView(viewId) {
    // Esconde todas as telas e remove a classe 'active' dos links de navegação
    [dom.vagasView, dom.curriculosView, dom.lojasView].forEach(view => view.classList.add('hidden'));
    [dom.navVagas, dom.navCurriculos, dom.navLojas].forEach(nav => nav.parentElement.classList.remove('active'));

    const viewMap = {
        'vagas': { view: dom.vagasView, nav: dom.navVagas },
        'curriculos': { view: dom.curriculosView, nav: dom.navCurriculos },
        'lojas': { view: dom.lojasView, nav: dom.navLojas }
    };

    const selected = viewMap[viewId];
    if (selected) {
        selected.view.classList.remove('hidden');
        selected.nav.parentElement.classList.add('active');
        
        // Guarda a vista atual na sessão do navegador
        sessionStorage.setItem('activeAdminView', viewId);

        // Carrega os dados para a tela selecionada, se necessário
        if (viewLoaders[viewId]) {
            viewLoaders[viewId]();
        }
    }
}

// Funções para controlar a visibilidade dos modais de Lojas e Vagas
export const openStoreModal = () => dom.storeModalOverlay.classList.remove('hidden');
export const closeStoreModal = () => { dom.storeModalOverlay.classList.add('hidden'); dom.storeForm.reset(); dom.storeIdInput.value = ''; };

export const openJobModal = () => dom.jobModalOverlay.classList.remove('hidden');
export const closeJobModal = () => { dom.jobModalOverlay.classList.add('hidden'); dom.jobForm.reset(); dom.jobIdInput.value = ''; };

/**
 * Abre o modal para adicionar ao Banco de Talentos e popula o seletor de lojas.
 */
export function openTalentModal() {
    const talentStoreSelect = document.getElementById('talent-store-select');
    const stores = getLoadedStores();

    // Limpa opções antigas, exceto a primeira ("Selecione a Loja")
    while (talentStoreSelect.options.length > 1) {
        talentStoreSelect.remove(1);
    }
    
    // Popula com as lojas carregadas
    stores.forEach(store => {
        talentStoreSelect.add(new Option(store.name, store.id));
    });

    dom.talentModalOverlay.classList.remove('hidden');
}

/**
 * Fecha o modal do Banco de Talentos e limpa o formulário e mensagens de erro.
 */
export const closeTalentModal = () => {
    dom.talentModalOverlay.classList.add('hidden');
    document.getElementById('talent-form').reset();
    const statusMessage = document.getElementById('talent-status-message');
    if (statusMessage) {
        statusMessage.textContent = '';
    }
};

/**
 * Exibe o painel de administração e esconde a tela de login.
 */
export function showDashboard() {
    dom.loginContainer.classList.add('hidden');
    dom.dashboard.classList.remove('hidden');
    
    // Verifica se há uma vista guardada na sessão, caso contrário, usa 'vagas'
    const savedView = sessionStorage.getItem('activeAdminView');
    showView(savedView || 'vagas'); 
}

/**
 * Exibe a tela de login e esconde o painel de administração.
 */
export function showLogin() {
    dom.dashboard.classList.add('hidden');
    dom.loginContainer.classList.remove('hidden');
}