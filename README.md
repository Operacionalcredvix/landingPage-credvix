# 🚀 Landing Page - Credvix & Help!

Landing page institucional da **Credvix & Help!**, empresa especializada em crédito consignado com atuação em 6 estados brasileiros (ES, MG, GO, BA, MT, DF).

## 📋 Sobre o Projeto

Site responsivo e moderno desenvolvido para apresentar a empresa, suas lojas, vagas de emprego e receber candidaturas online. Integrado com Supabase para gestão dinâmica de conteúdo.

### ✨ Principais Funcionalidades

- **🏠 Home**: Carousel hero com imagens responsivas (desktop/mobile automático), história da empresa e valores
- **🏪 Lojas**: Localizador de lojas com filtros por estado, busca por cidade e contador dinâmico (+32 lojas)
- **💼 Trabalhe Conosco**: Portal de vagas com categorias visuais (Abertas/Banco de Talentos) e sistema de candidatura online
- **📄 Currículo**: Upload de currículos (PDF/DOCX) para bucket storage do Supabase com validação de arquivo
- **🎨 Design Responsivo**: Totalmente adaptado para mobile, tablet e desktop com imagens otimizadas por dispositivo
- **♿ Acessibilidade**: Painel completo com controle de fonte, contraste, espaçamento e suporte VLibras

## 🛠️ Tecnologias Utilizadas

### Frontend
- **HTML5** - Estrutura semântica
- **CSS3** - Estilização customizada com variáveis CSS
- **JavaScript (ES6 Modules)** - Lógica modular e moderna
- **Tailwind CSS** (CDN) - Framework CSS utilitário
- **Swiper.js** - Carousels/sliders modernos

### Backend/Serviços
- **Supabase** - Backend as a Service
  - PostgreSQL Database
  - Storage para currículos
  - Row Level Security (RLS)
  - Realtime subscriptions

### Estrutura de Dados

```sql
-- Tabelas principais
public.lojas       -- Cadastro de lojas/unidades (filtrado por "Matriz" = 32 lojas ativas)
public.vagas       -- Vagas de emprego com categorias (Aberta/Banco de Talentos)
public.candidatos  -- Candidaturas recebidas com URL do currículo
public.auditoria   -- Log de ações no sistema
```

### Storage

```
curriculos/
  ├── nome-da-loja/
  │   ├── candidato_timestamp.pdf
  │   └── candidato_timestamp.docx
```

## 📁 Estrutura do Projeto

```
landingPage/
├── index.html              # Página principal
├── lojas.html             # Localizador de lojas
├── vagas.html             # Portal de vagas
├── farol.html             # Página institucional Farol
├── enxame.html            # Página "Em Construção" (CRM)
├── sitemap.xml            # Sitemap para SEO
├── style.css              # Estilos globais customizados
├── img/                   # Imagens e assets
│   ├── banner.jpeg              # Hero desktop slide 1
│   ├── banner-mobile.jpeg       # Hero mobile slide 1
│   ├── quem-somos.jpg           # Hero desktop slide 2
│   ├── quem-somos-mobile.jpg    # Hero mobile slide 2
│   ├── somos-help.jpg           # Hero desktop slide 3
│   └── somos-help-mobile.jpg    # Hero mobile slide 3
└── script/
    ├── main.js                  # Inicialização e orquestração
    ├── config.js                # Credenciais Supabase (gitignored)
    ├── supabase-client.js       # Cliente Supabase
    ├── components.js            # Header e Footer reutilizáveis
    ├── storeLocator.js          # Lógica de listagem de lojas com contador dinâmico
    ├── jobBoard.js              # Lógica de vagas com categorização visual
    ├── modalHandler.js          # Upload de currículos com cores dinâmicas
    ├── hero-swiper.js           # Carousel principal com imagens responsivas
    ├── testimonial-swiper.js    # Carousel de depoimentos
    ├── accessibility.js         # Sistema de acessibilidade (WCAG)
    └── animations.js            # Animações on-scroll
```

## 🚀 Começando

## 🎨 Customização

### Cores da Marca

Edite as variáveis CSS em `style.css`:

```css
:root {
    --primary-color: rgb(242, 99, 34);    /* Laranja Credvix */
    --secondary-color: #4B5563;           /* Cinza escuro */
    --text-color: #374151;
    --background-color: #F9FAFB;
}

.bg-help-purple { 
    background-color: rgb(105, 56, 176);  /* Roxo Help! (#6938B0) */
}

.text-credvix-orange { 
    color: rgb(243, 112, 33);             /* Laranja principal (#F37021) */
}
```

**Cores dinâmicas do modal (modalHandler.js):**
```javascript
// Vaga Aberta
background: 'linear-gradient(to right, #F37021, #d97829)'

// Banco de Talentos
background: 'linear-gradient(to right, #6938B0, #5b21b6)'
```

### Imagens do Hero

O sistema possui **detecção automática** de dispositivo e troca as imagens conforme a tela:

```javascript
// hero-swiper.js detecta automaticamente
const isMobile = window.innerWidth <= 768;
```

Substitua as imagens em `img/` mantendo os pares desktop/mobile:

**Slide 1 - Banner Principal:**
- Desktop: `img/banner.jpeg` (recomendado: 1920×1080px)
- Mobile: `img/banner-mobile.jpeg` (recomendado: 720×630px)

**Slide 2 - Quem Somos:**
- Desktop: `img/quem-somos.jpg` (recomendado: 1920×1080px)
- Mobile: `img/quem-somos-mobile.jpg` (recomendado: 720×630px)

**Slide 3 - Trabalhe Conosco:**
- Desktop: `img/somos-help.jpg` (recomendado: 1920×1080px)
- Mobile: `img/somos-help-mobile.jpg` (recomendado: 720×630px)

**Proporções CSS aplicadas:**
- Desktop: Flexível com `background-size: cover`
- Mobile: Flexível com `background-size: cover` e ajustes de posição

## 📊 Funcionalidades Detalhadas

### 1. Localizador de Lojas

- **Contador dinâmico**: Exibe "+32 lojas" em tempo real (total - Matriz)
- Filtro por estado (dropdown)
- Busca por nome ou cidade
- Cards com WhatsApp e Instagram
- Badge "Mais Próxima" baseada em geolocalização
- Integração em tempo real com `public.lojas`
- Filtro automático: exclui loja "Matriz" da contagem

### 2. Portal de Vagas

- **Categorias visuais**: Cards com cores distintas
  - 🟠 **Vagas Abertas**: Gradiente laranja (#F37021)
  - 🟣 **Banco de Talentos**: Gradiente roxo (#6938B0)
- Listagem de vagas ativas com lazy loading
- Filtros: localidade, título, categoria
- **Modal dinâmico**: Muda de cor conforme tipo de vaga
- Upload de currículo com validação (máx 5MB, PDF/DOC/DOCX)
- Feedback visual de sucesso/erro

### 3. Sistema de Candidatura

**Fluxo completo:**
1. Usuário clica em "Candidatar-se" (botão colorido por categoria)
2. Modal abre com **header personalizado** (laranja ou roxo)
3. Preenche formulário moderno com ícones:
   - Nome completo
   - E-mail
   - Telefone (WhatsApp) com validação
4. Seleciona arquivo de currículo (drag-and-drop estilizado)
5. **Validações aplicadas:**
   - Tipo de arquivo (PDF, DOC, DOCX)
   - Tamanho máximo (5MB)
   - Campos obrigatórios
6. Upload para Supabase Storage (`curriculos/nome-da-loja/`)
7. Registro em `public.candidatos` com:
   - Dados do candidato
   - URL pública do currículo
   - Tipo de candidatura normalizado
   - Timestamp automático
8. Feedback visual com animação de sucesso
9. Modal fecha automaticamente após 4 segundos

**Recursos visuais do modal:**
- Header com gradiente personalizado por categoria
- Ícones SVG em todos os campos
- Badge do WhatsApp com ícone oficial
- Botão de envio com gradiente animado
- Estados de loading, sucesso e erro
- Design glassmorphism no header


### Boas Práticas

- ✅ Validação de tipos de arquivo no frontend e storage
- ✅ Limite de tamanho (5MB) para uploads
- ✅ Políticas RLS restritivas
- ✅ HTTPS obrigatório em produção
- ✅ Sanitização de nomes de arquivo (remove acentos e caracteres especiais)
- ✅ Timestamps únicos para evitar sobrescrita de arquivos

## 📱 Responsividade

O site é totalmente responsivo com breakpoints e recursos adaptativos:

### Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Recursos Responsivos

**Hero Carousel:**
- Detecção automática de dispositivo
- Imagens otimizadas por tamanho de tela
- Swap dinâmico em tempo de execução
- Event listener em resize para ajuste em tempo real

**Cards de Vagas:**
- Layout adaptável (grid → coluna única)
- Badges responsivos
- Botões full-width em mobile

**Modal de Candidatura:**
- Largura ajustável (max-w-lg)
- Padding reduzido em telas pequenas
- Upload de arquivo otimizado para touch
- Teclado virtual considerado

**Localizador de Lojas:**
- Grid responsivo de cards
- Filtros empilhados verticalmente em mobile
- Mapa adaptável (futuro)

### Dispositivos Testados

- ✅ iPhone SE, 12, 13, 14 (Safari)
- ✅ Samsung Galaxy S21, S22 (Chrome)
- ✅ iPad Air, Pro (Safari)
- ✅ Desktop HD, Full HD, 4K (Chrome, Firefox, Safari, Edge)
- ✅ Surface Pro (Edge)

## 🚀 Deploy

### Hostinger (Produção Atual)

O deploy é realizado automaticamente via **integração Git da Hostinger**:

1. **Configuração Inicial:**
   - Acesse o painel da Hostinger
   - Vá em **Websites** → Seu domínio
   - Ative **Git Deployment** nas configurações

2. **Conectar Repositório:**
   - Conecte com GitHub (Operacionalcredvix/landingPage-credvix)
   - Selecione a branch `main`
   - Configure o diretório de deploy (geralmente `/public_html`)

3. **Deploy Automático:**
   ```bash
   # Faça suas alterações localmente
   git add .
   git commit -m "feat: sua alteração"
   git push origin main
   
   # A Hostinger detecta o push e faz deploy automático
   ```

4. **Variáveis de Ambiente:**
   - Configure no painel: **Configurações Avançadas** → **Variáveis de Ambiente**
   - Adicione:
     - `SUPABASE_URL`
     - `SUPABASE_ANON_KEY`

5. **Domínio e SSL:**
   - Domínio: credvix.com
   - SSL: Configurado automaticamente pela Hostinger (Let's Encrypt)

**Status do Deploy:**
- ✅ Auto-deploy ativo na branch `main`
- ✅ SSL/HTTPS habilitado
- ✅ CDN otimizado da Hostinger
- ✅ Cache automático de assets



Este é um projeto **privado e interno da Credvix**. Acesso restrito aos colaboradores autorizados.

### Padrão de Commits

Seguimos [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `refactor:` Refatoração de código
- `style:` Mudanças de estilo/formatação
- `docs:` Documentação
- `chore:` Tarefas de build/configuração

### Fluxo de Trabalho

1. Crie uma branch para sua feature (`git checkout -b feature/nome-da-feature`)
2. Commit suas mudanças seguindo o padrão acima
3. Push para o repositório (`git push origin feature/nome-da-feature`)
4. Deploy automático via Hostinger após merge na `main`

## 📝 Roadmap

- [x] Sistema de candidaturas com upload de currículos
- [x] Contador dinâmico de lojas (+32)
- [x] Imagens responsivas no hero (desktop/mobile)
- [x] Categorização visual de vagas (cores por tipo)
- [x] Modal de candidatura com cores dinâmicas
- [x] Sistema de acessibilidade (WCAG 2.1)
- [x] Painel de controle de fonte e contraste
- [x] Integração VLibras (Libras virtual)


## 📄 Licença

**Projeto Privado** - Propriedade exclusiva da **Credvix** e do **Grupo Apis**.  
Todos os direitos reservados. Uso interno apenas.

## 👥 Equipe de Desenvolvimento

- **Desenvolvimento**: Equipe Operacional Credvix
- **Design**: Equipe Credvix
- **Conteúdo**: Marketing Credvix
- **Infraestrutura**: TI Credvix

---

<div align="center">
  
**Desenvolvido com ❤️ pela equipe Credvix**

[![Credvix](https://img.shields.io/badge/Credvix-F37021?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyczQuNDggMTAgMTAgMTAgMTAtNC40OCAxMC0xMFMxNy41MiAyIDEyIDJ6bTAgMThjLTQuNDEgMC04LTMuNTktOC04czMuNTktOCA4LTggOCAzLjU5IDggOC0zLjU5IDgtOCA4eiIvPjwvc3ZnPg==)](https://credvix.com)
[![Help!](https://img.shields.io/badge/Help!-482B74?style=for-the-badge)](https://credvix.com)

</div>
