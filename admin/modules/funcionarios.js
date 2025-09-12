// admin/funcionarios.js
import { supabase } from '../script/supabase-client.js';
import { initializeAuth } from './modules/auth.js';

/**
 * Mostra o dashboard e esconde o login.
 */
function showDashboard() {
    document.getElementById('dashboard').classList.remove('hidden');
    document.getElementById('login-container').classList.add('hidden');
}

/**
 * Mostra o login e esconde o dashboard.
 */
function showLogin() {
    document.getElementById('dashboard').classList.add('hidden');
    document.getElementById('login-container').classList.remove('hidden');
}

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
    console.log("Formulário de funcionário enviado!");

    // Seleciona os valores dos campos do formulário
    const fullName = document.getElementById('full-name').value;
    // Pega o email do campo com o ID CORRETO
    const email = document.getElementById('employee-email').value; 
    const profile = document.getElementById('access-profile').value;

    console.log({
        nome: fullName,
        email: email,
        perfil: profile
    });
    
    alert('Funcionalidade de salvar funcionário ainda não implementada, mas os dados foram capturados no console.');
    // Futuramente, a lógica para salvar os dados no Supabase será adicionada aqui.
}

// Inicia a autenticação e, em seguida, a página.
initializeAuth(
    (user) => { // onUserLoggedIn
        console.log("Utilizador logado:", user.email);
        showDashboard();
        initializePage();
    },
    () => { // onUserLoggedOut
        console.log("Nenhum utilizador logado.");
        showLogin();
    }
);