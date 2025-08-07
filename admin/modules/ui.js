
import * as dom from './dom.js';
import { loadJobs } from './jobs.js';
import { loadResumesByStore } from './resumes.js';
import { loadStores } from './stores.js';

// Mapeia o ID da tela à sua função de carregamento de dados
const viewLoaders = {
    'vagas': loadJobs,
    'curriculos': loadResumesByStore,
    'lojas': loadStores,
};

/**
 * Exibe a tela solicitada e esconde as outras.
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
        // Carrega os dados para a tela selecionada
        if (viewLoaders[viewId]) {
            viewLoaders[viewId]();
        }
    }
}

// Funções para controlar a visibilidade dos modais
export const openStoreModal = () => dom.storeModalOverlay.classList.remove('hidden');
export const closeStoreModal = () => { dom.storeModalOverlay.classList.add('hidden'); dom.storeForm.reset(); dom.storeIdInput.value = ''; };

export const openJobModal = () => dom.jobModalOverlay.classList.remove('hidden');
export const closeJobModal = () => { dom.jobModalOverlay.classList.add('hidden'); dom.jobForm.reset(); dom.jobIdInput.value = ''; };

export const openTalentModal = () => dom.talentModalOverlay.classList.remove('hidden');
export const closeTalentModal = () => dom.talentModalOverlay.classList.add('hidden');

/**
 * Exibe o painel de administração e esconde a tela de login.
 */
export function showDashboard() {
    dom.loginContainer.classList.add('hidden');
    dom.dashboard.classList.remove('hidden');
    showView('vagas'); // Define 'vagas' como a tela inicial
}

/**
 * Exibe a tela de login e esconde o painel de administração.
 */
export function showLogin() {
    dom.dashboard.classList.add('hidden');
    dom.loginContainer.classList.remove('hidden');
}