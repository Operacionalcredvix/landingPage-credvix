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
    loadingMessage.classList.remove('hidden');
    jobListTbody.innerHTML = '';

    const { data: jobs, error } = await supabase
        .from('vagas')
        .select(`
            *,
            lojas ( name, city, state ),
            candidatos ( count )
        `)
        .order('created_at', { ascending: false });

    loadingMessage.classList.add('hidden');

    if (error) {
        console.error('Erro ao carregar vagas:', error.message);
        alert('Não foi possível carregar as vagas.');
        return;
    }

    totalJobsStat.textContent = jobs.length;
    activeJobsStat.textContent = jobs.filter(j => j.is_active).length;
    inactiveJobsStat.textContent = jobs.filter(j => !j.is_active).length;

    jobs.forEach(job => {
        const row = jobListTbody.insertRow();
        const creationDate = new Date(job.created_at).toLocaleDateString('pt-BR');
        const inactivationDate = job.inactivated_at ? new Date(job.inactivated_at).toLocaleDateString('pt-BR') : '---';
        const candidateCount = job.candidatos[0]?.count || 0;
        const storeInfo = job.lojas ? `${job.lojas.name} | ${job.lojas.city}, ${job.lojas.state}` : 'Loja não vinculada';

        row.innerHTML = `
            <td>
                <strong>${job.title}</strong><br>
                <small>${storeInfo}</small>
            </td>
            <td><span class="category-badge">${job.job_category}</span></td>
            <td>${candidateCount}</td>
            <td><span class="${job.is_active ? 'status-active' : 'status-inactive'}">${job.is_active ? 'Ativa' : 'Inativa'}</span></td>
            <td><strong>Criação:</strong> ${creationDate}<br><strong>Inativação:</strong> ${inactivationDate}</td>
            <td class="actions">
                <button class="edit-btn" data-id="${job.id}">Editar</button>
                <button class="delete-btn" data-id="${job.id}" data-candidates="${candidateCount}">Excluir</button>
            </td>
        `;
    });

    document.querySelectorAll('.edit-btn').forEach(btn => btn.addEventListener('click', handleEditJob));
    document.querySelectorAll('.delete-btn').forEach(btn => btn.addEventListener('click', handleDeleteJob));
}


async function handleJobFormSubmit(event) {
    event.preventDefault();
    saveBtn.disabled = true;
    saveBtn.textContent = 'Salvando...';

    const jobId = jobIdInput.value;
    const isNowActive = document.getElementById('job-is_active').checked;
    
    const selectedLojaId = document.getElementById('job-storeName').value;
    const selectedStore = loadedStores.find(s => s.id == selectedLojaId);

    const jobData = {
        title: document.getElementById('job-title').value,
        loja_id: selectedLojaId,
        storename: selectedStore ? selectedStore.name : '',
        city: document.getElementById('job-city').value,
        state: document.getElementById('job-state').value,
        type: document.getElementById('job-type').value,
        description: document.getElementById('job-description').value,
        job_category: document.getElementById('job-category').value,
        is_active: isNowActive,
        benefits: document.getElementById('job-benefits')?.value.split('\n').map(b => b.trim()).filter(b => b) || []
    };

    if (jobId) {
        const { data: vagaAnterior } = await supabase.from('vagas').select('is_active').eq('id', jobId).single();
        if (vagaAnterior && vagaAnterior.is_active && !isNowActive) {
            jobData.inactivated_at = new Date();
        }
        if (vagaAnterior && !vagaAnterior.is_active && isNowActive) {
            jobData.inactivated_at = null;
        }
    }

    const { error } = jobId
        ? await supabase.from('vagas').update(jobData).eq('id', jobId)
        : await supabase.from('vagas').insert([jobData]);

    if (error) {
        console.error('Erro ao salvar vaga:', error.message);
        alert('Ocorreu um erro ao salvar a vaga.');
    } else {
        closeJobModal();
        await loadJobs();
    }

    saveBtn.disabled = false;
    saveBtn.textContent = 'Salvar';
}

async function handleEditJob(event) {
    const id = event.target.dataset.id;
    const { data: job, error } = await supabase.from('vagas').select('*').eq('id', id).single();

    if (error) {
        alert('Não foi possível encontrar a vaga para editar.');
        return;
    }

    jobForm.reset();
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
    if (job.benefits) {
        document.getElementById('job-benefits').value = job.benefits.join('\n');
    }

    openJobModal();
}

async function handleDeleteJob(event) {
    const id = event.target.dataset.id;
    const candidateCount = parseInt(event.target.dataset.candidates, 10);
    if (candidateCount > 0) {
        alert(`Não é possível excluir esta vaga, pois ela possui ${candidateCount} candidatura(s).`);
        return;
    }
    if (confirm('Tem certeza que deseja excluir esta vaga permanentemente?')) {
        const { error } = await supabase.from('vagas').delete().eq('id', id);
        if (error) {
            alert('Ocorreu um erro ao excluir a vaga.');
        } else {
            await loadJobs();
        }
    }
}

// --- FUNÇÕES DE GESTÃO DE CURRÍCULOS ---
async function loadResumesByStore() {
    loadingResumesMessage.classList.remove('hidden');
    noResumesMessage.classList.add('hidden');
    resumeListTbody.innerHTML = '';
    
    const selectedCity = storeFilterSelect.value;
    
    let query = supabase.from('candidatos').select('*').order('created_at', { ascending: false });

    if (selectedCity !== 'todos') {
        query = query.eq('city', selectedCity);
    }
    
    const { data: resumes, error } = await query;

    loadingResumesMessage.classList.add('hidden');
    if (error) {
        console.error('Erro ao buscar currículos:', error);
        noResumesMessage.textContent = 'Ocorreu um erro ao carregar os currículos.';
        noResumesMessage.classList.remove('hidden');
        return;
    }
    if (resumes.length === 0) {
        noResumesMessage.textContent = 'Nenhum currículo encontrado para o filtro selecionado.';
        noResumesMessage.classList.remove('hidden');
        return;
    }

    resumes.forEach(resume => {
        const row = resumeListTbody.insertRow();
        const applicationDate = new Date(resume.created_at).toLocaleDateString('pt-BR');
        row.innerHTML = `
            <td><strong>${resume.nome_completo}</strong><br><small>${resume.email} / ${resume.telefone}</small></td>
            <td>${resume.loja || 'N/A'}</td>
            <td>${applicationDate}</td>
            <td><a href="${resume.curriculo_url}" target="_blank" download class="download-cv-btn">Baixar</a></td>
        `;
    });
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
    document.getElementById('job-is_active').checked = true;
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

// Filtro de currículos
storeFilterSelect.addEventListener('change', loadResumesByStore);