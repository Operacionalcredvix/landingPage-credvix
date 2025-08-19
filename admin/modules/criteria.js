import { supabase } from '../../script/supabase-client.js';
import * as dom from './dom.js';

async function populateStoreDropdown() {
    const { data: stores, error } = await supabase.from('lojas').select('id, nome').order('nome');
    if (error) {
        console.error("Erro ao carregar lojas para o dropdown:", error);
        dom.criteriaStoreSelect.innerHTML = '<option value="">Não foi possível carregar as lojas</option>';
        return;
    }

    dom.criteriaStoreSelect.innerHTML = '<option value="">Selecione uma loja para definir os critérios</option>';
    stores.forEach(store => {
        const option = new Option(store.nome, store.id);
        dom.criteriaStoreSelect.add(option);
    });
}

async function loadCriteriaForStore() {
    const storeId = dom.criteriaStoreSelect.value;
    dom.criteriaText.value = '';
    dom.criteriaStatusMessage.textContent = '';

    if (!storeId) {
        dom.criteriaText.disabled = true;
        dom.criteriaSubmitBtn.disabled = true;
        return;
    }

    dom.criteriaText.disabled = false;
    dom.criteriaSubmitBtn.disabled = false;
    dom.criteriaStatusMessage.textContent = 'A carregar critérios...';

    const { data, error } = await supabase
        .from('loja_criterios')
        .select('criterios')
        .eq('loja_id', storeId)
        .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
        console.error("Erro ao carregar critérios:", error);
        dom.criteriaStatusMessage.textContent = 'Erro ao carregar.';
    } else if (data) {
        dom.criteriaText.value = data.criterios;
        dom.criteriaStatusMessage.textContent = 'Critérios carregados.';
    } else {
        dom.criteriaStatusMessage.textContent = 'Nenhum critério definido para esta loja ainda.';
    }
}

async function handleCriteriaFormSubmit(event) {
    event.preventDefault();
    const storeId = dom.criteriaStoreSelect.value;
    const criteriosText = dom.criteriaText.value;

    if (!storeId || !criteriosText) {
        alert('Por favor, selecione uma loja e preencha os critérios.');
        return;
    }

    dom.criteriaStatusMessage.textContent = 'A salvar...';
    dom.criteriaSubmitBtn.disabled = true;

    const { error } = await supabase
        .from('loja_criterios')
        .upsert({
            loja_id: storeId,
            criterios: criteriosText
        }, { onConflict: 'loja_id' });

    if (error) {
        console.error("Erro ao salvar critérios:", error);
        dom.criteriaStatusMessage.textContent = `Erro ao salvar: ${error.message}`;
    } else {
        dom.criteriaStatusMessage.textContent = 'Critérios salvos com sucesso!';
    }
    
    dom.criteriaSubmitBtn.disabled = false;
}

export function initializeCriteria() {
    if (dom.criteriaForm) {
        populateStoreDropdown();
        dom.criteriaStoreSelect.addEventListener('change', loadCriteriaForStore);
        dom.criteriaForm.addEventListener('submit', handleCriteriaFormSubmit);
    }
}