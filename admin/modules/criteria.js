// admin/modules/criteria.js (Versão Final Corrigida)
import { supabase } from '../../script/supabase-client.js';
import * as dom from './dom.js';

let tagify; // Variável para guardar a instância da biblioteca de tags

/**
 * Inicializa a biblioteca Tagify no campo de input.
 */
function initializeTagify() {
    if (!dom.criteriaText) return;

    tagify = new Tagify(dom.criteriaText, {
        delimiters: ',|Enter', // Permite criar tags com vírgula ou Enter
        // ATUALIZADO: Inicia o campo como 'apenas leitura' (desativado) através do método da biblioteca
        readOnly: true 
    });
}

/**
 * Carrega as tags de critérios para a loja selecionada.
 */
async function loadCriteriaForStore() {
    const storeId = dom.criteriaStoreSelect.value;
    
    tagify.removeAllTags(); 
    dom.criteriaStatusMessage.textContent = '';

    if (!storeId) {
        // Desativa o campo e o botão se nenhuma loja estiver selecionada
        tagify.setReadonly(true);
        tagify.DOM.input.placeholder = 'Selecione uma loja para começar...';
        dom.criteriaSubmitBtn.disabled = true;
        return;
    }

    // Ativa o campo e o botão quando uma loja é selecionada
    tagify.setReadonly(false);
    tagify.DOM.input.placeholder = 'Adicione um critério e pressione Enter...';
    dom.criteriaSubmitBtn.disabled = false;
    dom.criteriaStatusMessage.textContent = 'A carregar critérios...';

    const { data, error } = await supabase
        .from('criterio_tags')
        .select('tag_texto')
        .eq('loja_id', storeId);

    if (error) {
        console.error("Erro ao carregar critérios:", error);
        dom.criteriaStatusMessage.textContent = 'Erro ao carregar.';
    } else if (data && data.length > 0) {
        const tags = data.map(item => item.tag_texto);
        tagify.loadOriginalValues(tags);
        dom.criteriaStatusMessage.textContent = 'Critérios carregados.';
    } else {
        dom.criteriaStatusMessage.textContent = 'Nenhum critério definido para esta loja ainda.';
    }
}

async function populateStoreDropdown() {
    const { data: stores, error } = await supabase.from('lojas').select('id, nome').order('nome');
    if (error) {
        console.error("Erro ao carregar lojas:", error);
        dom.criteriaStoreSelect.innerHTML = '<option value="">Não foi possível carregar as lojas</option>';
        return;
    }

    dom.criteriaStoreSelect.innerHTML = '<option value="">Selecione uma loja...</option>';
    stores.forEach(store => {
        const option = new Option(store.nome, store.id);
        dom.criteriaStoreSelect.add(option);
    });
}

/**
 * Salva as tags de critérios no banco de dados.
 */
async function handleCriteriaFormSubmit(event) {
    event.preventDefault();
    const storeId = dom.criteriaStoreSelect.value;
    
    const tagsToSave = tagify.value.map(tag => ({
        loja_id: storeId,
        tag_texto: tag.value
    }));

    if (!storeId) {
        alert('Por favor, selecione uma loja.');
        return;
    }

    dom.criteriaStatusMessage.textContent = 'A salvar...';
    dom.criteriaSubmitBtn.disabled = true;

    // Estratégia de Sincronização: Apagar todos os critérios antigos para esta loja
    const { error: deleteError } = await supabase
        .from('criterio_tags')
        .delete()
        .eq('loja_id', storeId);

    if (deleteError) {
        console.error("Erro ao apagar critérios antigos:", deleteError);
        dom.criteriaStatusMessage.textContent = `Erro: ${deleteError.message}`;
        dom.criteriaSubmitBtn.disabled = false;
        return;
    }

    // Insere os novos critérios, se houver algum
    if (tagsToSave.length > 0) {
        const { error: insertError } = await supabase
            .from('criterio_tags')
            .insert(tagsToSave);

        if (insertError) {
            console.error("Erro ao salvar novos critérios:", insertError);
            dom.criteriaStatusMessage.textContent = `Erro: ${insertError.message}`;
        } else {
            dom.criteriaStatusMessage.textContent = 'Critérios salvos com sucesso!';
        }
    } else {
        dom.criteriaStatusMessage.textContent = 'Todos os critérios foram removidos.';
    }
    
    dom.criteriaSubmitBtn.disabled = false;
}

export function initializeCriteria() {
    if (dom.criteriaForm) {
        initializeTagify();
        populateStoreDropdown();
        dom.criteriaStoreSelect.addEventListener('change', loadCriteriaForStore);
        dom.criteriaForm.addEventListener('submit', handleCriteriaFormSubmit);
    }
}