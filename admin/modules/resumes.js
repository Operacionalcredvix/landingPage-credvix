// admin/modules/resumes.js
import { supabase } from '../../script/supabase-client.js';
import * as dom from './dom.js';
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
            <td>${resume.loja || resume.city || 'N/A'}</td>
            <td>${resume.tipo_candidatura || 'N/A'}</td>
            <td>${applicationDate}</td>
            <td><a href="${resume.curriculo_url}" target="_blank" download class="btn btn-primary">Baixar</a></td>
        `;
    });
}

// FUNÇÃO ATUALIZADA
export async function handleTalentFormSubmit(event) {
    event.preventDefault();
    const statusMessage = document.getElementById('talent-status-message');
    statusMessage.textContent = 'A processar...';
    document.getElementById('talent-save-btn').disabled = true;

    const nome_completo = document.getElementById('talent-name').value.trim();
    const email = document.getElementById('talent-email').value.trim();
    const telefone = document.getElementById('talent-phone').value.trim();
    const localidade = document.getElementById('talent-localidade-select').value; // CAMPO ATUALIZADO
    const vaga = document.getElementById('talent-position-input').value.trim();
    const file = document.getElementById('talent-cv-file').files[0];

    if (!nome_completo || !email || !telefone || !localidade || !vaga || !file) { // CONDIÇÃO ATUALIZADA
        statusMessage.textContent = 'Todos os campos são obrigatórios.';
        document.getElementById('talent-save-btn').disabled = false;
        return;
    }

    try {
        const { data: existingCandidate, error: checkError } = await supabase
            .from('candidatos')
            .select('id')
            .eq('email', email)
            .eq('tipo_candidatura', 'Banco de Talentos')
            .single();

        if (checkError && checkError.code !== 'PGRST116') {
            throw new Error(`Erro ao verificar candidato: ${checkError.message}`);
        }
        
        if (existingCandidate) {
            alert('Este candidato já está cadastrado no Banco de Talentos.');
            statusMessage.textContent = '';
            document.getElementById('talent-save-btn').disabled = false;
            return;
        }

        const fileExt = file.name.split('.').pop();
        const fileName = `${email.split('@')[0]}_${Date.now()}.${fileExt}`;
        const filePath = `banco-de-talentos/${fileName}`;

        const { error: uploadError } = await supabase.storage.from('curriculos').upload(filePath, file);
        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage.from('curriculos').getPublicUrl(filePath);

        // ATUALIZADO: Salva a localidade de interesse nos campos 'loja' e 'city'
        const { error: insertError } = await supabase.from('candidatos').insert([{
            nome_completo,
            email,
            telefone,
            vaga,
            curriculo_url: urlData.publicUrl,
            loja: localidade,
            city: localidade,
            tipo_candidatura: 'Banco de Talentos',
            status: 'pendente'
        }]);

        if (insertError) throw insertError;

        alert('Candidato adicionado com sucesso!');
        document.getElementById('talent-form').reset();
        closeTalentModal();
        loadResumesByStore();

    } catch (error) {
        console.error('Erro ao adicionar candidato:', error);
        statusMessage.textContent = `Erro: ${error.message}`;
    } finally {
        document.getElementById('talent-save-btn').disabled = false;
    }
}