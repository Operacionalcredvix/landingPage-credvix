# 🚀 Landing Page - Credvix & Help!

Landing page institucional da **Credvix & Help!**, empresa especializada em crédito consignado com atuação em 6 estados brasileiros (ES, MG, GO, BA, MT, DF).

## 📋 Sobre o Projeto

Site responsivo e moderno desenvolvido para apresentar a empresa, suas lojas, vagas de emprego e receber candidaturas online. Integrado com Supabase para gestão dinâmica de conteúdo.

### ✨ Principais Funcionalidades

- **🏠 Home**: Carousel hero com imagens responsivas, história da empresa e valores
- **🏪 Lojas**: Localizador de lojas com filtros por estado e busca por cidade
- **💼 Trabalhe Conosco**: Portal de vagas com sistema de candidatura online
- **📄 Currículo**: Upload de currículos (PDF/DOCX) para vaga storage do Supabase
- **🎨 Design Responsivo**: Totalmente adaptado para mobile, tablet e desktop

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
public.lojas       -- Cadastro de lojas/unidades
public.vagas       -- Vagas de emprego ativas
public.candidatos  -- Candidaturas recebidas
```

## 📁 Estrutura do Projeto

```
landingPage/
├── index.html              # Página principal
├── lojas.html             # Localizador de lojas
├── vagas.html             # Portal de vagas
├── enxame.html            # Página "Em Construção" (CRM)
├── style.css              # Estilos globais customizados
├── img/                   # Imagens e assets
└── script/
    ├── main.js                  # Inicialização e orquestração
    ├── config.js                # Credenciais Supabase (gitignored)
    ├── supabase-client.js       # Cliente Supabase
    ├── components.js            # Header e Footer reutilizáveis
    ├── storeLocator.js          # Lógica de listagem de lojas
    ├── jobBoard.js              # Lógica de vagas
    ├── modalHandler.js          # Upload de currículos
    ├── hero-swiper.js           # Carousel principal
    ├── testimonial-swiper.js    # Carousel de depoimentos
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
    background-color: rgb(72, 43, 116);   /* Roxo Help! */
}
```

### Imagens do Hero

Substitua as imagens em `img/` e atualize em `index.html`:

```html
<div class="slide-background" 
     style="background-image: url('img/sua-imagem.jpg');">
</div>
```

**Tamanhos recomendados:**
- Desktop: 2560×1440px ou 1920×1080px (16:9)
- Mobile: 1080×1440px (3:4)

## 📊 Funcionalidades Detalhadas

### 1. Localizador de Lojas

- Filtro por estado (dropdown)
- Busca por nome ou cidade
- Cards com WhatsApp e Instagram
- Integração em tempo real com `public.lojas`

### 2. Portal de Vagas

- Listagem de vagas ativas
- Filtros: localidade, título, categoria (Aberta/Banco de Talentos)
- Modal de candidatura com validação
- Upload de currículo (máx 5MB, PDF/DOC/DOCX)

### 3. Sistema de Candidatura

**Fluxo:**
1. Usuário preenche formulário (nome, email, telefone)
2. Seleciona arquivo de currículo
3. Upload para Supabase Storage (`curriculos/`)
4. Registro em `public.candidatos` com URL pública do arquivo
5. Feedback visual de sucesso/erro

## 🔒 Segurança

### ⚠️ Importante

- **NUNCA** commite `script/config.js` (já está no `.gitignore`)
- Use apenas `SUPABASE_ANON_KEY` no frontend
- `SUPABASE_SERVICE_KEY` deve ficar apenas no backend/servidor
- RLS está ativo em todas as tabelas públicas

### Boas Práticas

- ✅ Validação de tipos de arquivo no frontend e storage
- ✅ Limite de tamanho (5MB) para uploads
- ✅ Políticas RLS restritivas
- ✅ HTTPS obrigatório em produção

## 📱 Responsividade

O site é totalmente responsivo com breakpoints:

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

Componentes testados em:
- iPhone (Safari)
- Android (Chrome)
- iPad
- Desktop (Chrome, Firefox, Safari, Edge)

## 🚀 Deploy

### Netlify (Recomendado)

1. Conecte o repositório GitHub
2. Configure variáveis de ambiente:
   ```
   SUPABASE_URL=https://seu-projeto.supabase.co
   SUPABASE_ANON_KEY=sua-chave-anon
   ```
3. Deploy automático a cada push

### Vercel

```bash
npm i -g vercel
vercel --prod
```

### GitHub Pages

```bash
# Configure branch gh-pages
git checkout -b gh-pages
git push origin gh-pages
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

### Padrão de Commits

Seguimos [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `refactor:` Refatoração de código
- `style:` Mudanças de estilo/formatação
- `docs:` Documentação
- `chore:` Tarefas de build/configuração

## 📝 Roadmap

- [ ] Sistema de newsletter
- [ ] Chat online (WhatsApp Business)
- [ ] Calculadora de crédito consignado
- [ ] Integração com Google Analytics
- [ ] PWA (Progressive Web App)
- [ ] Dashboard administrativo (Enxame CRM)

## 📄 Licença

Este projeto é propriedade da **Credvix** e do **Grupo Apis**. Todos os direitos reservados.

## 👥 Equipe

- **Desenvolvimento**: Operacional Credvix
- **Design**: Equipe Credvix
- **Conteúdo**: Marketing Credvix

## 📞 Contato

- **Site**: [credvix.com](https://credvix.com)
- **Email**: markenting@credvix.com
- **Telefone**: (27) 3020-8584
- **Instagram**: [@credvix](https://instagram.com/credvix)

---

<div align="center">
  
**Desenvolvido com ❤️ pela equipe Credvix**

[![Credvix](https://img.shields.io/badge/Credvix-F37021?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyczQuNDggMTAgMTAgMTAgMTAtNC40OCAxMC0xMFMxNy41MiAyIDEyIDJ6bTAgMThjLTQuNDEgMC04LTMuNTktOC04czMuNTktOCA4LTggOCAzLjU5IDggOC0zLjU5IDgtOCA4eiIvPjwvc3ZnPg==)](https://credvix.com)
[![Help!](https://img.shields.io/badge/Help!-482B74?style=for-the-badge)](https://credvix.com)

</div>
