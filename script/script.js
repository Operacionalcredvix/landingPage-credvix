document.addEventListener('DOMContentLoaded', async function() {
    // --- INICIALIZAÇÃO DO SWIPER ---
    const swiper = new Swiper('.hero-swiper', {
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.hero-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.hero-nav-next',
            prevEl: '.hero-nav-prev',
        },
    });

    // --- ELEMENTOS DO DOM ---
    const stateSelect = document.getElementById('state-select');
    const searchInput = document.getElementById('search-input');
    const storeList = document.getElementById('store-list');
    const noStoresMessage = document.getElementById('no-stores-message');
    const initialStorePrompt = document.getElementById('initial-store-prompt');
    const jobLocationSelect = document.getElementById('job-location-select');
    const jobTitleSelect = document.getElementById('job-title-select');
    const jobList = document.getElementById('job-list');
    const noJobsMessage = document.getElementById('no-jobs-message');
    document.getElementById('year').textContent = new Date().getFullYear();

    // --- ELEMENTOS DO MODAL ---
    const uploadModal = document.getElementById('upload-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const modalJobTitle = document.getElementById('modal-job-title');
    const uploadForm = document.getElementById('upload-form');
    const cvFileInput = document.getElementById('cv-file');
    const modalContentForm = document.getElementById('modal-content-form');
    const modalContentStatus = document.getElementById('modal-content-status');
    
    // --- FUNÇÕES AUXILIARES ---
    function formatPhoneNumberForWhatsApp(phone) {
        return `55${phone.replace(/\D/g, '')}`;
    }

    // --- FUNÇÕES DO LOCALIZADOR DE LOJAS ---
    function createStoreCard(store) {
        const whatsappNumber = store.whatsapp.replace(/\D/g, '');
        const whatsappMessage = encodeURIComponent(`Oi, encontrei a loja ${store.name} pelo site e gostaria de mais informações!`);
        const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

        let finalImageUrl = store.imageUrl;
        if (!finalImageUrl.startsWith('http') && !finalImageUrl.startsWith('/')) {
            finalImageUrl = `img/${finalImageUrl}`;
        }

        return `
            <div class="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col transform hover:-translate-y-1 transition-transform duration-300 animate-on-scroll border">
                <div class="store-card-image-wrapper">
                    <img src="${finalImageUrl}" alt="Foto da loja ${store.name}" class="store-card-image" onerror="this.onerror=null;this.src='https://placehold.co/400x300/e2e8f0/4a5568?text=Imagem+Indisponível';">
                </div>
                <div class="p-6 flex flex-col flex-grow">
                    <div class="flex justify-between items-start mb-4">
                        <h3 class="text-xl font-bold text-gray-800 pr-2">${store.name}</h3>
                        <span class="bg-help-purple text-white text-xs font-bold px-2 py-1 rounded-md flex-shrink-0">${store.state}</span>
                    </div>
                    <div class="space-y-3 text-gray-600 flex-grow">
                        <div class="flex items-start">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-credvix-orange mr-2 mt-1 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" /></svg>
                            <span>${store.address}</span>
                        </div>
                        <div class="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-credvix-orange mr-2" viewBox="0 0 20 20" fill="currentColor"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.518.76a11.034 11.034 0 006.364 6.364l.76-1.518a1 1 0 011.06-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg>
                            <span class="font-semibold">${store.phone}</span>
                        </div>
                    </div>
                    <div class="mt-auto pt-4 border-t">
                        <div class="flex items-center space-x-2">
                            <a href="${whatsappLink}" target="_blank" rel="noopener noreferrer" title="Contatar no WhatsApp" class="bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition-colors duration-300 flex items-center justify-center space-x-2 text-sm font-semibold flex-grow">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.886-.001 2.267.651 4.383 1.803 6.151l-1.217 4.439 4.562-1.192zM12.07 9.15c-.244-.123-1.448-.714-1.674-.795-.225-.082-.39-.123-.554.124-.165.246-.633.795-.776.959-.143.164-.287.185-.531.062-.244-.123-.488-.185-1.032-.617-.544-.432-.902-1.02-1.02-1.184-.118-.164-.025-.246.082-.369.082-.102.185-.267.287-.432.102-.164.143-.287.205-.471.062-.185.021-.349-.041-.471-.062-.123-.554-1.329-.757-1.826-.205-.496-.41-.432-.554-.432-.143 0-.307-.021-.471-.021-.164 0-.432.062-.657.328-.225.267-.862.84-.862 2.046 0 1.206.883 2.372 1.005 2.536.123.164 1.738 2.66 4.205 3.72.596.246 1.054.389 1.416.51.544.185.962.164 1.325.102.41-.062 1.448-.592 1.651-1.164.205-.572.205-1.054.143-1.164-.062-.102-.225-.164-.471-.287z"/></svg>
                                <span>WhatsApp</span>
                            </a>
                            <a href="${store.instagramUrl}" target="_blank" rel="noopener noreferrer" title="Visitar Instagram" class="instagram-btn p-2 rounded-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.689-.073-4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44 1.441-.645 1.441-1.44-.645-1.44-1.441-1.44z"/></svg>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function updateDisplayedStores() {
            const stateFilter = stateSelect.value;
            const searchTerm = searchInput.value.toLowerCase();

            if (!stores) return; // Proteção para caso o arquivo de lojas não carregue

            const filteredStores = stores.filter(store => {
                const matchesState = (stateFilter === 'todos') || (store.state === stateFilter);
                const matchesSearch = store.name.toLowerCase().includes(searchTerm) ||
                                      store.address.toLowerCase().includes(searchTerm);
                return matchesState && matchesSearch;
            });

            storeList.innerHTML = '';
            if (filteredStores.length > 0) {
                initialStorePrompt.classList.add('hidden');
                noStoresMessage.classList.add('hidden');
                storeList.classList.remove('hidden');
                filteredStores.forEach(store => {
                    storeList.innerHTML += createStoreCard(store);
                });
            } else {
                initialStorePrompt.classList.add('hidden');
                storeList.classList.add('hidden');
                noStoresMessage.classList.remove('hidden');
            }
            observeElements();
        }

        function populateStoreDropdown() {
            if (!stores) return; // Proteção
            const availableStates = [...new Set(stores.map(store => store.state))].sort();
            availableStates.forEach(state => {
                const option = document.createElement('option');
                option.value = state;
                option.textContent = state;
                stateSelect.appendChild(option);
            });
        }

        // --- FUNÇÕES DO TRABALHE CONOSCO ---
        async function fetchJobsFromSheet() {
            if (!googleSheetURL || googleSheetURL.includes('COLE_AQUI')) {
                console.error("URL da Planilha Google não configurada.");
                return [];
            }
            try {
                const response = await fetch(googleSheetURL);
                if (!response.ok) throw new Error('Falha ao buscar dados da planilha.');
                const csvText = await response.text();
                const lines = csvText.split('\n').slice(1);
                return lines.map(line => {
                    const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
                    return { title: values[0], storeName: values[1], state: values[2], type: values[3], description: values[4] };
                }).filter(job => job.title);
            } catch (error) {
                console.error("Erro ao processar vagas:", error);
                jobList.innerHTML = `<p class="text-red-500 text-center">Não foi possível carregar as vagas. Tente novamente mais tarde.</p>`;
                return [];
            }
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
        
        function displayJobs(allJobs, stateFilter = 'todos', titleFilter = 'todos') {
            jobList.innerHTML = '';

            const filteredJobs = allJobs.filter(job => {
                const matchesState = (stateFilter === 'todos') || (job.state === stateFilter);
                const matchesTitle = (titleFilter === 'todos') || (job.title === titleFilter);
                return matchesState && matchesTitle;
            });
            
            if (filteredJobs.length > 0) {
                noJobsMessage.classList.add('hidden');
                filteredJobs.forEach(job => {
                    jobList.innerHTML += createJobCard(job);
                });
            } else {
                noJobsMessage.classList.remove('hidden');
            }
            addApplyButtonListeners();
            observeElements();
        }

        function populateJobsStateFilter(jobs) {
            const jobStates = [...new Set(jobs.map(job => job.state))].filter(Boolean).sort();
            jobLocationSelect.innerHTML = '<option value="todos">Todos os Estados</option>';
            jobStates.forEach(state => {
                const option = document.createElement('option');
                option.value = state;
                option.textContent = state;
                jobLocationSelect.appendChild(option);
            });
        }
        
        function populateJobTitlesFilter(jobs) {
            const jobTitles = [...new Set(jobs.map(job => job.title))].filter(Boolean).sort();
            jobTitleSelect.innerHTML = '<option value="todos">Todas as Vagas</option>';
            jobTitles.forEach(title => {
                const option = document.createElement('option');
                option.value = title;
                option.textContent = title;
                jobTitleSelect.appendChild(option);
            });
        }

        // --- LÓGICA DO MODAL DE UPLOAD ---
        function openUploadModal(jobTitle, storeName) {
            modalJobTitle.textContent = `${jobTitle} - ${storeName}`;
            uploadForm.dataset.jobTitle = jobTitle;
            uploadForm.dataset.storeName = storeName;
            modalContentForm.classList.remove('hidden');
            modalContentStatus.classList.add('hidden');
            uploadForm.reset();
            uploadModal.classList.remove('hidden');
            uploadModal.classList.add('flex');
        }

        function closeModal() {
            uploadModal.classList.add('hidden');
            uploadModal.classList.remove('flex');
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

        uploadForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const file = cvFileInput.files[0];
            if (!file) {
                alert("Por favor, selecione um arquivo.");
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                alert("O arquivo é muito grande. O tamanho máximo permitido é 5MB.");
                return;
            }
            const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            if (!validTypes.includes(file.type)) {
                alert("Por favor, envie um arquivo nos formatos PDF, DOC ou DOCX.");
                return;
            }
            
            const jobTitle = this.dataset.jobTitle;
            const storeName = this.dataset.storeName;
            const candidateName = document.getElementById('candidate-name').value;
            const candidateEmail = document.getElementById('candidate-email').value;
            const candidatePhone = document.getElementById('candidate-phone').value;
            
            modalContentForm.classList.add('hidden');
            modalContentStatus.classList.remove('hidden');
            modalContentStatus.innerHTML = `<div class="animate-pulse flex flex-col items-center"><svg class="animate-spin h-8 w-8 text-help-purple mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg><p class="text-lg">Processando seu currículo...</p></div>`;

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

                // **LINHA DE DEBUG ADICIONADA**
                // console.log("Enviando para o Google Apps Script. Payload:", JSON.stringify(payload));

                modalContentStatus.innerHTML = `<div class="animate-pulse flex flex-col items-center"><svg class="animate-spin h-8 w-8 text-help-purple mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg><p class="text-lg">Enviando seu currículo...</p></div>`;

                fetch(googleAppScriptURL, {
                    method: 'POST',
                    mode: 'cors', // Adicionado para evitar possíveis problemas de CORS
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
                modalContentStatus.innerHTML = `<div class="flex flex-col items-center"><svg class="h-12 w-12 text-red-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg><p class="text-red-600 font-bold text-xl mb-2">Erro ao ler o arquivo</p><p class="text-sm text-gray-500">O arquivo selecionado não pôde ser lido. Por favor, tente outro arquivo.</p><button onclick="modalContentForm.classList.remove('hidden'); modalContentStatus.classList.add('hidden')" class="text-help-purple font-semibold mt-4">Voltar</button></div>`;
            };
        });

        closeModalBtn.addEventListener('click', closeModal);
        uploadModal.addEventListener('click', (e) => {
            if (e.target === uploadModal) {
                closeModal();
            }
        });

        function observeElements() {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });

            document.querySelectorAll('.animate-on-scroll').forEach(element => {
                observer.observe(element);
            });
        }

        async function initializePage() {
            // Lógica das Lojas
            populateStoreDropdown();
            updateDisplayedStores();
            
            // Lógica das Vagas
            const jobs = await fetchJobsFromSheet();
            if (jobs.length > 0) {
                populateJobsStateFilter(jobs);
                populateJobTitlesFilter(jobs);
                
                displayJobs(jobs, 'todos', 'todos');

                const updateJobDisplay = () => {
                    const selectedState = jobLocationSelect.value;
                    const selectedTitle = jobTitleSelect.value;
                    displayJobs(jobs, selectedState, selectedTitle);
                };

                jobLocationSelect.addEventListener('change', updateJobDisplay);
                jobTitleSelect.addEventListener('change', updateJobDisplay);
            }
            
            stateSelect.addEventListener('change', updateDisplayedStores);
            searchInput.addEventListener('input', updateDisplayedStores);

            observeElements();
        }

        initializePage();
    });