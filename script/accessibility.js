// Gerenciador de Acessibilidade
class AccessibilityManager {
    constructor() {
        this.fontSize = 0; // -1, 0, 1, 2
        this.contrast = 'normal'; // normal, high, inverted
        this.highlightLinks = false;
        this.lineHeight = false;
        this.vlibrasEnabled = false;
        
        this.loadPreferences();
        this.createAccessibilityButton();
        this.createAlertModal();
        this.applyPreferences();
        this.initVLibras();
    }

    loadPreferences() {
        const saved = localStorage.getItem('accessibility-preferences');
        if (saved) {
            const prefs = JSON.parse(saved);
            this.fontSize = prefs.fontSize || 0;
            this.contrast = prefs.contrast || 'normal';
            this.highlightLinks = prefs.highlightLinks || false;
            this.lineHeight = prefs.lineHeight || false;
            this.vlibrasEnabled = prefs.vlibrasEnabled || false;
        }
    }

    savePreferences() {
        const prefs = {
            fontSize: this.fontSize,
            contrast: this.contrast,
            highlightLinks: this.highlightLinks,
            lineHeight: this.lineHeight,
            vlibrasEnabled: this.vlibrasEnabled
        };
        localStorage.setItem('accessibility-preferences', JSON.stringify(prefs));
    }

    createAccessibilityButton() {
        const button = document.createElement('button');
        button.id = 'accessibility-toggle';
        button.className = 'accessibility-button';
        button.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z"/>
            </svg>
        `;
        button.setAttribute('aria-label', 'Menu de Acessibilidade');
        button.onclick = () => this.togglePanel();
        document.body.appendChild(button);

        this.createPanel();
    }

    createAlertModal() {
        const modal = document.createElement('div');
        modal.id = 'accessibility-alert-modal';
        modal.className = 'accessibility-alert-modal hidden';
        modal.innerHTML = `
            <div class="accessibility-alert-overlay"></div>
            <div class="accessibility-alert-content">
                <div class="accessibility-alert-icon">✓</div>
                <h3 class="accessibility-alert-title">Sucesso!</h3>
                <p class="accessibility-alert-message"></p>
                <button class="accessibility-alert-btn">OK</button>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Evento para fechar
        modal.querySelector('.accessibility-alert-btn').onclick = () => this.closeAlert();
        modal.querySelector('.accessibility-alert-overlay').onclick = () => this.closeAlert();
    }

    showAlert(message, title = 'Sucesso!', icon = '✓') {
        const modal = document.getElementById('accessibility-alert-modal');
        if (!modal) return;
        
        modal.querySelector('.accessibility-alert-icon').textContent = icon;
        modal.querySelector('.accessibility-alert-title').textContent = title;
        modal.querySelector('.accessibility-alert-message').textContent = message;
        modal.classList.remove('hidden');
        
        // Foco no botão OK
        setTimeout(() => {
            modal.querySelector('.accessibility-alert-btn').focus();
        }, 100);
    }

    closeAlert() {
        const modal = document.getElementById('accessibility-alert-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    createPanel() {
        const panel = document.createElement('div');
        panel.id = 'accessibility-panel';
        panel.className = 'accessibility-panel hidden';
        panel.innerHTML = `
            <div class="accessibility-header">
                <h3>♿ Acessibilidade</h3>
                <button class="close-btn" aria-label="Fechar">&times;</button>
            </div>
            
            <div class="accessibility-content">
                <div class="accessibility-section">
                    <label>🔤 Tamanho do Texto</label>
                    <div class="button-group">
                        <button data-action="font-decrease" title="Diminuir texto">A-</button>
                        <button data-action="font-reset" title="Tamanho padrão">A</button>
                        <button data-action="font-increase" title="Aumentar texto">A+</button>
                    </div>
                    <span class="current-size">Tamanho: <span id="font-indicator">Normal</span></span>
                </div>

                <div class="accessibility-section">
                    <label>🎨 Contraste</label>
                    <div class="radio-group">
                        <label class="radio-label">
                            <input type="radio" name="contrast" value="normal" checked>
                            <span>Normal</span>
                        </label>
                        <label class="radio-label">
                            <input type="radio" name="contrast" value="high">
                            <span>Alto Contraste</span>
                        </label>
                        <label class="radio-label">
                            <input type="radio" name="contrast" value="inverted">
                            <span>Invertido</span>
                        </label>
                    </div>
                </div>

                <div class="accessibility-section">
                    <label>✨ Recursos Adicionais</label>
                    <div class="checkbox-group">
                        <label class="checkbox-label">
                            <input type="checkbox" id="highlight-links">
                            <span>Destacar Links</span>
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" id="line-height">
                            <span>Espaçamento de Linhas</span>
                        </label>
                    </div>
                </div>

                <div class="accessibility-section">
                    <label>🔊 Leitor em Libras</label>
                    <button class="vlibras-toggle" data-action="toggle-vlibras">
                        <span class="vlibras-icon">🤟</span>
                        <span id="vlibras-status">Ativar VLibras</span>
                    </button>
                    <small class="helper-text">Tradutor de Libras do Governo Federal</small>
                </div>

                <div class="accessibility-section">
                    <button class="reset-all" data-action="reset-all">
                        🔄 Restaurar Padrão
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(panel);
        this.attachEventListeners();
    }

    attachEventListeners() {
        const panel = document.getElementById('accessibility-panel');
        
        // Fechar painel
        panel.querySelector('.close-btn').onclick = () => this.togglePanel();
        
        // Tamanho de fonte
        panel.querySelector('[data-action="font-decrease"]').onclick = () => this.changeFontSize(-1);
        panel.querySelector('[data-action="font-reset"]').onclick = () => this.changeFontSize(0, true);
        panel.querySelector('[data-action="font-increase"]').onclick = () => this.changeFontSize(1);
        
        // Contraste
        panel.querySelectorAll('input[name="contrast"]').forEach(radio => {
            radio.onchange = (e) => this.changeContrast(e.target.value);
        });
        
        // Destacar links
        panel.querySelector('#highlight-links').onchange = (e) => {
            this.highlightLinks = e.target.checked;
            this.applyHighlightLinks();
            this.savePreferences();
        };
        
        // Espaçamento de linhas
        panel.querySelector('#line-height').onchange = (e) => {
            this.lineHeight = e.target.checked;
            this.applyLineHeight();
            this.savePreferences();
        };
        
        // VLibras
        panel.querySelector('[data-action="toggle-vlibras"]').onclick = () => this.toggleVLibras();
        
        // Resetar tudo
        panel.querySelector('[data-action="reset-all"]').onclick = () => this.resetAll();
    }

    togglePanel() {
        const panel = document.getElementById('accessibility-panel');
        panel.classList.toggle('hidden');
    }

    changeFontSize(delta, reset = false) {
        if (reset) {
            this.fontSize = 0;
        } else {
            this.fontSize = Math.max(-1, Math.min(2, this.fontSize + delta));
        }
        
        this.applyFontSize();
        this.updateFontIndicator();
        this.savePreferences();
    }

    applyFontSize() {
        document.documentElement.classList.remove('font-small', 'font-medium', 'font-large', 'font-xlarge');
        
        const classes = {
            '-1': 'font-small',
            '0': '',
            '1': 'font-large',
            '2': 'font-xlarge'
        };
        
        const className = classes[this.fontSize];
        if (className) {
            document.documentElement.classList.add(className);
        }
    }

    updateFontIndicator() {
        const indicator = document.getElementById('font-indicator');
        const labels = {
            '-1': 'Pequeno',
            '0': 'Normal',
            '1': 'Grande',
            '2': 'Muito Grande'
        };
        indicator.textContent = labels[this.fontSize];
    }

    changeContrast(mode) {
        this.contrast = mode;
        this.applyContrast();
        this.savePreferences();
    }

    applyContrast() {
        document.documentElement.classList.remove('contrast-high', 'contrast-inverted');
        
        if (this.contrast === 'high') {
            document.documentElement.classList.add('contrast-high');
        } else if (this.contrast === 'inverted') {
            document.documentElement.classList.add('contrast-inverted');
        }
    }

    applyHighlightLinks() {
        if (this.highlightLinks) {
            document.documentElement.classList.add('highlight-links');
        } else {
            document.documentElement.classList.remove('highlight-links');
        }
    }

    applyLineHeight() {
        if (this.lineHeight) {
            document.documentElement.classList.add('increased-line-height');
        } else {
            document.documentElement.classList.remove('increased-line-height');
        }
    }

    applyPreferences() {
        this.applyFontSize();
        this.applyContrast();
        this.applyHighlightLinks();
        this.applyLineHeight();
        
        // Atualizar UI do painel quando carregar
        setTimeout(() => {
            this.updateFontIndicator();
            
            const contrastRadio = document.querySelector(`input[name="contrast"][value="${this.contrast}"]`);
            if (contrastRadio) contrastRadio.checked = true;
            
            const highlightCheckbox = document.getElementById('highlight-links');
            if (highlightCheckbox) highlightCheckbox.checked = this.highlightLinks;
            
            const lineHeightCheckbox = document.getElementById('line-height');
            if (lineHeightCheckbox) lineHeightCheckbox.checked = this.lineHeight;
        }, 100);
    }

    initVLibras() {
        if (this.vlibrasEnabled) {
            this.loadVLibrasScript();
        }
    }

    toggleVLibras() {
        this.vlibrasEnabled = !this.vlibrasEnabled;
        
        if (this.vlibrasEnabled) {
            this.loadVLibrasScript();
            document.getElementById('vlibras-status').textContent = 'VLibras Ativado';
        } else {
            this.removeVLibras();
            document.getElementById('vlibras-status').textContent = 'Ativar VLibras';
        }
        
        this.savePreferences();
    }

    loadVLibrasScript() {
        if (document.getElementById('vlibras-script')) return;
        
        const script = document.createElement('script');
        script.id = 'vlibras-script';
        script.src = 'https://vlibras.gov.br/app/vlibras-plugin.js';
        script.onload = () => {
            new window.VLibras.Widget('https://vlibras.gov.br/app');
        };
        document.head.appendChild(script);
    }

    removeVLibras() {
        const script = document.getElementById('vlibras-script');
        if (script) script.remove();
        
        const widget = document.querySelector('[vw]');
        if (widget) widget.remove();
    }

    resetAll() {
        this.fontSize = 0;
        this.contrast = 'normal';
        this.highlightLinks = false;
        this.lineHeight = false;
        this.vlibrasEnabled = false;
        
        this.applyPreferences();
        this.removeVLibras();
        this.savePreferences();
        
        document.getElementById('vlibras-status').textContent = 'Ativar VLibras';
        
        this.showAlert('Configurações de acessibilidade restauradas para o padrão.', 'Restaurado!', '🔄');
    }
}

// Inicializar quando o DOM estiver pronto
export function initAccessibility() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            new AccessibilityManager();
        });
    } else {
        new AccessibilityManager();
    }
}
