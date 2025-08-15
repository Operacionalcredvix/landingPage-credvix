
import { supabase } from '../../script/supabase-client.js';
import * as dom from './dom.js';
import { showLogin } from './ui.js';

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
    await supabase.auth.signOut();
}

/**
 * Verifica o estado da sessão e chama a função de sucesso ou mostra o login.
 * @param {Function} onLoginSuccess - Função a ser executada quando o login for bem-sucedido.
 */
export function initializeAuth(onLoginSuccess) {
    supabase.auth.onAuthStateChange((event, session) => {
        if (session) {
            // Usuário autenticado - mostra o painel
            onLoginSuccess();
        } else {
            // Usuário não autenticado - mostra a tela de login
            showLogin();
        }
    });
}