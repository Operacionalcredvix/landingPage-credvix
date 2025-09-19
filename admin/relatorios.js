import { initializeAuth } from './modules/auth.js';
import { generateNewEmployeesReport, filterHighlightedRows, filterReportByName } from './modules/relatorios.js';

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
    const searchNameInput = document.getElementById('search-name-input');

    const today = new Date();

    const setPeriodAndFilter = (days) => {
        const startDate = new Date();
        startDate.setDate(today.getDate() - days);
        startDateInput.value = startDate.toISOString().split('T')[0];
        endDateInput.value = today.toISOString().split('T')[0];
        generateNewEmployeesReport(startDateInput.value, endDateInput.value);
    };

    if (filterButton) {
        filterButton.addEventListener('click', () => {
            generateNewEmployeesReport(startDateInput.value, endDateInput.value);
        });
    }

    if (filter40DaysButton) {
        filter40DaysButton.addEventListener('click', () => setPeriodAndFilter(45));
    }

    if (filter80DaysButton) {
        filter80DaysButton.addEventListener('click', () => setPeriodAndFilter(90));
    }

    if (highlightToggle) {
        highlightToggle.addEventListener('change', () => filterHighlightedRows());
    }
    
    // Adiciona o 'listener' de forma segura, verificando se o elemento existe
    if (searchNameInput) {
        searchNameInput.addEventListener('input', () => filterReportByName());
    } else {
        console.error("Elemento do filtro de nome (#search-name-input) não foi encontrado.");
    }

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