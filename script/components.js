const headerHTML = `
        <nav class="container mx-auto px-6 py-4 flex justify-between items-center">
            <div class="flex items-center space-x-4">
                <a href="index.html"><img src="Logo Credvix Oficial.png" alt="Logo Grupo Credvix" class="h-8 md:h-10"
                        onerror="this.onerror=null;this.src='https://placehold.co/150x40/f37021/ffffff?text=Credvix';"></a>
                <span class="text-gray-300 text-2xl font-light">|</span>
                <a href="index.html"><img src="logo_help.png" alt="Logo Help!" class="h-8 md:h-10"
                        onerror="this.onerror=null;this.src='https://placehold.co/100x40/000000/ffffff?text=Help!';"></a>
                <div class="flex space-x-4 pl-4">
                    <a href="https://www.facebook.com/credvix.oficial/?locale=pt_BR" aria-label="Facebook"
                        class="social-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                            viewBox="0 0 24 24" fill="currentColor">
                            <path
                                d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v2.385z" />
                        </svg></a>
                    <a href="https://www.instagram.com/credvix/" aria-label="Instagram" class="social-icon"><svg
                            xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                            fill="currentColor">
                            <path
                                d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.689-.073-4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44 1.441-.645 1.441-1.44-.645-1.44-1.441-1.44z" />
                        </svg></a>
                    <a href="https://br.linkedin.com/company/credvix" aria-label="LinkedIn" class="social-icon"><svg
                            xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                            fill="currentColor">
                            <path
                                d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
                        </svg></a>
                </div>
            </div>
            <div class="hidden md:flex items-center space-x-8">
                <a href="#quem-somos" class="nav-link">Quem Somos</a>
                <a href="#perguntas" class="nav-link">Perguntas Frequentes</a>
                <a href="lojas.html" target="_blank" class="nav-link">Lojas</a>
                <a href="/vagas.html" target="_blank" class="nav-link">Trabalhe Conosco</a>
                <a href="/admin/index.html" target="_blank" class="nav-link">Enxame</a>
            </div>
        </nav>
`;


const footerHTML = `
<div class="container mx-auto px-6">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
                <div class="col-span-1 md:col-span-2 lg:col-span-1">
                    <div class="flex items-center mb-4 space-x-2">
                        <span class="footer-brand-btn footer-brand-credvix">Credvix</span>
                        <span class="text-gray-500">|</span>
                        <span class="footer-brand-btn footer-brand-help">Help!</span>
                    </div>
                    <p class="text-gray-400 text-sm mb-6">
                        Há 13 anos oferecendo as melhores soluções em crédito consignado para servidores públicos,
                        aposentados e pensionistas em todo o Brasil.
                    </p>
                    <div class="flex space-x-4">
                        <a href="https://www.facebook.com/credvix.oficial/?locale=pt_BR" target="_blank"
                            rel="noopener noreferrer" aria-label="Facebook" class="social-icon"><svg
                                xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                fill="currentColor">
                                <path
                                    d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v2.385z" />
                            </svg></a>
                        <a href="https://www.instagram.com/credvix/" target="_blank" rel="noopener noreferrer"
                            aria-label="Instagram" class="social-icon"><svg xmlns="http://www.w3.org/2000/svg"
                                width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path
                                    d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.689-.073-4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44 1.441-.645 1.441-1.44-.645-1.44-1.441-1.44z" />
                            </svg></a>
                        <a href="https://br.linkedin.com/company/credvix" target="_blank" rel="noopener noreferrer"
                            aria-label="LinkedIn" class="social-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24"
                                height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path
                                    d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
                            </svg></a>
                    </div>
                </div>

                <div class="col-span-1">
                    <h3 class="font-semibold text-lg mb-4 text-white uppercase tracking-wider">Links Rápidos</h3>
                    <ul class="space-y-3 text-gray-400">
                        <li><a href="#quem-somos" class="hover:text-white transition-colors">Quem Somos</a></li>
                        <li><a href="#perguntasFrequentes" class="hover:text-white transition-colors">Perguntas Frequentes</a></li>
                        <li><a href="lojas.html" target="_blank" class="hover:text-white transition-colors">Nossas Lojas</a></li>
                        <li><a href="vagas.html" target="_blank" class="hover:text-white transition-colors">Trabalhe Conosco</a></li>
                        </li>
                    </ul>
                </div>

                <div class="col-span-1 md:col-span-2 lg:col-span-2">
                    <h3 class="font-semibold text-lg mb-4 text-white uppercase tracking-wider">Contato</h3>
                    <ul class="space-y-4 text-gray-400">
                        <li class="flex items-start">
                            <span class="material-icons mr-3 mt-1 text-credvix-orange flex-shrink-0">location_on</span>
                            <span>Presente em  6 Estados do Brasil</span>
                        </li>
                        <li class="flex items-center">
<span class="material-icons mr-3 text-credvix-orange">email</span>
                            <a href="mailto:contato@credvix.com"
                                class="hover:text-white transition-colors">contato@credvix.com</a>
                        </li>
                        <li class="flex items-center">
<span class="material-icons mr-3 text-credvix-orange">call</span>
                            <a href="tel:+552730208584" class="hover:text-white transition-colors">
                                (27) 3020-8584
                            </a>
                        </li>
                        <li class="flex items-start">
<span class="material-icons mr-3 mt-1 text-credvix-orange flex-shrink-0">schedule</span>
                            <span>Matriz: Segunda a Sexta, 9h às 18h<br><span class="text-xs text-gray-500">Demais lojas
                                    seguem o horário local.</span></span>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="border-t border-gray-700 pt-6 mt-6 text-center text-gray-500 text-sm">
                <p class="mb-2">&copy; <span id="year"></span> Credvix. Todos os direitos reservados. Operando como
                    franqueada oficial da Help! BMG.</p>
                <p>O crédito consignado está sujeito à análise e aprovação. As condições apresentadas podem variar
                    conforme o convênio e a margem consignável disponível. Consulte sempre as condições específicas
                    antes da contratação. Help! é uma marca registrada do Banco BMG S.A.</p>
            </div>

            <div class="mt-10 pt-6 border-t border-gray-700 text-center">
                <p class="text-gray-400 text-sm mb-3">Uma empresa do</p>
                <a href="#" target="_blank" rel="noopener noreferrer">
                    <img src="/img/apis.png" alt="Logo Apis Grupo" class="h-12 mx-auto"
                        onerror="this.onerror=null;this.src='https://placehold.co/150x50/ffffff/000000?text=Apis+Grupo';">
                </a>
            </div>
        </div>
`;

export function loadHeader() {
    const headerElement = document.getElementById('main-header');
    if (headerElement) {
        headerElement.innerHTML = headerHTML;
    }
}

export function loadFooter() {
    const footerElement = document.getElementById('main-footer');
    if (footerElement) {
        footerElement.innerHTML = footerHTML;
    }
}