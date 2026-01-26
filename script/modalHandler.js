import { supabase } from './supabase-client.js';

// Define os valores padrão para os tipos de candidatura
const APLICATION_TYPE = {
    OPEN_POSITION: 'Aberta',
    TALENT_POOL: 'Banco de Talentos'
};

// Elementos do DOM
const uploadModal = document.getElementById('upload-modal');
const closeModalBtn = document.getElementById('close-modal-btn');
const modalJobTitle = document.getElementById('modal-job-title');
const uploadForm = document.getElementById('upload-form');
const cvFileInput = document.getElementById('cv-file');
const modalContentForm = document.getElementById('modal-content-form');
const modalContentStatus = document.getElementById('modal-content-status');

/**
 * Normaliza o tipo de candidatura para garantir consistência
 */
function normalizeApplicationType(type) {
    if (typeof type !== 'string') return null;
    const lowerCaseType = type.toLowerCase().trim();
    if (lowerCaseType.includes('banco')) {
        return APLICATION_TYPE.TALENT_POOL;
    }
    if (lowerCaseType.includes('aberta')) {
        return APLICATION_TYPE.OPEN_POSITION;
    }
    return type;
}

/**
 * Verifica se o bucket 'curriculos' existe e está acessível
 * Tenta acessar diretamente sem listar todos os buckets
 */
async function checkBucketExists() {
    try {
        const { data: files, error: listError } = await supabase.storage
            .from('curriculos')
            .list('', { limit: 1 });
        
        if (listError) {
            if (listError.message?.includes('not found') || listError.statusCode === '404') {
                return false;
            }
            throw listError;
        }
        
        return true;
    } catch (error) {
        return false;
    }
}

/**
 * Valida o arquivo antes do upload
 */
function validateFile(file) {
    const validTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    if (!file) throw new Error('Por favor, selecione um arquivo.');
    if (file.size > 5 * 1024 * 1024) throw new Error('O arquivo é muito grande. Tamanho máximo: 5MB.');
    if (!validTypes.includes(file.type)) throw new Error('Formato inválido. Use PDF, DOC ou DOCX.');
    return true;
}

/**
 * Faz upload do arquivo para o storage
 */
async function uploadFile(file, storeName, candidateEmail) {
    try {
        const bucketExists = await checkBucketExists();
        if (!bucketExists) {
            throw new Error('BUCKET_NOT_FOUND');
        }

        const fileExt = file.name.split('.').pop();
        const fileName = `${candidateEmail.split('@')[0]}_${Date.now()}.${fileExt}`;
        const safeStoreName = storeName.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-');
        const filePath = `${safeStoreName}/${fileName}`;
        
        const { error: uploadError } = await supabase.storage.from('curriculos').upload(filePath, file, { 
            cacheControl: '3600', 
            upsert: false 
        });
        
        if (uploadError) {
            if (uploadError.message.includes('Bucket not found') || uploadError.message.includes('not found')) {
                throw new Error('BUCKET_NOT_FOUND');
            }
            throw uploadError;
        }
        
        return filePath;
    } catch (error) {
        throw error;
    }
}

/**
 * Registra o candidato no banco de dados
 */
async function registerCandidate(candidateData, filePath) {
    try {
        const { data: urlData } = supabase.storage.from('curriculos').getPublicUrl(filePath);
        console.log('📎 URL do currículo:', urlData.publicUrl);
        
        const insertData = {
            nome_completo: candidateData.nome_completo,
            email: candidateData.email,
            telefone: candidateData.telefone,
            vaga: candidateData.vaga,
            loja: candidateData.loja,
            tipo_candidatura: candidateData.tipo_candidatura,
            curriculo_url: urlData.publicUrl
        };
        console.log('💾 Inserindo dados:', insertData);
        
        const { data, error } = await supabase.from('candidatos').insert([insertData]);
        
        if (error) {
            console.error('❌ Erro ao inserir no banco:', error);
            throw error;
        }
        
        console.log('✅ Dados inseridos com sucesso:', data);
        return data;
    } catch (error) {
        console.error('❌ Erro em registerCandidate:', error);
        throw error;
    }
}

/**
 * Manipula o envio do formulário
 */
async function handleFormSubmit(e) {
    e.preventDefault();
    const jobId = e.currentTarget.dataset.jobId; // não utilizado na inserção atual
    const file = cvFileInput.files[0];
    const jobTitle = e.currentTarget.dataset.jobTitle;
    const storeName = e.currentTarget.dataset.storeName;
    const rawApplicationType = e.currentTarget.dataset.applicationType;
    const applicationType = normalizeApplicationType(rawApplicationType);
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
        console.log('🚀 Iniciando envio de currículo...');
        validateFile(file);
        console.log('✅ Arquivo validado');

        const filePath = await uploadFile(file, storeName, candidateEmail);
        console.log('✅ Upload concluído:', filePath);
        
        await registerCandidate({
            nome_completo: candidateName,
            email: candidateEmail,
            telefone: candidatePhone,
            vaga: jobTitle,
            loja: storeName,
            tipo_candidatura: applicationType
        }, filePath);
        console.log('✅ Candidato registrado no banco');

        modalContentStatus.innerHTML = `<div class="flex flex-col items-center"><svg class="h-12 w-12 text-green-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg><p class="text-green-600 font-bold text-xl mb-2" style="color: #059669 !important;">Currículo enviado com sucesso!</p><p class="text-gray-700 text-sm" style="color: #374151 !important;">Agradecemos seu interesse. Entraremos em contato em breve.</p></div>`;
        setTimeout(closeModal, 4000);

    } catch (error) {
        console.error('❌ Erro ao enviar currículo:', error);
        
        let errorMessage = 'Não foi possível enviar seu currículo.';
        let errorDetails = '';
        
        if (error.message === 'BUCKET_NOT_FOUND' || error.message.includes('Bucket')) {
            errorMessage = '🛠️ Sistema em Configuração';
            errorDetails = `
                <div class="text-left bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                    <p class="text-sm text-gray-700 mb-3">
                        <strong>O sistema de upload automático está sendo configurado.</strong>
                    </p>
                    <p class="text-sm text-gray-600 mb-2">📧 Por favor, envie seu currículo diretamente para:</p>
                    <a href="mailto:rh@credvix.com?subject=Candidatura: ${encodeURIComponent(jobTitle)}&body=Nome: ${encodeURIComponent(candidateName)}%0AEmail: ${encodeURIComponent(candidateEmail)}%0ATelefone: ${encodeURIComponent(candidatePhone)}" 
                       class="text-help-purple font-bold hover:underline break-all">
                        rh@credvix.com
                    </a>
                    <p class="text-xs text-gray-500 mt-2">
                        ℹ️ Anexe seu currículo e mencione a vaga: <strong>${jobTitle}</strong>
                    </p>
                </div>
            `;
        } else if (error.message.includes('Tamanho máximo')) {
            errorMessage = error.message;
            errorDetails = '<p class="text-sm text-gray-500 mt-2">ℹ️ Tente comprimir o arquivo ou salvar em formato PDF.</p>';
        } else if (error.message.includes('Formato inválido')) {
            errorMessage = error.message;
            errorDetails = '<p class="text-sm text-gray-500 mt-2">ℹ️ Aceitamos apenas arquivos PDF, DOC ou DOCX.</p>';
        } else if (error.message.includes('selecione um arquivo')) {
            errorMessage = error.message;
        }
        
        modalContentStatus.innerHTML = `
            <div class="flex flex-col items-center">
                <svg class="h-12 w-12 text-orange-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p class="text-orange-600 font-bold text-xl mb-2">${errorMessage}</p>
                ${errorDetails}
                <button onclick="location.reload()" class="mt-6 text-help-purple font-semibold px-6 py-2 border-2 border-help-purple rounded-lg hover:bg-help-purple hover:text-white transition-colors">
                    🔄 Tentar Novamente
                </button>
            </div>
        `;
    }
}

/**
 * Fecha o modal
 */
function closeModal() {
    if (uploadModal) {
        uploadModal.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
    }
}

/**
 * Abre o modal de upload
 */
export function openUploadModal(jobTitle, storeName, jobId, applicationType) {
    if (uploadModal) {
        modalJobTitle.textContent = `${jobTitle} - ${storeName}`;
        uploadForm.dataset.jobTitle = jobTitle;
        uploadForm.dataset.storeName = storeName;
        uploadForm.dataset.jobId = jobId;
        uploadForm.dataset.applicationType = applicationType;
        modalContentForm.classList.remove('hidden');
        modalContentStatus.classList.add('hidden');
        uploadForm.reset();
        
        // Aplicar cores baseadas no tipo de vaga
        const modalHeader = uploadModal.querySelector('.bg-gradient-to-r');
        const submitButton = uploadModal.querySelector('button[type="submit"]');
        const normalizedType = normalizeApplicationType(applicationType);
        
        // Remover classes anteriores
        uploadModal.classList.remove('modal-open-position', 'modal-talent-pool');
        
        if (normalizedType === APLICATION_TYPE.OPEN_POSITION) {
            // Vaga Aberta - Laranja
            uploadModal.classList.add('modal-open-position');
            if (modalHeader) {
                modalHeader.style.background = 'linear-gradient(to right, #F37021, #d97829)';
            }
            if (submitButton) {
                submitButton.style.background = 'linear-gradient(to right, #F37021, #d97829)';
            }
        } else {
            // Banco de Talentos - Roxo
            uploadModal.classList.add('modal-talent-pool');
            if (modalHeader) {
                modalHeader.style.background = 'linear-gradient(to right, #6938B0, #5b21b6)';
            }
            if (submitButton) {
                submitButton.style.background = 'linear-gradient(to right, #6938B0, #5b21b6)';
            }
        }
        
        uploadModal.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
    }
}

/**
 * Inicializa o handler do modal
 */
export function initModalHandler() {
    if (!uploadModal) return;
    uploadForm.addEventListener('submit', handleFormSubmit);
    closeModalBtn.addEventListener('click', closeModal);
    uploadModal.addEventListener('click', (e) => {
        if (e.target === uploadModal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !uploadModal.classList.contains('hidden')) {
            closeModal();
        }
    });
}