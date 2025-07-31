// Importa o cliente Supabase. O arquivo 'stores.js' não é mais necessário aqui.
import { supabase } from '../script/supabase-client.js';

// --- ELEMENTOS DO DOM ---
const loginContainer = document.getElementById('login-container');
const dashboard = document.getElementById('dashboard');
const loginForm = document.getElementById('login-form');
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

// Elementos da Tela de Currículos
const storeFilterSelect = document.getElementById('store-filter-select');
const resumeListTbody = document.getElementById('resume-list-tbody');
const loadingResumesMessage = document.getElementById('loading-resumes-message');
const noResumesMessage = document.getElementById('no-resumes-message');

// --- ESTADO DA APLICAÇÃO ---
// Guardaremos as lojas carregadas aqui para reutilizar nos dropdowns
let loadedStores = [];

// --- FUNÇÕES DE NAVEGAÇÃO ---
function showView(viewId) {
    [vagasView, curriculosView, lojasView].forEach(view => view.classList.add('hidden'));
    [navVagas, navCurriculos, navLojas].forEach(nav => nav.classList.remove('active'));

    if (viewId === 'vagas') {
        vagasView.classList.remove('hidden');
        navVagas.classList.add('active');
    } else if (viewId === 'curriculos') {
        curriculosView.classList.remove('hidden');
        navCurriculos.classList.add('active');
    } else if (viewId === 'lojas') {
        lojasView.classList.remove('hidden');
        navLojas.classList.add('active');
    }
}

// --- FUNÇÕES DE GESTÃO DE LOJAS ---
function openStoreModal() {
    storeModalOverlay.classList.remove('hidden');
}

function closeStoreModal() {
    storeForm.reset();
    storeIdInput.value = '';
    storeModalOverlay.classList.add('hidden');
}

async function loadStoresAndPopulateDropdowns() {
    loadingStoresMessage.classList.remove('hidden');
    storeListTbody.innerHTML = '';

    const { data, error } = await supabase.from('lojas').select(`*, vagas(count)`).order('name', { ascending: true });
    
    if (error) {
        console.error("Erro ao carregar lojas:", error);
        alert("Não foi possível carregar as lojas.");
        loadingStoresMessage.classList.add('hidden');
        return;
    }
    
    loadedStores = data; // Armazena as lojas carregadas

    // Popula a tabela de gestão de lojas
    storeListTbody.innerHTML = '';
    loadedStores.forEach(store => {
        const row = document.createElement('tr');
        const vagaCount = store.vagas[0]?.count || 0;
        row.innerHTML = `
            <td><strong>${store.name}</strong></td>
            <td>${store.city} / ${store.state}</td>
            <td>${vagaCount}</td>
            <td class="actions">
                <button class="edit-store-btn" data-id="${store.id}">Editar</button>
                <button class="delete-store-btn" data-id="${store.id}" data-vagas="${vagaCount}">Excluir</button>
            </td>
        `;
        storeListTbody.appendChild(row);
    });
    
    loadingStoresMessage.classList.add('hidden');
    document.querySelectorAll('.edit-store-btn').forEach(btn => btn.addEventListener('click', handleEditStore));
    document.querySelectorAll('.delete-store-btn').forEach(btn => btn.addEventListener('click', handleDeleteStore));

    // Popula o dropdown de filtro de currículos
    const cities = [...new Set(loadedStores.map(store => store.city))].sort();
    storeFilterSelect.innerHTML = '<option value="todos">Todas as Cidades</option>';
    cities.forEach(city => storeFilterSelect.add(new Option(city, city)));
    
    // Popula o dropdown do modal de vagas
    const jobStoreSelect = document.getElementById('job-storeName'); // No modal de vagas
    jobStoreSelect.innerHTML = '<option value="" disabled selected>Selecione a Loja</option>';
    loadedStores.forEach(store => jobStoreSelect.add(new Option(store.name, store.id)));
}


async function handleStoreFormSubmit(event) {
    event.preventDefault();
    saveStoreBtn.disabled = true;
    saveStoreBtn.textContent = 'Salvando...';

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

    const { error } = storeId
        ? await supabase.from('lojas').update(storeData).eq('id', storeId)
        : await supabase.from('lojas').insert([storeData]);

    if (error) {
        console.error("Erro ao salvar loja:", error);
        alert("Ocorreu um erro ao salvar a loja.");
    } else {
        closeStoreModal();
        await loadStoresAndPopulateDropdowns(); // Recarrega tudo
    }

    saveStoreBtn.disabled = false;
    saveStoreBtn.textContent = 'Salvar Loja';
}

async function handleEditStore(event) {
    const id = event.target.dataset.id;
    const store = loadedStores.find(s => s.id == id);
    if (!store) return alert("Loja não encontrada.");

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
        alert(`Não é possível excluir esta loja, pois ela possui ${vagaCount} vaga(s) associada(s). Por favor, remova ou desvincule as vagas primeiro.`);
        return;
    }

    if (confirm('Tem certeza que deseja excluir esta loja permanentemente?')) {
        const { error } = await supabase.from('lojas').delete().eq('id', id);
        if (error) {
            alert("Ocorreu um erro ao excluir a loja.");
        } else {
            await loadStoresAndPopulateDropdowns(); // Recarrega tudo
        }
    }
}

// --- FUNÇÕES DE AUTENTICAÇÃO E INICIALIZAÇÃO ---
async function initializeDashboard() {
    showView('vagas'); // Mostra a tela de vagas como padrão
    await loadStoresAndPopulateDropdowns(); // Carrega as lojas e popula os dropdowns
    // await loadJobs(); // Carregaremos as vagas e currículos conforme a navegação
    // await loadResumes();
}

function showDashboard() {
    loginContainer.classList.add('hidden');
    dashboard.classList.remove('hidden');
    initializeDashboard();
}

// ... (suas funções de login e logout existentes) ...

// --- INICIALIZAÇÃO E EVENTOS ---
// Eventos de Navegação
navVagas.addEventListener('click', (e) => { e.preventDefault(); showView('vagas'); /* loadJobs(); */ });
navCurriculos.addEventListener('click', (e) => { e.preventDefault(); showView('curriculos'); /* loadResumes(); */ });
navLojas.addEventListener('click', (e) => { e.preventDefault(); showView('lojas'); });

// Eventos de Lojas
newStoreBtn.addEventListener('click', () => {
    storeModalTitle.textContent = 'Criar Nova Loja';
    openStoreModal();
});
cancelStoreBtn.addEventListener('click', closeStoreModal);
storeModalOverlay.addEventListener('click', (e) => { if (e.target === storeModalOverlay) closeStoreModal(); });
storeForm.addEventListener('submit', handleStoreFormSubmit);

// ... (outros event listeners que você já tem para vagas, currículos, etc.) ...

supabase.auth.onAuthStateChange((_event, session) => {
    if (session) {
        showDashboard();
    } else {
        dashboard.classList.add('hidden');
        loginContainer.classList.remove('hidden');
    }
});