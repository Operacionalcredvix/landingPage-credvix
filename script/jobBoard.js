// script/jobBoard.js
import { supabase } from './supabase-client.js';
import { openUploadModal } from './modalHandler.js';
import { observeElements } from './animations.js';

async function fetchActiveJobs() {
    const { data, error } = await supabase
        .from('vagas')
        .select(`id, title, description, type, job_category, localidade`)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Erro ao buscar vagas do Supabase:", error.message);
        throw new Error("Falha ao buscar as vagas.");
    }
    return data;
}

function createJobCard(job) {
    const categoryClass = job.job_category === 'Banco de Talentos' ? 'category-talent' : 'category-open';
    
    return `
        <div class="bg-white rounded-lg shadow-md p-6 border flex flex-col h-full animate-on-scroll justify-between">
            <div>
                <div class="flex justify-between items-center mb-3">
                    <span class="category-indicator ${categoryClass}">${job.job_category}</span>
                    <span class="inline-block bg-gray-200 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full">${job.type || ''}</span>
                </div>
                <h3 class="text-lg font-bold text-help-purple">${job.title}</h3>
                <p class="text-gray-600 font-semibold text-sm mt-1">${job.localidade}</p> 
            </div>
            <button class="apply-btn block w-full text-center bg-help-purple text-white font-semibold px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors mt-4" 
                    data-job-id="${job.id}" 
                    data-job-title="${job.title}" 
                    data-store-name="${job.localidade}"
                    data-application-type="${job.job_category}">
                Candidatar-se
            </button>
        </div>
    `;
}

function addApplyButtonListeners() {
    document.querySelectorAll('.apply-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const jobId = e.currentTarget.dataset.jobId;
            const jobTitle = e.currentTarget.dataset.jobTitle;
            const storeName = e.currentTarget.dataset.storeName;
            const applicationType = e.currentTarget.dataset.applicationType;
            openUploadModal(jobTitle, storeName, jobId, applicationType);
        });
    });
}

export async function initJobBoard() {
    const jobList = document.getElementById('job-list');
    const jobLocationSelect = document.getElementById('job-location-select');
    const jobTitleSelect = document.getElementById('job-title-select');
    const jobCategorySelect = document.getElementById('job-category-select');
    const noJobsMessage = document.getElementById('no-jobs-message');

    if (!jobList || !jobLocationSelect || !jobTitleSelect || !jobCategorySelect) return;

    try {
        const jobs = await fetchActiveJobs();

        if (jobs.length === 0) {
            noJobsMessage.classList.remove('hidden');
            return;
        }

        const displayJobs = () => {
            const locationFilter = jobLocationSelect.value;
            const titleFilter = jobTitleSelect.value;
            const categoryFilter = jobCategorySelect.value;

            const filteredJobs = jobs.filter(job =>
                (locationFilter === 'todos' || job.localidade === locationFilter) &&
                (titleFilter === 'todos' || job.title === titleFilter) &&
                (categoryFilter === 'todos' || job.job_category === categoryFilter)
            );

            jobList.innerHTML = '';
            if (filteredJobs.length > 0) {
                jobList.classList.remove('hidden');
                noJobsMessage.classList.add('hidden');
                filteredJobs.forEach(job => jobList.innerHTML += createJobCard(job));
                addApplyButtonListeners();
                observeElements();
            } else {
                jobList.classList.add('hidden');
                noJobsMessage.classList.remove('hidden');
            }
        };
        
        // ATUALIZADO: Popula o filtro de localização com as localidades das vagas
        const jobLocations = [...new Set(jobs.map(job => job.localidade).filter(Boolean))].sort();
        jobLocationSelect.innerHTML = '<option value="todos">Todas as Localidades</option>';
        jobLocations.forEach(loc => jobLocationSelect.add(new Option(loc, loc)));

        const jobTitles = [...new Set(jobs.map(job => job.title))].filter(Boolean).sort();
        jobTitleSelect.innerHTML = '<option value="todos">Todas as Vagas</option>';
        jobTitles.forEach(title => jobTitleSelect.add(new Option(title, title)));

        jobLocationSelect.addEventListener('change', displayJobs);
        jobTitleSelect.addEventListener('change', displayJobs);
        jobCategorySelect.addEventListener('change', displayJobs);

        displayJobs();

    } catch (error) {
        console.error("Falha final ao inicializar o mural de vagas:", error);
        noJobsMessage.innerHTML = '<p>Não foi possível carregar as vagas no momento. Tente novamente mais tarde.</p>';
        noJobsMessage.classList.remove('hidden');
    }
}