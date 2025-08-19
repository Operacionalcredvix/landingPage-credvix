// admin/modules/ui.js (Versão Final e Corrigida)
import * as dom from './dom.js';
import { supabase } from '../../script/supabase-client.js';
import { loadJobs } from './jobs.js';
import { loadResumesByStore } from './resumes.js';
import { loadStores } from './stores.js';

// Mapeia qual função de carregamento de dados pertence a cada vista
const viewLoaders = {
    'vagas': loadJobs,
    'curriculos': loadResumesByStore,
    'lojas': loadStores,
    // Adicione o 'criterios' se/quando criar essa funcionalidade
};

/**
 * Gere a visibilidade das diferentes secções do painel e o estado ativo do menu.
 * @param {string} viewId - O ID da vista a ser exibida (ex: 'vagas', 'lojas').
 */
export function showView(viewId) {
    // Esconde todas as vistas
    [dom.vagasView, dom.curriculosView, dom.lojasView].forEach(view => {
        if (view) view.classList.add('hidden');
    });
    
    // Remove a classe 'active' de todos os itens do menu
    [dom.navVagas, dom.navCurriculos, dom.navLojas].forEach(nav => {
        if (nav) nav.classList.remove('active');
    });

    const viewMap = {
        'vagas': { view: dom.vagasView, nav: dom.navVagas },
        'curriculos': { view: dom.curriculosView, nav: dom.navCurriculos },
        'lojas': { view: dom.lojasView, nav: dom.navLojas }
    };

    const selected = viewMap[viewId];
    if (selected && selected.view) {
        // Mostra a vista selecionada
        selected.view.classList.remove('hidden');
        
        // Adiciona a classe 'active' apenas ao item de menu correto
        if (selected.nav) {
            selected.nav.classList.add('active');
        }
        
        sessionStorage.setItem('activeAdminView', viewId);
        
        // Carrega os dados para a vista que está a ser aberta
        if (viewLoaders[viewId]) {
            viewLoaders[viewId]();
        }
    }
}

// Funções para controlar os modais
export const openStoreModal = () => dom.storeModalOverlay && dom.storeModalOverlay.classList.remove('hidden');
export const closeStoreModal = () => {
    if (dom.storeModalOverlay) {
        dom.storeModalOverlay.classList.add('hidden');
        dom.storeForm.reset();
        dom.storeIdInput.value = '';
    }
};

export const openJobModal = () => {
    if (dom.jobModalOverlay) {
        dom.jobModalTitle.textContent = 'Criar Nova Vaga'; 
        document.getElementById('job-is_active').checked = true;
        dom.jobModalOverlay.classList.remove('hidden');
    }
};
export const closeJobModal = () => {
    if (dom.jobModalOverlay) {
        dom.jobModalOverlay.classList.add('hidden');
        dom.jobForm.reset();
        dom.jobIdInput.value = '';
    }
};

export async function openTalentModal() {
    const talentLocalidadeSelect = document.getElementById('talent-localidade-select');
    if (!talentLocalidadeSelect) return;

    const { data, error } = await supabase.from('lojas').select('city');
    if (error) {
        console.error("Erro ao buscar cidades para o Banco de Talentos:", error);
        return;
    }

    const cidades = [...new Set(data.map(item => item.city))].sort();
    talentLocalidadeSelect.innerHTML = '<option value="" disabled selected>Selecione a Localidade de Interesse</option>';
    talentLocalidadeSelect.innerHTML += '<option value="Grande Vitória">Grande Vitória</option>';
    cidades.forEach(cidade => {
        if (!['Vila Velha', 'Vitória', 'Serra', 'Cariacica'].includes(cidade)) {
            talentLocalidadeSelect.innerHTML += `<option value="${cidade}">${cidade}</option>`;
        }
    });

    if (dom.talentModalOverlay) dom.talentModalOverlay.classList.remove('hidden');
}

export const closeTalentModal = () => {
    if (dom.talentModalOverlay) {
        dom.talentModalOverlay.classList.add('hidden');
        document.getElementById('talent-form').reset();
        const statusMessage = document.getElementById('talent-status-message');
        if (statusMessage) statusMessage.textContent = '';
    }
};

// Funções para alternar entre o ecrã de login e o dashboard
export function showDashboard() {
    if (dom.loginContainer) dom.loginContainer.classList.add('hidden');
    if (dom.dashboard) dom.dashboard.classList.remove('hidden');
    
    const savedView = sessionStorage.getItem('activeAdminView');
    showView(savedView || 'vagas'); 
}

export function showLogin() {
    if (dom.dashboard) dom.dashboard.classList.add('hidden');
    if (dom.loginContainer) dom.loginContainer.classList.remove('hidden');
}