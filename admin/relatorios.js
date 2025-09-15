import { initializeAuth } from './modules/auth.js';
import { generateNewEmployeesReport } from './modules/relatorios.js';

function showDashboard() {
    document.getElementById('login-container')?.classList.add('hidden');
    document.getElementById('dashboard')?.classList.remove('hidden');
}

function showLogin() {
    document.getElementById('dashboard')?.classList.add('hidden');
    document.getElementById('login-container')?.classList.remove('hidden');
}

/**
 * Define os valores padrão para os filtros de data e dispara a geração do relatório.
 */
function initializeReportPage() {
    const startDateInput = document.getElementById('start-date');
    const endDateInput = document.getElementById('end-date');
    const filterButton = document.getElementById('filter-report-btn');

    // Define a data final padrão como hoje
    const today = new Date();
    endDateInput.value = today.toISOString().split('T')[0];

    // Define a data inicial padrão como 90 dias atrás
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(today.getDate() - 90);
    startDateInput.value = ninetyDaysAgo.toISOString().split('T')[0];
    
    // Adiciona o evento de clique ao botão de filtro
    filterButton.addEventListener('click', () => {
        const startDate = startDateInput.value;
        const endDate = endDateInput.value;
        generateNewEmployeesReport(startDate, endDate);
    });

    // Gera o relatório inicial com o período padrão
    generateNewEmployeesReport(startDateInput.value, endDateInput.value);
}

// Inicializa a autenticação e, em seguida, a página de relatórios
initializeAuth(
    (user) => {
        showDashboard();
        initializeReportPage();
    },
    () => {
        showLogin();
    }
);