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
    const categoryIcon = job.job_category === 'Banco de Talentos' ? 'bookmark_add' : 'work';
    const borderClass = job.job_category === 'Banco de Talentos' ? 'border-l-help-purple' : 'border-l-help-orange';
    const bgAccentClass = job.job_category === 'Banco de Talentos' ? 'bg-purple-50' : 'bg-orange-50';
    
    return `
        <div class="job-card-compact bg-white rounded-lg shadow-md border-l-4 ${borderClass} border border-gray-200 flex flex-col h-full animate-on-scroll overflow-hidden hover:shadow-xl transition-all duration-300 group">
            <!-- Header compacto -->
            <div class="p-4 ${bgAccentClass}">
                <div class="flex justify-between items-center mb-2">
                    <span class="category-badge-compact ${categoryClass}">
                        <span class="material-icons text-xs align-middle mr-1">${categoryIcon}</span>
                        ${job.job_category}
                    </span>
                    ${job.type ? `<span class="job-type-compact">${job.type}</span>` : ''}
                </div>
                <h3 class="text-lg font-bold ${job.job_category === 'Banco de Talentos' ? 'text-help-purple' : 'text-help-orange'}">${job.title}</h3>
            </div>
            
            <!-- Corpo compacto -->
            <div class="p-4 flex-grow">
                <div class="flex items-center text-gray-700 mb-3">
                    <span class="material-icons ${job.job_category === 'Banco de Talentos' ? 'text-help-purple' : 'text-help-orange'} mr-2 text-lg">location_on</span>
                    <span class="font-semibold text-sm">${job.localidade}</span>
                </div>
                
                <!-- Informações -->
                <div class="flex items-center gap-2 text-xs text-gray-600">
                    <div class="flex items-center">
                        <span class="material-icons text-sm mr-1">schedule</span>
                        <span>Integral</span>
                    </div>
                    <div class="flex items-center">
                        <span class="material-icons text-sm mr-1">trending_up</span>
                        <span>Crescimento</span>
                    </div>
                </div>
            </div>
            
            <!-- Botão -->
            <div class="p-4 pt-0">
                <button class="apply-btn-site ${categoryClass} block w-full text-center font-bold px-4 py-3 rounded-lg hover:shadow-lg transition-all transform hover:scale-105" 
                        data-job-id="${job.id}" 
                        data-job-title="${job.title}" 
                        data-store-name="${job.localidade}"
                        data-application-type="${job.job_category}">
                    <span class="material-icons align-middle mr-1 text-sm">send</span>
                    Candidatar-se Agora
                </button>
            </div>
        </div>
    `;
}

function addApplyButtonListeners() {
    document.querySelectorAll('.apply-btn, .apply-btn-modern, .apply-btn-colorful, .apply-btn-site').forEach(button => {
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

// Função para gerenciar o formulário do Banco de Talentos
export function initializeTalentBankForm() {
    const form = document.getElementById('talent-bank-form');
    const statusDiv = document.getElementById('talent-bank-status');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Mostrar loading
        statusDiv.className = 'mt-6 p-4 rounded-lg text-center bg-blue-50 border border-blue-200';
        statusDiv.innerHTML = `
            <div class="flex items-center justify-center">
                <svg class="animate-spin h-5 w-5 mr-3 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span class="text-blue-600 font-semibold">Enviando seu currículo...</span>
            </div>
        `;
        statusDiv.classList.remove('hidden');

        try {
            const formData = new FormData(form);
            const cvFile = formData.get('talent-cv');

            // Validar tamanho do arquivo (5MB)
            if (cvFile.size > 5 * 1024 * 1024) {
                throw new Error('O arquivo é muito grande. Tamanho máximo: 5MB');
            }

            // Upload do currículo
            const fileExt = cvFile.name.split('.').pop();
            const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `banco-talentos/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('curriculos')
                .upload(filePath, cvFile);

            if (uploadError) throw uploadError;

            // Obter URL pública
            const { data: { publicUrl } } = supabase.storage
                .from('curriculos')
                .getPublicUrl(filePath);

            // Inserir no banco de dados
            const { error: insertError } = await supabase
                .from('candidatos')
                .insert([{
                    nome_completo: formData.get('talent-name'),
                    email: formData.get('talent-email'),
                    telefone: formData.get('talent-phone'),
                    vaga: formData.get('talent-position'),
                    loja: formData.get('talent-location'),
                    tipo_candidatura: 'Banco de Talentos',
                    curriculo_url: publicUrl,
                    mensagem: formData.get('talent-message') || null
                }]);

            if (insertError) throw insertError;

            // Sucesso
            statusDiv.className = 'mt-6 p-4 rounded-lg text-center bg-green-50 border border-green-200';
            statusDiv.innerHTML = `
                <div class="flex items-center justify-center mb-2">
                    <span class="material-icons text-green-600 text-3xl">check_circle</span>
                </div>
                <h4 class="font-bold text-green-800 mb-2">Currículo Cadastrado com Sucesso!</h4>
                <p class="text-green-700 text-sm">
                    Obrigado por se cadastrar em nosso banco de talentos. 
                    Entraremos em contato quando surgir uma oportunidade compatível com seu perfil.
                </p>
            `;

            form.reset();

            // Scroll suave para a mensagem de sucesso
            setTimeout(() => {
                statusDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 300);

        } catch (error) {
            console.error('Erro ao cadastrar no banco de talentos:', error);
            
            statusDiv.className = 'mt-6 p-4 rounded-lg text-center bg-red-50 border border-red-200';
            statusDiv.innerHTML = `
                <div class="flex items-center justify-center mb-2">
                    <span class="material-icons text-red-600 text-3xl">error</span>
                </div>
                <h4 class="font-bold text-red-800 mb-2">Erro ao Enviar</h4>
                <p class="text-red-700 text-sm">
                    ${error.message || 'Ocorreu um erro ao processar sua candidatura. Tente novamente.'}
                </p>
            `;
        }
    });
}