// admin/admin.js
import * as dom from './modules/dom.js';
import { initializeAuth, handleLogin, handleLogout } from './modules/auth.js';
import { showView, openStoreModal, closeStoreModal, openJobModal, closeJobModal, openTalentModal } from './modules/ui.js';
import { loadStores, displayStores, handleStoreFormSubmit } from './modules/stores.js';
import { displayJobs, handleJobFormSubmit, loadJobs } from './modules/jobs.js';
import { loadResumesByStore, handleTalentFormSubmit } from './modules/resumes.js';
import { initializeProfile } from './modules/profile.js'; 

function initializeAdminPanel() {
    // Adiciona listeners apenas a elementos que existem
    if (dom.loginForm) dom.loginForm.addEventListener('submit', handleLogin);
    if (dom.logoutBtn) dom.logoutBtn.addEventListener('click', handleLogout);

    if (dom.navVagas) dom.navVagas.addEventListener('click', (e) => { e.preventDefault(); showView('vagas'); });
    if (dom.navCurriculos) dom.navCurriculos.addEventListener('click', (e) => { e.preventDefault(); showView('curriculos'); });
    if (dom.navLojas) dom.navLojas.addEventListener('click', (e) => { e.preventDefault(); showView('lojas'); });

    if (dom.newStoreBtn) dom.newStoreBtn.addEventListener('click', () => { dom.storeModalTitle.textContent = 'Criar Nova Loja'; openStoreModal(); });
    if (dom.cancelStoreBtn) dom.cancelStoreBtn.addEventListener('click', closeStoreModal);
    if (dom.storeModalOverlay) dom.storeModalOverlay.addEventListener('click', (e) => { if (e.target === dom.storeModalOverlay) closeStoreModal(); });
    if (dom.storeForm) dom.storeForm.addEventListener('submit', handleStoreFormSubmit);
    if (dom.storeSearchInput) dom.storeSearchInput.addEventListener('input', displayStores);
    if (dom.storeStateFilter) dom.storeStateFilter.addEventListener('change', displayStores);

    if (dom.newJobBtn) dom.newJobBtn.addEventListener('click', () => { openJobModal(); });
    if (dom.cancelJobBtn) dom.cancelJobBtn.addEventListener('click', closeJobModal);
    if (dom.jobModalOverlay) dom.jobModalOverlay.addEventListener('click', (e) => { if (e.target === dom.jobModalOverlay) closeJobModal(); });
    if (dom.jobForm) dom.jobForm.addEventListener('submit', handleJobFormSubmit);
    if (dom.jobStatusFilter) dom.jobStatusFilter.addEventListener('change', displayJobs);
    if (dom.jobCategoryFilter) dom.jobCategoryFilter.addEventListener('change', displayJobs);
    if (dom.jobTitleFilter) dom.jobTitleFilter.addEventListener('change', displayJobs);
    if (dom.jobSearchInput) dom.jobSearchInput.addEventListener('input', displayJobs);

    if (dom.newTalentBtn) dom.newTalentBtn.addEventListener('click', openTalentModal);
    if (dom.talentForm) dom.talentForm.addEventListener('submit', handleTalentFormSubmit);

    if (dom.storeFilterSelect) dom.storeFilterSelect.addEventListener('change', loadResumesByStore);
    if (dom.applicationTypeFilter) dom.applicationTypeFilter.addEventListener('change', loadResumesByStore);

    // Inicializa a autenticação e passa a função que carrega os dados do painel.
    initializeAuth(async () => {
        try {
            await Promise.all([
                loadStores(),
                loadJobs()
            ]);
            initializeProfile();
        } catch (error) {
            console.error("Falha ao inicializar os módulos do painel:", error);
            alert("Ocorreu um erro ao carregar os dados do painel.");
        }
    });
}

document.addEventListener('DOMContentLoaded', initializeAdminPanel);