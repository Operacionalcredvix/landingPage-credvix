import { supabase } from '../../script/supabase-client.js';

// Variável para guardar os dados completos do relatório
let completeReportData = [];

function getDaysDifference(date1, date2) {
    const oneDay = 1000 * 60 * 60 * 24;
    const diffInTime = date1.getTime() - date2.getTime();
    return Math.round(diffInTime / oneDay);
}

/**
 * Renderiza as linhas da tabela do relatório com base nos dados fornecidos.
 */
function renderReportTable(dataToRender) {
    const tbody = document.getElementById('report-new-employees-tbody');
    const noReportMessage = document.getElementById('no-report-message');
    
    if (!tbody || !noReportMessage) return;
    
    tbody.innerHTML = '';

    if (dataToRender.length === 0) {
        noReportMessage.classList.remove('hidden');
        return;
    }
    
    noReportMessage.classList.add('hidden');

    dataToRender.forEach(employeeData => {
        const row = tbody.insertRow();
        const admissionDate = new Date(employeeData.admissionDate);

        if ((employeeData.daysInCompany >= 40 && employeeData.daysInCompany <= 45) || (employeeData.daysInCompany >= 80 && employeeData.daysInCompany <= 90)) {
            row.classList.add('highlight-warning');
        }

        row.innerHTML = `
            <td>${employeeData.nome_completo}</td>
            <td>${employeeData.perfil}</td>
            <td>${employeeData.loja}</td>
            <td>${admissionDate.toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</td>
            <td>${employeeData.daysInCompany} dias</td>
        `;
    });
    
    filterHighlightedRows();
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
            row.style.display = isHighlighted ? '' : 'none';
        } else {
            row.style.display = '';
        }
    });
}

/**
 * Filtra os dados do relatório por nome.
 */
export function filterReportByName() {
    const searchInput = document.getElementById('search-name-input');
    if (!searchInput) return;

    const searchTerm = searchInput.value.toLowerCase();
    
    if (!searchTerm) {
        renderReportTable(completeReportData);
        return;
    }

    const filteredData = completeReportData.filter(employee =>
        employee.nome_completo.toLowerCase().includes(searchTerm)
    );

    renderReportTable(filteredData);
}


/**
 * Gera os dados do relatório de novos funcionários.
 */
export async function generateNewEmployeesReport(startDate, endDate) {
    const tbody = document.getElementById('report-new-employees-tbody');
    const loadingMessage = document.getElementById('loading-report-message');
    const searchInput = document.getElementById('search-name-input');
    
    if (!tbody || !loadingMessage) return;

    completeReportData = [];
    tbody.innerHTML = '';
    loadingMessage.classList.remove('hidden');
    document.getElementById('no-report-message')?.classList.add('hidden');
    if(searchInput) searchInput.value = '';

    try {
        let vinculosQuery = supabase
            .from('historico_vinculos')
            .select('funcionario_id, data_admissao')
            .is('data_saida', null)
            .order('data_admissao', { ascending: false });

        if (startDate) vinculosQuery = vinculosQuery.gte('data_admissao', startDate);
        if (endDate) vinculosQuery = vinculosQuery.lte('data_admissao', endDate);

        const { data: vinculos, error: vinculosError } = await vinculosQuery;
        if (vinculosError) throw vinculosError;

        if (!vinculos || vinculos.length === 0) {
            renderReportTable([]);
            return;
        }

        const employeeAdmissionMap = new Map();
        for (const vinculo of vinculos) {
            if (vinculo.funcionario_id && !employeeAdmissionMap.has(vinculo.funcionario_id)) {
                employeeAdmissionMap.set(vinculo.funcionario_id, vinculo.data_admissao);
            }
        }

        const uniqueEmployeeIds = Array.from(employeeAdmissionMap.keys());
        if (uniqueEmployeeIds.length === 0) {
            renderReportTable([]);
            return;
        }

        const { data: employees, error: employeesError } = await supabase
            .from('funcionarios')
            .select('id, nome_completo, perfis(nome), lojas(nome)')
            .in('id', uniqueEmployeeIds);
        if (employeesError) throw employeesError;
        
        const today = new Date();
        completeReportData = employees.map(employee => {
            const admissionDate = new Date(employeeAdmissionMap.get(employee.id));
            return {
                ...employee,
                admissionDate: admissionDate,
                daysInCompany: getDaysDifference(today, admissionDate),
                perfil: employee.perfis ? employee.perfis.nome : 'N/A',
                loja: employee.lojas ? employee.lojas.nome : 'N/A',
            };
        });
        
        renderReportTable(completeReportData);

    } catch (error) {
        console.error("Erro ao gerar relatório:", error);
        tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: red;">Ocorreu um erro ao carregar os dados.</td></tr>`;
    } finally {
        if(loadingMessage) loadingMessage.classList.add('hidden');
    }
}