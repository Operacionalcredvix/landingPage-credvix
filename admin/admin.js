// Importa o cliente Supabase. O arquivo 'stores.js' não é mais necessário aqui.
import { supabase } from '../script/supabase-client.js';

// --- ELEMENTOS DO DOM ---
const loginContainer = document.getElementById('login-container');
const dashboard = document.getElementById('dashboard');
const loginForm = document.getElementById('login-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginError = document.getElementById('login-error');
const logoutBtn = document.getElementById('logout-btn');

// Navegação e Telas
const navVagas = document.getElementById('nav-vagas');
const navCurriculos = document.getElementById('nav-curriculos');
const navLojas = document.getElementById('nav-lojas');
const vagasView = document.getElementById('vagas-view');
const curriculosView = document.getElementById('curriculos-view');
const lojasView = document.getElementById('lojas-view');

// Elementos da Tela de Lojas
const storeListTbody = document.getElementById('store-list-tbody');
const loadingStoresMessage = document.getElementById('loading-stores-message');
const newStoreBtn = document.getElementById('new-store-btn');
const storeModalOverlay = document.getElementById('store-modal-overlay');
const storeModalTitle = document.getElementById('store-modal-title');
const storeForm = document.getElementById('store-form');
const cancelStoreBtn = document.getElementById('cancel-store-btn');
const saveStoreBtn = document.getElementById('save-store-btn');
const storeIdInput = document.getElementById('store-id');

// Elementos da Tela de Vagas
const jobListTbody = document.getElementById('job-list-tbody');
const loadingMessage = document.getElementById('loading-message');
const newJobBtn = document.getElementById('new-job-btn');
const jobModalOverlay = document.getElementById('job-modal-overlay');
const jobModalTitle = document.getElementById('modal-title');
const jobForm = document.getElementById('job-form');
const jobIdInput = document.getElementById('job-id');
const cancelBtn = document.getElementById('cancel-btn');
const saveBtn = document.getElementById('save-btn');
const totalJobsStat = document.getElementById('total-jobs-stat');
const activeJobsStat = document.getElementById('active-jobs-stat');
const inactiveJobsStat = document.getElementById('inactive-jobs-stat');

// ... outros elementos que você possa ter ...

// --- ESTADO DA APLICAÇÃO ---
let loadedStores = [];

// --- FUNÇÕES DE NAVEGAÇÃO ---
function showView(viewId) {
    [vagasView, curriculosView, lojasView].forEach(view => view.classList.add('hidden'));
    [navVagas, navCurriculos, navLojas].forEach(nav => nav.classList.remove('active'));

    const viewMap = {
        'vagas': { view: vagasView, nav: navVagas },
        'curriculos': { view: curriculosView, nav: navCurriculos },
        'lojas': { view: lojasView, nav: navLojas }
    };

    if (viewMap[viewId]) {
        viewMap[viewId].view.classList.remove('hidden');
        viewMap[viewId].nav.classList.add('active');
    }
}


// --- FUNÇÕES DE AUTENTICAÇÃO ---
async function handleLogin(event) {
    event.preventDefault();
    loginError.textContent = '';
    const { error } = await supabase.auth.signInWithPassword({
        email: emailInput.value,
        password: passwordInput.value,
    });

    if (error) {
        loginError.textContent = 'E-mail ou senha inválidos.';
    }
    // A mágica acontece no onAuthStateChange, não precisamos fazer mais nada aqui.
}

async function handleLogout() {
    sessionStorage.removeItem('sessionActive'); // Limpa nossa chave de sessão
    await supabase.auth.signOut();
    // O onAuthStateChange cuidará de mostrar a tela de login.
}


// --- FUNÇÕES PRINCIPAIS DAS TELAS ---
function showDashboard() {
    loginContainer.classList.add('hidden');
    dashboard.classList.remove('hidden');
    initializeDashboard();
}

function showLogin() {
    dashboard.classList.add('hidden');
    loginContainer.classList.remove('hidden');
}

async function initializeDashboard() {
    showView('vagas'); // Define a tela inicial
    await loadStoresAndPopulateDropdowns();
    // As funções de carregar vagas e currículos serão chamadas quando o usuário navegar para elas
}

async function loadStoresAndPopulateDropdowns() {
    // Esta função agora carrega as lojas e preenche todos os dropdowns necessários
    // (Lógica completa será adicionada aqui)
    console.log("Carregando lojas do banco de dados...");
}

// ... (Aqui entrariam todas as suas outras funções: loadJobs, loadResumes, handleFormSubmit, etc.)


// --- PONTO CENTRAL DE CONTROLE DE SESSÃO ---
supabase.auth.onAuthStateChange((event, session) => {
    const sessionIsActive = sessionStorage.getItem('sessionActive');

    if (event === 'SIGNED_IN') {
        // Usuário acabou de logar com sucesso.
        sessionStorage.setItem('sessionActive', 'true');
        showDashboard();
    } else if (event === 'SIGNED_OUT') {
        // Usuário fez logout.
        sessionStorage.removeItem('sessionActive');
        showLogin();
    } else if (session) {
        // Página foi recarregada, Supabase encontrou uma sessão.
        if (sessionIsActive) {
            // Nossa chave de sessão existe, tudo ok.
            showDashboard();
        } else {
            // Aba foi fechada e reaberta. Força o logout.
            console.log('Sessão persistente sem sessão de aba ativa. Fazendo logout.');
            supabase.auth.signOut();
        }
    } else {
        // Nenhum usuário logado.
        showLogin();
    }
});


// --- INICIALIZAÇÃO E EVENTOS ---
loginForm.addEventListener('submit', handleLogin);
logoutBtn.addEventListener('click', handleLogout);

// Eventos de Navegação
navVagas.addEventListener('click', (e) => { e.preventDefault(); showView('vagas'); /* loadJobs(); */ });
navCurriculos.addEventListener('click', (e) => { e.preventDefault(); showView('curriculos'); /* loadResumes(); */ });
navLojas.addEventListener('click', (e) => { e.preventDefault(); showView('lojas'); loadStoresAndPopulateDropdowns(); });

// Eventos de Lojas
newStoreBtn.addEventListener('click', () => {
    storeModalTitle.textContent = 'Criar Nova Loja';
    storeForm.reset();
    storeIdInput.value = '';
    openStoreModal();
});
cancelStoreBtn.addEventListener('click', closeStoreModal);
// ... outros event listeners de lojas e vagas