// admin/funcionarios.js
import { supabase } from '../script/supabase-client.js';

/**
 * Função para carregar dados iniciais, como preencher a lista de lojas.
 */
async function initializePage() {
    console.log("A inicializar a página de funcionários...");

    const storeSelect = document.getElementById('store-employee');
    if (!storeSelect) return;

    // Busca as lojas para preencher o <select>
    const { data: stores, error } = await supabase
        .from('lojas')
        .select('id, nome')
        .order('nome', { ascending: true });

    if (error) {
        console.error("Erro ao carregar lojas:", error);
        return;
    }

    // Limpa opções antigas e adiciona as novas
    storeSelect.innerHTML = '<option value="">Selecione a loja (após a regional)</option>';
    stores.forEach(store => {
        storeSelect.add(new Option(store.nome, store.id));
    });

    // Adicionar listener para o formulário
    const employeeForm = document.getElementById('employee-form');
    if (employeeForm) {
        employeeForm.addEventListener('submit', handleEmployeeFormSubmit);
    }
}

/**
 * Manipula o envio do formulário de cadastro de funcionário.
 */
async function handleEmployeeFormSubmit(event) {
    event.preventDefault();
    alert('Funcionalidade de salvar funcionário ainda não implementada.');
    // Futuramente, a lógica para salvar os dados no Supabase será adicionada aqui.
}

// Inicia a página quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', initializePage);