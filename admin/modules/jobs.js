// admin/modules/jobs.js

import { supabase } from '../../script/supabase-client.js';
import * as dom from './dom.js';
import { getLoadedStores } from './stores.js';
import { openJobModal, closeJobModal } from './ui.js';

let allJobs = []; // Estado local do módulo

export async function loadJobs() {
    dom.jobCardGrid.innerHTML = `<p>Carregando vagas...</p>`;
    dom.noJobsMessage.classList.add('hidden');

    const { data, error } = await supabase.from('vagas').select(`*, lojas(name, city, state), candidatos(count)`).order('created_at', { ascending: false });

    if (error) {
        console.error('Erro ao carregar vagas:', error.message);
        dom.jobCardGrid.innerHTML = `<p>Erro ao carregar vagas.</p>`;
        return;
    }
    allJobs = data;
    displayJobs();
}

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
        const storeName = job.lojas?.name?.toLowerCase() || '';
        const jobTitleText = job.title.toLowerCase();
        const matchesSearch = storeName.includes(searchTerm) || jobTitleText.includes(searchTerm);
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
        dom.jobCardGrid.appendChild(card);
    });

    document.querySelectorAll('.js-edit-job').forEach(btn => btn.addEventListener('click', handleEditJob));
    document.querySelectorAll('.js-delete-job').forEach(btn => btn.addEventListener('click', handleDeleteJob));
}

export async function handleJobFormSubmit(event) {
    event.preventDefault();
    const jobId = dom.jobIdInput.value;
    const selectedLojaId = dom.jobStoreSelect.value;
    const selectedStore = getLoadedStores().find(s => s.id == selectedLojaId);

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
    document.getElementById('job-storeName').value = job.loja_id;
    document.getElementById('job-city').value = job.lojas?.city || '';
    document.getElementById('job-state').value = job.lojas?.state || '';
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

export function handleStoreSelectChange(event) {
    const selectedStoreId = event.target.value;
    const store = getLoadedStores().find(s => s.id == selectedStoreId);
    if (store) {
        document.getElementById('job-city').value = store.city;
        document.getElementById('job-state').value = store.state;
    }
}