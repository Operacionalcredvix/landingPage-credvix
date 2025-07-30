
// Importa o cliente Supabase do diretório principal do script
import { supabase } from '../script/supabase-client.js';

// --- ELEMENTOS DO DOM ---
// Autenticação
const loginContainer = document.getElementById('login-container');
const dashboard = document.getElementById('dashboard');
const loginForm = document.getElementById('login-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginError = document.getElementById('login-error');
const logoutBtn = document.getElementById('logout-btn');

// Modal e Formulário
const jobModalOverlay = document.getElementById('job-modal-overlay');
const jobModal = document.getElementById('job-modal');
const jobForm = document.getElementById('job-form');
const modalTitle = document.getElementById('modal-title');
const jobIdInput = document.getElementById('job-id');
const newJobBtn = document.getElementById('new-job-btn');
const cancelBtn = document.getElementById('cancel-btn');
const saveBtn = document.getElementById('save-btn');

// Lista de Vagas e Estatísticas
const jobListTbody = document.getElementById('job-list-tbody');
const loadingMessage = document.getElementById('loading-message');
const totalJobsStat = document.getElementById('total-jobs-stat');
const activeJobsStat = document.getElementById('active-jobs-stat');
const inactiveJobsStat = document.getElementById('inactive-jobs-stat');


// --- FUNÇÕES AUXILIARES DE UI ---

function openModal() {
    jobModalOverlay.classList.remove('hidden');
}

function closeModal() {
    jobModalOverlay.classList.add('hidden');
}


// --- FUNÇÕES PRINCIPAIS (CRUD de Vagas) ---

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
    <td>
        <strong>${job.title}</strong><br>
        <small>${job.storename || 'N/A'} | ${job.city || ''}, ${job.state || ''}</small>
    </td>
    <td><span class="category-badge">${job.job_category}</span></td>
            <td><span class="candidate-count">${job.candidate_count}</span></td>
            <td>
                <span class="${job.is_active ? 'status-active' : 'status-inactive'}">
                    ${job.is_active ? 'Ativa' : 'Inativa'}
                </span>
            </td>
            <td>
                <strong>Criação:</strong> ${creationDate}<br>
                <strong>Inativação:</strong> ${inactivationDate}
            </td>
            <td class="actions">
                <button class="edit-btn" data-id="${job.id}">Editar</button>
                <button class="delete-btn" data-id="${job.id}" data-candidates="${job.candidate_count}">Excluir</button>
            </td>
        `;
        jobListTbody.appendChild(row);
    });

    document.querySelectorAll('.edit-btn').forEach(btn => btn.addEventListener('click', handleEdit));
    document.querySelectorAll('.delete-btn').forEach(btn => btn.addEventListener('click', handleDelete));
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
    // LINHA CORRIGIDA ABAIXO
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


// --- FUNÇÕES DE AUTENTICAÇÃO ---

function showDashboard() {
    loginContainer.classList.add('hidden');
    dashboard.classList.remove('hidden');
    loadJobs();
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

newJobBtn.addEventListener('click', () => {
    jobForm.reset();
    jobIdInput.value = '';
    modalTitle.textContent = 'Criar Nova Vaga';
    document.getElementById('job-is_active').checked = true;
    document.getElementById('job-category').value = 'Aberta'; // Define "Aberta" como padrão ao criar
    openModal();
});

cancelBtn.addEventListener('click', closeModal);
jobModalOverlay.addEventListener('click', (e) => {
    if (e.target === jobModalOverlay) {
        closeModal();
    }
});
jobForm.addEventListener('submit', handleFormSubmit);

supabase.auth.onAuthStateChange((_event, session) => {
    if (session) {
        showDashboard();
    } else {
        dashboard.classList.add('hidden');
        loginContainer.classList.remove('hidden');
    }
});