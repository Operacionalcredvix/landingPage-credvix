// Caminho: /script/storeLocator.js
import { supabase } from './supabase-client.js';
import { observeElements } from './animations.js';

function createStoreCard(store) {
    const whatsappNumber = store.whatsapp ? store.whatsapp.replace(/\D/g, '') : '';
    const whatsappMessage = encodeURIComponent(`Oi, encontrei a loja ${store.nome} pelo site e gostaria de mais informações!`);
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;
    const hasInstagram = Boolean(store.instagram_url && String(store.instagram_url).trim());

    return `
        <div class="bg-white rounded-2xl shadow-lg hover:shadow-xl overflow-hidden flex flex-col transform hover:-translate-y-1 transition-all duration-300 animate-on-scroll border">
            <div class="p-6 flex flex-col flex-grow">
                <div class="flex justify-between items-start mb-4"><h3 class="text-xl font-bold text-gray-800 pr-2">${store.nome}</h3><span class="bg-help-purple text-white text-xs font-bold px-2 py-1 rounded-md flex-shrink-0">${store.state}</span></div>
                <div class="space-y-3 text-gray-600 flex-grow">
                    <div class="flex items-start">
                        <span class="material-icons text-credvix-orange mr-2 mt-1 flex-shrink-0">location_on</span>
                        <span>${store.address || ''}</span>
                    </div>
                    <div class="flex items-center">
                        <span class="material-icons text-credvix-orange mr-2">call</span>
                        <span class="font-semibold">${store.phone || ''}</span>
                    </div>
                </div>
                <div class="mt-auto pt-4 border-t">
                    <div class="flex items-center space-x-2">
                        <a href="${whatsappLink}" target="_blank" rel="noopener noreferrer" title="Contatar no WhatsApp" class="bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition-colors duration-300 flex items-center justify-center space-x-2 text-sm font-semibold flex-grow">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.886-.001 2.267.651 4.383 1.803 6.151l-1.217 4.439 4.562-1.192zM12.07 9.15c-.244-.123-1.448-.714-1.674-.795-.225-.082-.39-.123-.554.124-.165.246-.633.795-.776.959-.143.164-.287.185-.531.062-.244-.123-.488-.185-1.032-.617-.544-.432-.902-1.02-1.02-1.184-.118-.164-.025-.246.082-.369.082-.102.185-.267.287-.432.102-.164.143-.287.205-.471.062-.185.021-.349-.041-.471-.062-.123-.554-1.329-.757-1.826-.205-.496-.41-.432-.554-.432-.143 0-.307-.021-.471-.021-.164 0-.432.062-.657.328-.225.267-.862.84-.862 2.046 0 1.206.082 2.372 1.005 2.536.123.164 1.738 2.66 4.205 3.72.596.246 1.054.389 1.416.51.544.185.962.164 1.325.102.41-.062 1.448-.592 1.651-1.164.205-.572.205-1.054.143-1.164-.062-.102-.225-.164-.471-.287z"/></svg><span>WhatsApp</span>
                        </a>
                        ${hasInstagram ? `
                        <a href="${store.instagram_url}" target="_blank" rel="noopener noreferrer" title="Visitar Instagram" class="instagram-btn p-2 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.689-.073-4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44 1.441-.645 1.441-1.44-.645-1.44-1.441-1.44z"/></svg>
                        </a>` : ''}
                    </div>
                </div>
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

    if (!stateSelect || !searchInput || !storeList || !noStoresMessage) {
        return;
    }

    // A LINHA ABAIXO FOI CORRIGIDA
    const { data: stores, error } = await supabase.from('lojas').select('*').order('nome');

    if (error) {
        console.error("Erro ao buscar lojas:", error);
        noStoresMessage.innerHTML = "<p>Não foi possível carregar as lojas no momento. Tente novamente mais tarde.</p>";
        noStoresMessage.classList.remove('hidden');
        initialStorePrompt.classList.add('hidden');
        return;
    }

    const updateDisplayedStores = () => {
        const stateFilter = stateSelect.value;
        const searchTerm = searchInput.value.toLowerCase();
        const filteredStores = stores.filter(store => {
            const matchesState = (stateFilter === 'todos') || (store.state === stateFilter);
            // CORRIGIDO PARA USAR 'nome'
            const matchesSearch = store.nome.toLowerCase().includes(searchTerm) || (store.address && store.address.toLowerCase().includes(searchTerm));
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
}