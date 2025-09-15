import { supabase } from '../../script/supabase-client.js';
import { initializeAuth } from './auth.js';

// --- Funções de UI ---
function showDashboard() {
    document.getElementById('dashboard')?.classList.remove('hidden');
    document.getElementById('login-container')?.classList.add('hidden');
}
function showLogin() {
    document.getElementById('dashboard')?.classList.add('hidden');
    document.getElementById('login-container')?.remove('hidden');
}

// --- Funções de Lógica do Formulário ---

/**
 * Limpa o formulário e o reconfigura para o modo de criação.
 */
function resetFormToCreateMode() {
    document.getElementById('employee-form').reset();
    document.getElementById('employee-id').value = '';
    document.getElementById('vinculo-id').value = '';

    document.getElementById('form-title').textContent = 'Novo Cadastro';
    document.getElementById('form-subtitle').textContent = 'Preencha os dados do novo funcionário.';
    document.getElementById('form-action-btn').textContent = 'Salvar Novo Funcionário';
    document.getElementById('clear-form-btn').classList.add('hidden');
    
    // Reseta e desabilita os selects dependentes
    const liderSelect = document.getElementById('lider-select');
    const regionalSelect = document.getElementById('regional-select');
    const lojaSelect = document.getElementById('loja-select');
    
    [liderSelect, regionalSelect, lojaSelect].forEach(el => {
        el.disabled = true;
        el.innerHTML = '<option value="">Selecione o perfil primeiro</option>';
    });
}

/**
 * Preenche o formulário com os dados de um funcionário para edição.
 * @param {object} employee - O objeto do funcionário com seus dados.
 */
async function populateFormForEdit(employee) {
    resetFormToCreateMode();

    // Preenche os campos simples
    document.getElementById('employee-id').value = employee.id;
    document.getElementById('full-name').value = employee.nome_completo;
    document.getElementById('employee-email').value = employee.email;
    document.getElementById('employee-status-toggle').checked = employee.is_active;

    // Preenche o perfil e aguarda a conclusão
    document.getElementById('perfil-select').value = employee.perfil_id;
    
    // Dispara o evento 'change' para carregar as dependências
    document.getElementById('perfil-select').dispatchEvent(new Event('change'));

    // Aguarda um pequeno intervalo para os campos dependentes serem populados
    await new Promise(resolve => setTimeout(resolve, 300));

    // Preenche os campos dependentes
    if (employee.regional_id) {
        document.getElementById('regional-select').value = employee.regional_id;
        document.getElementById('regional-select').dispatchEvent(new Event('change'));
        await new Promise(resolve => setTimeout(resolve, 300)); // Aguarda lojas carregarem
    }
    if (employee.loja_id) {
        document.getElementById('loja-select').value = employee.loja_id;
    }
    if (employee.gerente_id) {
        document.getElementById('lider-select').value = employee.gerente_id;
    }

    // Busca o vínculo mais recente para preencher as datas
    const { data: vinculo, error } = await supabase
        .from('historico_vinculos')
        .select('*')
        .eq('funcionario_id', employee.id)
        .is('data_saida', null) // Busca o vínculo ativo
        .single();
    
    if (vinculo) {
        document.getElementById('vinculo-id').value = vinculo.id;
        document.getElementById('admission-date').value = vinculo.data_admissao;
        document.getElementById('exit-date').value = vinculo.data_saida || '';
    }

    // Ajusta a UI para o modo de edição
    document.getElementById('form-title').textContent = 'Editar Cadastro';
    document.getElementById('form-subtitle').textContent = `Você está editando o perfil de ${employee.nome_completo}.`;
    document.getElementById('form-action-btn').textContent = 'Atualizar Cadastro';
    document.getElementById('clear-form-btn').classList.remove('hidden');

    // Rola a tela para o formulário
    document.getElementById('form-title').scrollIntoView({ behavior: 'smooth' });
}

// --- Funções de Carregamento de Dados ---

async function populatePerfis() { /* ... (código existente, sem alterações) ... */ }
async function populateRegionais() { /* ... (código existente, sem alterações) ... */ }
async function populateLojas(regionalId) { /* ... (código existente, sem alterações) ... */ }
async function populateLideres(perfilLiderNome) { /* ... (código existente, sem alterações) ... */ }

// --- Lógica de Busca e Listagem ---

/**
 * Busca funcionários no banco de dados com base em um termo de pesquisa.
 */
async function searchEmployees() {
    const searchTerm = document.getElementById('search-employee-input').value.trim();
    const tbody = document.getElementById('employee-list-tbody');
    const noResultsMessage = document.getElementById('no-employee-found-message');

    tbody.innerHTML = '<tr><td colspan="5">Buscando...</td></tr>';
    noResultsMessage.classList.add('hidden');

    let query = supabase.from('funcionarios').select(`
        id, nome_completo, email, is_active,
        perfis ( nome ),
        lojas ( nome )
    `);

    if (searchTerm) {
        query = query.or(`nome_completo.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`);
    }
    
    query = query.order('nome_completo');

    const { data: employees, error } = await query;

    tbody.innerHTML = '';
    if (error || employees.length === 0) {
        noResultsMessage.classList.remove('hidden');
        if(error) console.error("Erro ao buscar funcionários:", error);
        return;
    }

    employees.forEach(employee => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${employee.nome_completo}</td>
            <td>${employee.perfis?.nome || 'N/A'}</td>
            <td>${employee.lojas?.nome || 'N/A'}</td>
            <td><span class="${employee.is_active ? 'status-active' : 'status-inactive'}">${employee.is_active ? 'Ativo' : 'Inativo'}</span></td>
            <td><button class="btn btn-info btn-sm js-edit-employee" data-id="${employee.id}">Editar</button></td>
        `;
    });

    // Adiciona event listeners aos novos botões de editar
    document.querySelectorAll('.js-edit-employee').forEach(button => {
        button.addEventListener('click', async (e) => {
            const id = e.target.dataset.id;
            const employeeToEdit = employees.find(emp => emp.id == id);
            if (employeeToEdit) {
                populateFormForEdit(employeeToEdit);
            }
        });
    });
}

// --- Funções de Manipulação de Eventos ---

function handlePerfilChange(event) { /* ... (código existente, sem alterações) ... */ }
function handleRegionalChange(event) { /* ... (código existente, sem alterações) ... */ }
function handleStatusToggle() { /* ... (código existente, sem alterações) ... */ }

/**
 * Lida com o envio do formulário, diferenciando entre CRIAÇÃO e ATUALIZAÇÃO.
 */
async function handleEmployeeFormSubmit(event) {
    event.preventDefault();
    const saveButton = document.getElementById('form-action-btn');
    saveButton.disabled = true;
    const originalButtonText = saveButton.textContent;
    saveButton.textContent = 'A salvar...';

    const employeeId = document.getElementById('employee-id').value;
    const vinculoId = document.getElementById('vinculo-id').value;

    try {
        const funcionarioData = {
            nome_completo: document.getElementById('full-name').value,
            email: document.getElementById('employee-email').value,
            perfil_id: document.getElementById('perfil-select').value,
            regional_id: document.getElementById('regional-select').value || null,
            loja_id: document.getElementById('loja-select').value || null,
            gerente_id: document.getElementById('lider-select').value || null,
            is_active: document.getElementById('employee-status-toggle').checked
        };
        const vinculoData = {
            data_admissao: document.getElementById('admission-date').value,
            data_saida: document.getElementById('exit-date').value || null
        };
        
        if (employeeId) {
            // --- MODO DE ATUALIZAÇÃO ---
            const { error: funcError } = await supabase.from('funcionarios').update(funcionarioData).eq('id', employeeId);
            if (funcError) throw funcError;

            const { error: vincError } = await supabase.from('historico_vinculos').update(vinculoData).eq('id', vinculoId);
            if (vincError) throw vincError;

            alert('Funcionário atualizado com sucesso!');
        } else {
            // --- MODO DE CRIAÇÃO ---
            const { data: novoFuncionario, error: funcError } = await supabase.from('funcionarios').insert(funcionarioData).select().single();
            if (funcError) throw funcError;

            const { error: vincError } = await supabase.from('historico_vinculos').insert({ ...vinculoData, funcionario_id: novoFuncionario.id });
            if (vincError) throw vincError;

            alert('Funcionário cadastrado com sucesso!');
        }
        
        resetFormToCreateMode();
        searchEmployees(); // Atualiza a lista

    } catch (error) {
        console.error('Erro ao salvar funcionário:', error);
        alert(`Ocorreu um erro: ${error.message}`);
    } finally {
        saveButton.disabled = false;
        saveButton.textContent = originalButtonText;
    }
}


// --- Função Principal de Inicialização ---
async function initializePage() {
    await Promise.all([ populatePerfis(), populateRegionais() ]);
    
    // Listeners
    document.getElementById('perfil-select')?.addEventListener('change', handlePerfilChange);
    document.getElementById('regional-select')?.addEventListener('change', handleRegionalChange);
    document.getElementById('employee-form')?.addEventListener('submit', handleEmployeeFormSubmit);
    document.getElementById('employee-status-toggle')?.addEventListener('change', handleStatusToggle);
    document.getElementById('search-employee-input')?.addEventListener('input', searchEmployees);
    document.getElementById('clear-form-btn')?.addEventListener('click', resetFormToCreateMode);

    // Carga inicial
    searchEmployees(); // Busca todos os funcionários ao carregar a página
}

// Inicia a autenticação e, em seguida, a página.
initializeAuth(
    (user) => { 
        showDashboard();
        initializePage();
    },
    () => { 
        showLogin();
    }
);