// admin/modules/auth.js (Versão Simplificada sem Perfis)
import { supabase } from '../../script/supabase-client.js';
import * as dom from './dom.js';
import { showLogin, showDashboard } from './ui.js';
import { loadUserProfile } from './profile.js';

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
    // Encerra a sessão no Supabase
    const { error } = await supabase.auth.signOut();

    // Limpa a variável local do utilizador
    currentUser = null;

    // Força o recarregamento da página para um estado limpo
    if (!error) {
        location.reload();
    } else {
        console.error('Erro ao fazer logout:', error);
    }
}

export function initializeAuth(onLoginSuccess) {
    supabase.auth.onAuthStateChange(async (event, session) => {
        if (session && session.user) {
            // MODIFICADO: A consulta agora é mais simples e não busca o perfil.
            const { data, error } = await supabase
                .from('funcionarios')
                .select('id, nome_completo, avatar_url')
                .eq('user_id', session.user.id)
                .single();

            if (error) {
                console.error("Erro ao buscar o perfil do funcionário. O utilizador pode não estar registado na tabela 'funcionarios'. A fazer logout forçado.", error);
                await handleLogout();
                return;
            }

            currentUser = { ...session.user, ...data };

            loadUserProfile(currentUser); 

            await onLoginSuccess(); 

            showDashboard();
        } else {
            currentUser = null;
            showLogin();
        }
    });
}