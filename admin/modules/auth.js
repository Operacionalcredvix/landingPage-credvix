// admin/modules/auth.js (Versão Final Super Simplificada)
import { supabase } from '../../script/supabase-client.js';
import * as dom from './dom.js';
import { showLogin, showDashboard } from './ui.js';
// A linha abaixo foi removida pois a função não é mais utilizada.
// import { loadUserProfile } from './profile.js';

let currentUser = null;

export const getCurrentUser = () => currentUser;

export async function handleLogin(event) {
    event.preventDefault();
    dom.loginError.textContent = '';

    const { data, error } = await supabase.auth.signInWithPassword({
        email: dom.emailInput.value,
        password: dom.passwordInput.value
    });

    if (error) {
        dom.loginError.textContent = 'E-mail ou senha inválidos.';
        console.error('Erro de login detalhado:', error);
    }
}

export async function handleLogout() {
    const { error } = await supabase.auth.signOut();
    currentUser = null;
    if (!error) {
        location.reload();
    } else {
        console.error('Erro ao fazer logout:', error);
    }
}

export function initializeAuth(onLoginSuccess) {
    supabase.auth.onAuthStateChange(async (event, session) => {
        if (session && session.user) {
            console.log("Sessão do Supabase detectada. A carregar o painel.");
            currentUser = session.user;
            
            // A chamada a loadUserProfile foi removida.
            
            await onLoginSuccess();
            showDashboard();
            
        } else {
            currentUser = null;
            showLogin();
        }
    });
}