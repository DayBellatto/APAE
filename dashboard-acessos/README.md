# Dashboard APAE - Sistema de Gestão

Sistema completo de dashboard desenvolvido em HTML, CSS e JavaScript puro, com backend opcional em Python Flask.

## 🚀 Funcionalidades

### 🔐 Sistema de Autenticação
- Tela de login responsiva baseada no design original
- Validação de email e campos obrigatórios
- Persistência de sessão com localStorage
- Suporte a diferentes tipos de usuário (admin/comum)

### 🏠 Dashboard Principal
- **5 Módulos principais**:
  1. **Principal** - Resumo e métricas do sistema
  2. **Escalas** - Gerenciamento de escalas de trabalho
  3. **Funcionários** - Gestão de colaboradores
  4. **Pacientes** - Prontuários e informações
  5. **Configurações** - Apenas para administradores

### 🛡️ Controle de Acesso
- Card de "Configurações" só aparece para usuários admin
- Badge visual indicando permissões
- Validação de sessão

## 📁 Estrutura do Projeto

\`\`\`
dashboard-apae/
├── index.html              # Página principal
├── styles/
│   └── main.css            # Estilos principais
├── js/
│   ├── auth.js             # Gerenciamento de autenticação
│   ├── dashboard.js        # Lógica do dashboard
│   └── main.js             # Controle principal da aplicação
├── images/                 # Imagens do sistema
├── backend/                # Backend Python (opcional)
│   ├── app.py              # Servidor Flask
│   └── requirements.txt    # Dependências Python
└── README.md
\`\`\`

## 🔧 Como Executar

### Versão Frontend Apenas (Simulação)
\`\`\`bash
# Servir arquivos estáticos
python -m http.server 8000
# ou
npx serve .

# Acessar: http://localhost:8000
\`\`\`

### Versão com Backend Python
\`\`\`bash
# Instalar dependências do backend
cd backend
pip install -r requirements.txt

# Executar backend
python app.py

# Em outro terminal, servir frontend
python -m http.server 8000

# Backend: http://localhost:5000
# Frontend: http://localhost:8000
\`\`\`

## 👤 Usuários de Teste

### Usuário Comum
- **Email**: `user@teste.com`
- **Senha**: `123456`

### Administrador
- **Email**: `admin@teste.com`
- **Senha**: `admin123`

## 🎨 Características Técnicas

- **HTML5** semântico e acessível
- **CSS3** com Grid e Flexbox
- **JavaScript ES6+** modular
- **Design responsivo** para mobile e desktop
- **Animações suaves** e transições
- **Validação em tempo real**
- **Persistência de dados** com localStorage

## 🔌 API Endpoints (Backend)

- `POST /api/login` - Autenticação
- `POST /api/verify-session` - Verificar sessão
- `POST /api/logout` - Logout
- `GET /api/dashboard-stats` - Estatísticas do dashboard

## 📱 Responsividade

O sistema é totalmente responsivo e funciona em:
- 📱 Smartphones (320px+)
- 📱 Tablets (768px+)
- 💻 Desktops (1024px+)
- 🖥️ Telas grandes (1200px+)

## 🔒 Segurança

- Validação de entrada no frontend e backend
- Hash de senhas com SHA-256
- Tokens de sessão seguros
- Proteção contra XSS básica
- Validação de permissões por módulo

## 🚀 Próximos Passos

- [ ] Implementar módulos específicos
- [ ] Adicionar sistema de notificações
- [ ] Integrar com banco de dados real
- [ ] Implementar upload de arquivos
- [ ] Adicionar relatórios e gráficos
