// admin/modules/profile.js
import { supabase } from '../../script/supabase-client.js';
import { getCurrentUser } from './auth.js';

// Elementos do DOM (assumindo que serão adicionados ao dom.js)
const userAvatarImg = document.getElementById('user-avatar-img');
const userNameSpan = document.getElementById('user-name-span');
const profileModalOverlay = document.getElementById('profile-modal-overlay');
const profileForm = document.getElementById('profile-form');
const avatarFileInput = document.getElementById('avatar-file-input');
const newPasswordInput = document.getElementById('new-password');
const confirmPasswordInput = document.getElementById('confirm-password');
const profileStatusMessage = document.getElementById('profile-status-message');

let selectedFile = null;

/**
 * Carrega os dados do utilizador na interface (sidebar).
 */
export function loadUserProfile(user) {
    if (user) {
        userNameSpan.textContent = user.nome_completo;
        userAvatarImg.src = user.avatar_url || 'https://placehold.co/100';
    }
}

/**
 * Lida com a submissão do formulário de perfil.
 */
async function handleProfileUpdate(event) {
    event.preventDefault();
    profileStatusMessage.textContent = 'A salvar...';
    
    const newPassword = newPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    const user = getCurrentUser();

    // 1. Atualizar Senha (se preenchida)
    if (newPassword) {
        if (newPassword !== confirmPassword) {
            profileStatusMessage.textContent = 'As senhas não coincidem.';
            return;
        }
        const { error: passwordError } = await supabase.auth.updateUser({ password: newPassword });
        if (passwordError) {
            profileStatusMessage.textContent = `Erro ao atualizar senha: ${passwordError.message}`;
            return;
        }
    }

    // 2. Atualizar Imagem de Perfil (se selecionada)
    if (selectedFile) {
        const filePath = `${user.id}/${Date.now()}_${selectedFile.name}`;
        
        // Faz o upload para o bucket 'avatares'
        const { error: uploadError } = await supabase.storage
            .from('avatares')
            .upload(filePath, selectedFile, {
                cacheControl: '3600',
                upsert: true,
            });

        if (uploadError) {
            profileStatusMessage.textContent = `Erro no upload: ${uploadError.message}`;
            return;
        }

        // Obtém a URL pública da imagem
        const { data: { publicUrl } } = supabase.storage
            .from('avatares')
            .getPublicUrl(filePath);

        // Atualiza a URL na tabela 'funcionarios'
        const { error: dbError } = await supabase
            .from('funcionarios')
            .update({ avatar_url: publicUrl })
            .eq('id', user.id);

        if (dbError) {
            profileStatusMessage.textContent = `Erro ao salvar no banco: ${dbError.message}`;
            return;
        }
    }

    profileStatusMessage.textContent = 'Perfil atualizado com sucesso!';
    setTimeout(() => {
        location.reload(); // Recarrega a página para ver todas as alterações
    }, 1500);
}

/**
 * Inicializa todos os eventos da página de perfil.
 */
export function initializeProfile() {
    const btnConfig = document.getElementById('btn-config');
    const btnCancelProfile = document.getElementById('btn-cancel-profile');
    const avatarPreview = document.getElementById('profile-avatar-preview');

    btnConfig.addEventListener('click', () => {
        profileForm.reset();
        selectedFile = null;
        profileStatusMessage.textContent = '';
        const user = getCurrentUser();
        avatarPreview.src = user.avatar_url || 'https://placehold.co/150';
        profileModalOverlay.classList.remove('hidden');
    });

    btnCancelProfile.addEventListener('click', () => {
        profileModalOverlay.classList.add('hidden');
    });

    avatarFileInput.addEventListener('change', (event) => {
        if (event.target.files && event.target.files[0]) {
            selectedFile = event.target.files[0];
            // Mostra a pré-visualização da imagem
            const reader = new FileReader();
            reader.onload = (e) => {
                avatarPreview.src = e.target.result;
            };
            reader.readAsDataURL(selectedFile);
        }
    });

    profileForm.addEventListener('submit', handleProfileUpdate);
}