// Importa o cliente Supabase
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

// Elementos do Modal de Candidatos
const candidateModalOverlay = document.getElementById('candidate-modal-overlay');
const closeCandidateModalBtn = document.getElementById('close-candidate-modal-btn');
const candidateModalTitle = document.getElementById('candidate-modal-title');
const loadingCandidatesMessage = document.getElementById('loading-candidates-message');
const candidateListTbody = document.getElementById('candidate-list-tbody');

// Elementos do Banco de Talentos
const newTalentBtn = document.getElementById('new-talent-btn');
const talentModalOverlay = document.getElementById('talent-modal-overlay');
const talentForm = document.getElementById('talent-form');
const cancelTalentBtn = document.getElementById('cancel-talent-btn');
const talentStatusMessage = document.getElementById('talent-status-message');

// Elementos da Tela de Currículos
const storeFilterSelect = document.getElementById('store-filter-select');
const resumeListTbody = document.getElementById('resume-list-tbody');
const loadingResumesMessage = document.getElementById('loading-resumes-message');
const noResumesMessage = document.getElementById('no-resumes-message');

// --- ESTADO DA APLICAÇÃO ---
let loadedStores = [];

// --- FUNÇÕES DE NAVEGAÇÃO ---
function showView(viewId) {
    [vagasView, curriculosView, lojasView].forEach(view => view.classList.add('hidden'));
    [navVagas, navCurriculos, navLojas].forEach(nav => nav.classList.remove('active'));

    const viewMap = {
        'vagas': { view: vagasView, nav: navVagas, loader: loadJobs },
        'curriculos': { view: curriculosView, nav: navCurriculos, loader: loadResumesByStore },
        'lojas': { view: lojasView, nav: navLojas, loader: loadStoresAndPopulateDropdowns }
    };

    if (viewMap[viewId]) {
        viewMap[viewId].view.classList.remove('hidden');
        viewMap[viewId].nav.classList.add('active');
        viewMap[viewId].loader();
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
}

async function handleLogout() {
    sessionStorage.removeItem('sessionActive');
    await supabase.auth.signOut();
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
    await loadStoresAndPopulateDropdowns();
    showView('vagas');
}

// --- FUNÇÕES DE GESTÃO DE LOJAS ---
function openStoreModal() { storeModalOverlay.classList.remove('hidden'); }
function closeStoreModal() { storeModalOverlay.classList.add('hidden'); storeForm.reset(); storeIdInput.value = ''; }

async function loadStoresAndPopulateDropdowns() {
    loadingStoresMessage.classList.remove('hidden');
    storeListTbody.innerHTML = '';

    const { data, error } = await supabase.from('lojas').select(`*, vagas(count)`).order('name', { ascending: true });
    
    if (error) {
        console.error("Erro ao carregar lojas:", error);
        loadingStoresMessage.textContent = "Erro ao carregar lojas.";
        return;
    }
    
    loadedStores = data;

    storeListTbody.innerHTML = '';
    loadedStores.forEach(store => {
        const vagaCount = store.vagas[0]?.count || 0;
        const row = storeListTbody.insertRow();
        row.innerHTML = `
            <td><strong>${store.name}</strong></td>
            <td>${store.city} / ${store.state}</td>
            <td>${vagaCount}</td>
            <td class="actions">
                <button class="edit-store-btn" data-id="${store.id}">Editar</button>
                <button class="delete-store-btn" data-id="${store.id}" data-vagas="${vagaCount}">Excluir</button>
            </td>
        `;
    });
    
    loadingStoresMessage.classList.add('hidden');
    document.querySelectorAll('.edit-store-btn').forEach(btn => btn.addEventListener('click', handleEditStore));
    document.querySelectorAll('.delete-store-btn').forEach(btn => btn.addEventListener('click', handleDeleteStore));

    const cities = [...new Set(loadedStores.map(store => store.city))].sort();
    storeFilterSelect.innerHTML = '<option value="todos">Todas as Cidades</option>';
    cities.forEach(city => storeFilterSelect.add(new Option(city, city)));
    
    const jobStoreSelect = document.getElementById('job-storeName');
    jobStoreSelect.innerHTML = '<option value="" disabled selected>Selecione a Loja</option>';
    loadedStores.forEach(store => jobStoreSelect.add(new Option(store.name, store.id)));
}

async function handleStoreFormSubmit(event) {
    event.preventDefault();
    const storeId = storeIdInput.value;
    const storeData = {
        name: document.getElementById('store-name').value,
        city: document.getElementById('store-city').value,
        state: document.getElementById('store-state').value,
        address: document.getElementById('store-address').value,
        phone: document.getElementById('store-phone').value,
        whatsapp: document.getElementById('store-whatsapp').value,
        instagram_url: document.getElementById('store-instagram').value,
    };

    const { error } = storeId ? await supabase.from('lojas').update(storeData).eq('id', storeId) : await supabase.from('lojas').insert([storeData]);

    if (error) {
        alert("Ocorreu um erro ao salvar a loja.");
    } else {
        closeStoreModal();
        await loadStoresAndPopulateDropdowns();
    }
}

function handleEditStore(event) {
    const id = event.target.dataset.id;
    const store = loadedStores.find(s => s.id == id);
    if (!store) return;

    storeModalTitle.textContent = 'Editar Loja';
    storeIdInput.value = store.id;
    document.getElementById('store-name').value = store.name;
    document.getElementById('store-city').value = store.city;
    document.getElementById('store-state').value = store.state;
    document.getElementById('store-address').value = store.address;
    document.getElementById('store-phone').value = store.phone;
    document.getElementById('store-whatsapp').value = store.whatsapp;
    document.getElementById('store-instagram').value = store.instagram_url;
    openStoreModal();
}

async function handleDeleteStore(event) {
    const id = event.target.dataset.id;
    const vagaCount = parseInt(event.target.dataset.vagas, 10);
    if (vagaCount > 0) {
        alert(`Não é possível excluir esta loja, pois ela possui ${vagaCount} vaga(s) associada(s).`);
        return;
    }
    if (confirm('Tem certeza que deseja excluir esta loja?')) {
        const { error } = await supabase.from('lojas').delete().eq('id', id);
        if (error) {
            alert("Ocorreu um erro ao excluir a loja.");
        } else {
            await loadStoresAndPopulateDropdowns();
        }
    }
}

// --- FUNÇÕES DE GESTÃO DE VAGAS ---
function openJobModal() { jobModalOverlay.classList.remove('hidden'); }
function closeJobModal() { jobModalOverlay.classList.add('hidden'); jobForm.reset(); jobIdInput.value = ''; }

async function loadJobs() {
    console.log("Carregando vagas...");
    // Implementação completa da função
}

async function handleJobFormSubmit(event) {
    event.preventDefault();
    // Implementação completa para salvar vaga
}

// --- FUNÇÕES DE GESTÃO DE CURRÍCULOS ---
async function loadResumesByStore() {
    console.log("Carregando currículos...");
    // Implementação completa da função
}

// --- FUNÇÕES DO BANCO DE TALENTOS ---
function openTalentModal() { if(talentModalOverlay) talentModalOverlay.classList.remove('hidden'); }
function closeTalentModal() { if(talentModalOverlay) talentModalOverlay.classList.add('hidden'); }

// --- PONTO CENTRAL DE CONTROLE DE SESSÃO ---
supabase.auth.onAuthStateChange((event, session) => {
    const sessionIsActive = sessionStorage.getItem('sessionActive');
    if (event === 'SIGNED_IN') {
        sessionStorage.setItem('sessionActive', 'true');
        showDashboard();
    } else if (event === 'SIGNED_OUT') {
        sessionStorage.removeItem('sessionActive');
        showLogin();
    } else if (session && sessionIsActive) {
        showDashboard();
    } else if (session && !sessionIsActive) {
        supabase.auth.signOut();
    } else {
        showLogin();
    }
});


// --- INICIALIZAÇÃO E EVENTOS ---
loginForm.addEventListener('submit', handleLogin);
logoutBtn.addEventListener('click', handleLogout);

// Navegação
navVagas.addEventListener('click', (e) => { e.preventDefault(); showView('vagas'); });
navCurriculos.addEventListener('click', (e) => { e.preventDefault(); showView('curriculos'); });
navLojas.addEventListener('click', (e) => { e.preventDefault(); showView('lojas'); });

// Lojas
newStoreBtn.addEventListener('click', () => {
    storeModalTitle.textContent = 'Criar Nova Loja';
    storeForm.reset();
    storeIdInput.value = '';
    openStoreModal();
});
cancelStoreBtn.addEventListener('click', closeStoreModal);
storeModalOverlay.addEventListener('click', (e) => { if(e.target === storeModalOverlay) closeStoreModal(); });
storeForm.addEventListener('submit', handleStoreFormSubmit);

// Vagas
newJobBtn.addEventListener('click', () => {
    jobModalTitle.textContent = 'Criar Nova Vaga';
    jobForm.reset();
    jobIdInput.value = '';
    openJobModal();
});
cancelBtn.addEventListener('click', closeJobModal);
jobModalOverlay.addEventListener('click', (e) => { if(e.target === jobModalOverlay) closeJobModal(); });
jobForm.addEventListener('submit', handleJobFormSubmit);

// Banco de Talentos
if (newTalentBtn) {
    newTalentBtn.addEventListener('click', openTalentModal);
}
if(cancelTalentBtn) {
    cancelTalentBtn.addEventListener('click', closeTalentModal);
}
if (talentModalOverlay) {
    talentModalOverlay.addEventListener('click', (e) => {
        if(e.target === talentModalOverlay) closeTalentModal();
    });
}