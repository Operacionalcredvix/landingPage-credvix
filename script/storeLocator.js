// Caminho: /script/storeLocator.js
import { supabase } from './supabase-client.js';
import { observeElements } from './animations.js';

// Função para verificar se a loja está aberta
function isStoreOpen() {
    const now = new Date();
    const day = now.getDay(); // 0 = Domingo, 6 = Sábado
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const currentTime = hours * 60 + minutes;

    // Fechado aos domingos
    if (day === 0) return false;

    // Sábado: 8h às 13h
    if (day === 6) {
        return currentTime >= 8 * 60 && currentTime < 13 * 60;
    }

    // Segunda a Sexta: 8h às 18h
    return currentTime >= 8 * 60 && currentTime < 18 * 60;
}

// Função para obter o horário de funcionamento formatado
function getBusinessHours(day = null) {
    const currentDay = day ?? new Date().getDay();
    
    if (currentDay === 0) {
        return 'Fechado';
    } else if (currentDay === 6) {
        return '8h às 13h';
    } else {
        return '8h às 18h';
    }
}

function createStoreCard(store) {
    const whatsappNumber = store.whatsapp ? store.whatsapp.replace(/\D/g, '') : '';
    const whatsappMessage = encodeURIComponent(`Oi, encontrei a loja ${store.nome} pelo site e gostaria de mais informações!`);
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;
    const hasInstagram = Boolean(store.instagram_url && String(store.instagram_url).trim());
    
    // Criar link do Google Maps
    const addressEncoded = encodeURIComponent(store.address || store.nome);
    const mapsLink = `https://www.google.com/maps/search/?api=1&query=${addressEncoded}`;
    
    // Verificar status
    const isOpen = isStoreOpen();
    const statusBadge = isOpen 
        ? '<span class="store-status-badge store-status-open">🟢 Aberto Agora</span>'
        : '<span class="store-status-badge store-status-closed">🔴 Fechado</span>';

    return `
        <div class="benefit-card-modern store-card group animate-on-scroll">
            <div class="flex justify-between items-start mb-4">
                <div class="flex-grow pr-2">
                    <h3 class="benefit-title text-left mb-2">${store.nome}</h3>
                    <span class="inline-block bg-gradient-to-r from-help-purple to-purple-700 text-white text-xs font-bold px-3 py-1 rounded-full">${store.state}</span>
                </div>
                <div class="flex flex-col gap-2 items-end">
                    ${statusBadge}
                </div>
            </div>
            
            <div class="space-y-3 text-gray-600 flex-grow mb-4">
                <div class="flex items-start">
                    <span class="material-icons text-credvix-orange mr-2 mt-1 flex-shrink-0">location_on</span>
                    <span class="text-sm">${store.address || ''}</span>
                </div>
                <div class="flex items-center">
                    <span class="material-icons text-credvix-orange mr-2 flex-shrink-0">call</span>
                    <span class="font-semibold text-sm">${store.phone || ''}</span>
                </div>
                <div class="flex items-center text-sm">
                    <span class="material-icons text-credvix-orange mr-2 flex-shrink-0">schedule</span>
                    <span class="text-gray-700 font-medium">
                        Seg-Sex: 8h-18h | Sáb: 8h-13h
                    </span>
                </div>
            </div>
            
            <div class="border-t pt-4 space-y-3">
                <div class="grid grid-cols-2 gap-2">
                    <a href="${whatsappLink}" target="_blank" rel="noopener noreferrer" 
                       title="Contatar no WhatsApp" 
                       class="store-action-btn bg-green-500 hover:bg-green-600">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.886-.001 2.267.651 4.383 1.803 6.151l-1.217 4.439 4.562-1.192z"/>
                            <path d="M12.07 9.15c-.244-.123-1.448-.714-1.674-.795-.225-.082-.39-.123-.554.124-.165.246-.633.795-.776.959-.143.164-.287.185-.531.062-.244-.123-.488-.185-1.032-.617-.544-.432-.902-1.02-1.02-1.184-.118-.164-.025-.246.082-.369.082-.102.185-.267.287-.432.102-.164.143-.287.205-.471.062-.185.021-.349-.041-.471-.062-.123-.554-1.329-.757-1.826-.205-.496-.41-.432-.554-.432-.143 0-.307-.021-.471-.021-.164 0-.432.062-.657.328-.225.267-.862.84-.862 2.046 0 1.206.082 2.372 1.005 2.536.123.164 1.738 2.66 4.205 3.72.596.246 1.054.389 1.416.51.544.185.962.164 1.325.102.41-.062 1.448-.592 1.651-1.164.205-.572.205-1.054.143-1.164-.062-.102-.225-.164-.471-.287z"/>
                        </svg>
                        <span>WhatsApp</span>
                    </a>
                    ${hasInstagram ? `
                    <a href="${store.instagram_url}" target="_blank" rel="noopener noreferrer" 
                       title="Visitar Instagram" 
                       class="store-action-btn instagram-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.689-.073-4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44 1.441-.645 1.441-1.44-.645-1.44-1.441-1.44z"/>
                        </svg>
                        <span>Instagram</span>
                    </a>
                    ` : '<div></div>'}
                </div>
                <a href="${mapsLink}" target="_blank" rel="noopener noreferrer"
                   class="store-maps-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Ver no Google Maps
                </a>
            </div>
        </div>
    `;
}

export async function initStoreLocator() {
    const stateSelect = document.getElementById('state-select');
    const searchInput = document.getElementById('search-input');
    const storeList = document.getElementById('store-list');
    const noStoresMessage = document.getElementById('no-stores-message');
    const initialStorePrompt = document.getElementById('initial-store-prompt');
    const showAllButton = document.getElementById('show-all-stores');
    const storeCounter = document.getElementById('store-counter');
    const storeCount = document.getElementById('store-count');
    const totalStoresBadge = document.getElementById('total-stores-badge');

    if (!stateSelect || !searchInput || !storeList || !noStoresMessage) {
        return;
    }

    const { data: allStores, error } = await supabase.from('lojas').select('*').order('nome');

    if (error) {
        console.error("Erro ao buscar lojas:", error);
        noStoresMessage.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto mb-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-lg font-semibold mb-2">Erro ao carregar lojas</p>
            <p class="text-sm">Não foi possível carregar as lojas no momento. Tente novamente mais tarde.</p>
        `;
        noStoresMessage.classList.remove('hidden');
        initialStorePrompt.classList.add('hidden');
        return;
    }

    // Filtrar lojas excluindo "Matriz"
    const stores = allStores.filter(store => 
        !store.nome.toLowerCase().includes('matriz')
    );

    // Atualizar badge de total de lojas
    if (totalStoresBadge) {
        totalStoresBadge.textContent = stores.length;
    }
    
    // Atualizar contagem em todos os elementos store-count
    const storeCountElements = document.querySelectorAll('#store-count, [data-store-count]');
    storeCountElements.forEach(element => {
        element.textContent = `+${stores.length}`;
    });

    const updateDisplayedStores = () => {
        const stateFilter = stateSelect.value;
        const searchTerm = searchInput.value.toLowerCase();
        const filteredStores = stores.filter(store => {
            const matchesState = (stateFilter === 'todos') || (store.state === stateFilter);
            const matchesSearch = store.nome.toLowerCase().includes(searchTerm) || 
                                (store.address && store.address.toLowerCase().includes(searchTerm));
            return matchesState && matchesSearch;
        });

        storeList.innerHTML = '';
        
        if (filteredStores.length > 0) {
            initialStorePrompt.classList.add('hidden');
            noStoresMessage.classList.add('hidden');
            storeList.classList.remove('hidden');
            storeCounter.classList.remove('hidden');
            
            // Atualizar contador
            if (storeCount) {
                storeCount.textContent = filteredStores.length;
            }
            
            // Renderizar lojas
            filteredStores.forEach(store => {
                storeList.innerHTML += createStoreCard(store);
            });
        } else {
            initialStorePrompt.classList.add('hidden');
            storeList.classList.add('hidden');
            storeCounter.classList.add('hidden');
            noStoresMessage.classList.remove('hidden');
        }
        observeElements();
    };

    const populateStoreDropdown = () => {
        const availableStates = [...new Set(stores.map(store => store.state))].sort();
        availableStates.forEach(state => {
            const option = document.createElement('option');
            option.value = state;
            option.textContent = state;
            stateSelect.appendChild(option);
        });
    };

    populateStoreDropdown();
    
    stateSelect.addEventListener('change', updateDisplayedStores);
    searchInput.addEventListener('input', updateDisplayedStores);
    
    // Botão "Ver Todas as Lojas"
    if (showAllButton) {
        showAllButton.addEventListener('click', () => {
            stateSelect.value = 'todos';
            searchInput.value = '';
            updateDisplayedStores();
            
            // Scroll suave para a lista
            storeList.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }
}