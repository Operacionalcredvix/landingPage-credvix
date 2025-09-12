
import { supabase } from '../../script/supabase-client.js';

/**
 * Lida com o login do utilizador.
 */
export async function handleLogin(event) {
    event.preventDefault();
    const loginError = document.getElementById('login-error');
    loginError.textContent = '';
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
        loginError.textContent = 'E-mail ou senha inválidos.';
        console.error('Erro de login:', error);
    }
    // A página irá recarregar automaticamente pelo onAuthStateChange
}

/**
 * Lida com o logout do utilizador.
 */
export async function handleLogout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error('Erro ao fazer logout:', error);
    }
    // A página irá recarregar automaticamente pelo onAuthStateChange
}

/**
 * Inicializa a verificação de autenticação.
 * @param {function} onUserLoggedIn - Função a ser executada quando um utilizador está logado.
 * @param {function} onUserLoggedOut - Função a ser executada quando não há utilizador.
 */
export function initializeAuth(onUserLoggedIn, onUserLoggedOut) {
    const loginForm = document.getElementById('login-form');
    const logoutBtn = document.getElementById('logout-btn');

    if (loginForm) loginForm.addEventListener('submit', handleLogin);
    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);

    supabase.auth.onAuthStateChange((event, session) => {
        if (session && session.user) {
            onUserLoggedIn(session.user);
        } else {
            onUserLoggedOut();
        }
    });
}