// admin/admin.js (Versão Final com a secção de Critérios)
import * as dom from './modules/dom.js';
import { initializeAuth, handleLogin, handleLogout } from './modules/auth.js';
import { showView, openStoreModal, closeStoreModal, openJobModal, closeJobModal, openTalentModal, closeTalentModal } from './modules/ui.js'; // Adicionado closeTalentModal aqui
import { loadStores, displayStores, handleStoreFormSubmit } from './modules/stores.js';
import { displayJobs, handleJobFormSubmit, loadJobs } from './modules/jobs.js';
import { loadResumesByStore, handleTalentFormSubmit } from './modules/resumes.js';
import { initializeCriteria } from './modules/criteria.js';

function initializeAdminPanel() {
    // Listeners de Autenticação e Navegação Principal
    if (dom.loginForm) dom.loginForm.addEventListener('submit', handleLogin);
    if (dom.logoutBtn) dom.logoutBtn.addEventListener('click', handleLogout);
    if (dom.navVagas) dom.navVagas.addEventListener('click', (e) => { e.preventDefault(); showView('vagas'); });
    if (dom.navCurriculos) dom.navCurriculos.addEventListener('click', (e) => { e.preventDefault(); showView('curriculos'); });
    if (dom.navLojas) dom.navLojas.addEventListener('click', (e) => { e.preventDefault(); showView('lojas'); });
    if (dom.navCriterios) dom.navCriterios.addEventListener('click', (e) => { e.preventDefault(); showView('criterios'); });

    // Listeners para a Secção de Lojas
    if (dom.newStoreBtn) dom.newStoreBtn.addEventListener('click', () => { dom.storeModalTitle.textContent = 'Criar Nova Loja'; openStoreModal(); });
    if (dom.cancelStoreBtn) dom.cancelStoreBtn.addEventListener('click', closeStoreModal);
    if (dom.storeModalOverlay) dom.storeModalOverlay.addEventListener('click', (e) => { if (e.target === dom.storeModalOverlay) closeStoreModal(); });
    if (dom.storeForm) dom.storeForm.addEventListener('submit', handleStoreFormSubmit);
    if (dom.storeSearchInput) dom.storeSearchInput.addEventListener('input', displayStores);
    if (dom.storeStateFilter) dom.storeStateFilter.addEventListener('change', displayStores);

    // Listeners para a Secção de Vagas
    if (dom.newJobBtn) dom.newJobBtn.addEventListener('click', () => { openJobModal(); });
    if (dom.cancelJobBtn) dom.cancelJobBtn.addEventListener('click', closeJobModal);
    if (dom.jobModalOverlay) dom.jobModalOverlay.addEventListener('click', (e) => { if (e.target === dom.jobModalOverlay) closeJobModal(); });
    if (dom.jobForm) dom.jobForm.addEventListener('submit', handleJobFormSubmit);
    if (dom.jobStatusFilter) dom.jobStatusFilter.addEventListener('change', displayJobs);
    if (dom.jobCategoryFilter) dom.jobCategoryFilter.addEventListener('change', displayJobs);
    if (dom.jobTitleFilter) dom.jobTitleFilter.addEventListener('change', displayJobs);
    if (dom.jobSearchInput) dom.jobSearchInput.addEventListener('input', displayJobs);

    // Listeners para a Secção de Currículos (Banco de Talentos)
    if (dom.newTalentBtn) dom.newTalentBtn.addEventListener('click', openTalentModal);
    if (dom.talentForm) dom.talentForm.addEventListener('submit', handleTalentFormSubmit);
    
    // LINHA ADICIONADA PARA CORRIGIR O BOTÃO
    if (dom.cancelTalentBtn) dom.cancelTalentBtn.addEventListener('click', closeTalentModal);
    // Também adicionei um listener para fechar clicando fora do modal
    if (dom.talentModalOverlay) dom.talentModalOverlay.addEventListener('click', (e) => { if (e.target === dom.talentModalOverlay) closeTalentModal(); });


    if (dom.storeFilterSelect) dom.storeFilterSelect.addEventListener('change', loadResumesByStore);
    if (dom.applicationTypeFilter) dom.applicationTypeFilter.addEventListener('change', loadResumesByStore);

    // Inicializa os módulos da aplicação
    initializeCriteria();
    initializeAuth(() => {
        // Esta função é chamada após o login ser bem-sucedido.
        // A lógica de carregamento dos dados agora é gerida pela função showView.
    });
}

document.addEventListener('DOMContentLoaded', initializeAdminPanel);