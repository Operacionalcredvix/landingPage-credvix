// admin/modules/auth.js
import { supabase } from '../../script/supabase-client.js';
import * as dom from './dom.js';
import { showLogin, showDashboard } from './ui.js';
import { loadUserProfile } from './profile.js';

let currentUser = null;

// Permite que outros módulos acessem os dados do utilizador logado
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
        console.error('Erro de login detalhado:', error);
    }
    // Se o login for bem-sucedido, a função onAuthStateChange fará o resto.
}

/**
 * Desloga o utilizador do sistema.
 */
export async function handleLogout() {
    await supabase.auth.signOut();
    currentUser = null;
}

/**
 * Ponto de entrada da autenticação. Ouve as mudanças de estado e atualiza a interface.
 * @param {Function} onLoginSuccess - Função a ser executada quando o login for bem-sucedido.
 */
export function initializeAuth(onLoginSuccess) {
    supabase.auth.onAuthStateChange(async (event, session) => {
        if (session && session.user) {
            // 1. Se existe uma sessão, o utilizador está logado.
            // 2. Busca os dados do perfil na tabela 'funcionarios' para obter o nome, avatar e perfil.
            const { data, error } = await supabase
                .from('funcionarios')
                .select('id, nome_completo, avatar_url, perfil:perfis (nome)')
                .eq('user_id', session.user.id)
                .single();
            
            if (error) {
                console.error("Erro ao buscar o perfil do funcionário. O utilizador pode não estar registado na tabela 'funcionarios'. A fazer logout forçado.", error);
                await handleLogout(); // Força o logout se o perfil não for encontrado
                return;
            }
            
            // 3. Guarda os dados completos do utilizador
            currentUser = { ...session.user, ...data };
            
            // 4. Atualiza a UI com os dados do perfil
            loadUserProfile(currentUser); 
            
            // 5. Executa as funções de carregamento do painel (loadStores, loadJobs, etc.)
            await onLoginSuccess(); 
            
            // 6. Mostra o painel
            showDashboard();
        } else {
            // Se não há sessão, o utilizador não está logado
            currentUser = null;
            showLogin();
        }
    });
}