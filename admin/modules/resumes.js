
import { supabase } from '../../script/supabase-client.js';
import * as dom from './dom.js';
import { getLoadedStores } from './stores.js';
import { closeTalentModal } from './ui.js';

export async function loadResumesByStore() {
    dom.loadingResumesMessage.classList.remove('hidden');
    dom.noResumesMessage.classList.add('hidden');
    dom.resumeListTbody.innerHTML = '';

    const selectedCity = dom.storeFilterSelect.value;
    const selectedApplicationType = dom.applicationTypeFilter.value;

    let query = supabase.from('candidatos').select('*').order('created_at', { ascending: false });

    if (selectedCity !== 'todos') {
        query = query.eq('city', selectedCity);
    }
    if (selectedApplicationType !== 'todos') {
        query = query.eq('tipo_candidatura', selectedApplicationType);
    }

    const { data: resumes, error } = await query;
    dom.loadingResumesMessage.classList.add('hidden');

    if (error) {
        console.error("Erro ao carregar currículos:", error);
        dom.noResumesMessage.textContent = 'Ocorreu um erro ao carregar os currículos.';
        dom.noResumesMessage.classList.remove('hidden');
        return;
    }
    if (resumes.length === 0) {
        dom.noResumesMessage.textContent = 'Nenhum currículo encontrado para os filtros selecionados.';
        dom.noResumesMessage.classList.remove('hidden');
        return;
    }
    
    resumes.forEach(resume => {
        const row = dom.resumeListTbody.insertRow();
        const applicationDate = new Date(resume.created_at).toLocaleDateString('pt-BR');
        row.innerHTML = `
            <td><strong>${resume.nome_completo}</strong><br><small>${resume.email} / ${resume.telefone}</small></td>
            <td>${resume.loja || 'N/A'}</td>
            <td>${resume.tipo_candidatura || 'N/A'}</td>
            <td>${applicationDate}</td>
            <td><a href="${resume.curriculo_url}" target="_blank" download class="btn btn-primary">Baixar</a></td>
        `;
    });
}

/**
 * Lida com o envio do formulário para adicionar um novo candidato ao banco de talentos.
 * @param {Event} event - O evento de submissão do formulário.
 */
export async function handleTalentFormSubmit(event) {
    event.preventDefault();
    const statusMessage = document.getElementById('talent-status-message');
    statusMessage.textContent = 'A processar...';
    document.getElementById('talent-save-btn').disabled = true;

    // --- Dados do Formulário ---
    const nome_completo = document.getElementById('talent-name').value.trim();
    const email = document.getElementById('talent-email').value.trim();
    const telefone = document.getElementById('talent-phone').value.trim();
    const lojaId = document.getElementById('talent-store-select').value;
    const vaga = document.getElementById('talent-position-input').value.trim();
    const file = document.getElementById('talent-cv-file').files[0];

    if (!nome_completo || !email || !telefone || !lojaId || !vaga || !file) {
        statusMessage.textContent = 'Todos os campos são obrigatórios.';
        document.getElementById('talent-save-btn').disabled = false;
        return;
    }

    try {
        // --- NOVA ETAPA DE VERIFICAÇÃO ---
        // 1. Verifica se já existe um candidato com o mesmo e-mail para o mesmo tipo de vaga.
        const { data: existingCandidate, error: checkError } = await supabase
            .from('candidatos')
            .select('id')
            .eq('email', email)
            .eq('tipo_candidatura', 'Banco de Talentos')
            .single(); // .single() espera 0 ou 1 resultado. Se encontrar mais, dá erro.

        if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = "No rows found"
            throw new Error(`Erro ao verificar candidato: ${checkError.message}`);
        }
        
        // Se `existingCandidate` não for nulo, significa que o candidato já existe.
        if (existingCandidate) {
            alert('Este candidato já está cadastrado no Banco de Talentos.');
            statusMessage.textContent = '';
            document.getElementById('talent-save-btn').disabled = false;
            return; // Interrompe a execução
        }
        // --- FIM DA VERIFICAÇÃO ---

        // 2. Fazer upload do ficheiro para o Supabase Storage
        const fileExt = file.name.split('.').pop();
        const fileName = `${email.split('@')[0]}_${Date.now()}.${fileExt}`;
        const filePath = `banco-de-talentos/${fileName}`;

        const { error: uploadError } = await supabase.storage.from('curriculos').upload(filePath, file);
        if (uploadError) throw uploadError;

        // 3. Obter a URL pública do ficheiro
        const { data: urlData } = supabase.storage.from('curriculos').getPublicUrl(filePath);

        // 4. Obter dados da loja selecionada
        const selectedStore = getLoadedStores().find(s => s.id == lojaId);

        // 5. Inserir o candidato na base de dados
        const { error: insertError } = await supabase.from('candidatos').insert([{
            nome_completo,
            email,
            telefone,
            vaga,
            curriculo_url: urlData.publicUrl,
            loja: selectedStore ? selectedStore.name : 'N/A',
            city: selectedStore ? selectedStore.city : 'N/A',
            tipo_candidatura: 'Banco de Talentos',
            status: 'pendente'
        }]);

        if (insertError) throw insertError;

        // 6. Sucesso
        alert('Candidato adicionado com sucesso!');
        document.getElementById('talent-form').reset();
        closeTalentModal();
        loadResumesByStore(); // Atualiza a lista de currículos

    } catch (error) {
        console.error('Erro ao adicionar candidato:', error);
        statusMessage.textContent = `Erro: ${error.message}`;
    } finally {
        document.getElementById('talent-save-btn').disabled = false;
    }
}