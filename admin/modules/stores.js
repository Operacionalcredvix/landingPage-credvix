
import { supabase } from '../../script/supabase-client.js';
import * as dom from './dom.js';
import { openStoreModal, closeStoreModal } from './ui.js';

let loadedStores = []; // Estado local do módulo

export function getLoadedStores() {
    return loadedStores;
}

export async function loadStores() {
    dom.storeListTbody.innerHTML = `<tr><td colspan="4">Carregando lojas...</td></tr>`;

    const { data, error } = await supabase.from('lojas').select(`*, vagas(count)`).order('name', { ascending: true });

    if (error) {
        console.error("Erro ao carregar lojas:", error);
        dom.storeListTbody.innerHTML = `<tr><td colspan="4">Erro ao carregar lojas.</td></tr>`;
        return;
    }

    loadedStores = data;
    displayStores();
    populateStoreFilters();
}

export function displayStores() {
    const searchTerm = dom.storeSearchInput.value.toLowerCase();
    const stateFilter = dom.storeStateFilter.value;

    const filteredStores = loadedStores.filter(store =>
        (store.name.toLowerCase().includes(searchTerm)) &&
        (stateFilter === 'todos' || store.state === stateFilter)
    );

    dom.storeListTbody.innerHTML = '';
    if (filteredStores.length === 0) {
        dom.storeListTbody.innerHTML = `<tr><td colspan="4" style="text-align: center;">Nenhuma loja encontrada.</td></tr>`;
        return;
    }

    filteredStores.forEach(store => {
        const vagaCount = store.vagas[0]?.count || 0;
        const row = dom.storeListTbody.insertRow();
        row.innerHTML = `
            <td><strong>${store.name}</strong></td>
            <td>${store.city} / ${store.state}</td>
            <td>${vagaCount}</td>
            <td class="actions">
                <button class="btn btn-info js-edit-store" data-id="${store.id}"><span class="material-icons" style="font-size: 1.1rem;">edit</span>Editar</button>
                <button class="btn btn-danger js-delete-store" data-id="${store.id}" data-vagas="${vagaCount}"><span class="material-icons" style="font-size: 1.1rem;">delete_outline</span>Excluir</button>
            </td>
        `;
    });

    document.querySelectorAll('.js-edit-store').forEach(btn => btn.addEventListener('click', handleEditStore));
    document.querySelectorAll('.js-delete-store').forEach(btn => btn.addEventListener('click', handleDeleteStore));
}

function populateStoreFilters() {
    const states = [...new Set(loadedStores.map(store => store.state))].sort();
    dom.storeStateFilter.innerHTML = '<option value="todos">Todos os Estados</option>';
    states.forEach(state => dom.storeStateFilter.add(new Option(state, state)));

    const cities = [...new Set(loadedStores.map(store => store.city))].sort();
    dom.storeFilterSelect.innerHTML = '<option value="todos">Todas as Cidades</option>';
    cities.forEach(city => dom.storeFilterSelect.add(new Option(city, city)));

    dom.jobStoreSelect.innerHTML = '<option value="" disabled selected>Selecione a Loja</option>';
    loadedStores.forEach(store => dom.jobStoreSelect.add(new Option(store.name, store.id)));
}

export async function handleStoreFormSubmit(event) {
    event.preventDefault();
    const storeId = dom.storeIdInput.value;
    const storeData = {
        name: document.getElementById('store-name').value,
        city: document.getElementById('store-city').value,
        state: document.getElementById('store-state').value,
        address: document.getElementById('store-address').value,
        phone: document.getElementById('store-phone').value,
        whatsapp: document.getElementById('store-whatsapp').value,
        instagram_url: document.getElementById('store-instagram').value
    };

    const { error } = storeId
        ? await supabase.from('lojas').update(storeData).eq('id', storeId)
        : await supabase.from('lojas').insert([storeData]);

    if (error) {
        alert("Ocorreu um erro ao salvar a loja.");
        console.error(error);
    } else {
        closeStoreModal();
        await loadStores();
    }
}

function handleEditStore(event) {
    const id = event.currentTarget.dataset.id;
    const store = loadedStores.find(s => s.id == id);
    if (!store) return;
    dom.storeModalTitle.textContent = 'Editar Loja';
    dom.storeIdInput.value = store.id;
    document.getElementById('store-name').value = store.name;
    document.getElementById('store-city').value = store.city;
    document.getElementById('store-state').value = store.state;
    document.getElementById('store-address').value = store.address;
    document.getElementById('store-phone').value = store.phone;
    document.getElementById('store-whatsapp').value = store.whatsapp;
    document.getElementById('store-instagram').value = store.instagram_url;
    openStoreModal();
}

async function handleDeleteStore(event) {
    const id = event.currentTarget.dataset.id;
    const vagaCount = parseInt(event.currentTarget.dataset.vagas, 10);
    if (vagaCount > 0) {
        alert(`Não é possível excluir esta loja, pois ela possui ${vagaCount} vaga(s) associada(s).`);
        return;
    }
    if (confirm('Tem certeza que deseja excluir esta loja?')) {
        const { error } = await supabase.from('lojas').delete().eq('id', id);
        if (error) {
            alert("Ocorreu um erro ao excluir a loja.");
            console.error(error);
        } else {
            await loadStores();
        }
    }
}