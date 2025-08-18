// admin/modules/ui.js
import * as dom from './dom.js';
import { supabase } from '../../script/supabase-client.js';
import { loadJobs } from './jobs.js';
import { loadResumesByStore } from './resumes.js';
import { loadStores, getLoadedStores } from './stores.js';

const viewLoaders = {
    'vagas': loadJobs,
    'curriculos': loadResumesByStore,
    'lojas': loadStores,
};

export function showView(viewId) {
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
        sessionStorage.setItem('activeAdminView', viewId);
        if (viewLoaders[viewId]) {
            viewLoaders[viewId]();
        }
    }
}

export const openStoreModal = () => dom.storeModalOverlay.classList.remove('hidden');
export const closeStoreModal = () => { dom.storeModalOverlay.classList.add('hidden'); dom.storeForm.reset(); dom.storeIdInput.value = ''; };

// ATUALIZADO
export const openJobModal = () => {
    dom.jobModalTitle.textContent = 'Criar Nova Vaga'; 
    document.getElementById('job-is_active').checked = true;
    dom.jobModalOverlay.classList.remove('hidden');
};
export const closeJobModal = () => { dom.jobModalOverlay.classList.add('hidden'); dom.jobForm.reset(); dom.jobIdInput.value = ''; };

export async function openTalentModal() {
    const talentLocalidadeSelect = document.getElementById('talent-localidade-select');
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

    dom.talentModalOverlay.classList.remove('hidden');
}

export const closeTalentModal = () => {
    dom.talentModalOverlay.classList.add('hidden');
    document.getElementById('talent-form').reset();
    const statusMessage = document.getElementById('talent-status-message');
    if (statusMessage) statusMessage.textContent = '';
};

export function showDashboard() {
    dom.loginContainer.classList.add('hidden');
    dom.dashboard.classList.remove('hidden');
    const savedView = sessionStorage.getItem('activeAdminView');
    showView(savedView || 'vagas'); 
}

export function showLogin() {
    dom.dashboard.classList.add('hidden');
    dom.loginContainer.classList.remove('hidden');
}