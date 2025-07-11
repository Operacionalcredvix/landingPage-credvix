
// import { googleAppScriptURL } from './config.js';

const uploadModal = document.getElementById('upload-modal');
const closeModalBtn = document.getElementById('close-modal-btn');
const modalJobTitle = document.getElementById('modal-job-title');
const uploadForm = document.getElementById('upload-form');
const cvFileInput = document.getElementById('cv-file');
const modalContentForm = document.getElementById('modal-content-form');
const modalContentStatus = document.getElementById('modal-content-status');

export function openUploadModal(jobTitle, storeName) {
    if (uploadModal) {
        modalJobTitle.textContent = `${jobTitle} - ${storeName}`;
        uploadForm.dataset.jobTitle = jobTitle;
        uploadForm.dataset.storeName = storeName;
        modalContentForm.classList.remove('hidden');
        modalContentStatus.classList.add('hidden');
        uploadForm.reset();
        uploadModal.classList.remove('hidden');
        uploadModal.classList.add('flex');
    }
}

function closeModal() {
    if (uploadModal) {
        uploadModal.classList.add('hidden');
        uploadModal.classList.remove('flex');
    }
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const file = cvFileInput.files[0];
    if (!file) {
        alert("Por favor, selecione um arquivo.");
        return;
    }
    if (file.size > 5 * 1024 * 1024) { // 5MB
        alert("O arquivo é muito grande. O tamanho máximo permitido é 5MB.");
        return;
    }
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(file.type)) {
        alert("Por favor, envie um arquivo nos formatos PDF, DOC ou DOCX.");
        return;
    }
    
    const jobTitle = e.currentTarget.dataset.jobTitle;
    const storeName = e.currentTarget.dataset.storeName;
    const candidateName = document.getElementById('candidate-name').value;
    const candidateEmail = document.getElementById('candidate-email').value;
    const candidatePhone = document.getElementById('candidate-phone').value;
    
    modalContentForm.classList.add('hidden');
    modalContentStatus.classList.remove('hidden');
    modalContentStatus.innerHTML = `<div class="animate-pulse flex flex-col items-center"><svg class="animate-spin h-8 w-8 text-help-purple mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg><p class="text-lg">Enviando seu currículo...</p></div>`;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = function() {
        const fileDataUrl = reader.result;
        const base64Data = fileDataUrl.split(',')[1];
        
        const payload = {
            fileName: file.name,
            mimeType: file.type,
            fileData: base64Data,
            jobTitle: jobTitle,
            storeName: storeName,
            candidateName: candidateName,
            candidateEmail: candidateEmail,
            candidatePhone: candidatePhone
        };

        fetch(googleAppScriptURL, {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify(payload)
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                modalContentStatus.innerHTML = `<div class="flex flex-col items-center"><svg class="h-12 w-12 text-green-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg><p class="text-green-600 font-bold text-xl mb-2">Currículo enviado com sucesso!</p><p class="text-sm text-gray-500">Agradecemos seu interesse. Entraremos em contato em breve.</p></div>`;
            } else {
                throw new Error(data.message || 'O servidor retornou um erro.');
            }
            setTimeout(closeModal, 4000);
        })
        .catch(error => {
            console.error('Erro no upload:', error);
            modalContentStatus.innerHTML = `<div class="flex flex-col items-center"><svg class="h-12 w-12 text-red-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg><p class="text-red-600 font-bold text-xl mb-2">Ocorreu um erro</p><p class="text-sm text-gray-500 mb-4">Não foi possível enviar seu currículo. Por favor, tente novamente.</p><button onclick="location.reload()" class="text-help-purple font-semibold">Tentar novamente</button></div>`;
        });
    };

    reader.onerror = function() {
        modalContentStatus.innerHTML = `<div class="flex flex-col items-center"><svg class="h-12 w-12 text-red-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg><p class="text-red-600 font-bold text-xl mb-2">Erro ao ler o arquivo</p><p class="text-sm text-gray-500">O arquivo selecionado não pôde ser lido. Por favor, tente outro arquivo.</p></div>`;
    };
}

export function initModalHandler() {
    if (uploadModal) {
        uploadForm.addEventListener('submit', handleFormSubmit);
        closeModalBtn.addEventListener('click', closeModal);
        uploadModal.addEventListener('click', (e) => {
            if (e.target === uploadModal) {
                closeModal();
            }
        });
    }
}