// admin/modules/auth.js
import { supabase } from '../../script/supabase-client.js';
import * as dom from './dom.js';
import { showLogin, showDashboard } from './ui.js';
import { loadUserProfile } from './profile.js'; // Importa a função de perfil

let currentUser = null;

export const getCurrentUser = () => currentUser;

/**
 * Lida com a tentativa de login do utilizador.
 */
export async function handleLogin(event) {
    event.preventDefault();
    dom.loginError.textContent = '';
    
    const { data, error } = await supabase.auth.signInWithPassword({
        email: dom.emailInput.value,
        password: dom.passwordInput.value
    });

    if (error) {
        dom.loginError.textContent = 'E-mail ou senha inválidos.';
        console.error('Erro de login:', error.message);
    }
    // Se o login for bem-sucedido, o onAuthStateChange fará o resto.
}

/**
 * Desloga o utilizador do sistema.
 */
export async function handleLogout() {
    await supabase.auth.signOut();
    currentUser = null;
    // O onAuthStateChange irá detetar o evento SIGNED_OUT e redirecionar.
}

/**
 * Ponto de entrada da autenticação. Ouve as mudanças de estado e atualiza a interface.
 */
export function initializeAuth(onSuccessCallback) {
    supabase.auth.onAuthStateChange(async (event, session) => {
        if (session && session.user) {
            // Se existe uma sessão, o utilizador está logado.
            // Busca os dados do perfil na tabela 'funcionarios'.
            const { data, error } = await supabase
                .from('funcionarios')
                .select('id, nome_completo, avatar_url, perfil:perfis (nome)')
                .eq('user_id', session.user.id)
                .single();
            
            if (error) {
                console.error("Erro ao buscar perfil do funcionário. A fazer logout forçado.", error);
                await handleLogout();
                return;
            }
            
            currentUser = { ...session.user, ...data };
            loadUserProfile(currentUser); // Mostra os dados do utilizador na UI
            onSuccessCallback(); // Executa as funções de carregamento (loadStores, etc.)
            showDashboard();
        } else {
            // Se não há sessão, o utilizador não está logado.
            currentUser = null;
            showLogin();
        }
    });
}