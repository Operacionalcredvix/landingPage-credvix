/**
 * Centraliza todas as referências a elementos do DOM para fácil manutenção.
 */

// Geral e Autenticação
export const loginContainer = document.getElementById('login-container');
export const dashboard = document.getElementById('dashboard');
export const loginForm = document.getElementById('login-form');
export const emailInput = document.getElementById('email');
export const passwordInput = document.getElementById('password');
export const loginError = document.getElementById('login-error');
export const logoutBtn = document.getElementById('logout-btn');

// Navegação e Telas
export const navVagas = document.getElementById('nav-vagas');
export const navCurriculos = document.getElementById('nav-curriculos');
export const navLojas = document.getElementById('nav-lojas');
export const navCriterios = document.getElementById('nav-criterios'); // Adicionado
export const vagasView = document.getElementById('vagas-view');
export const curriculosView = document.getElementById('curriculos-view');
export const lojasView = document.getElementById('lojas-view');
export const criteriosView = document.getElementById('criterios-view'); // Adicionado

// Seção de Lojas
export const storeListTbody = document.getElementById('store-list-tbody');
export const newStoreBtn = document.getElementById('new-store-btn');
export const storeModalOverlay = document.getElementById('store-modal-overlay');
export const storeModalTitle = document.getElementById('store-modal-title');
export const storeForm = document.getElementById('store-form');
export const cancelStoreBtn = document.getElementById('store-cancel-btn');
export const storeIdInput = document.getElementById('store-id');
export const storeSearchInput = document.getElementById('store-search-input');
export const storeStateFilter = document.getElementById('store-state-filter');

// Seção de Vagas
export const totalJobsStat = document.getElementById('total-jobs-stat');
export const activeJobsStat = document.getElementById('active-jobs-stat');
export const inactiveJobsStat = document.getElementById('inactive-jobs-stat');
export const jobCardGrid = document.getElementById('job-card-grid');
export const noJobsMessage = document.getElementById('no-jobs-message');
export const jobStatusFilter = document.getElementById('job-status-filter');
export const jobCategoryFilter = document.getElementById('job-category-filter');
export const jobTitleFilter = document.getElementById('job-title-filter');
export const jobSearchInput = document.getElementById('job-search-input');
export const newJobBtn = document.getElementById('new-job-btn');
export const jobModalOverlay = document.getElementById('job-modal-overlay');
export const jobModalTitle = document.getElementById('modal-title');
export const jobForm = document.getElementById('job-form');
export const jobIdInput = document.getElementById('job-id');
export const cancelJobBtn = document.getElementById('job-cancel-btn');
export const jobLocalidadeSelect = document.getElementById('job-localidade');

// Seção de Currículos
export const storeFilterSelect = document.getElementById('store-filter-select');
export const applicationTypeFilter = document.getElementById('application-type-filter');
export const resumeListTbody = document.getElementById('resume-list-tbody');
export const loadingResumesMessage = document.getElementById('loading-resumes-message');
export const noResumesMessage = document.getElementById('no-resumes-message');

// Banco de Talentos
export const newTalentBtn = document.getElementById('new-talent-btn');
export const talentModalOverlay = document.getElementById('talent-modal-overlay');
export const cancelTalentBtn = document.getElementById('talent-cancel-btn');
export const talentForm = document.getElementById('talent-form');

// Secção de Critérios (Adicionado)
export const criteriaForm = document.getElementById('criteria-form');
export const criteriaStoreSelect = document.getElementById('criteria-store-select');
export const criteriaText = document.getElementById('criteria-text');
export const criteriaSubmitBtn = criteriaForm ? criteriaForm.querySelector('button[type="submit"]') : null;
export const criteriaStatusMessage = document.getElementById('criteria-status-message');
export const criteriaSummaryContainer = document.getElementById('criteria-summary-container');
export const criteriaSummaryList = document.getElementById('criteria-summary-list');
export const criteriaTagDisplay = document.getElementById('criteria-tag-display');