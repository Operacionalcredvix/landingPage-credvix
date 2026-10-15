const headerHTML = `
        <nav class="container mx-auto px-6 py-4 flex justify-between items-center">
            <div class="flex items-center space-x-4">
                <a href="index.html"><img src="/img/logo-credvix.webp" alt="Logo Grupo Credvix" width="97" height="32" class="h-8 md:h-10"
                        onerror="this.onerror=null;this.src='https://placehold.co/150x40/f37021/ffffff?text=Credvix';"></a>
                <span class="text-gray-300 text-2xl font-light">|</span>
                <a href="index.html"><img src="/img/logo-help.webp" alt="Logo Help!" width="112" height="64" class="h-8 md:h-10"
                        onerror="this.onerror=null;this.src='https://placehold.co/100x40/000000/ffffff?text=Help!';"></a>
                <div class="hidden md:flex space-x-4 pl-4">
                    <a href="https://www.facebook.com/credvix.oficial/?locale=pt_BR" aria-label="Facebook"
                        class="social-icon" data-tooltip="Siga-nos no Facebook">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                            viewBox="0 0 24 24" fill="currentColor">
                            <path
                                d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v2.385z" />
                        </svg></a>
                    <a href="https://www.instagram.com/credvix/" aria-label="Instagram" class="social-icon" data-tooltip="Siga-nos no Instagram"><svg
                            xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                            fill="currentColor">
                            <path
                                d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.689-.073-4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44 1.441-.645 1.441-1.44-.645-1.44-1.441-1.44z" />
                        </svg></a>
                    <a href="https://br.linkedin.com/company/credvix" aria-label="LinkedIn" class="social-icon" data-tooltip="Conecte-se no LinkedIn"><svg
                            xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                            fill="currentColor">
                            <path
                                d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
                        </svg></a>
                </div>
            </div>
            
            <!-- Desktop Navigation -->
            <div class="hidden md:flex items-center space-x-8">
                <a href="#quem-somos" class="nav-link" data-page="home">Quem Somos</a>
                <a href="lojas.html" class="nav-link" data-page="lojas">Lojas</a>
                <a href="/vagas.html" class="nav-link" data-page="vagas">Trabalhe Conosco</a>
                <a href="/farol.html" class="nav-link" data-page="farol">Farol CRM</a>
            </div>
            
            <!-- Mobile Menu Button -->
            <button id="mobile-menu-btn" class="md:hidden z-50 relative w-10 h-10 flex flex-col justify-center items-center" aria-label="Menu">
                <span class="hamburger-line"></span>
                <span class="hamburger-line"></span>
                <span class="hamburger-line"></span>
            </button>
        </nav>
        
        <!-- Mobile Menu -->
        <div id="mobile-menu" class="mobile-menu">
            <div class="mobile-menu-content">
                <a href="index.html" class="mobile-menu-link" data-page="home">Início</a>
                <a href="index.html#quem-somos" class="mobile-menu-link" data-page="home">Quem Somos</a>
                <a href="lojas.html" class="mobile-menu-link" data-page="lojas">Lojas</a>
                <a href="/vagas.html" class="mobile-menu-link" data-page="vagas">Trabalhe Conosco</a>
                <a href="/farol.html" class="mobile-menu-link" data-page="farol">Farol CRM</a>
                
                <div class="mobile-menu-social">
                    <a href="https://www.facebook.com/credvix.oficial/?locale=pt_BR" aria-label="Facebook" class="social-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v2.385z" />
                        </svg>
                    </a>
                    <a href="https://www.instagram.com/credvix/" aria-label="Instagram" class="social-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.689-.073-4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44 1.441-.645 1.441-1.44-.645-1.44-1.441-1.44z" />
                        </svg>
                    </a>
                    <a href="https://br.linkedin.com/company/credvix" aria-label="LinkedIn" class="social-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
                        </svg>
                    </a>
                </div>
            </div>
        </div>
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
                        Há <span id="company-years"></span> anos oferecendo as melhores soluções em crédito consignado para servidores públicos,
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
                            <span><span id="store-count" data-store-count>+33</span> lojas presentes em 5 estados e o Distrito Federal</span>
                        </li>
                        <li class="flex items-center">
<span class="material-icons mr-3 text-credvix-orange">email</span>
                            <a href="mailto:marketing@credvix.com"
                                class="hover:text-white transition-colors">marketing@credvix.com</a>
                        </li>
                        <li class="flex items-center">
<span class="material-icons mr-3 text-credvix-orange">call</span>
                            <a href="tel:+552730208584" class="hover:text-white transition-colors">
                                (27) 3020-8584
                            </a>
                        </li>
                        <li class="flex items-start">
<span class="material-icons mr-3 mt-1 text-credvix-orange flex-shrink-0">schedule</span>
                            <span>Matriz: Segunda a Sexta, 9h às 18h<br><span class="text-xs text-gray-400">Demais lojas
                                    seguem o horário local.</span></span>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="border-t border-gray-700 pt-6 mt-6 text-center text-gray-400 text-sm">
                <p class="mb-2">&copy; <span id="year"></span> Credvix. Todos os direitos reservados. Operando como
                    franqueada oficial da Help! BMG.</p>
                <p class="mb-3">O crédito consignado está sujeito à análise e aprovação. As condições apresentadas podem variar
                    conforme o convênio e a margem consignável disponível. Consulte sempre as condições específicas
                    antes da contratação. Help! é uma marca registrada do Banco BMG S.A.</p>
                
                <div class="flex flex-wrap justify-center gap-4 text-xs text-gray-400 mb-3">
                    <span>CNPJ: 14.994.452/0001-40</span>
                    <span>|</span>
                    <button class="hover:text-white transition-colors underline" onclick="openLegalModal('privacy')">
                        Política de Privacidade
                    </button>
                    <span>|</span>
                    <button class="hover:text-white transition-colors underline" onclick="openLegalModal('terms')">
                        Termos de Uso
                    </button>
                    <span>|</span>
                    <button class="hover:text-white transition-colors underline" onclick="openLegalModal('sitemap')">
                        Mapa do Site
                    </button>
                </div>
                
                <p class="text-xs text-gray-400">
                    🔒 Seus dados estão protegidos conforme a LGPD (Lei Geral de Proteção de Dados Pessoais - Lei nº 13.709/2018)
                </p>
            </div>

            <div class="mt-10 pt-6 border-t border-gray-700 text-center">
                <p class="text-gray-400 text-sm mb-3">Uma empresa do</p>
                <a href="#" target="_blank" rel="noopener noreferrer">
                    <img src="/img/apis.webp" alt="Logo Apis Grupo" width="114" height="64" class="h-12 mx-auto"
                        onerror="this.onerror=null;this.src='https://placehold.co/150x50/ffffff/000000?text=Apis+Grupo';">
                </a>
            </div>
        </div>
        
        <!-- Modal de Termos Legais -->
        <div id="legal-modal" class="legal-modal hidden">
            <div class="legal-modal-overlay"></div>
            <div class="legal-modal-content">
                <div class="legal-modal-header">
                    <h2 id="legal-modal-title"></h2>
                    <button class="legal-modal-close" onclick="closeLegalModal()">&times;</button>
                </div>
                <div class="legal-modal-body" id="legal-modal-body"></div>
                <div class="legal-modal-footer">
                    <button class="legal-modal-btn" onclick="closeLegalModal()">Fechar</button>
                </div>
            </div>
        </div>
`;

export function loadHeader() {
    const headerElement = document.getElementById('main-header');
    if (headerElement) {
        headerElement.innerHTML = headerHTML;
        initMobileMenu();
        initActivePageIndicator();
        initScrollEffects();
        initBreadcrumb();
    }
}

function initBreadcrumb() {
    const breadcrumbContainer = document.getElementById('breadcrumb-container');
    if (!breadcrumbContainer) return;
    
    const currentPath = window.location.pathname;
    const pathSegments = currentPath.split('/').filter(segment => segment !== '');
    
    let breadcrumbHTML = `
        <div class="breadcrumb-item">
            <a href="/index.html">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                </svg>
                Início
            </a>
        </div>
    `;
    
    if (currentPath.includes('lojas')) {
        breadcrumbHTML += `
            <span class="breadcrumb-separator">/</span>
            <div class="breadcrumb-item active">Lojas</div>
        `;
    } else if (currentPath.includes('vagas')) {
        breadcrumbHTML += `
            <span class="breadcrumb-separator">/</span>
            <div class="breadcrumb-item active">Trabalhe Conosco</div>
        `;
    } else if (currentPath.includes('farol')) {
        breadcrumbHTML += `
            <span class="breadcrumb-separator">/</span>
            <div class="breadcrumb-item active">Farol CRM</div>
        `;
    }
    
    breadcrumbContainer.innerHTML = breadcrumbHTML;
}

function initMobileMenu() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuLinks = document.querySelectorAll('.mobile-menu-link');
    
    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            menuBtn.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });
        
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuBtn.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
        
        mobileMenu.addEventListener('click', (e) => {
            if (e.target === mobileMenu) {
                menuBtn.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
}

function initActivePageIndicator() {
    const currentPath = window.location.pathname;
    const currentPage = currentPath.includes('lojas') ? 'lojas' :
                       currentPath.includes('vagas') ? 'vagas' :
                       currentPath.includes('farol') ? 'farol' : 'home';
    
    document.querySelectorAll('.nav-link, .mobile-menu-link').forEach(link => {
        if (link.dataset.page === currentPage) {
            link.classList.add('active');
        }
    });
}

function initScrollEffects() {
    const header = document.getElementById('main-header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
}

export function loadFooter() {
    const footerElement = document.getElementById('main-footer');
    if (footerElement) {
        footerElement.innerHTML = footerHTML;
        
        // Atualiza o ano dinamicamente
        const yearElement = document.getElementById('year');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }
        
        // Calcula anos desde a fundação (10/08/2011)
        const companyYearsElement = document.getElementById('company-years');
        if (companyYearsElement) {
            const foundationDate = new Date('2011-08-10');
            const today = new Date();
            let yearsInBusiness = today.getFullYear() - foundationDate.getFullYear();
            
            // Se ainda não passou a data de aniversário este ano, subtrai 1
            const hasPassedAnniversary = (today.getMonth() > foundationDate.getMonth()) || 
                (today.getMonth() === foundationDate.getMonth() && today.getDate() >= foundationDate.getDate());
            
            if (!hasPassedAnniversary) {
                yearsInBusiness--;
            }
            
            companyYearsElement.textContent = yearsInBusiness;
        }
        
        // Busca quantidade de lojas ativas do banco de dados
        // Aguarda um pouco para garantir que o DOM está pronto
        setTimeout(() => {
            updateStoreCount();
        }, 500);
    }
}

async function updateStoreCount() {
    try {
        const { supabase } = await import('./supabase-client.js');
        const { data, error } = await supabase
            .from('lojas')
            .select('nome');
        
        if (!error && data) {
            // Filtrar lojas excluindo "Matriz"
            const filteredStores = data.filter(store => 
                !store.nome.toLowerCase().includes('matriz')
            );
            const count = filteredStores.length;
            
            // Atualizar todos os elementos com id="store-count" ou data-store-count
            const storeCountElements = document.querySelectorAll('#store-count, [data-store-count]');
            storeCountElements.forEach(element => {
                element.textContent = `+${count}`;
            });
        }
    } catch (error) {
        console.error('Erro ao buscar contagem de lojas:', error);
    }
}

// Funções para modais de termos legais
window.openLegalModal = function(type) {
    const modal = document.getElementById('legal-modal');
    const title = document.getElementById('legal-modal-title');
    const body = document.getElementById('legal-modal-body');
    
    if (type === 'privacy') {
        title.textContent = 'Política de Privacidade';
        body.innerHTML = getPrivacyPolicy();
    } else if (type === 'terms') {
        title.textContent = 'Termos de Uso';
        body.innerHTML = getTermsOfUse();
    } else if (type === 'sitemap') {
        title.textContent = 'Mapa do Site';
        body.innerHTML = getSitemap();
    }
    
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
};

window.closeLegalModal = function() {
    const modal = document.getElementById('legal-modal');
    modal.classList.add('hidden');
    document.body.style.overflow = '';
};

function getPrivacyPolicy() {
    return `
        <h3>1. Introdução</h3>
        <p>A <strong>Credvix</strong>, inscrita sob o CNPJ 14.994.452/0001-40, está comprometida com a proteção da privacidade e dos dados pessoais de seus clientes, colaboradores e visitantes do site, em conformidade com a Lei Geral de Proteção de Dados Pessoais (LGPD - Lei nº 13.709/2018).</p>
        
        <h3>2. Dados Coletados</h3>
        <p>Coletamos as seguintes informações:</p>
        <ul>
            <li><strong>Dados de Identificação:</strong> Nome completo, CPF, RG, data de nascimento</li>
            <li><strong>Dados de Contato:</strong> E-mail, telefone, endereço</li>
            <li><strong>Dados Profissionais:</strong> Cargo, empresa, currículo (para candidatos a vagas)</li>
            <li><strong>Dados de Navegação:</strong> Cookies, endereço IP, páginas visitadas</li>
        </ul>
        
        <h3>3. Finalidade do Tratamento</h3>
        <p>Utilizamos seus dados pessoais para:</p>
        <ul>
            <li>Processar candidaturas a vagas de emprego</li>
            <li>Enviar comunicações sobre produtos e serviços</li>
            <li>Cumprir obrigações legais e regulatórias</li>
            <li>Melhorar a experiência do usuário no site</li>
        </ul>
        
        <h3>4. Compartilhamento de Dados</h3>
        <p>Seus dados podem ser compartilhados com:</p>
        <ul>
            <li><strong>Autoridades Públicas:</strong> Quando exigido por lei</li>
            <li><strong>Prestadores de Serviço:</strong> Para armazenamento e processamento de dados</li>
        </ul>
        
        <h3>5. Segurança dos Dados</h3>
        <p>Adotamos medidas técnicas e administrativas para proteção dos dados:</p>
        <ul>
            <li>Criptografia SSL/TLS em todas as transmissões</li>
            <li>Controle de acesso restrito aos dados</li>
            <li>Monitoramento contínuo de segurança</li>
            <li>Backup regular de informações</li>
        </ul>
        
        <h3>6. Seus Direitos</h3>
        <p>Você tem direito a:</p>
        <ul>
            <li>Confirmar a existência de tratamento de seus dados</li>
            <li>Acessar seus dados pessoais</li>
            <li>Corrigir dados incompletos ou desatualizados</li>
            <li>Solicitar anonimização, bloqueio ou eliminação</li>
            <li>Revogar consentimento</li>
            <li>Portabilidade dos dados</li>
        </ul>
        
        <h3>7. Retenção de Dados</h3>
        <p>Mantemos seus dados pelo período necessário para cumprir as finalidades descritas ou conforme exigido por lei (geralmente 5 anos após encerramento da relação).</p>
        
        <h3>8. Cookies e Armazenamento Local</h3>
        <p>Este site <strong>NÃO utiliza cookies de rastreamento, publicidade ou análise de comportamento</strong>. Não coletamos dados de navegação para fins comerciais ou de marketing.</p>
        <p>Utilizamos apenas <strong>armazenamento local (localStorage)</strong> do navegador para:</p>
        <ul>
            <li>Salvar suas preferências de acessibilidade (tamanho de fonte, contraste, etc.)</li>
            <li>Melhorar sua experiência de navegação no site</li>
        </ul>
        <p>Esses dados ficam armazenados apenas no seu dispositivo e não são compartilhados com terceiros. Você pode limpar essas informações a qualquer momento através das configurações do seu navegador.</p>
        <p><strong>Importante:</strong> Não utilizamos Google Analytics, Facebook Pixel ou qualquer ferramenta de rastreamento de terceiros.</p>
        
        <h3>9. Contato - Encarregado de Dados</h3>
        <p>Para exercer seus direitos ou esclarecer dúvidas sobre privacidade:</p>
        <p><strong>E-mail:</strong> juridico@credvix.com<br>
        <strong>Telefone:</strong> (27) 3020-8584<br>
        <strong>Endereço:</strong> Consulte nossas lojas</p>
        
        <h3>10. Alterações</h3>
        <p>Esta política pode ser atualizada periodicamente. A versão mais recente estará sempre disponível em nosso site.</p>
        
        <p class="update-date"><strong>Última atualização:</strong> Dezembro de 2025</p>
    `;
}

function getTermsOfUse() {
    return `
        <h3>1. Aceitação dos Termos</h3>
        <p>Ao acessar e utilizar o site da <strong>Credvix</strong> (CNPJ 14.994.452/0001-40), você concorda com estes Termos de Uso. Caso não concorde, por favor, não utilize nossos serviços.</p>
        
        <h3>2. Serviços Oferecidos</h3>
        <p>A Credvix opera como franqueada da <strong>Help! BMG</strong> e oferece:</p>
        <ul>
            <li>Consultoria e intermediação de crédito consignado</li>
            <li>Informações sobre produtos financeiros</li>
            <li>Portal de vagas de emprego</li>
            <li>Localizador de lojas físicas</li>
        </ul>
        
        <h3>3. Elegibilidade</h3>
        <p>Nossos serviços são destinados a:</p>
        <ul>
            <li>Servidores públicos federais, estaduais e municipais</li>
            <li>Aposentados e pensionistas do INSS</li>
            <li>Maiores de 18 anos, civilmente capazes</li>
        </ul>
        
        <h3>4. Cadastro e Conta</h3>
        <p>Ao se cadastrar, você se compromete a:</p>
        <ul>
            <li>Fornecer informações verdadeiras e atualizadas</li>
            <li>Manter a confidencialidade de suas credenciais</li>
            <li>Notificar imediatamente sobre uso não autorizado</li>
            <li>Não compartilhar sua conta com terceiros</li>
        </ul>
        
        <h3>5. Uso Permitido</h3>
        <p>Você pode usar nosso site para:</p>
        <ul>
            <li>Localizar lojas físicas</li>
            <li>Candidatar-se a vagas de emprego</li>
            <li>Entrar em contato com nossa equipe</li>
        </ul>
        
        <h3>6. Uso Proibido</h3>
        <p>É estritamente proibido:</p>
        <ul>
            <li>Fornecer informações falsas ou fraudulentas</li>
            <li>Violar direitos de propriedade intelectual</li>
            <li>Transmitir vírus ou códigos maliciosos</li>
            <li>Utilizar o site para fins ilegais</li>
            <li>Fazer engenharia reversa ou copiar o site</li>
            <li>Sobrecarregar servidores (DoS/DDoS)</li>
        </ul>
        
        <h3>7. Crédito Consignado - Condições</h3>
        <p><strong>Importante:</strong></p>
        <ul>
            <li>Todas as operações estão sujeitas à análise e aprovação</li>
            <li>Taxas e condições variam conforme convênio e margem consignável</li>
            <li>Consulte sempre o CET (Custo Efetivo Total) antes de contratar</li>
            <li>Valores divulgados são exemplificativos</li>
            <li>Help! é marca registrada do Banco BMG S.A.</li>
        </ul>
        
        <p><strong>⚠️ ATENÇÃO:</strong> Este site <strong>NÃO</strong> tem como finalidade fornecer valores de crédito, realizar simulações ou consultas de empréstimos consignados. Para informações detalhadas sobre crédito, taxas, condições e contratação, você deve comparecer presencialmente em uma de nossas lojas físicas. <a href="/lojas.html" target="_blank" style="color: var(--primary-color); text-decoration: underline; font-weight: 600;">Encontre a loja mais próxima aqui</a>.</p>
        
        <h3>8. Propriedade Intelectual</h3>
        <p>Todo o conteúdo do site (textos, imagens, logos, códigos) é de propriedade exclusiva da Credvix e/ou Help! BMG, protegido por direitos autorais.</p>
        
        <h3>9. Isenção de Responsabilidade</h3>
        <p>A Credvix não se responsabiliza por:</p>
        <ul>
            <li>Indisponibilidade temporária do site</li>
            <li>Erros de digitação em informações</li>
            <li>Decisões de crédito do Banco BMG</li>
            <li>Links externos para sites de terceiros</li>
            <li>Perda de dados por falhas técnicas</li>
        </ul>
        
        <h3>10. Limitação de Responsabilidade</h3>
        <p>Em nenhuma hipótese a Credvix será responsável por danos indiretos, lucros cessantes ou danos consequenciais decorrentes do uso do site.</p>
        
        <h3>11. Modificações</h3>
        <p>Reservamo-nos o direito de modificar estes termos a qualquer momento. Alterações entram em vigor imediatamente após publicação no site.</p>
        
        <h3>12. Rescisão</h3>
        <p>Podemos suspender ou encerrar seu acesso ao site imediatamente, sem aviso prévio, em caso de violação destes termos.</p>
        
        <h3>13. Lei Aplicável e Foro</h3>
        <p>Estes termos são regidos pelas leis brasileiras. Fica eleito o foro da comarca de Vitória/ES para dirimir quaisquer controvérsias.</p>
        
        <h3>14. Contato</h3>
        <p>Dúvidas sobre estes termos:</p>
        <p><strong>E-mail:</strong> juridico@credvix.com<br>
        <strong>Telefone:</strong> (27) 3020-8584<br>
        <strong>Endereço:</strong> Consulte nossas lojas</p>
        
        <h3>15. Disposições Gerais</h3>
        <ul>
            <li>A tolerância ao descumprimento de qualquer cláusula não implica renúncia</li>
            <li>Se alguma cláusula for inválida, as demais permanecem em vigor</li>
            <li>Estes termos constituem o acordo integral entre as partes</li>
        </ul>
        
        <p class="update-date"><strong>Última atualização:</strong> Dezembro de 2025</p>
    `;
}

function getSitemap() {
    return `
        <div class="sitemap-container">
            <p class="sitemap-intro">Navegue facilmente por todas as páginas do nosso site:</p>
            
            <div class="sitemap-section">
                <h3>🏠 Página Inicial</h3>
                <ul>
                    <li><a href="/index.html">Home</a> - Página principal</li>
                    <li><a href="/index.html#quem-somos">Quem Somos</a> - História da empresa</li>
                    <li><a href="/index.html#valores">Nossos Valores</a> - Missão, visão e valores</li>
                </ul>
            </div>
            
            <div class="sitemap-section">
                <h3>🏢 Institucional</h3>
                <ul>
                    <li><a href="/lojas.html" target="_blank">Nossas Lojas</a> - Localizador de lojas físicas</li>
                    <li><a href="/farol.html" target="_blank">Farol CRM</a> - Sistema de gestão</li>
                    <li><a href="/enxame.html" target="_blank">Enxame</a> - Portal em construção</li>
                </ul>
            </div>
            
            <div class="sitemap-section">
                <h3>💼 Trabalhe Conosco</h3>
                <ul>
                    <li><a href="/vagas.html" target="_blank">Vagas Abertas</a> - Oportunidades de emprego</li>
                    <li><a href="/vagas.html#banco-talentos" target="_blank">Banco de Talentos</a> - Cadastro de currículo</li>
                </ul>
            </div>
            
            <div class="sitemap-section">
                <h3>📞 Contato</h3>
                <ul>
                    <li><strong>Telefone:</strong> (27) 3020-8584</li>
                    <li><strong>E-mail:</strong> marketing@credvix.com</li>
                    <li><strong>WhatsApp:</strong> Disponível em cada loja</li>
                </ul>
            </div>
            
            <div class="sitemap-section">
                <h3>📄 Informações Legais</h3>
                <ul>
                    <li><a href="javascript:void(0)" onclick="closeLegalModal(); setTimeout(() => openLegalModal('privacy'), 300)">Política de Privacidade</a> - Como tratamos seus dados</li>
                    <li><a href="javascript:void(0)" onclick="closeLegalModal(); setTimeout(() => openLegalModal('terms'), 300)">Termos de Uso</a> - Regras de utilização do site</li>
                    <li><strong>CNPJ:</strong> 14.994.452/0001-40</li>
                </ul>
            </div>
            
            <div class="sitemap-section">
                <h3>🌐 Redes Sociais</h3>
                <ul>
                    <li><a href="https://www.facebook.com/credvix.oficial/?locale=pt_BR" target="_blank" rel="noopener noreferrer">Facebook</a></li>
                    <li><a href="https://www.instagram.com/credvix/" target="_blank" rel="noopener noreferrer">Instagram</a></li>
                    <li><a href="https://br.linkedin.com/company/credvix" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
                </ul>
            </div>
            
            <div class="sitemap-footer">
                <p><strong>📍 Presença Regional:</strong> <span data-store-count>+33</span> lojas em 5 estados e o Distrito Federal</p>
                <p><strong>🏢 Parceria:</strong> Franqueada oficial Help! BMG</p>
                <p><strong>🏆 Grupo:</strong> Apis Grupo</p>
                <p class="sitemap-seo"><strong>SEO:</strong> Versão para robôs de busca disponível em <a href="/sitemap.xml" target="_blank">sitemap.xml</a></p>
            </div>
        </div>
    `;
}