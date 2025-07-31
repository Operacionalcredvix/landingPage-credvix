// Importa o cliente Supabase e a lista de lojas
import { supabase } from '../script/supabase-client.js';
import { stores } from '../script/stores.js';

// --- ELEMENTOS DO DOM ---
const loginContainer = document.getElementById('login-container');
const dashboard = document.getElementById('dashboard');
const loginForm = document.getElementById('login-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginError = document.getElementById('login-error');
const logoutBtn = document.getElementById('logout-btn');

const mainNav = document.getElementById('main-nav');
const navVagas = document.getElementById('nav-vagas');
const navCurriculos = document.getElementById('nav-curriculos');
const vagasView = document.getElementById('vagas-view');
const curriculosView = document.getElementById('curriculos-view');

const jobModalOverlay = document.getElementById('job-modal-overlay');
const jobModal = document.getElementById('job-modal');
const jobForm = document.getElementById('job-form');
const modalTitle = document.getElementById('modal-title');
const jobIdInput = document.getElementById('job-id');
const newJobBtn = document.getElementById('new-job-btn');
const cancelBtn = document.getElementById('cancel-btn');
const saveBtn = document.getElementById('save-btn');
const jobListTbody = document.getElementById('job-list-tbody');
const loadingMessage = document.getElementById('loading-message');
const totalJobsStat = document.getElementById('total-jobs-stat');
const activeJobsStat = document.getElementById('active-jobs-stat');
const inactiveJobsStat = document.getElementById('inactive-jobs-stat');

const candidateModalOverlay = document.getElementById('candidate-modal-overlay');
const closeCandidateModalBtn = document.getElementById('close-candidate-modal-btn');
const candidateModalTitle = document.getElementById('candidate-modal-title');
const loadingCandidatesMessage = document.getElementById('loading-candidates-message');
const candidateListTbody = document.getElementById('candidate-list-tbody');

const newTalentBtn = document.getElementById('new-talent-btn');
const talentModalOverlay = document.getElementById('talent-modal-overlay');
const talentForm = document.getElementById('talent-form');
const cancelTalentBtn = document.getElementById('cancel-talent-btn');
const talentStatusMessage = document.getElementById('talent-status-message');

const storeFilterSelect = document.getElementById('store-filter-select');
const resumeListTbody = document.getElementById('resume-list-tbody');
const loadingResumesMessage = document.getElementById('loading-resumes-message');
const noResumesMessage = document.getElementById('no-resumes-message');


// --- FUNÇÕES DE NAVEGAÇÃO ---
function showView(viewId) {
    vagasView.classList.add('hidden');
    curriculosView.classList.add('hidden');
    navVagas.classList.remove('active');
    navCurriculos.classList.remove('active');
    if (viewId === 'vagas') {
        vagasView.classList.remove('hidden');
        navVagas.classList.add('active');
    } else if (viewId === 'curriculos') {
        curriculosView.classList.remove('hidden');
        navCurriculos.classList.add('active');
    }
}

function populateJobStoreDropdown() {
    const storeSelect = document.getElementById('job-storeName');
    storeSelect.innerHTML = '<option value="" disabled selected>Selecione a Loja</option>';
    const storeNames = [...new Set(stores.map(store => store.name))].sort();
    storeNames.forEach(name => {
        const option = document.createElement('option');
        option.value = name;
        option.textContent = name;
        storeSelect.appendChild(option);
    });
}


// --- FUNÇÕES DE VAGAS ---
function openModal() {
    jobModalOverlay.classList.remove('hidden');
}

function closeModal() {
    jobModalOverlay.classList.add('hidden');
}

async function loadJobs() {
    loadingMessage.classList.remove('hidden');
    jobListTbody.innerHTML = '';
    const { data: jobs, error } = await supabase.rpc('get_vaga_stats');
    loadingMessage.classList.add('hidden');
    if (error) {
        console.error('Erro ao carregar estatísticas das vagas:', error.message);
        alert('Não foi possível carregar os dados das vagas.');
        return;
    }
    totalJobsStat.textContent = jobs.length;
    activeJobsStat.textContent = jobs.filter(j => j.is_active).length;
    inactiveJobsStat.textContent = jobs.filter(j => !j.is_active).length;
    jobs.forEach(job => {
        const row = document.createElement('tr');
        const creationDate = new Date(job.created_at).toLocaleDateString('pt-BR');
        const inactivationDate = job.inactivated_at ? new Date(job.inactivated_at).toLocaleDateString('pt-BR') : '---';
        row.innerHTML = `
            <td><strong>${job.title}</strong><br><small>${job.storename || 'N/A'} | ${job.city || ''}, ${job.state || ''}</small></td>
            <td><span class="category-badge">${job.job_category}</span></td>
            <td>${job.candidate_count > 0 ? `<span class="candidate-count-link" data-job-id="${job.id}" data-job-title="${job.title}">${job.candidate_count}</span>` : `<span class="candidate-count-zero">0</span>`}</td>
            <td><span class="${job.is_active ? 'status-active' : 'status-inactive'}">${job.is_active ? 'Ativa' : 'Inativa'}</span></td>
            <td><strong>Criação:</strong> ${creationDate}<br><strong>Inativação:</strong> ${inactivationDate}</td>
            <td class="actions">
                <button class="edit-btn" data-id="${job.id}">Editar</button>
                <button class="delete-btn" data-id="${job.id}" data-candidates="${job.candidate_count}">Excluir</button>
            </td>
        `;
        jobListTbody.appendChild(row);
    });
    document.querySelectorAll('.edit-btn').forEach(btn => btn.addEventListener('click', handleEdit));
    document.querySelectorAll('.delete-btn').forEach(btn => btn.addEventListener('click', handleDelete));
    document.querySelectorAll('.candidate-count-link').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const jobId = e.target.dataset.jobId;
            const jobTitle = e.target.dataset.jobTitle;
            openCandidateModal(jobId, jobTitle);
        });
    });
}

async function handleFormSubmit(event) {
    event.preventDefault();
    saveBtn.disabled = true;
    saveBtn.textContent = 'Salvando...';
    const jobId = jobIdInput.value;
    const isNowActive = document.getElementById('job-is_active').checked;
    const jobData = {
        title: document.getElementById('job-title').value,
        storename: document.getElementById('job-storeName').value,
        city: document.getElementById('job-city').value,
        state: document.getElementById('job-state').value,
        type: document.getElementById('job-type').value,
        description: document.getElementById('job-description').value,
        job_category: document.getElementById('job-category').value,
        is_active: isNowActive,
    };
    if (jobId) {
        const { data: vagaAnterior } = await supabase.from('vagas').select('is_active').eq('id', jobId).single();
        if (vagaAnterior && vagaAnterior.is_active && !isNowActive) jobData.inactivated_at = new Date();
        if (vagaAnterior && !vagaAnterior.is_active && isNowActive) jobData.inactivated_at = null;
    }
    const { error } = jobId ? await supabase.from('vagas').update(jobData).eq('id', jobId) : await supabase.from('vagas').insert([jobData]);
    if (error) {
        console.error('Erro ao salvar vaga:', error.message);
        alert('Ocorreu um erro ao salvar a vaga.');
    } else {
        closeModal();
        await loadJobs();
    }
    saveBtn.disabled = false;
    saveBtn.textContent = 'Salvar';
}

async function handleEdit(event) {
    const id = event.target.dataset.id;
    const { data: job, error } = await supabase.from('vagas').select('*').eq('id', id).single();
    if (error) {
        console.error('Erro ao buscar vaga para edição:', error.message);
        return alert('Não foi possível encontrar a vaga para editar.');
    }
    jobForm.reset();
    modalTitle.textContent = 'Editar Vaga';
    jobIdInput.value = job.id;
    document.getElementById('job-title').value = job.title;
    document.getElementById('job-storeName').value = job.storename;
    document.getElementById('job-city').value = job.city;
    document.getElementById('job-state').value = job.state;
    document.getElementById('job-type').value = job.type;
    document.getElementById('job-description').value = job.description;
    document.getElementById('job-category').value = job.job_category;
    document.getElementById('job-is_active').checked = job.is_active;
    openModal();
}

async function handleDelete(event) {
    const id = event.target.dataset.id;
    const candidateCount = parseInt(event.target.dataset.candidates, 10);
    if (candidateCount > 0) {
        alert(`Não é possível excluir esta vaga, pois ela possui ${candidateCount} candidatura(s).\n\nPara removê-la da lista pública, você pode desativá-la no menu "Editar".`);
        return;
    }
    if (confirm('Tem certeza que deseja excluir esta vaga permanentemente? Esta ação não pode ser desfeita.')) {
        const { error } = await supabase.from('vagas').delete().eq('id', id);
        if (error) {
            console.error('Erro ao excluir vaga:', error.message);
            alert('Ocorreu um erro ao excluir a vaga.');
        } else {
            await loadJobs();
        }
    }
}


// --- FUNÇÕES DO MODAL DE CANDIDATOS ---
async function openCandidateModal(jobId, jobTitle) {
    candidateModalTitle.textContent = `Candidatos para: ${jobTitle}`;
    candidateListTbody.innerHTML = '';
    loadingCandidatesMessage.classList.remove('hidden');
    candidateModalOverlay.classList.remove('hidden');
    const { data: candidates, error } = await supabase.from('candidatos').select('*').eq('vaga_id', jobId).order('created_at', { ascending: false });
    loadingCandidatesMessage.classList.add('hidden');
    if (error) {
        console.error('Erro ao buscar candidatos:', error);
        candidateListTbody.innerHTML = '<tr><td colspan="3">Erro ao carregar candidatos.</td></tr>';
        return;
    }
    if (candidates.length === 0) {
        candidateListTbody.innerHTML = '<tr><td colspan="3">Nenhum candidato encontrado para esta vaga.</td></tr>';
        return;
    }
    candidates.forEach(candidate => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${candidate.nome_completo}</strong><br><small>${candidate.email}</small></td>
            <td>${candidate.telefone}</td>
            <td><a href="${candidate.curriculo_url}" target="_blank" download class="download-cv-btn">Baixar CV</a></td>
        `;
        candidateListTbody.appendChild(row);
    });
}

function closeCandidateModal() {
    candidateModalOverlay.classList.add('hidden');
}


// --- FUNÇÕES DO BANCO DE TALENTOS ---
function openTalentModal() {
    talentForm.reset();
    talentStatusMessage.textContent = '';
    talentModalOverlay.classList.remove('hidden');
}

function closeTalentModal() {
    talentModalOverlay.classList.add('hidden');
}

async function handleTalentFormSubmit(event) {
    event.preventDefault();
    const saveBtn = document.getElementById('save-talent-btn');
    saveBtn.disabled = true;
    talentStatusMessage.textContent = 'Processando...';
    talentStatusMessage.style.color = 'blue';
    const { data: talentJob, error: findError } = await supabase.from('vagas').select('id').eq('title', 'Banco de Talentos').single();
    if (findError || !talentJob) {
        talentStatusMessage.textContent = 'Erro: A vaga "Banco de Talentos" não foi encontrada. Crie-a primeiro.';
        talentStatusMessage.style.color = 'red';
        saveBtn.disabled = false;
        return;
    }
    const candidateName = document.getElementById('talent-name').value;
    const candidateEmail = document.getElementById('talent-email').value;
    const candidatePhone = document.getElementById('talent-phone').value;
    const cvFile = document.getElementById('talent-cv-file').files[0];
    talentStatusMessage.textContent = 'Enviando currículo...';
    const fileExt = cvFile.name.split('.').pop();
    const fileName = `${candidateEmail.split('@')[0]}_${Date.now()}.${fileExt}`;
    const filePath = `banco-de-talentos/${fileName}`;
    const { error: uploadError } = await supabase.storage.from('curriculos').upload(filePath, cvFile);
    if (uploadError) {
        talentStatusMessage.textContent = `Erro no upload: ${uploadError.message}`;
        talentStatusMessage.style.color = 'red';
        saveBtn.disabled = false;
        return;
    }
    talentStatusMessage.textContent = 'Registrando candidato...';
    const { data: urlData } = supabase.storage.from('curriculos').getPublicUrl(filePath);
    const { error: insertError } = await supabase.from('candidatos').insert([{
        vaga_id: talentJob.id,
        nome_completo: candidateName,
        email: candidateEmail,
        telefone: candidatePhone,
        curriculo_url: urlData.publicUrl,
        status: 'banco_de_talentos',
        vaga: 'Banco de Talentos',
        loja: 'N/A',
        city: 'N/A'
    }]);
    if (insertError) {
        talentStatusMessage.textContent = `Erro ao salvar: ${insertError.message}`;
        talentStatusMessage.style.color = 'red';
        saveBtn.disabled = false;
        return;
    }
    talentStatusMessage.textContent = 'Candidato salvo com sucesso!';
    talentStatusMessage.style.color = 'green';
    setTimeout(() => {
        closeTalentModal();
        loadJobs();
    }, 2000);
}


// --- FUNÇÕES DA TELA DE CURRÍCULOS ---
function populateStoreFilter() {
    const cities = [...new Set(stores.map(store => store.city))].sort();
    storeFilterSelect.innerHTML = '<option value="todos">Todas as Cidades</option>';
    cities.forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        storeFilterSelect.appendChild(option);
    });
}

async function loadResumesByStore() {
    const selectedCity = storeFilterSelect.value;
    loadingResumesMessage.classList.remove('hidden');
    noResumesMessage.classList.add('hidden');
    resumeListTbody.innerHTML = '';
    
    // =================================================================
    // ======================= LÓGICA ATUALIZADA =======================
    let query = supabase.from('candidatos').select('*').order('created_at', { ascending: false });

    if (selectedCity !== 'todos') {
        // Agora a busca é direta e infalível pela coluna 'city'
        query = query.eq('city', selectedCity);
    }
    // =================================================================
    
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
        const row = document.createElement('tr');
        const applicationDate = new Date(resume.created_at).toLocaleDateString('pt-BR');
        row.innerHTML = `
            <td><strong>${resume.nome_completo}</strong><br><small>${resume.email} / ${resume.telefone}</small></td>
            <td>${resume.loja || 'N/A'}</td>
            <td>${applicationDate}</td>
            <td><a href="${resume.curriculo_url}" target="_blank" download class="download-cv-btn">Baixar</a></td>
        `;
        resumeListTbody.appendChild(row);
    });
}


// --- FUNÇÕES DE AUTENTICAÇÃO ---
function showDashboard() {
    loginContainer.classList.add('hidden');
    dashboard.classList.remove('hidden');
    loadJobs();
    populateStoreFilter();
    loadResumesByStore();
    populateJobStoreDropdown(); 
    showView('vagas');
}

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
    await supabase.auth.signOut();
}


// --- INICIALIZAÇÃO E EVENTOS ---
loginForm.addEventListener('submit', handleLogin);
logoutBtn.addEventListener('click', handleLogout);
navVagas.addEventListener('click', (e) => { e.preventDefault(); showView('vagas'); });
navCurriculos.addEventListener('click', (e) => { e.preventDefault(); showView('curriculos'); });
newJobBtn.addEventListener('click', () => {
    jobForm.reset();
    jobIdInput.value = '';
    modalTitle.textContent = 'Criar Nova Vaga';
    document.getElementById('job-is_active').checked = true;
    document.getElementById('job-category').value = 'Aberta';
    document.getElementById('job-storeName').selectedIndex = 0; 
    openModal();
});
cancelBtn.addEventListener('click', closeModal);
jobModalOverlay.addEventListener('click', (e) => { if (e.target === jobModalOverlay) closeModal(); });
jobForm.addEventListener('submit', handleFormSubmit);
closeCandidateModalBtn.addEventListener('click', closeCandidateModal);
candidateModalOverlay.addEventListener('click', (e) => { if (e.target === candidateModalOverlay) closeCandidateModal(); });
newTalentBtn.addEventListener('click', openTalentModal);
cancelTalentBtn.addEventListener('click', closeTalentModal);
talentModalOverlay.addEventListener('click', (e) => { if (e.target === talentModalOverlay) closeTalentModal(); });
talentForm.addEventListener('submit', handleTalentFormSubmit);
storeFilterSelect.addEventListener('change', loadResumesByStore);
supabase.auth.onAuthStateChange((_event, session) => {
    if (session) {
        showDashboard();
    } else {
        dashboard.classList.add('hidden');
        loginContainer.classList.remove('hidden');
    }
});