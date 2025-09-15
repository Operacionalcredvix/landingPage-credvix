import { initializeAuth } from './modules/auth.js';
import { generateNewEmployeesReport, filterHighlightedRows } from './modules/relatorios.js';

function showDashboard() {
    document.getElementById('login-container')?.classList.add('hidden');
    document.getElementById('dashboard')?.classList.remove('hidden');
}

function showLogin() {
    document.getElementById('dashboard')?.classList.add('hidden');
    document.getElementById('login-container')?.classList.remove('hidden');
}

function initializeReportPage() {
    const startDateInput = document.getElementById('start-date');
    const endDateInput = document.getElementById('end-date');
    const filterButton = document.getElementById('filter-report-btn');
    const filter40DaysButton = document.getElementById('filter-40-days-btn');
    const filter80DaysButton = document.getElementById('filter-80-days-btn');
    const highlightToggle = document.getElementById('highlight-only-toggle');

    const today = new Date();

    const setPeriodAndFilter = (days) => {
        const startDate = new Date();
        startDate.setDate(today.getDate() - days);
        startDateInput.value = startDate.toISOString().split('T')[0];
        endDateInput.value = today.toISOString().split('T')[0];
        generateNewEmployeesReport(startDateInput.value, endDateInput.value);
    };

    filterButton.addEventListener('click', () => {
        generateNewEmployeesReport(startDateInput.value, endDateInput.value);
    });

    filter40DaysButton.addEventListener('click', () => {
        setPeriodAndFilter(45); // Ajustado para incluir o intervalo de destaque
    });

    filter80DaysButton.addEventListener('click', () => {
        setPeriodAndFilter(90); // Ajustado para incluir o intervalo de destaque
    });

    // Adiciona o evento para o novo interruptor
    highlightToggle.addEventListener('change', () => {
        filterHighlightedRows();
    });

    // Gera o relatório inicial com o período padrão de 90 dias
    setPeriodAndFilter(90);
}

initializeAuth(
    (user) => {
        showDashboard();
        initializeReportPage();
    },
    () => {
        showLogin();
    }
);