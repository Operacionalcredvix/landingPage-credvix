// admin/modules/criteria.js (Versão Final com seleção de Cargo)
import { supabase } from '../../script/supabase-client.js';
import * as dom from './dom.js';

let tagify; // Variável para guardar a instância da biblioteca de tags

/**
 * Inicializa a biblioteca Tagify no campo de input.
 */
function initializeTagify() {
    if (!dom.criteriaText) return;

    tagify = new Tagify(dom.criteriaText, {
        delimiters: ',|Enter',
        readOnly: true // Começa desativado
    });
}

/**
 * Carrega as tags de critérios para a loja e cargo selecionados.
 */
async function loadCriteria() {
    const storeId = dom.criteriaStoreSelect.value;
    const role = dom.criteriaRoleSelect.value;
    
    tagify.removeAllTags(); 
    dom.criteriaStatusMessage.textContent = '';

    // Validação para garantir que loja e cargo foram selecionados
    if (!storeId || !role) {
        tagify.setReadonly(true);
        tagify.DOM.input.placeholder = 'Selecione uma loja e um cargo para começar...';
        dom.criteriaSubmitBtn.disabled = true;
        return;
    }

    // Ativa os campos
    tagify.setReadonly(false);
    tagify.DOM.input.placeholder = 'Adicione um critério e pressione Enter...';
    dom.criteriaSubmitBtn.disabled = false;
    dom.criteriaStatusMessage.textContent = 'A carregar critérios...';

    const { data, error } = await supabase
        .from('criterio_tags')
        .select('tag_texto')
        .eq('loja_id', storeId)
        .eq('cargo', role); // << NOVO: Filtra também pelo cargo

    if (error) {
        console.error("Erro ao carregar critérios:", error);
        dom.criteriaStatusMessage.textContent = 'Erro ao carregar.';
    } else if (data && data.length > 0) {
        const tags = data.map(item => item.tag_texto);
        tagify.loadOriginalValues(tags);
        dom.criteriaStatusMessage.textContent = 'Critérios carregados.';
    } else {
        dom.criteriaStatusMessage.textContent = `Nenhum critério definido para ${role} nesta loja.`;
    }
}

/**
 * Popula o dropdown de lojas.
 */
async function populateStoreDropdown() {
    const { data: stores, error } = await supabase.from('lojas').select('id, nome').order('nome');
    if (error) {
        console.error("Erro ao carregar lojas:", error);
        dom.criteriaStoreSelect.innerHTML = '<option value="">Não foi possível carregar</option>';
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
    const role = dom.criteriaRoleSelect.value; // << NOVO: Pega o valor do cargo

    if (!storeId || !role) {
        alert('Por favor, selecione uma loja e um cargo.');
        return;
    }

    // Adiciona o cargo a cada tag que será salva
    const tagsToSave = tagify.value.map(tag => ({
        loja_id: storeId,
        tag_texto: tag.value,
        cargo: role // << NOVO: Inclui o cargo no objeto
    }));

    dom.criteriaStatusMessage.textContent = 'A salvar...';
    dom.criteriaSubmitBtn.disabled = true;

    // Estratégia de Sincronização: Apaga todos os critérios antigos para esta loja E este cargo
    const { error: deleteError } = await supabase
        .from('criterio_tags')
        .delete()
        .eq('loja_id', storeId)
        .eq('cargo', role); // << NOVO: Deleta apenas os do cargo selecionado

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
        dom.criteriaStatusMessage.textContent = 'Todos os critérios foram removidos para este cargo.';
    }
    
    dom.criteriaSubmitBtn.disabled = false;
}


/**
 * Habilita ou desabilita o seletor de cargo.
 */
function handleStoreChange() {
    if (dom.criteriaStoreSelect.value) {
        dom.criteriaRoleSelect.disabled = false;
        dom.criteriaRoleSelect.value = ''; // Reseta a seleção de cargo
        dom.criteriaRoleSelect.querySelector('option[value=""]').textContent = "Selecione um cargo...";
    } else {
        dom.criteriaRoleSelect.disabled = true;
        dom.criteriaRoleSelect.value = '';
        dom.criteriaRoleSelect.querySelector('option[value=""]').textContent = "Selecione uma loja primeiro...";
    }
    loadCriteria(); // Tenta carregar os critérios (que irá falhar e resetar o campo de tags)
}

/**
 * Inicializa toda a funcionalidade da página de critérios.
 */
export function initializeCriteria() {
    if (dom.criteriaForm) {
        initializeTagify();
        populateStoreDropdown();
        // Adiciona os event listeners para os dois seletores
        dom.criteriaStoreSelect.addEventListener('change', handleStoreChange);
        dom.criteriaRoleSelect.addEventListener('change', loadCriteria);
        dom.criteriaForm.addEventListener('submit', handleCriteriaFormSubmit);
    }
}