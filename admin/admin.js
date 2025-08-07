// admin/admin.js

// Importação dos Módulos
import * as dom from './modules/dom.js';
import { initializeAuth, handleLogin, handleLogout } from './modules/auth.js';
import { showView, showDashboard, openStoreModal, closeStoreModal, openJobModal, closeJobModal, openTalentModal, closeTalentModal } from './modules/ui.js';
import { loadStores, displayStores, handleStoreFormSubmit } from './modules/stores.js';
import { displayJobs, handleJobFormSubmit, handleStoreSelectChange } from './modules/jobs.js';
import { loadResumesByStore, handleTalentFormSubmit } from './modules/resumes.js';


/**
 * Ponto de entrada da aplicação do painel de administração.
 * Configura todos os ouvintes de eventos e a inicialização.
 */
function initializeAdminPanel() {
    // --- Configuração dos Ouvintes de Eventos ---
    
    // Autenticação
    dom.loginForm.addEventListener('submit', handleLogin);
    dom.logoutBtn.addEventListener('click', handleLogout);

    // Navegação Principal
    dom.navVagas.addEventListener('click', (e) => { e.preventDefault(); showView('vagas'); });
    dom.navCurriculos.addEventListener('click', (e) => { e.preventDefault(); showView('curriculos'); });
    dom.navLojas.addEventListener('click', (e) => { e.preventDefault(); showView('lojas'); });

    // Modal de Lojas e Filtros
    dom.newStoreBtn.addEventListener('click', () => { dom.storeModalTitle.textContent = 'Criar Nova Loja'; openStoreModal(); });
    dom.cancelStoreBtn.addEventListener('click', closeStoreModal);
    dom.storeModalOverlay.addEventListener('click', (e) => { if (e.target === dom.storeModalOverlay) closeStoreModal(); });
    dom.storeForm.addEventListener('submit', handleStoreFormSubmit);
    dom.storeSearchInput.addEventListener('input', displayStores);
    dom.storeStateFilter.addEventListener('change', displayStores);

    // Modal de Vagas e Filtros
    dom.newJobBtn.addEventListener('click', () => { dom.jobModalTitle.textContent = 'Criar Nova Vaga'; document.getElementById('job-is_active').checked = true; openJobModal(); });
    dom.cancelJobBtn.addEventListener('click', closeJobModal);
    dom.jobModalOverlay.addEventListener('click', (e) => { if (e.target === dom.jobModalOverlay) closeJobModal(); });
    dom.jobForm.addEventListener('submit', handleJobFormSubmit);
    dom.jobStoreSelect.addEventListener('change', handleStoreSelectChange);
    dom.jobStatusFilter.addEventListener('change', displayJobs);
    dom.jobCategoryFilter.addEventListener('change', displayJobs);
    dom.jobTitleFilter.addEventListener('change', displayJobs);
    dom.jobSearchInput.addEventListener('input', displayJobs);

    // Modal de Banco de Talentos
    dom.newTalentBtn.addEventListener('click', openTalentModal);
    dom.cancelTalentBtn.addEventListener('click', closeTalentModal);
    dom.talentModalOverlay.addEventListener('click', (e) => { if (e.target === dom.talentModalOverlay) closeTalentModal(); });
    dom.talentForm.addEventListener('submit', handleTalentFormSubmit);

    // Filtros da Tela de Currículos
    dom.storeFilterSelect.addEventListener('change', loadResumesByStore);
    dom.applicationTypeFilter.addEventListener('change', loadResumesByStore);


    // --- Inicialização da Aplicação ---
    
    // A função initializeAuth agora recebe uma função para executar em caso de sucesso.
    initializeAuth(async () => {
        try {
            // 1. Carrega os dados essenciais que outras partes da aplicação precisam.
            await loadStores();

            // 2. Após os dados estarem prontos, exibe o painel.
            showDashboard();
        } catch (error) {
            console.error("Falha ao inicializar o painel:", error);
            alert("Ocorreu um erro ao carregar os dados do painel. Por favor, tente novamente.");
        }
    });
}

// Garante que o script rode após o carregamento completo do HTML
document.addEventListener('DOMContentLoaded', initializeAdminPanel);