// Caminho: script/jobBoard.js
import { googleSheetURL } from './config.js';
import { openUploadModal } from './modalHandler.js';
import { observeElements } from './animations.js';

async function fetchJobsFromSheet() {
    if (!googleSheetURL || googleSheetURL.includes('COLE_AQUI')) {
        console.error("URL da Planilha Google não configurada em config.js.");
        throw new Error("URL da planilha não configurada.");
    }
    const response = await fetch(googleSheetURL);
    if (!response.ok) {
        throw new Error(`Falha ao buscar dados da planilha: ${response.statusText}`);
    }
    const csvText = await response.text();
    const lines = csvText.split('\n').slice(1);
    return lines.map(line => {
        const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
        return { title: values[0], storeName: values[1], state: values[2], type: values[3], description: values[4] };
    }).filter(job => job.title && job.title.trim() !== '');
}

function createJobCard(job) {
    return `
        <div class="bg-white rounded-lg shadow-md p-6 border flex flex-col h-full animate-on-scroll">
            <div class="flex-grow">
                <span class="inline-block bg-credvix-orange text-white text-xs font-semibold px-3 py-1 rounded-full mb-3">${job.type || ''}</span>
                <h3 class="text-lg font-bold text-help-purple">${job.title}</h3>
                <p class="text-gray-600 font-semibold text-sm">${job.storeName}</p>
                <p class="text-gray-500 text-sm mt-2">${job.description || ''}</p>
            </div>
            <div class="mt-4">
                <button class="apply-btn block w-full text-center bg-help-purple text-white font-semibold px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors" data-job-title="${job.title}" data-store-name="${job.storeName}">
                    Candidatar-se
                </button>
            </div>
        </div>
    `;
}

function addApplyButtonListeners() {
    document.querySelectorAll('.apply-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const jobTitle = e.currentTarget.dataset.jobTitle;
            const storeName = e.currentTarget.dataset.storeName;
            openUploadModal(jobTitle, storeName);
        });
    });
}

export async function initJobBoard() {
    const jobList = document.getElementById('job-list');
    const jobLocationSelect = document.getElementById('job-location-select');
    const jobTitleSelect = document.getElementById('job-title-select');
    const noJobsMessage = document.getElementById('no-jobs-message');

    if (!jobList || !jobLocationSelect || !jobTitleSelect) return;

    try {
        const jobs = await fetchJobsFromSheet();

        if (jobs.length === 0) {
            noJobsMessage.classList.remove('hidden');
            return;
        }

        const displayJobs = () => {
            const stateFilter = jobLocationSelect.value;
            const titleFilter = jobTitleSelect.value;
            const filteredJobs = jobs.filter(job =>
                ((stateFilter === 'todos' || job.state === stateFilter) &&
                 (titleFilter === 'todos' || job.title === titleFilter))
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

        jobLocationSelect.addEventListener('change', displayJobs);
        jobTitleSelect.addEventListener('change', displayJobs);

        displayJobs();

    } catch (error) {
        console.error("Falha final ao inicializar o mural de vagas:", error);
        noJobsMessage.innerHTML = '<p>Não foi possível carregar as vagas no momento. Tente novamente mais tarde.</p>';
        noJobsMessage.classList.remove('hidden');
    }
}