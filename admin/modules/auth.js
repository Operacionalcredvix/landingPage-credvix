// admin/modules/auth.js

import { supabase } from '../../script/supabase-client.js';
import * as dom from './dom.js';
import { showDashboard, showLogin } from './ui.js';
import { loadStores } from './stores.js'; // Importa a função para carregar as lojas.

/**
 * Carrega os dados essenciais e exibe o painel.
 */
async function bootstrapDashboard() {
    await loadStores(); //  Garante que as lojas (e cidades) sejam carregadas primeiro.
    showDashboard();    //  Depois, exibe o painel já com os dados disponíveis.
}

/**
 * Lida com a tentativa de login do usuário.
 * @param {Event} event - O evento de submit do formulário.
 */
export async function handleLogin(event) {
    event.preventDefault();
    dom.loginError.textContent = '';
    const { error } = await supabase.auth.signInWithPassword({
        email: dom.emailInput.value,
        password: dom.passwordInput.value
    });
    if (error) {
        dom.loginError.textContent = 'E-mail ou senha inválidos.';
    }
}

/**
 * Desloga o usuário do sistema.
 */
export async function handleLogout() {
    sessionStorage.removeItem('sessionActive');
    await supabase.auth.signOut();
}

/**
 * Verifica o estado da sessão e exibe a tela correta (login ou dashboard).
 */
export function initializeAuth() {
    supabase.auth.onAuthStateChange((event, session) => {
        const sessionIsActive = sessionStorage.getItem('sessionActive');
        if (event === 'SIGNED_IN' || (session && sessionIsActive)) {
            if (event === 'SIGNED_IN') sessionStorage.setItem('sessionActive', 'true');
            bootstrapDashboard(); // Chama a nova função de inicialização.
        } else {
            if (session && !sessionIsActive) {
                 supabase.auth.signOut(); // Força o logout se a sessão do storage não bater com a do supabase
            }
            showLogin();
        }
    });
}