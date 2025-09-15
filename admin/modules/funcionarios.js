import { supabase } from '../../script/supabase-client.js';
import { initializeAuth } from './auth.js';

// --- Funções de UI ---
function showDashboard() {
    document.getElementById('dashboard')?.classList.remove('hidden');
    document.getElementById('login-container')?.classList.add('hidden');
}
function showLogin() {
    document.getElementById('dashboard')?.classList.add('hidden');
    document.getElementById('login-container')?.classList.remove('hidden');
}

// --- Funções de Lógica do Formulário ---
function preencherFormularioEndereco(data) {
    if (data.erro) {
        alert("CEP não encontrado. Por favor, verifique o número digitado.");
        document.getElementById('cep').value = '';
        return;
    }
    document.getElementById('address').value = data.logradouro || '';
    document.getElementById('neighborhood').value = data.bairro || '';
    document.getElementById('city').value = data.localidade || '';
    document.getElementById('state').value = data.uf || '';
}

async function consultarCEP() {
    const cepInput = document.getElementById('cep');
    const cep = cepInput.value.replace(/\D/g, '');
    if (cep.length !== 8) return;
    cepInput.disabled = true;
    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        preencherFormularioEndereco(data);
        document.getElementById('address-number').focus();
    } catch (error) {
        console.error("Erro ao consultar o CEP:", error);
        alert("Não foi possível consultar o CEP. Tente novamente.");
    } finally {
        cepInput.disabled = false;
    }
}

function resetFormToCreateMode() {
    document.getElementById('employee-form').reset();
    document.getElementById('employee-id').value = '';
    document.getElementById('vinculo-id').value = '';
    document.getElementById('form-title').textContent = 'Novo Cadastro';
    document.getElementById('form-subtitle').textContent = 'Preencha os dados do novo funcionário.';
    document.getElementById('form-action-btn').textContent = 'Salvar Novo Funcionário';
    document.getElementById('clear-form-btn').classList.add('hidden');
    
    const liderSelect = document.getElementById('lider-select');
    const regionalSelect = document.getElementById('regional-select');
    const lojaSelect = document.getElementById('loja-select');
    
    [liderSelect, regionalSelect, lojaSelect].forEach(el => {
        el.disabled = true;
        el.innerHTML = '<option value="">Selecione o perfil primeiro</option>';
    });
    document.getElementById('perfil-select').dispatchEvent(new Event('change'));
}

async function populateFormForEdit(employee) {
    document.getElementById('employee-id').value = employee.id;
    document.getElementById('full-name').value = employee.nome_completo;
    document.getElementById('birth-date').value = employee.data_nascimento;
    document.getElementById('mother-name').value = employee.nome_mae;
    document.getElementById('cpf').value = employee.cpf;
    document.getElementById('employee-email').value = employee.email;
    document.getElementById('phone').value = employee.telefone;
    document.getElementById('cep').value = employee.cep;
    document.getElementById('address').value = employee.endereco;
    document.getElementById('address-number').value = employee.numero_endereco;
    document.getElementById('address-complement').value = employee.complemento_endereco;
    document.getElementById('neighborhood').value = employee.bairro;
    document.getElementById('city').value = employee.cidade;
    document.getElementById('state').value = employee.estado;
    document.getElementById('employee-status-toggle').checked = employee.is_active;

    const { data: vinculo } = await supabase.from('historico_vinculos').select('*').eq('funcionario_id', employee.id).order('data_admissao', { ascending: false }).limit(1).single();
    if (vinculo) {
        document.getElementById('vinculo-id').value = vinculo.id;
        document.getElementById('admission-date').value = vinculo.data_admissao;
        document.getElementById('exit-date').value = vinculo.data_saida || '';
    }

    document.getElementById('perfil-select').value = employee.perfil_id;
    document.getElementById('perfil-select').dispatchEvent(new Event('change'));

    await new Promise(resolve => setTimeout(resolve, 300));
    if (employee.regional_id) {
        document.getElementById('regional-select').value = employee.regional_id;
        document.getElementById('regional-select').dispatchEvent(new Event('change'));
        await new Promise(resolve => setTimeout(resolve, 300));
    }
    if (employee.loja_id) document.getElementById('loja-select').value = employee.loja_id;
    if (employee.gerente_id) document.getElementById('lider-select').value = employee.gerente_id;

    document.getElementById('form-title').textContent = 'Editar Cadastro';
    document.getElementById('form-subtitle').textContent = `Você está editando o perfil de ${employee.nome_completo}.`;
    document.getElementById('form-action-btn').textContent = 'Atualizar Cadastro';
    document.getElementById('clear-form-btn').classList.remove('hidden');
    document.getElementById('form-title').scrollIntoView({ behavior: 'smooth' });
}

// --- Funções de Carregamento de Dados ---
async function populatePerfis() {
    const select = document.getElementById('perfil-select');
    const { data, error } = await supabase.from('perfis').select('id, nome').order('id');
    if (error) { select.innerHTML = '<option value="">Erro ao carregar</option>'; return; }
    select.innerHTML = '<option value="">Selecione o perfil</option>';
    data.forEach(p => select.add(new Option(p.nome, p.id)));
}

async function populateRegionais() {
    const select = document.getElementById('regional-select');
    const { data, error } = await supabase.from('regionais').select('id, nome_regional').order('nome_regional');
    if (error) { select.innerHTML = '<option value="">Erro ao carregar</option>'; return; }
    select.innerHTML = '<option value="">Selecione a regional</option>';
    data.forEach(r => select.add(new Option(r.nome_regional, r.id)));
}

async function populateLojas(regionalId) {
    const select = document.getElementById('loja-select');
    select.disabled = true;
    const { data, error } = await supabase.from('lojas').select('id, nome').eq('regional_id', regionalId).order('nome');
    if (error) { select.innerHTML = '<option value="">Erro</option>'; return; }
    select.innerHTML = '<option value="">Selecione a loja</option>';
    data.forEach(l => select.add(new Option(l.nome, l.id)));
    select.disabled = false;
}

async function populateLideres(perfilLiderNome) {
    const select = document.getElementById('lider-select');
    const { data: p } = await supabase.from('perfis').select('id').eq('nome', perfilLiderNome).single();
    if (!p) { select.innerHTML = '<option value="">Erro</option>'; return; }
    const { data: funcs } = await supabase.from('funcionarios').select('id, nome_completo').eq('perfil_id', p.id).eq('is_active', true);
    if (!funcs) { select.innerHTML = '<option value="">Erro</option>'; return; }
    select.innerHTML = `<option value="">Selecione o ${perfilLiderNome.toLowerCase()}</option>`;
    funcs.forEach(f => select.add(new Option(f.nome_completo, f.id)));
}

// --- Lógica de Busca ---
async function searchEmployees() {
    const searchTerm = document.getElementById('search-employee-input').value.trim();
    const tbody = document.getElementById('employee-list-tbody');
    const noResultsMsg = document.getElementById('no-employee-found-message');

    tbody.innerHTML = '';
    noResultsMsg.classList.add('hidden');

    if (!searchTerm) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; color:#6c757d;">Digite para buscar um funcionário.</td></tr>';
        return;
    }

    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Buscando...</td></tr>';
    
    const { data: employees, error } = await supabase
        .from('funcionarios')
        .select(`*, perfis(nome), lojas(nome)`)
        .or(`nome_completo.ilike.%${searchTerm}%,cpf.ilike.%${searchTerm}%`)
        .order('nome_completo');

    tbody.innerHTML = '';
    if (error || employees.length === 0) {
        noResultsMsg.classList.remove('hidden');
        if (error) console.error(error);
        return;
    }
    
    employees.forEach(employee => {
        const row = tbody.insertRow();
        const statusClass = employee.is_active ? 'status-active' : 'status-inactive';
        row.innerHTML = `
            <td>${employee.nome_completo}</td>
            <td>${employee.perfis?.nome || 'N/A'}</td>
            <td>${employee.lojas?.nome || 'N/A'}</td>
            <td><span class="${statusClass}">${employee.is_active ? 'Ativo' : 'Inativo'}</span></td>
            <td><button class="btn btn-info js-edit-employee" data-id="${employee.id}">Editar</button></td>
        `;
    });

    document.querySelectorAll('.js-edit-employee').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = e.currentTarget.dataset.id;
            const employeeToEdit = employees.find(emp => emp.id == id);
            if (employeeToEdit) populateFormForEdit(employeeToEdit);
        });
    });
}

// --- Handlers de Eventos ---
function handlePerfilChange(event) {
    const perfilTexto = event.target.options[event.target.selectedIndex]?.text || '';
    const liderSelect = document.getElementById('lider-select');
    const liderLabel = document.querySelector('label[for="lider-select"]');
    const regionalSelect = document.getElementById('regional-select');
    const lojaSelect = document.getElementById('loja-select');
    
    [liderSelect, regionalSelect, lojaSelect].forEach(el => { el.disabled = true; el.required = false; el.value = ''; });
    liderLabel.textContent = 'Líder Direto';
    
    switch (perfilTexto) {
        case 'Coordenador':
            regionalSelect.disabled = false; regionalSelect.required = true;
            break;
        case 'Supervisor':
            liderLabel.textContent = 'Coordenador Direto';
            liderSelect.disabled = false; liderSelect.required = true;
            regionalSelect.disabled = false; regionalSelect.required = true;
            populateLideres('Coordenador');
            break;
        case 'Consultor':
            liderLabel.textContent = 'Supervisor Direto';
            liderSelect.disabled = false; liderSelect.required = true;
            regionalSelect.disabled = false; regionalSelect.required = true;
            populateLideres('Supervisor');
            break;
    }
}

function handleRegionalChange(event) {
    const regionalId = event.target.value;
    const perfilTexto = document.getElementById('perfil-select').options[document.getElementById('perfil-select').selectedIndex]?.text || '';
    if (regionalId && ['Supervisor', 'Consultor'].includes(perfilTexto)) {
        document.getElementById('loja-select').required = true;
        populateLojas(regionalId);
    } else {
        const lojaSelect = document.getElementById('loja-select');
        lojaSelect.disabled = true;
        lojaSelect.required = false;
        lojaSelect.innerHTML = '<option value="">Selecione a regional primeiro</option>';
    }
}

async function handleEmployeeFormSubmit(event) {
    event.preventDefault();
    const saveButton = document.getElementById('form-action-btn');
    saveButton.disabled = true;
    saveButton.textContent = 'Aguarde...';

    const employeeId = document.getElementById('employee-id').value;
    const vinculoId = document.getElementById('vinculo-id').value;

    const funcionarioData = {
        nome_completo: document.getElementById('full-name').value,
        data_nascimento: document.getElementById('birth-date').value || null,
        nome_mae: document.getElementById('mother-name').value || null,
        cpf: document.getElementById('cpf').value || null,
        email: document.getElementById('employee-email').value,
        telefone: document.getElementById('phone').value || null,
        cep: document.getElementById('cep').value || null,
        endereco: document.getElementById('address').value || null,
        numero_endereco: document.getElementById('address-number').value || null,
        complemento_endereco: document.getElementById('address-complement').value || null,
        // ================== AQUI ESTÁ A CORREÇÃO ==================
        bairro: document.getElementById('neighborhood').value || null, // Corrigido de 'bairro' para 'neighborhood'
        // ==========================================================
        cidade: document.getElementById('city').value || null,
        estado: document.getElementById('state').value || null,
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

    try {
        if (employeeId) {
            const { error: funcError } = await supabase.from('funcionarios').update(funcionarioData).eq('id', employeeId);
            if (funcError) throw funcError;
            if (vinculoId) {
                const { error: vincError } = await supabase.from('historico_vinculos').update(vinculoData).eq('id', vinculoId);
                if (vincError) throw vincError;
            } else {
                const { error: vincError } = await supabase.from('historico_vinculos').insert({ ...vinculoData, funcionario_id: employeeId });
                if (vincError) throw vincError;
            }
            alert('Funcionário atualizado com sucesso!');
        } else {
            const { data: novoFunc, error: funcError } = await supabase.from('funcionarios').insert(funcionarioData).select().single();
            if (funcError) throw funcError;
            const { error: vincError } = await supabase.from('historico_vinculos').insert({ ...vinculoData, funcionario_id: novoFunc.id });
            if (vincError) throw vincError;
            alert('Funcionário cadastrado com sucesso!');
        }
        resetFormToCreateMode();
        searchEmployees();
    } catch (error) {
        console.error('Erro ao salvar funcionário:', error);
        alert(`Ocorreu um erro: ${error.message}`);
    } finally {
        saveButton.disabled = false;
        // O texto do botão será resetado pelo resetFormToCreateMode()
    }
}

// --- Inicialização da Página ---
async function initializePage() {
    await Promise.all([populatePerfis(), populateRegionais()]);
    
    document.getElementById('perfil-select')?.addEventListener('change', handlePerfilChange);
    document.getElementById('regional-select')?.addEventListener('change', handleRegionalChange);
    document.getElementById('employee-form')?.addEventListener('submit', handleEmployeeFormSubmit);
    document.getElementById('search-employee-input')?.addEventListener('input', () => setTimeout(searchEmployees, 300));
    document.getElementById('clear-form-btn')?.addEventListener('click', resetFormToCreateMode);
    document.getElementById('cep')?.addEventListener('blur', consultarCEP);
    
    searchEmployees(); // Exibe a mensagem inicial
}

initializeAuth(
    (user) => { 
        showDashboard();
        initializePage();
    },
    () => { 
        showLogin();
    }
);