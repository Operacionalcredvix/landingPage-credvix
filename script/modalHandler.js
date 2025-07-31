import { supabase } from './supabase-client.js';

const uploadModal = document.getElementById('upload-modal');
const closeModalBtn = document.getElementById('close-modal-btn');
const modalJobTitle = document.getElementById('modal-job-title');
const uploadForm = document.getElementById('upload-form');
const cvFileInput = document.getElementById('cv-file');
const modalContentForm = document.getElementById('modal-content-form');
const modalContentStatus = document.getElementById('modal-content-status');

export function openUploadModal(jobTitle, storeName, jobId) {
    if (uploadModal) {
        modalJobTitle.textContent = `${jobTitle} - ${storeName}`;
        uploadForm.dataset.jobTitle = jobTitle;
        uploadForm.dataset.storeName = storeName;
        uploadForm.dataset.jobId = jobId;
        modalContentForm.classList.remove('hidden');
        modalContentStatus.classList.add('hidden');
        uploadForm.reset();
        uploadModal.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
    }
}

function closeModal() {
    if (uploadModal) {
        uploadModal.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
    }
}

function validateFile(file) {
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!file) throw new Error('Por favor, selecione um arquivo.');
    if (file.size > 5 * 1024 * 1024) throw new Error('O arquivo é muito grande. Tamanho máximo: 5MB.');
    if (!validTypes.includes(file.type)) throw new Error('Formato inválido. Use PDF, DOC ou DOCX.');
    return true;
}

async function uploadFile(file, storeName, candidateEmail) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${candidateEmail.split('@')[0]}_${Date.now()}.${fileExt}`;
    const safeStoreName = storeName.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-');
    const filePath = `${safeStoreName}/${fileName}`;
    const { error: uploadError } = await supabase.storage.from('curriculos').upload(filePath, file);
    if (uploadError) throw uploadError;
    return filePath;
}

async function registerCandidate(candidateData, filePath) {
    const { data: urlData } = supabase.storage.from('curriculos').getPublicUrl(filePath);
    const { error } = await supabase.from('candidatos').insert([{ ...candidateData, curriculo_url: urlData.publicUrl, status: 'pendente' }]);
    if (error) throw error;
}

async function handleFormSubmit(e) {
    e.preventDefault();
    const jobId = e.currentTarget.dataset.jobId;
    const file = cvFileInput.files[0];
    const jobTitle = e.currentTarget.dataset.jobTitle;
    const storeName = e.currentTarget.dataset.storeName;
    const candidateName = document.getElementById('candidate-name').value.trim();
    const candidateEmail = document.getElementById('candidate-email').value.trim();
    const candidatePhone = document.getElementById('candidate-phone').value.trim();

    if (!candidateName || !candidateEmail || !candidatePhone) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }

    modalContentForm.classList.add('hidden');
    modalContentStatus.classList.remove('hidden');
    modalContentStatus.innerHTML = `<div class="animate-pulse flex flex-col items-center"><svg class="animate-spin h-8 w-8 text-help-purple mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg><p class="text-lg">Enviando seu currículo...</p></div>`;

    try {
        validateFile(file);
        const filePath = await uploadFile(file, storeName, candidateEmail);

        // Busca os dados da vaga para pegar o city
        const { data: vaga, error: vagaError } = await supabase.from('vagas').select('*, lojas (city)').eq('id', jobId).single();
        if (vagaError) throw vagaError;

        await registerCandidate({
            vaga_id: jobId,
            nome_completo: candidateName,
            email: candidateEmail,
            telefone: candidatePhone,
            vaga: jobTitle,
            loja: storeName,
            city: vaga.lojas.city 
        }, filePath);

        modalContentStatus.innerHTML = `<div class="flex flex-col items-center"><svg class="h-12 w-12 text-green-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg><p class="text-green-600 font-bold text-xl mb-2">Currículo enviado com sucesso!</p><p class="text-sm text-gray-500">Agradecemos seu interesse. Entraremos em contato em breve.</p></div>`;
        setTimeout(closeModal, 4000);

    } catch (error) {
        console.error('Erro no processo de candidatura:', error);
        modalContentStatus.innerHTML = `<div class="flex flex-col items-center"><svg class="h-12 w-12 text-red-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg><p class="text-red-600 font-bold text-xl mb-2">Ocorreu um erro</p><p class="text-sm text-gray-500 mb-4">${error.message || 'Não foi possível enviar seu currículo.'}</p><button onclick="location.reload()" class="text-help-purple font-semibold mt-2 px-4 py-2 border border-help-purple rounded-lg hover:bg-help-purple hover:text-white transition-colors">Tentar novamente</button></div>`;
    }
}

export function initModalHandler() {
    if (!uploadModal) return;
    uploadForm.addEventListener('submit', handleFormSubmit);
    closeModalBtn.addEventListener('click', closeModal);
    uploadModal.addEventListener('click', (e) => {
        if (e.target === uploadModal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !uploadModal.classList.contains('hidden')) closeModal();
    });
}