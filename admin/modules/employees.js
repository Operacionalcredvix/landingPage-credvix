import { supabase } from '../../script/supabase-client.js';
import * as dom from './dom.js';

/**
 * Função para carregar dados iniciais da tela de funcionários, como
 * preencher a lista de lojas no formulário.
 */
export async function loadEmployees() {
    console.log("A carregar dados para a tela de funcionários...");

    const storeSelect = document.getElementById('store-employee');
    if (!storeSelect) return;

    // Busca as lojas para preencher o <select>
    const { data: stores, error } = await supabase
        .from('lojas')
        .select('id, nome')
        .order('nome', { ascending: true });

    if (error) {
        console.error("Erro ao carregar lojas para o formulário de funcionário:", error);
        return;
    }

    // Limpa opções antigas e adiciona as novas
    storeSelect.innerHTML = '<option value="">Selecione a loja</option>';
    stores.forEach(store => {
        storeSelect.add(new Option(store.nome, store.id));
    });

    console.log("Dados da tela de funcionários carregados.");
}

/**
 * Manipula o envio do formulário de cadastro de funcionário.
 * (Esta função será implementada no futuro)
 */
export async function handleEmployeeFormSubmit(event) {
    event.preventDefault();
    alert('Funcionalidade de salvar funcionário ainda não implementada.');
    // Aqui entrará a lógica para salvar os dados no Supabase
}