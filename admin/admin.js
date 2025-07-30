// Caminho: admin/admin.js

// Importa o cliente Supabase do diretório principal do script
import { supabase } from '../script/supabase-client.js';

// --- ELEMENTOS DO DOM ---
// É uma boa prática declarar todas as referências a elementos do HTML no início.

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

/** Abre o modal de criação/edição de vaga. */
function openModal() {
    jobModalOverlay.classList.remove('hidden');
}

/** Fecha o modal de criação/edição de vaga. */
function closeModal() {
    jobModalOverlay.classList.add('hidden');
}


// --- FUNÇÕES PRINCIPAIS (CRUD de Vagas) ---

/**
 * Busca as vagas no Supabase, atualiza as estatísticas e
 * renderiza a tabela na tela.
 */
async function loadJobs() {
    loadingMessage.classList.remove('hidden');
    jobListTbody.innerHTML = '';

    const { data: jobs, error } = await supabase
        .from('vagas')
        .select('*')
        .order('created_at', { ascending: false });

    loadingMessage.classList.add('hidden');

    if (error) {
        console.error('Erro ao carregar vagas:', error.message);
        alert('Não foi possível carregar as vagas.');
        return;
    }

    // Atualiza os cartões de estatísticas
    totalJobsStat.textContent = jobs.length;
    activeJobsStat.textContent = jobs.filter(j => j.is_active).length;
    inactiveJobsStat.textContent = jobs.filter(j => !j.is_active).length;

    // Popula a tabela com as vagas
    jobs.forEach(job => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${job.title}</strong><br><small>${job.state}</small></td>
            <td>${job.storeName}</td>
            <td>
                <span class="${job.is_active ? 'status-active' : 'status-inactive'}">
                    ${job.is_active ? 'Ativa' : 'Inativa'}
                </span>
            </td>
            <td class="actions">
                <button class="edit-btn" data-id="${job.id}">Editar</button>
                <button class="delete-btn" data-id="${job.id}">Excluir</button>
            </td>
        `;
        jobListTbody.appendChild(row);
    });

    // Adiciona eventos aos botões recém-criados de editar e excluir
    document.querySelectorAll('.edit-btn').forEach(btn => btn.addEventListener('click', handleEdit));
    document.querySelectorAll('.delete-btn').forEach(btn => btn.addEventListener('click', handleDelete));
}

/**
 * Lida com o envio do formulário, seja para criar uma nova vaga
 * ou para atualizar uma existente.
 * @param {Event} event O evento de submit do formulário.
 */
async function handleFormSubmit(event) {
    event.preventDefault();
    saveBtn.disabled = true;
    saveBtn.textContent = 'Salvando...';

    const jobData = {
        title: document.getElementById('job-title').value,
        storeName: document.getElementById('job-storeName').value,
        state: document.getElementById('job-state').value,
        type: document.getElementById('job-type').value,
        description: document.getElementById('job-description').value,
        is_active: document.getElementById('job-is_active').checked,
    };

    const jobId = jobIdInput.value;

    const { error } = jobId
        ? await supabase.from('vagas').update(jobData).eq('id', jobId) // Se tem ID, atualiza
        : await supabase.from('vagas').insert([jobData]);             // Se não, insere

    if (error) {
        console.error('Erro ao salvar vaga:', error.message);
        alert('Ocorreu um erro ao salvar a vaga.');
    } else {
        closeModal();
        await loadJobs(); // Recarrega a lista para mostrar a alteração
    }
    
    saveBtn.disabled = false;
    saveBtn.textContent = 'Salvar';
}

/**
 * Prepara o modal para edição de uma vaga existente.
 * @param {Event} event O evento de clique do botão "Editar".
 */
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
    document.getElementById('job-storeName').value = job.storeName;
    document.getElementById('job-state').value = job.state;
    document.getElementById('job-type').value = job.type;
    document.getElementById('job-description').value = job.description;
    document.getElementById('job-is_active').checked = job.is_active;

    openModal();
}

/**
 * Exclui uma vaga após confirmação do usuário.
 * @param {Event} event O evento de clique do botão "Excluir".
 */
async function handleDelete(event) {
    const id = event.target.dataset.id;
    if (confirm('Tem certeza que deseja excluir esta vaga? Esta ação não pode ser desfeita.')) {
        const { error } = await supabase.from('vagas').delete().eq('id', id);

        if (error) {
            console.error('Erro ao excluir vaga:', error.message);
            alert('Ocorreu um erro ao excluir a vaga.');
        } else {
            await loadJobs(); // Recarrega a lista para remover a vaga da tela
        }
    }
}


// --- FUNÇÕES DE AUTENTICAÇÃO ---

/** Mostra o dashboard e carrega os dados iniciais. */
function showDashboard() {
    loginContainer.classList.add('hidden');
    dashboard.classList.remove('hidden');
    loadJobs();
}

/**
 * Tenta autenticar o usuário com email e senha no Supabase.
 * @param {Event} event O evento de submit do formulário de login.
 */
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
    // Se o login for bem-sucedido, onAuthStateChange cuidará de mostrar o dashboard.
}

/** Desconecta o usuário do Supabase. */
async function handleLogout() {
    await supabase.auth.signOut();
    // onAuthStateChange cuidará de mostrar a tela de login.
}


// --- INICIALIZAÇÃO E EVENTOS ---
// Adiciona todos os listeners de eventos quando o script é carregado.

// Eventos de Autenticação
loginForm.addEventListener('submit', handleLogin);
logoutBtn.addEventListener('click', handleLogout);

// Eventos do Modal e Formulário
newJobBtn.addEventListener('click', () => {
    jobForm.reset();
    jobIdInput.value = '';
    modalTitle.textContent = 'Criar Nova Vaga';
    document.getElementById('job-is_active').checked = true;
    openModal();
});

cancelBtn.addEventListener('click', closeModal);
jobModalOverlay.addEventListener('click', (e) => {
    // Fecha o modal apenas se o clique for no fundo escuro, não no formulário
    if (e.target === jobModalOverlay) {
        closeModal();
    }
});
jobForm.addEventListener('submit', handleFormSubmit);

// Listener principal de autenticação do Supabase
// Este é o ponto de entrada que verifica se o usuário está logado ou não.
supabase.auth.onAuthStateChange((_event, session) => {
    if (session) {
        // Se existe uma sessão (usuário logado), mostra o dashboard
        showDashboard();
    } else {
        // Se não existe sessão, mostra a tela de login
        dashboard.classList.add('hidden');
        loginContainer.classList.remove('hidden');
    }
});