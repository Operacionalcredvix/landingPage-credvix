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
// ... (as funções consultarCEP e preencherFormularioEndereco continuam as mesmas) ...
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


// --- Funções de Carregamento de Dados (Populate) ---

// ATUALIZADO: Busca os perfis do Supabase
async function populatePerfis() {
    const select = document.getElementById('perfil-select');
    select.innerHTML = '<option value="">A carregar perfis...</option>';
    const { data: perfis, error } = await supabase.from('perfis').select('id, nome').order('id');
    if (error) {
        console.error("Erro ao carregar perfis do Supabase:", error);
        select.innerHTML = '<option value="">Erro ao carregar</option>';
        return;
    }
    select.innerHTML = '<option value="">Selecione o perfil</option>';
    perfis.forEach(perfil => select.add(new Option(perfil.nome, perfil.id)));
    console.log("Perfis carregados do Supabase com sucesso!");
}

async function populateRegionais() {
    const select = document.getElementById('regional-select');
    select.innerHTML = '<option value="">A carregar...</option>';
    const { data, error } = await supabase.from('regionais').select('id, nome_regional').order('nome_regional');
    if (error) {
        console.error("Erro ao carregar regionais:", error);
        select.innerHTML = '<option value="">Erro ao carregar</option>';
        return;
    }
    select.innerHTML = '<option value="">Selecione a regional</option>';
    data.forEach(regional => select.add(new Option(regional.nome_regional, regional.id)));
}

async function populateLojas(regionalId) {
    const select = document.getElementById('loja-select');
    select.innerHTML = '<option value="">A carregar lojas...</option>';
    select.disabled = true;
    const { data, error } = await supabase.from('lojas').select('id, nome').eq('regional_id', regionalId).order('nome');
    if (error) {
        console.error(`Erro ao carregar lojas:`, error);
        select.innerHTML = '<option value="">Erro ao carregar</option>';
        return;
    }
    select.innerHTML = '<option value="">Selecione a loja</option>';
    data.forEach(loja => select.add(new Option(loja.nome, loja.id)));
    select.disabled = false;
}

async function populateLideres(perfilLiderNome) {
    const liderSelect = document.getElementById('lider-select');
    liderSelect.innerHTML = `<option value="">A carregar ${perfilLiderNome.toLowerCase()}es...</option>`;
    
    // Primeiro, busca o ID do perfil desejado (ex: "Coordenador")
    const { data: perfilData, error: perfilError } = await supabase
      .from('perfis')
      .select('id')
      .eq('nome', perfilLiderNome)
      .single();

    if (perfilError || !perfilData) {
        console.error(`Perfil "${perfilLiderNome}" não encontrado.`, perfilError);
        liderSelect.innerHTML = `<option value="">Erro ao carregar</option>`;
        return;
    }

    // Agora, busca os funcionários que têm esse ID de perfil
    const { data: funcionarios, error: funcError } = await supabase
        .from('funcionarios')
        .select('id, nome_completo')
        .eq('perfil_id', perfilData.id)
        .eq('is_active', true); // Busca apenas líderes ativos

    if (funcError) {
        console.error(`Erro ao buscar funcionários com perfil ${perfilLiderNome}:`, funcError);
        liderSelect.innerHTML = `<option value="">Erro ao carregar</option>`;
        return;
    }
    
    liderSelect.innerHTML = `<option value="">Selecione o ${perfilLiderNome.toLowerCase()}</option>`;
    funcionarios.forEach(func => liderSelect.add(new Option(func.nome_completo, func.id)));
}

// --- Funções de Manipulação de Eventos (Handlers) ---

// ATUALIZADO: Esta função agora contém toda a lógica condicional
function handlePerfilChange(event) {
    const perfilSelecionado = event.target.options[event.target.selectedIndex];
    const perfilTexto = perfilSelecionado ? perfilSelecionado.text : '';

    // Referências aos elementos do formulário
    const liderSelect = document.getElementById('lider-select');
    const liderLabel = document.querySelector('label[for="lider-select"]');
    const regionalSelect = document.getElementById('regional-select');
    const lojaSelect = document.getElementById('loja-select');

    // 1. Resetar o estado de todos os campos
    [liderSelect, regionalSelect, lojaSelect].forEach(el => {
        el.disabled = true;
        el.required = false;
        el.value = '';
    });
    liderLabel.textContent = 'Líder Direto';
    lojaSelect.innerHTML = '<option value="">Selecione a regional primeiro</option>';
    
    // 2. Aplicar as regras com base no perfil selecionado
    switch (perfilTexto) {
        case 'Master':
        case 'RH':
        case 'Backoffice':
            // Não faz nada, todos os campos permanecem desabilitados
            break;

        case 'Coordenador':
            regionalSelect.disabled = false;
            regionalSelect.required = true;
            // A regra de "múltiplas regionais" exigiria uma alteração na interface (ex: multi-select).
            // Por enquanto, o formulário permite selecionar uma regional.
            break;

        case 'Supervisor':
            liderLabel.textContent = 'Coordenador Direto';
            liderSelect.disabled = false;
            liderSelect.required = true;
            regionalSelect.disabled = false;
            regionalSelect.required = true;
            // O campo de loja será habilitado quando uma regional for selecionada
            populateLideres('Coordenador');
            break;

        case 'Consultor':
            liderLabel.textContent = 'Supervisor Direto';
            liderSelect.disabled = false;
            liderSelect.required = true;
            regionalSelect.disabled = false;
            regionalSelect.required = true;
            // O campo de loja será habilitado quando uma regional for selecionada
            populateLideres('Supervisor');
            break;
    }
}


function handleRegionalChange(event) {
    const regionalId = event.target.value;
    const lojaSelect = document.getElementById('loja-select');
    
    // Verifica se o perfil selecionado requer uma loja (Supervisor ou Consultor)
    const perfilTexto = document.getElementById('perfil-select').options[document.getElementById('perfil-select').selectedIndex].text;
    
    if (regionalId && ['Supervisor', 'Consultor'].includes(perfilTexto)) {
        lojaSelect.required = true;
        populateLojas(regionalId); // A função populateLojas já habilita o select no final
    } else {
        lojaSelect.disabled = true;
        lojaSelect.required = false;
        lojaSelect.innerHTML = '<option value="">Selecione a regional primeiro</option>';
    }
}

// ... (as funções handleStatusToggle e handleEmployeeFormSubmit continuam as mesmas) ...
function handleStatusToggle() {
    const toggle = document.getElementById('employee-status-toggle');
    const exitDateInput = document.getElementById('exit-date');
    const exitDateLabel = document.querySelector('label[for="exit-date"]');
    if (!toggle || !exitDateInput || !exitDateLabel) return;
    if (toggle.checked) {
        exitDateInput.required = false;
        exitDateLabel.classList.remove('form-label-required');
        exitDateLabel.innerHTML = 'Data de Saída';
    } else {
        exitDateInput.required = true;
        exitDateLabel.classList.add('form-label-required');
        exitDateLabel.innerHTML = 'Data de Saída <span class="label-optional">(Obrigatória para inativar)</span>';
    }
}

async function handleEmployeeFormSubmit(event) {
    event.preventDefault();
    const saveButton = document.getElementById('employee-save-btn');
    saveButton.disabled = true;
    saveButton.textContent = 'A salvar...';
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
        const { data: novoFuncionario, error: erroFuncionario } = await supabase
            .from('funcionarios')
            .insert(funcionarioData)
            .select()
            .single();
        if (erroFuncionario) throw erroFuncionario;
        const { error: erroVinculo } = await supabase
            .from('historico_vinculos')
            .insert({
                funcionario_id: novoFuncionario.id,
                data_admissao: vinculoData.data_admissao,
                data_saida: vinculoData.data_saida
            });
        if (erroVinculo) throw erroVinculo;
        alert('Funcionário cadastrado com sucesso!');
        event.target.reset();
    } catch (error) {
        console.error('Erro ao salvar funcionário:', error);
        alert(`Ocorreu um erro: ${error.message}`);
    } finally {
        saveButton.disabled = false;
        saveButton.textContent = 'Salvar';
    }
}


// --- Função Principal de Inicialização ---
async function initializePage() {
    console.log("A inicializar a página de funcionários...");
    
    await Promise.all([
        populatePerfis(),
        populateRegionais()
    ]);
    
    document.getElementById('perfil-select')?.addEventListener('change', handlePerfilChange);
    document.getElementById('regional-select')?.addEventListener('change', handleRegionalChange);
    document.getElementById('employee-form')?.addEventListener('submit', handleEmployeeFormSubmit);
    document.getElementById('employee-status-toggle')?.addEventListener('change', handleStatusToggle);
    document.getElementById('cep')?.addEventListener('blur', consultarCEP);
}

// Inicia a autenticação e, em seguida, a página.
document.addEventListener('DOMContentLoaded', () => {
    initializeAuth(
        (user) => { 
            showDashboard();
            initializePage();
        },
        () => { 
            showLogin();
        }
    );
});