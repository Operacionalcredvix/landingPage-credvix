// admin/admin.js
import * as dom from './modules/dom.js';
import { initializeAuth } from './modules/auth.js';
import { showView, showDashboard, showLogin } from './modules/ui.js';
import { displayStores, handleStoreFormSubmit } from './modules/stores.js';
import { displayJobs, handleJobFormSubmit } from './modules/jobs.js';
import { loadResumesByStore, handleTalentFormSubmit } from './modules/resumes.js';
import { initializeCriteria } from './modules/criteria.js';
import { openStoreModal, closeStoreModal, openJobModal, closeJobModal, openTalentModal, closeTalentModal } from './modules/ui.js';

function initializeAdminPanel() {
    // Listeners de Navegação Principal
    if (dom.navVagas) dom.navVagas.addEventListener('click', (e) => { e.preventDefault(); showView('vagas'); });
    if (dom.navCurriculos) dom.navCurriculos.addEventListener('click', (e) => { e.preventDefault(); showView('curriculos'); });
    if (dom.navLojas) dom.navLojas.addEventListener('click', (e) => { e.preventDefault(); showView('lojas'); });
    if (dom.navCriterios) dom.navCriterios.addEventListener('click', (e) => { e.preventDefault(); showView('criterios'); });

    // Listeners para Modais e Formulários
    if (dom.newStoreBtn) dom.newStoreBtn.addEventListener('click', () => { dom.storeModalTitle.textContent = 'Criar Nova Loja'; openStoreModal(); });
    if (dom.cancelStoreBtn) dom.cancelStoreBtn.addEventListener('click', closeStoreModal);
    if (dom.storeModalOverlay) dom.storeModalOverlay.addEventListener('click', (e) => { if (e.target === dom.storeModalOverlay) closeStoreModal(); });
    if (dom.storeForm) dom.storeForm.addEventListener('submit', handleStoreFormSubmit);

    if (dom.newJobBtn) dom.newJobBtn.addEventListener('click', openJobModal);
    if (dom.cancelJobBtn) dom.cancelJobBtn.addEventListener('click', closeJobModal);
    if (dom.jobModalOverlay) dom.jobModalOverlay.addEventListener('click', (e) => { if (e.target === dom.jobModalOverlay) closeJobModal(); });
    if (dom.jobForm) dom.jobForm.addEventListener('submit', handleJobFormSubmit);

    if (dom.newTalentBtn) dom.newTalentBtn.addEventListener('click', openTalentModal);
    if (dom.cancelTalentBtn) dom.cancelTalentBtn.addEventListener('click', closeTalentModal);
    if (dom.talentModalOverlay) dom.talentModalOverlay.addEventListener('click', (e) => { if (e.target === dom.talentModalOverlay) closeTalentModal(); });
    if (dom.talentForm) dom.talentForm.addEventListener('submit', handleTalentFormSubmit);
    
    // Listeners para Filtros
    if (dom.storeSearchInput) dom.storeSearchInput.addEventListener('input', displayStores);
    if (dom.storeStateFilter) dom.storeStateFilter.addEventListener('change', displayStores);
    if (dom.jobStatusFilter) dom.jobStatusFilter.addEventListener('change', displayJobs);
    if (dom.jobCategoryFilter) dom.jobCategoryFilter.addEventListener('change', displayJobs);
    if (dom.jobTitleFilter) dom.jobTitleFilter.addEventListener('change', displayJobs);
    if (dom.jobSearchInput) dom.jobSearchInput.addEventListener('input', displayJobs);
    if (dom.storeFilterSelect) dom.storeFilterSelect.addEventListener('change', loadResumesByStore);
    if (dom.applicationTypeFilter) dom.applicationTypeFilter.addEventListener('change', loadResumesByStore);
    
    // Inicializa os módulos
    initializeCriteria();
}


// Inicializa a autenticação e depois o painel
initializeAuth(
    (user) => { // onUserLoggedIn
        showDashboard();
        initializeAdminPanel();
    },
    () => { // onUserLoggedOut
        showLogin();
    }
);