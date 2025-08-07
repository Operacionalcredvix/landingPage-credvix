// admin/modules/resumes.js

import { supabase } from '../../script/supabase-client.js';
import * as dom from './dom.js';

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