//Supabase e outras funções necessárias
import { supabase } from './supabase-client.js';
import { openUploadModal } from './modalHandler.js';
import { observeElements } from './animations.js';

async function fetchActiveJobs() {
    const { data, error } = await supabase
        .from('vagas')
        .select('*') // Seleciona todas as colunas
        .eq('is_active', true) // Filtra para pegar APENAS vagas ativas
        .order('created_at', { ascending: false }); // Ordena pelas mais recentes

    if (error) {
        console.error("Erro ao buscar vagas do Supabase:", error.message);
        throw new Error("Falha ao buscar as vagas.");
    }
    return data;
}

/**
 * Cria o HTML para um card de vaga, incluindo o botão com o estilo correto.
 */
function createJobCard(job) {
    const categoryClass = job.job_category === 'Banco de Talentos' ? 'category-talent' : 'category-open';

    return `
        <div class="bg-white rounded-lg shadow-md p-6 border flex flex-col h-full animate-on-scroll">
            <div class="flex-grow">
                <div class="job-card-header">
                    <span class="inline-block bg-credvix-orange text-white text-xs font-semibold px-3 py-1 rounded-full">${job.type || ''}</span>
                    <span class="category-indicator ${categoryClass}">${job.job_category}</span>
                </div>
                <h3 class="text-lg font-bold text-help-purple mt-3">${job.title}</h3>
                <p class="text-gray-600 font-semibold text-sm">${job.storename} - ${job.city}, ${job.state}</p> 
                <p class="text-gray-500 text-sm mt-2">${job.description || ''}</p>
            </div>
            <div class="mt-4">
                <button class="apply-btn block w-full text-center bg-help-purple text-white font-semibold px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors" 
                        data-job-id="${job.id}" 
                        data-job-title="${job.title}" 
                        data-store-name="${job.storename}">
                    Candidatar-se
                </button>
            </div>
        </div>
    `;
}

/**
 * Adiciona os listeners aos botões "Candidatar-se".
 */
function addApplyButtonListeners() {
    document.querySelectorAll('.apply-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const jobId = e.currentTarget.dataset.jobId;
            const jobTitle = e.currentTarget.dataset.jobTitle;
            const storeName = e.currentTarget.dataset.storeName;
            openUploadModal(jobTitle, storeName, jobId);
        });
    });
}

/**
 * Inicializa todo o painel de vagas, agora com o novo filtro.
 */
export async function initJobBoard() {
    const jobList = document.getElementById('job-list');
    const jobLocationSelect = document.getElementById('job-location-select');
    const jobTitleSelect = document.getElementById('job-title-select');
    const jobCategorySelect = document.getElementById('job-category-select'); // <-- Pega o novo filtro
    const noJobsMessage = document.getElementById('no-jobs-message');

    if (!jobList || !jobLocationSelect || !jobTitleSelect || !jobCategorySelect) return;

    try {
        const jobs = await fetchActiveJobs();

        if (jobs.length === 0) {
            noJobsMessage.classList.remove('hidden');
            return;
        }

        const displayJobs = () => {
            const stateFilter = jobLocationSelect.value;
            const titleFilter = jobTitleSelect.value;
            const categoryFilter = jobCategorySelect.value; // <-- Lê o valor do novo filtro

            const filteredJobs = jobs.filter(job =>
                (stateFilter === 'todos' || job.state === stateFilter) &&
                (titleFilter === 'todos' || job.title === titleFilter) &&
                (categoryFilter === 'todos' || job.job_category === categoryFilter) // <-- Aplica o novo filtro
            );

            jobList.innerHTML = '';
            if (filteredJobs.length > 0) {
                jobList.classList.remove('hidden');
                noJobsMessage.classList.add('hidden');
                filteredJobs.forEach(job => {
                    jobList.innerHTML += createJobCard(job);
                });
                addApplyButtonListeners();
                observeElements();
            } else {
                jobList.classList.add('hidden');
                noJobsMessage.classList.remove('hidden');
            }
        };

        const jobStates = [...new Set(jobs.map(job => job.state))].filter(Boolean).sort();
        jobLocationSelect.innerHTML = '<option value="todos">Todos os Estados</option>';
        jobStates.forEach(state => jobLocationSelect.add(new Option(state, state)));

        const jobTitles = [...new Set(jobs.map(job => job.title))].filter(Boolean).sort();
        jobTitleSelect.innerHTML = '<option value="todos">Todas as Vagas</option>';
        jobTitles.forEach(title => jobTitleSelect.add(new Option(title, title)));

        // Adiciona os event listeners para todos os filtros
        jobLocationSelect.addEventListener('change', displayJobs);
        jobTitleSelect.addEventListener('change', displayJobs);
        jobCategorySelect.addEventListener('change', displayJobs); // <-- Listener para o novo filtro

        displayJobs();

    } catch (error) {
        console.error("Falha final ao inicializar o mural de vagas:", error);
        noJobsMessage.innerHTML = '<p>Não foi possível carregar as vagas no momento. Tente novamente mais tarde.</p>';
        noJobsMessage.classList.remove('hidden');
    }
}