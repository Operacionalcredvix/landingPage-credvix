import { supabase } from '../../script/supabase-client.js';

/**
 * Calcula a diferença de dias entre duas datas.
 */
function getDaysDifference(date1, date2) {
    const oneDay = 1000 * 60 * 60 * 24;
    const diffInTime = date1.getTime() - date2.getTime();
    return Math.round(diffInTime / oneDay);
}

/**
 * Busca funcionários admitidos em um intervalo de datas e os renderiza na tabela.
 * @param {string} startDate - A data de início no formato YYYY-MM-DD.
 * @param {string} endDate - A data de fim no formato YYYY-MM-DD.
 */
export async function generateNewEmployeesReport(startDate, endDate) {
    const tbody = document.getElementById('report-new-employees-tbody');
    const loadingMessage = document.getElementById('loading-report-message');
    const noReportMessage = document.getElementById('no-report-message');

    if (!tbody || !loadingMessage || !noReportMessage) return;

    tbody.innerHTML = '';
    loadingMessage.classList.remove('hidden');
    noReportMessage.classList.add('hidden');

    // Monta a consulta base
    let query = supabase
        .from('historico_vinculos')
        // ================== AQUI ESTÁ A MUDANÇA ==================
        // Adicionamos !left para forçar um LEFT JOIN.
        // Isso garante que os funcionários apareçam mesmo se não tiverem loja ou perfil associado.
        .select(`
            data_admissao,
            funcionarios!left (
                nome_completo,
                perfis!left ( nome ),
                lojas!left ( nome )
            )
        `)
        // ==========================================================
        .is('data_saida', null)
        .order('data_admissao', { ascending: false });

    if (startDate) {
        query = query.gte('data_admissao', startDate);
    }
    if (endDate) {
        query = query.lte('data_admissao', endDate);
    }

    const { data, error } = await query;

    loadingMessage.classList.add('hidden');

    if (error) {
        console.error("Erro ao gerar relatório:", error);
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: red;">Ocorreu um erro ao carregar os dados.</td></tr>';
        return;
    }

    if (data.length === 0) {
        noReportMessage.classList.remove('hidden');
        return;
    }

    const today = new Date();
    data.forEach(vinculo => {
        // Adicionamos uma verificação extra para garantir que o funcionário existe no vínculo
        if (!vinculo.funcionarios) return;

        const row = tbody.insertRow();
        const admissionDate = new Date(vinculo.data_admissao);
        const daysInCompany = getDaysDifference(today, admissionDate);

        const funcionario = vinculo.funcionarios;
        const perfil = funcionario.perfis ? funcionario.perfis.nome : 'N/A';
        const loja = funcionario.lojas ? funcionario.lojas.nome : 'N/A';

        row.innerHTML = `
            <td>${funcionario.nome_completo}</td>
            <td>${perfil}</td>
            <td>${loja}</td>
            <td>${admissionDate.toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</td>
            <td>${daysInCompany} dias</td>
        `;
    });
}