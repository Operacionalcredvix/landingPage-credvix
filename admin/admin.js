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
const cancelStoreBtn = document.getElementById('store-cancel-btn');
const storeIdInput = document.getElementById('store-id');

// Elementos da Tela de Vagas
const newJobBtn = document.getElementById('new-job-btn');
const jobModalOverlay = document.getElementById('job-modal-overlay');
const jobModalTitle = document.getElementById('modal-title');
const jobForm = document.getElementById('job-form');
const jobIdInput = document.getElementById('job-id');
const cancelJobBtn = document.getElementById('job-cancel-btn');
const totalJobsStat = document.getElementById('total-jobs-stat');
const activeJobsStat = document.getElementById('active-jobs-stat');
const inactiveJobsStat = document.getElementById('inactive-jobs-stat');
const jobStatusFilter = document.getElementById('job-status-filter');
const jobCategoryFilter = document.getElementById('job-category-filter');
const jobTitleFilter = document.getElementById('job-title-filter');
const jobSearchInput = document.getElementById('job-search-input');
const jobCardGrid = document.getElementById('job-card-grid');
const noJobsMessage = document.getElementById('no-jobs-message');

// Elementos do Banco de Talentos
const newTalentBtn = document.getElementById('new-talent-btn');
const talentModalOverlay = document.getElementById('talent-modal-overlay');
const cancelTalentBtn = document.getElementById('talent-cancel-btn');

// Elementos da Tela de Currículos
const storeFilterSelect = document.getElementById('store-filter-select');
const applicationTypeFilter = document.getElementById('application-type-filter'); // NOVO
const resumeListTbody = document.getElementById('resume-list-tbody');
const loadingResumesMessage = document.getElementById('loading-resumes-message');
const noResumesMessage = document.getElementById('no-resumes-message');

// --- ESTADO DA APLICAÇÃO ---
let loadedStores = [];
let allJobs = [];

// --- FUNÇÕES DE NAVEGAÇÃO ---
function showView(viewId) {
    [vagasView, curriculosView, lojasView].forEach(view => view.classList.add('hidden'));
    [navVagas, navCurriculos, navLojas].forEach(nav => nav.parentElement.classList.remove('active'));

    const viewMap = {
        'vagas': { view: vagasView, nav: navVagas, loader: loadJobs },
        'curriculos': { view: curriculosView, nav: navCurriculos, loader: loadResumesByStore },
        'lojas': { view: lojasView, nav: navLojas, loader: loadStores }
    };

    if (viewMap[viewId]) {
        viewMap[viewId].view.classList.remove('hidden');
        viewMap[viewId].nav.parentElement.classList.add('active');
        if (viewMap[viewId].loader) viewMap[viewId].loader();
    }
}

// --- FUNÇÕES DE AUTENTICAÇÃO ---
async function handleLogin(event) {
    event.preventDefault();
    loginError.textContent = '';
    const { error } = await supabase.auth.signInWithPassword({ email: emailInput.value, password: passwordInput.value });
    if (error) loginError.textContent = 'E-mail ou senha inválidos.';
}

async function handleLogout() {
    sessionStorage.removeItem('sessionActive');
    await supabase.auth.signOut();
}

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
    await loadStores();
    showView('vagas');
}

// --- FUNÇÕES DE GESTÃO DE LOJAS ---
function openStoreModal() { storeModalOverlay.classList.remove('hidden'); }
function closeStoreModal() { storeModalOverlay.classList.add('hidden'); storeForm.reset(); storeIdInput.value = ''; }

async function loadStores() {
    storeListTbody.innerHTML = `<p>Carregando lojas...</p>`;
    const { data, error } = await supabase.from('lojas').select(`*, vagas(count)`).order('name', { ascending: true });

    if (error) {
        console.error("Erro ao carregar lojas:", error);
        storeListTbody.innerHTML = `<p>Erro ao carregar lojas.</p>`;
        return;
    }

    loadedStores = data;
    displayStores();

    const stateFilter = document.getElementById('store-state-filter');
    const states = [...new Set(loadedStores.map(store => store.state))].sort();
    stateFilter.innerHTML = '<option value="todos">Todos os Estados</option>';
    states.forEach(state => stateFilter.add(new Option(state, state)));

    const cities = [...new Set(loadedStores.map(store => store.city))].sort();
    storeFilterSelect.innerHTML = '<option value="todos">Todas as Cidades</option>';
    cities.forEach(city => storeFilterSelect.add(new Option(city, city)));

    const jobStoreSelect = document.getElementById('job-storeName');
    jobStoreSelect.innerHTML = '<option value="" disabled selected>Selecione a Loja</option>';
    loadedStores.forEach(store => jobStoreSelect.add(new Option(store.name, store.id)));
}

function displayStores() {
    const searchTerm = document.getElementById('store-search-input').value.toLowerCase();
    const stateFilter = document.getElementById('store-state-filter').value;

    const filteredStores = loadedStores.filter(store =>
        (store.name.toLowerCase().includes(searchTerm)) &&
        (stateFilter === 'todos' || store.state === stateFilter)
    );

    storeListTbody.innerHTML = '';
    if (filteredStores.length === 0) {
        storeListTbody.innerHTML = `<tr><td colspan="4" style="text-align: center;">Nenhuma loja encontrada.</td></tr>`;
        return;
    }

    filteredStores.forEach(store => {
        const vagaCount = store.vagas[0]?.count || 0;
        const row = storeListTbody.insertRow();
        row.innerHTML = `
            <td><strong>${store.name}</strong></td>
            <td>${store.city} / ${store.state}</td>
            <td>${vagaCount}</td>
            <td class="actions">
                <button class="btn btn-info js-edit-store" data-id="${store.id}">
                    <span class="material-icons" style="font-size: 1.1rem;">edit</span>
                    <span>Editar</span>
                </button>
                <button class="btn btn-danger js-delete-store" data-id="${store.id}" data-vagas="${vagaCount}">
                    <span class="material-icons" style="font-size: 1.1rem;">delete_outline</span>
                    <span>Excluir</span>
                </button>
            </td>
        `;
    });

    document.querySelectorAll('.js-edit-store').forEach(btn => btn.addEventListener('click', handleEditStore));
    document.querySelectorAll('.js-delete-store').forEach(btn => btn.addEventListener('click', handleDeleteStore));
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
        instagram_url: document.getElementById('store-instagram').value
    };
    const { error } = storeId
        ? await supabase.from('lojas').update(storeData).eq('id', storeId)
        : await supabase.from('lojas').insert([storeData]);

    if (error) { alert("Ocorreu um erro ao salvar a loja."); }
    else { closeStoreModal(); await loadStores(); }
}

function handleEditStore(event) {
    const id = event.currentTarget.dataset.id;
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
    const id = event.currentTarget.dataset.id;
    const vagaCount = parseInt(event.currentTarget.dataset.vagas, 10);
    if (vagaCount > 0) {
        alert(`Não é possível excluir esta loja, pois ela possui ${vagaCount} vaga(s) associada(s).`);
        return;
    }
    if (confirm('Tem certeza que deseja excluir esta loja?')) {
        const { error } = await supabase.from('lojas').delete().eq('id', id);
        if (error) { alert("Ocorreu um erro ao excluir a loja."); }
        else { await loadStores(); }
    }
}

// --- FUNÇÕES DE GESTÃO DE VAGAS ---
function openJobModal() { jobModalOverlay.classList.remove('hidden'); }
function closeJobModal() { jobModalOverlay.classList.add('hidden'); jobForm.reset(); jobIdInput.value = ''; }

async function loadJobs() {
    jobCardGrid.innerHTML = `<p>Carregando vagas...</p>`;
    noJobsMessage.classList.add('hidden');
    const { data, error } = await supabase.from('vagas').select(`*, lojas(name, city, state), candidatos(count)`).order('created_at', { ascending: false });

    if (error) { console.error('Erro ao carregar vagas:', error.message); return; }
    allJobs = data;
    displayJobs();
}

function displayJobs() {
    const statusFilter = jobStatusFilter.value;
    const categoryFilter = jobCategoryFilter.value;
    const titleFilter = jobTitleFilter.value;
    const searchTerm = jobSearchInput.value.toLowerCase();

    const filteredJobs = allJobs.filter(job => {
        const isActive = job.is_active;
        const matchesStatus = (statusFilter === 'todas') || (statusFilter === 'ativas' && isActive) || (statusFilter === 'inativas' && !isActive);
        const matchesCategory = (categoryFilter === 'todas') || (job.job_category === categoryFilter);
        const matchesTitle = (titleFilter === 'todos') || (job.title === titleFilter);
        const storeName = job.lojas?.name?.toLowerCase() || '';
        const jobTitleText = job.title.toLowerCase();
        const matchesSearch = storeName.includes(searchTerm) || jobTitleText.includes(searchTerm);
        return matchesStatus && matchesCategory && matchesTitle && matchesSearch;
    });

    totalJobsStat.textContent = allJobs.length;
    activeJobsStat.textContent = allJobs.filter(j => j.is_active).length;
    inactiveJobsStat.textContent = allJobs.filter(j => !j.is_active).length;

    jobCardGrid.innerHTML = '';
    if (filteredJobs.length === 0) {
        noJobsMessage.classList.remove('hidden');
        return;
    }
    noJobsMessage.classList.add('hidden');

    filteredJobs.forEach(job => {
        const candidateCount = job.candidatos[0]?.count || 0;
        const storeInfo = job.lojas ? `${job.lojas.name}` : 'Loja não vinculada';
        const card = document.createElement('div');
        card.className = 'job-card';
        card.innerHTML = `
            <div class="job-card-header">
                <div>
                    <h3 class="job-card-title">${job.title}</h3>
                    <p class="job-card-location"><span class="material-icons" style="font-size: 1rem;">store</span>${storeInfo}</p>
                </div>
                <div class="job-card-status"><span class="${job.is_active ? 'status-active' : 'status-inactive'}">${job.is_active ? 'Ativa' : 'Inativa'}</span></div>
            </div>
            <div class="job-card-body">
                <div class="job-card-details">
                    <div class="detail-item"><strong>${candidateCount}</strong><span>Candidaturas</span></div>
                    <div class="detail-item"><span class="category-badge">${job.job_category}</span><span>Categoria</span></div>
                </div>
            </div>
            <div class="job-card-footer">
                <button class="btn btn-info js-edit-job" data-id="${job.id}">Editar</button>
                <button class="btn btn-danger js-delete-job" data-id="${job.id}" data-candidates="${candidateCount}">Excluir</button>
            </div>
        `;
        jobCardGrid.appendChild(card);
    });

    document.querySelectorAll('.js-edit-job').forEach(btn => btn.addEventListener('click', handleEditJob));
    document.querySelectorAll('.js-delete-job').forEach(btn => btn.addEventListener('click', handleDeleteJob));
}

async function handleJobFormSubmit(event) {
    event.preventDefault();
    const jobId = jobIdInput.value;
    const selectedLojaId = document.getElementById('job-storeName').value;
    const selectedStore = loadedStores.find(s => s.id == selectedLojaId);
    const jobData = {
        title: document.getElementById('job-title').value,
        loja_id: selectedLojaId,
        storename: selectedStore ? selectedStore.name : '',
        city: selectedStore ? selectedStore.city : '',
        state: selectedStore ? selectedStore.state : '',
        type: document.getElementById('job-type').value,
        description: document.getElementById('job-description').value,
        job_category: document.getElementById('job-category').value,
        is_active: document.getElementById('job-is_active').checked
    };
    const { error } = jobId
        ? await supabase.from('vagas').update(jobData).eq('id', jobId)
        : await supabase.from('vagas').insert([jobData]);

    if (error) { console.error(error); alert('Ocorreu um erro ao salvar a vaga.'); }
    else { closeJobModal(); await loadJobs(); }
}

function handleEditJob(event) {
    const id = event.currentTarget.dataset.id;
    const job = allJobs.find(j => j.id == id);
    if (!job) return;
    jobModalTitle.textContent = 'Editar Vaga';
    jobIdInput.value = job.id;
    document.getElementById('job-title').value = job.title;
    document.getElementById('job-storeName').value = job.loja_id;
    document.getElementById('job-city').value = job.city;
    document.getElementById('job-state').value = job.state;
    document.getElementById('job-type').value = job.type;
    document.getElementById('job-description').value = job.description;
    document.getElementById('job-category').value = job.job_category;
    document.getElementById('job-is_active').checked = job.is_active;
    openJobModal();
}

async function handleDeleteJob(event) {
    const id = event.currentTarget.dataset.id;
    const candidateCount = parseInt(event.currentTarget.dataset.candidates, 10);
    if (candidateCount > 0) {
        alert(`Não é possível excluir esta vaga, pois ela possui ${candidateCount} candidatura(s).`);
        return;
    }
    if (confirm('Tem certeza que deseja excluir esta vaga?')) {
        const { error } = await supabase.from('vagas').delete().eq('id', id);
        if (error) { alert('Ocorreu um erro ao excluir a vaga.'); }
        else { await loadJobs(); }
    }
}

// --- FUNÇÕES DE GESTÃO DE CURRÍCULOS ---
async function loadResumesByStore() {
    loadingResumesMessage.classList.remove('hidden');
    noResumesMessage.classList.add('hidden');
    resumeListTbody.innerHTML = '';

    const selectedCity = storeFilterSelect.value;
    const selectedApplicationType = applicationTypeFilter.value; // NOVO

    let query = supabase.from('candidatos').select('*').order('created_at', { ascending: false });

    if (selectedCity !== 'todos') {
        query = query.eq('city', selectedCity);
    }
    if (selectedApplicationType !== 'todos') { // NOVO
        query = query.eq('tipo_candidatura', selectedApplicationType);
    }

    const { data: resumes, error } = await query;
    loadingResumesMessage.classList.add('hidden');

    if (error) {
        noResumesMessage.textContent = 'Ocorreu um erro ao carregar os currículos.';
        noResumesMessage.classList.remove('hidden');
        return;
    }
    if (resumes.length === 0) {
        noResumesMessage.classList.remove('hidden');
        return;
    }
    resumes.forEach(resume => {
        const row = resumeListTbody.insertRow();
        const applicationDate = new Date(resume.created_at).toLocaleDateString('pt-BR');
        row.innerHTML = `
            <td><strong>${resume.nome_completo}</strong><br><small>${resume.email} / ${resume.telefone}</small></td>
            <td>${resume.loja || 'N/A'}</td>
            <td>${resume.tipo_candidatura || 'N/A'}</td>
            <td>${applicationDate}</td>
            <td><a href="${resume.curriculo_url}" target="_blank" download class="btn btn-primary">Baixar</a></td>
        `;
    });
}

// --- FUNÇÕES DO BANCO DE TALENTOS ---
function openTalentModal() { talentModalOverlay.classList.remove('hidden'); }
function closeTalentModal() { talentModalOverlay.classList.add('hidden'); }

// --- CONTROLE DE SESSÃO ---
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
document.addEventListener('DOMContentLoaded', () => {
    loginForm.addEventListener('submit', handleLogin);
    logoutBtn.addEventListener('click', handleLogout);

    navVagas.addEventListener('click', (e) => { e.preventDefault(); showView('vagas'); });
    navCurriculos.addEventListener('click', (e) => { e.preventDefault(); showView('curriculos'); });
    navLojas.addEventListener('click', (e) => { e.preventDefault(); showView('lojas'); });

    newStoreBtn.addEventListener('click', () => { storeModalTitle.textContent = 'Criar Nova Loja'; storeForm.reset(); storeIdInput.value = ''; openStoreModal(); });
    cancelStoreBtn.addEventListener('click', closeStoreModal);
    storeModalOverlay.addEventListener('click', (e) => { if (e.target === storeModalOverlay) closeStoreModal(); });
    storeForm.addEventListener('submit', handleStoreFormSubmit);

    newJobBtn.addEventListener('click', () => { jobModalTitle.textContent = 'Criar Nova Vaga'; jobForm.reset(); document.getElementById('job-is_active').checked = true; openJobModal(); });
    cancelJobBtn.addEventListener('click', closeJobModal);
    jobModalOverlay.addEventListener('click', (e) => { if (e.target === jobModalOverlay) closeJobModal(); });
    jobForm.addEventListener('submit', handleJobFormSubmit);

    jobStatusFilter.addEventListener('change', displayJobs);
    jobCategoryFilter.addEventListener('change', displayJobs);
    jobTitleFilter.addEventListener('change', displayJobs);
    jobSearchInput.addEventListener('input', displayJobs);

    newTalentBtn.addEventListener('click', openTalentModal);
    cancelTalentBtn.addEventListener('click', closeTalentModal);
    talentModalOverlay.addEventListener('click', (e) => { if (e.target === talentModalOverlay) closeTalentModal(); });

    storeFilterSelect.addEventListener('change', loadResumesByStore);
    applicationTypeFilter.addEventListener('change', loadResumesByStore); // NOVO
    document.getElementById('store-search-input').addEventListener('input', displayStores);
    document.getElementById('store-state-filter').addEventListener('change', displayStores);

    document.getElementById('job-storeName').addEventListener('change', (e) => {
        const selectedStoreId = e.target.value;
        const store = loadedStores.find(s => s.id == selectedStoreId);
        if (store) {
            document.getElementById('job-city').value = store.city;
            document.getElementById('job-state').value = store.state;
        }
    });
});