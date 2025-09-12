// admin/modules/funcionarios.js
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

/**
 * Preenche os campos de endereço a partir da resposta da API ViaCEP.
 */
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

/**
 * Consulta a API ViaCEP quando o utilizador preenche o CEP.
 */
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

async function populatePerfis() {
    const select = document.getElementById('perfil-select');
    const { data, error } = await supabase.from('perfis').select('id, nome').order('nome');
    
    if (error || !data) {
        console.error("Erro ao carregar perfis:", error);
        select.innerHTML = '<option value="">Erro ao carregar</option>';
        return;
    }
    select.innerHTML = '<option value="">Selecione o perfil</option>';
    data.forEach(perfil => select.add(new Option(perfil.nome, perfil.id)));
}

async function populateRegionais() {
    const select = document.getElementById('regional-select');
    const { data, error } = await supabase.from('regionais').select('id, nome_regional').order('nome_regional');

    if (error || !data) {
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
    const { data, error } = await supabase.from('lojas').select('id, nome').eq('regional_id', regionalId).order('nome');

    if (error || !data) {
        console.error(`Erro ao carregar lojas para a regional ID ${regionalId}:`, error);
        select.innerHTML = '<option value="">Erro ao carregar</option>';
        return;
    }
    select.innerHTML = '<option value="">Selecione a loja</option>';
    data.forEach(loja => select.add(new Option(loja.nome, loja.id)));
}

async function populateLideres(perfilLiderNome) {
    const liderSelect = document.getElementById('lider-select');
    liderSelect.innerHTML = '<option value="">A carregar...</option>';

    const { data, error } = await supabase
        .from('funcionarios')
        .select(`id, nome_completo, perfis ( nome )`)
        .eq('perfis.nome', perfilLiderNome);

    if (error || !data) {
        console.error(`Erro ao buscar funcionários com perfil ${perfilLiderNome}:`, error);
        liderSelect.innerHTML = `<option value="">Erro ao carregar</option>`;
        return;
    }
    
    liderSelect.innerHTML = `<option value="">Selecione o ${perfilLiderNome.toLowerCase()}</option>`;
    data.forEach(func => liderSelect.add(new Option(func.nome_completo, func.id)));
}

// --- Funções de Manipulação de Eventos (Handlers) ---

function handlePerfilChange(event) {
    const perfilTexto = event.target.options[event.target.selectedIndex].text;
    const liderSelect = document.getElementById('lider-select');
    const liderLabel = document.querySelector('label[for="lider-select"]');
    const regionalSelect = document.getElementById('regional-select');
    const regionalLabel = document.querySelector('label[for="regional-select"]');
    const lojaSelect = document.getElementById('loja-select');
    const lojaLabel = document.querySelector('label[for="loja-select"]');

    const perfisOperacionais = ['Coordenador', 'Supervisor', 'Consultor'];

    // Reset geral
    [liderSelect, regionalSelect, lojaSelect].forEach(el => {
        el.disabled = true;
        el.required = false;
        el.value = '';
    });
    [liderLabel, regionalLabel, lojaLabel].forEach(el => el.classList.remove('form-label-required'));
    liderSelect.innerHTML = '<option value="">Selecione o perfil primeiro</option>';
    lojaSelect.innerHTML = '<option value="">Selecione a regional primeiro</option>';
    liderLabel.innerHTML = 'Líder Direto';

    if (perfisOperacionais.includes(perfilTexto)) {
        regionalSelect.disabled = false;
        regionalSelect.required = true;
        regionalLabel.classList.add('form-label-required');
        
        lojaSelect.required = true;
        lojaLabel.classList.add('form-label-required');

        if (perfilTexto === 'Supervisor') {
            liderLabel.innerHTML = 'Coordenador Direto';
            liderLabel.classList.add('form-label-required');
            liderSelect.required = true;
            liderSelect.disabled = false;
            populateLideres('Coordenador');
        } else if (perfilTexto === 'Consultor') {
            liderLabel.innerHTML = 'Supervisor Direto';
            liderLabel.classList.add('form-label-required');
            liderSelect.required = true;
            liderSelect.disabled = false;
            populateLideres('Supervisor');
        }
    }
}

function handleRegionalChange(event) {
    const regionalId = event.target.value;
    const lojaSelect = document.getElementById('loja-select');

    if (regionalId) {
        lojaSelect.disabled = false;
        populateLojas(regionalId);
    } else {
        lojaSelect.disabled = true;
        lojaSelect.innerHTML = '<option value="">Selecione a regional primeiro</option>';
    }
}

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