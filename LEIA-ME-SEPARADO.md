# Dashboard APAE - Versão Separada (Login + Dashboard)

## 🎯 Sobre o Projeto

Este é o dashboard APAE completamente redesenhado conforme solicitado, com **login e dashboard em arquivos separados**. A tela de login mantém o estilo original do projeto inicial, enquanto o dashboard possui um design moderno e aprimorado.

## ✨ Principais Características

### 🔐 **Sistema de Autenticação Separado**
- **Login independente** (`login.html`) com estilo original preservado
- **Dashboard separado** (`dashboard.html`) com design moderno
- **Redirecionamento automático** após login bem-sucedido
- **Proteção de rotas** - dashboard só é acessível após autenticação
- **Logout funcional** que retorna para a tela de login

### 🎨 **Design Preservado no Login**
- **Estilo original mantido** exatamente como no projeto inicial
- **Layout 30/70** (formulário/imagem) preservado
- **Cores e tipografia originais** mantidas
- **Ícones sociais** e elementos visuais preservados
- **Animações e efeitos** do design original

### 📊 **Dashboard Moderno e Aprimorado**
- **Interface limpa e profissional** com design system consistente
- **Sidebar responsiva** com navegação intuitiva
- **Cards de estatísticas** com ícones coloridos e indicadores
- **Gráficos interativos** usando Chart.js
- **Layout totalmente responsivo** para mobile e desktop
- **Paleta de cores harmoniosa** (azul, verde, roxo, laranja)

## 📁 Estrutura do Projeto

```
dashboard-apae-novo/
├── login.html                 # Tela de login (estilo original)
├── dashboard.html             # Dashboard moderno (arquivo separado)
├── styles/
│   ├── login.css              # Estilos da tela de login
│   ├── main.css               # Estilos principais do dashboard
│   ├── components.css         # Componentes específicos
│   └── animations.css         # Animações e transições
├── js/
│   ├── login.js               # Lógica de autenticação do login
│   ├── dashboard-auth.js      # Proteção e gerenciamento do dashboard
│   ├── dashboard.js           # Funcionalidades do dashboard
│   ├── charts.js              # Gráficos interativos
│   ├── notifications.js       # Sistema de notificações
│   └── utils.js               # Utilitários gerais
└── public/
    ├── placeholder-logo.png   # Logo da APAE
    ├── placeholder.jpg        # Imagem de fundo do login
    └── ...                    # Outras imagens
```

## 🚀 Como Usar

### 1. **Acesso Inicial**
- Abra o arquivo `login.html` no navegador
- A tela de login aparecerá com o **estilo original preservado**

### 2. **Credenciais de Teste**
Use uma das seguintes credenciais para fazer login:

| Email | Senha | Perfil |
|-------|-------|--------|
| admin@apae.com | admin123 | Administrador |
| user@apae.com | user123 | Usuário |
| doctor@apae.com | doctor123 | Médico |

### 3. **Fluxo de Autenticação**
1. Digite email e senha na tela de login
2. Clique em "Entre"
3. Aguarde a validação (com animação de loading)
4. **Redirecionamento automático** para `dashboard.html`
5. Dashboard carrega com design moderno e dados personalizados

### 4. **Funcionalidades do Dashboard**
- **Navegação lateral** com menu responsivo
- **Estatísticas em tempo real** com indicadores de tendência
- **Gráficos interativos** de atendimentos e especialidades
- **Personalização por usuário** (nome e perfil aparecem no header)
- **Logout seguro** que retorna para a tela de login

## 🔧 Funcionalidades Técnicas

### **Autenticação e Segurança**
- **Validação de credenciais** em tempo real
- **Armazenamento seguro** no localStorage
- **Sessão com expiração** (24 horas)
- **Proteção de rotas** - dashboard verifica autenticação
- **Redirecionamento automático** se não autenticado

### **Experiência do Usuário**
- **Feedback visual** durante o login (loading, sucesso, erro)
- **Mensagens de erro** claras e informativas
- **Animações suaves** em transições
- **Responsividade total** em todos os dispositivos
- **Navegação intuitiva** com estados ativos

### **Personalização por Perfil**
- **Administradores**: Acesso completo a todas as seções
- **Usuários**: Acesso limitado (sem Relatórios e Configurações)
- **Médicos**: Perfil específico com permissões adequadas
- **Interface adaptativa** baseada no tipo de usuário

## 🎨 Diferenças Visuais

### **Login (Estilo Original)**
- Layout 30/70 preservado
- Cores e tipografia originais
- Ícones sociais no topo
- Formulário com estilo original
- Imagem de fundo lateral

### **Dashboard (Design Moderno)**
- Sidebar com ícones coloridos
- Cards com gradientes e sombras
- Gráficos interativos modernos
- Paleta de cores profissional
- Layout grid responsivo

## 📱 Responsividade

- **Mobile-first design** no dashboard
- **Login responsivo** mantendo proporções originais
- **Sidebar colapsível** em telas menores
- **Gráficos adaptativos** que se ajustam ao tamanho
- **Touch-friendly** em dispositivos móveis

## 🔄 Fluxo Completo

1. **Usuário acessa** `login.html`
2. **Insere credenciais** na tela com estilo original
3. **Sistema valida** e mostra feedback visual
4. **Redirecionamento** automático para `dashboard.html`
5. **Dashboard carrega** com design moderno e dados do usuário
6. **Navegação funcional** entre seções (com alertas "em desenvolvimento")
7. **Logout** retorna para `login.html` com dados limpos

## 🚀 Melhorias Implementadas

### **Separação Completa**
- ✅ Login e dashboard em arquivos separados
- ✅ Estilos independentes para cada tela
- ✅ Scripts específicos para cada funcionalidade
- ✅ Redirecionamento automático entre páginas

### **Preservação do Design Original**
- ✅ Layout 30/70 mantido no login
- ✅ Cores e tipografia originais preservadas
- ✅ Ícones sociais e elementos visuais mantidos
- ✅ Animações e efeitos originais funcionando

### **Dashboard Moderno**
- ✅ Design system consistente e profissional
- ✅ Componentes reutilizáveis e bem estruturados
- ✅ Gráficos interativos com Chart.js
- ✅ Responsividade total para todos os dispositivos

## 📞 Suporte

Para dúvidas ou sugestões sobre o dashboard separado, entre em contato com a equipe de desenvolvimento.

---

**Desenvolvido com ❤️ para a APAE - Versão Separada Conforme Solicitado**

