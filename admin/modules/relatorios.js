import { supabase } from '../../script/supabase-client.js';

// Variável para guardar os dados completos do relatório atual
let completeReportData = [];

function getDaysDifference(date1, date2) {
    const oneDay = 1000 * 60 * 60 * 24;
    const diffInTime = date1.getTime() - date2.getTime();
    return Math.round(diffInTime / oneDay);
}

/**
 * Renderiza a tabela do relatório com base numa lista de dados.
 * @param {Array} dataToRender A lista de funcionários a ser exibida.
 */
function renderReportTable(dataToRender) {
    const tbody = document.getElementById('report-new-employees-tbody');
    const noReportMessage = document.getElementById('no-report-message');
    
    if (!tbody || !noReportMessage) return;
    
    tbody.innerHTML = ''; // Limpa a tabela

    if (dataToRender.length === 0) {
        noReportMessage.classList.remove('hidden');
        return;
    }
    
    noReportMessage.classList.add('hidden');

    const today = new Date();
    dataToRender.forEach(vinculo => {
        const row = tbody.insertRow();
        const admissionDate = new Date(vinculo.data_admissao);
        const daysInCompany = getDaysDifference(today, admissionDate);

        // Adiciona a classe de destaque se o período for crítico
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
    
    filterHighlightedRows(); // Reaplica o filtro de destaque visual
}

/**
 * Filtra as linhas visíveis da tabela, mostrando/escondendo as destacadas.
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
            row.style.display = isHighlighted ? '' : 'none';
        } else {
            row.style.display = '';
        }
    });
}

/**
 * Filtra a lista de funcionários por nome e atualiza a tabela.
 */
export function filterReportByName() {
    const searchTerm = document.getElementById('search-name-input').value.toLowerCase();
    
    const filteredData = completeReportData.filter(vinculo =>
        vinculo.funcionarios.nome_completo.toLowerCase().includes(searchTerm)
    );

    renderReportTable(filteredData);
}

/**
 * Busca os dados do Supabase e gera o relatório inicial.
 */
export async function generateNewEmployeesReport(startDate, endDate) {
    const tbody = document.getElementById('report-new-employees-tbody');
    const loadingMessage = document.getElementById('loading-report-message');
    const noReportMessage = document.getElementById('no-report-message');
    const searchInput = document.getElementById('search-name-input');

    if (!tbody || !loadingMessage || !noReportMessage) return;

    tbody.innerHTML = '';
    loadingMessage.classList.remove('hidden');
    noReportMessage.classList.add('hidden');
    if (searchInput) searchInput.value = ''; // Limpa o filtro de nome

    try {
        let query = supabase
            .from('historico_vinculos')
            .select(`
                data_admissao,
                funcionarios!inner (
                    nome_completo,
                    perfis!left ( nome ),
                    lojas!left ( nome )
                )
            `)
            .is('data_saida', null)
            .order('data_admissao', { ascending: false });

        if (startDate) query = query.gte('data_admissao', startDate);
        if (endDate) query = query.lte('data_admissao', endDate);

        const { data, error } = await query;
        if (error) throw error;

        // Desduplicação para garantir que cada funcionário apareça apenas uma vez
        const uniqueEmployeesMap = new Map();
        if (data) {
            data.forEach(vinculo => {
                if (vinculo.funcionarios && !uniqueEmployeesMap.has(vinculo.funcionarios.nome_completo)) {
                    uniqueEmployeesMap.set(vinculo.funcionarios.nome_completo, vinculo);
                }
            });
        }

        completeReportData = Array.from(uniqueEmployeesMap.values());
        
        // Reordena a lista pela data de admissão (mais recente primeiro),
        // o que corresponde a 'Dias na Empresa' em ordem crescente.
        completeReportData.sort((a, b) => new Date(b.data_admissao) - new Date(a.data_admissao));

        renderReportTable(completeReportData);

    } catch (error) {
        console.error("Erro ao gerar relatório:", error);
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: red;">Ocorreu um erro ao carregar os dados.</td></tr>';
    } finally {
        loadingMessage.classList.add('hidden');
    }
}