// admin/admin.js (Versão Final e Corrigida)
import * as dom from './modules/dom.js';
import { initializeAuth, handleLogin, handleLogout } from './modules/auth.js';
import { showView, openStoreModal, closeStoreModal, openJobModal, closeJobModal, openTalentModal } from './modules/ui.js';
import { loadStores, displayStores, handleStoreFormSubmit } from './modules/stores.js';
import { displayJobs, handleJobFormSubmit, loadJobs } from './modules/jobs.js';
import { loadResumesByStore, handleTalentFormSubmit } from './modules/resumes.js';
// A importação e a inicialização do perfil foram removidas para corrigir o erro.
// import { initializeProfile } from './modules/profile.js'; 

function initializeAdminPanel() {
    // Adiciona listeners de eventos básicos
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

    // Inicializa a autenticação com a lógica de carregamento de dados adiada
    initializeAuth(() => {
        // Esta função de callback é chamada após o login ser bem-sucedido.
        // A chamada a initializeProfile() foi removida daqui.
    });
}

document.addEventListener('DOMContentLoaded', initializeAdminPanel);