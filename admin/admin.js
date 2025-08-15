// admin/admin.js
import * as dom from './modules/dom.js';
import { initializeAuth, handleLogin, handleLogout } from './modules/auth.js';
import { showView, openStoreModal, closeStoreModal, openJobModal, closeJobModal, openTalentModal, closeTalentModal } from './modules/ui.js';
import { loadStores, displayStores, handleStoreFormSubmit } from './modules/stores.js';
import { displayJobs, handleJobFormSubmit, loadJobs } from './modules/jobs.js';
import { loadResumesByStore, handleTalentFormSubmit } from './modules/resumes.js';
import { initializeProfile } from './modules/profile.js'; 

function initializeAdminPanel() {
    // Autenticação
    dom.loginForm.addEventListener('submit', handleLogin);
    dom.logoutBtn.addEventListener('click', handleLogout);

    // Navegação Principal
    dom.navVagas.addEventListener('click', (e) => { e.preventDefault(); showView('vagas'); });
    dom.navCurriculos.addEventListener('click', (e) => { e.preventDefault(); showView('curriculos'); });
    dom.navLojas.addEventListener('click', (e) => { e.preventDefault(); showView('lojas'); });

    // Lojas
    dom.newStoreBtn.addEventListener('click', () => { dom.storeModalTitle.textContent = 'Criar Nova Loja'; openStoreModal(); });
    dom.cancelStoreBtn.addEventListener('click', closeStoreModal);
    dom.storeModalOverlay.addEventListener('click', (e) => { if (e.target === dom.storeModalOverlay) closeStoreModal(); });
    dom.storeForm.addEventListener('submit', handleStoreFormSubmit);
    dom.storeSearchInput.addEventListener('input', displayStores);
    dom.storeStateFilter.addEventListener('change', displayStores);

    // Vagas
    dom.newJobBtn.addEventListener('click', () => { dom.jobModalTitle.textContent = 'Criar Nova Vaga'; document.getElementById('job-is_active').checked = true; openJobModal(); });
    dom.cancelJobBtn.addEventListener('click', closeJobModal);
    dom.jobModalOverlay.addEventListener('click', (e) => { if (e.target === dom.jobModalOverlay) closeJobModal(); });
    dom.jobForm.addEventListener('submit', handleJobFormSubmit);
    dom.jobStatusFilter.addEventListener('change', displayJobs);
    dom.jobCategoryFilter.addEventListener('change', displayJobs);
    dom.jobTitleFilter.addEventListener('change', displayJobs);
    dom.jobSearchInput.addEventListener('input', displayJobs);

    // Banco de Talentos
    dom.newTalentBtn.addEventListener('click', openTalentModal);
    dom.cancelTalentBtn.addEventListener('click', closeTalentModal);
    dom.talentModalOverlay.addEventListener('click', (e) => { if (e.target === dom.talentModalOverlay) closeTalentModal(); });
    dom.talentForm.addEventListener('submit', handleTalentFormSubmit);

    // Currículos
    dom.storeFilterSelect.addEventListener('change', loadResumesByStore);
    dom.applicationTypeFilter.addEventListener('change', loadResumesByStore);

    // Inicializa a autenticação e, em caso de sucesso, o resto do painel.
    initializeAuth(async () => {
        try {
            await loadStores(); // Carrega os dados das lojas
            loadJobs(); // Carrega os dados das vagas
            initializeProfile(); // INICIA A NOVA FUNCIONALIDADE DE PERFIL
        } catch (error) {
            console.error("Falha ao inicializar o painel:", error);
            alert("Ocorreu um erro ao carregar os dados do painel.");
        }
    });
}

document.addEventListener('DOMContentLoaded', initializeAdminPanel);