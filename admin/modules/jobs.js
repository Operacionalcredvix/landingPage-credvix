import { supabase } from '../../script/supabase-client.js';
import * as dom from './dom.js';
import { openJobModal, closeJobModal } from './ui.js';

let allJobs = [];

// NOVO: Função para buscar as localidades para o formulário e filtros.
async function populateLocalidadeOptions() {
    const { data, error } = await supabase.from('lojas').select('city');
    if (error) {
        console.error("Erro ao buscar cidades para o filtro:", error);
        return;
    }

    const cidades = [...new Set(data.map(item => item.city))].sort();
    
    const selectLocalidade = document.getElementById('job-localidade');
    selectLocalidade.innerHTML = '<option value="" disabled selected>Selecione a Localidade</option>';
    selectLocalidade.innerHTML += '<option value="Grande Vitória">Grande Vitória</option>';

    cidades.forEach(cidade => {
        if (!['Vila Velha', 'Vitória', 'Serra', 'Cariacica'].includes(cidade)) {
            selectLocalidade.innerHTML += `<option value="${cidade}">${cidade}</option>`;
        }
    });
}

export async function loadJobs() {
    dom.jobCardGrid.innerHTML = `<p>Carregando vagas...</p>`;
    dom.noJobsMessage.classList.add('hidden');

    // QUERY ATUALIZADA: Simplificada para a nova estrutura da tabela 'vagas'.
    const { data, error } = await supabase.from('vagas').select(`*, candidatos(count)`).order('created_at', { ascending: false });

    if (error) {
        console.error('Erro ao carregar vagas:', error.message);
        dom.jobCardGrid.innerHTML = `<p>Erro ao carregar vagas.</p>`;
        return;
    }
    allJobs = data;
    displayJobs();
    populateJobTitleFilter(); // Popula o filtro de cargos
}

// ATUALIZADO: para usar 'localidade' em vez de 'lojas'
export function displayJobs() {
    const statusFilter = dom.jobStatusFilter.value;
    const categoryFilter = dom.jobCategoryFilter.value;
    const titleFilter = dom.jobTitleFilter.value;
    const searchTerm = dom.jobSearchInput.value.toLowerCase();

    const filteredJobs = allJobs.filter(job => {
        const isActive = job.is_active;
        const matchesStatus = (statusFilter === 'todas') || (statusFilter === 'ativas' && isActive) || (statusFilter === 'inativas' && !isActive);
        const matchesCategory = (categoryFilter === 'todas') || (job.job_category === categoryFilter);
        const matchesTitle = (titleFilter === 'todos') || (job.title === titleFilter);
        const jobTitleText = job.title.toLowerCase();
        const localidadeText = job.localidade ? job.localidade.toLowerCase() : '';
        const matchesSearch = localidadeText.includes(searchTerm) || jobTitleText.includes(searchTerm);
        return matchesStatus && matchesCategory && matchesTitle && matchesSearch;
    });

    dom.totalJobsStat.textContent = allJobs.length;
    dom.activeJobsStat.textContent = allJobs.filter(j => j.is_active).length;
    dom.inactiveJobsStat.textContent = allJobs.filter(j => !j.is_active).length;

    dom.jobCardGrid.innerHTML = '';
    if (filteredJobs.length === 0) {
        dom.noJobsMessage.classList.remove('hidden');
        return;
    }
    dom.noJobsMessage.classList.add('hidden');

    filteredJobs.forEach(job => {
        const candidateCount = job.candidatos[0]?.count || 0;
        const card = document.createElement('div');
        card.className = 'job-card';
        card.innerHTML = `
            <div class="job-card-header">
                <div>
                    <h3 class="job-card-title">${job.title}</h3>
                    <p class="job-card-location"><span class="material-icons" style="font-size: 1rem;">location_on</span>${job.localidade || 'N/D'}</p>
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
        dom.jobCardGrid.appendChild(card);
    });

    document.querySelectorAll('.js-edit-job').forEach(btn => btn.addEventListener('click', handleEditJob));
    document.querySelectorAll('.js-delete-job').forEach(btn => btn.addEventListener('click', handleDeleteJob));
}

export async function handleJobFormSubmit(event) {
    event.preventDefault();
    const jobId = dom.jobIdInput.value;
    
    // FORMULÁRIO ATUALIZADO para usar 'localidade'
    const jobData = {
        title: document.getElementById('job-title').value,
        localidade: document.getElementById('job-localidade').value,
        type: document.getElementById('job-type').value,
        description: document.getElementById('job-description').value,
        job_category: document.getElementById('job-category').value,
        is_active: document.getElementById('job-is_active').checked
    };

    const { error } = jobId
        ? await supabase.from('vagas').update(jobData).eq('id', jobId)
        : await supabase.from('vagas').insert([jobData]);

    if (error) {
        console.error(error);
        alert('Ocorreu um erro ao salvar a vaga.');
    } else {
        closeJobModal();
        await loadJobs();
    }
}

function handleEditJob(event) {
    const id = event.currentTarget.dataset.id;
    const job = allJobs.find(j => j.id == id);
    if (!job) return;
    dom.jobModalTitle.textContent = 'Editar Vaga';
    dom.jobIdInput.value = job.id;
    document.getElementById('job-title').value = job.title;
    document.getElementById('job-localidade').value = job.localidade;
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
        if (error) {
            alert('Ocorreu um erro ao excluir a vaga.');
            console.error(error);
        } else {
            await loadJobs();
        }
    }
}

function populateJobTitleFilter() {
    const jobTitles = [...new Set(allJobs.map(job => job.title))].sort();
    dom.jobTitleFilter.innerHTML = '<option value="todos">Todos os Cargos</option>';
    jobTitles.forEach(title => dom.jobTitleFilter.add(new Option(title, title)));
}

// Chama a função para popular as localidades quando o módulo é carregado
populateLocalidadeOptions();