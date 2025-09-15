import { supabase } from '../../script/supabase-client.js';

function getDaysDifference(date1, date2) {
    const oneDay = 1000 * 60 * 60 * 24;
    const diffInTime = date1.getTime() - date2.getTime();
    return Math.round(diffInTime / oneDay);
}

/**
 * Filtra as linhas da tabela, mostrando apenas as que têm a classe 'highlight-warning'.
 */
export function filterHighlightedRows() {
    const toggle = document.getElementById('highlight-only-toggle');
    const tbody = document.getElementById('report-new-employees-tbody');
    if (!toggle || !tbody) return;

    const shouldFilter = toggle.checked;
    const rows = tbody.querySelectorAll('tr');

    rows.forEach(row => {
        const isHighlighted = row.classList.contains('highlight-warning');
        if (shouldFilter) {
            // Se o filtro está ativo, mostre a linha APENAS se ela for destacada
            row.style.display = isHighlighted ? '' : 'none';
        } else {
            // Se o filtro está inativo, mostre todas as linhas
            row.style.display = '';
        }
    });
}

export async function generateNewEmployeesReport(startDate, endDate) {
    const tbody = document.getElementById('report-new-employees-tbody');
    const loadingMessage = document.getElementById('loading-report-message');
    const noReportMessage = document.getElementById('no-report-message');

    if (!tbody || !loadingMessage || !noReportMessage) return;

    tbody.innerHTML = '';
    loadingMessage.classList.remove('hidden');
    noReportMessage.classList.add('hidden');

    let query = supabase
        .from('historico_vinculos')
        .select(`
            data_admissao,
            funcionarios!left (
                nome_completo,
                perfis!left ( nome ),
                lojas!left ( nome )
            )
        `)
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
        if (!vinculo.funcionarios) return;

        const row = tbody.insertRow();
        const admissionDate = new Date(vinculo.data_admissao);
        const daysInCompany = getDaysDifference(today, admissionDate);

        if ((daysInCompany >= 40 && daysInCompany <= 45) || (daysInCompany >= 80 && daysInCompany <= 90)) {
            row.classList.add('highlight-warning');
        }

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

    // Ao final de gerar o relatório, aplica o filtro de destaque atual
    filterHighlightedRows();
}
