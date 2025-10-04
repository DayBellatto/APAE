// Módulo do Dashboard Melhorado
class DashboardManager {
    constructor() {
        this.dashboardCards = [
            {
                id: 'principal',
                title: 'Principal',
                description: 'Resumo geral e métricas do sistema',
                icon: 'fas fa-home',
                color: 'bg-blue',
                stats: '12 notificações',
                accessible: true
            },
            {
                id: 'escalas',
                title: 'Escalas',
                description: 'Gerenciamento de escalas de trabalho',
                icon: 'fas fa-calendar-alt',
                color: 'bg-green',
                stats: '8 escalas ativas',
                accessible: true
            },
            {
                id: 'funcionarios',
                title: 'Funcionários',
                description: 'Gestão de colaboradores e dados pessoais',
                icon: 'fas fa-users',
                color: 'bg-purple',
                stats: '45 funcionários',
                accessible: true
            },
            {
                id: 'pacientes',
                title: 'Pacientes',
                description: 'Prontuários e informações de pacientes',
                icon: 'fas fa-user-check',
                color: 'bg-orange',
                stats: '128 pacientes',
                accessible: true
            },
            {
                id: 'configuracoes',
                title: 'Configurações',
                description: 'Definições do sistema e permissões',
                icon: 'fas fa-cog',
                color: 'bg-red',
                stats: 'Admin apenas',
                accessible: false // Será definido dinamicamente
            }
        ];
    }

    // Renderizar cards do dashboard
    renderCards() {
        const cardsGrid = document.getElementById('cards-grid');
        const user = authManager.getCurrentUser();
        
        cardsGrid.innerHTML = '';

        this.dashboardCards.forEach(card => {
            // Verificar acessibilidade do card
            if (card.id === 'configuracoes' && !authManager.isAdmin()) {
                return; // Não renderizar card de configurações para não-admins
            }

            const cardElement = this.createCardElement(card, user);
            cardsGrid.appendChild(cardElement);
        });
    }

    // Criar elemento do card
    createCardElement(card, user) {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'dashboard-card';
        cardDiv.setAttribute('data-module', card.id);

        cardDiv.innerHTML = `
            <div class="card-header">
                <div class="card-icon ${card.color}">
                    <i class="${card.icon}"></i>
                </div>
                ${card.id === 'configuracoes' && user.isAdmin ? 
                    '<span class="card-badge">Admin</span>' : ''}
            </div>
            <div class="card-content">
                <h3 class="card-title">${card.title}</h3>
                <p class="card-description">${card.description}</p>
                <div class="card-footer">
                    <span class="card-stats">${card.stats}</span>
                    <button class="card-action">Acessar →</button>
                </div>
            </div>
        `;

        // Adicionar evento de clique
        cardDiv.addEventListener('click', () => {
            this.handleCardClick(card.id, card.title);
        });

        return cardDiv;
    }

    // Manipular clique no card
    handleCardClick(moduleId, moduleTitle) {
        console.log(`Navegando para: ${moduleTitle}`);

        const modulePaths = {
            'principal': 'Principal/principal.html',
            'escalas': 'Escalas/escalas.html',
            'funcionarios': 'Funcionarios/func.html',
            'pacientes': 'Pacientes/pac.html',
            'configuracoes': 'Configuracoes/config.html'
        };

        const path = modulePaths[moduleId];

        if (path) {
            // Caminho corrigido para a sua estrutura de pastas
            window.location.href = `../apae/${path}`; 
        } else {
            alert(`Erro: Módulo "${moduleTitle}" não encontrado.`);
        }
    }

    // Atualizar informações do usuário no header melhorado
    updateUserInfo() {
        const user = authManager.getCurrentUser();
        if (!user) return;

        // Atualizar informações do usuário no canto direito
        document.getElementById('user-name').textContent = user.name;
        document.getElementById('user-role').textContent = user.isAdmin ? 'Administrador' : 'Usuário';
        
        // Atualizar mensagem de boas-vindas no centro
        document.getElementById('welcome-message').textContent = 'Bem-vindo!';
        document.getElementById('welcome-user').textContent = user.name;

        // Mostrar badge de admin se necessário
        const adminBadge = document.getElementById('admin-badge');
        if (user.isAdmin) {
            adminBadge.style.display = 'inline-block';
        } else {
            adminBadge.style.display = 'none';
        }
    }

    // Atualizar data e hora
    updateDateTime() {
        const now = new Date();
        const dateTimeElement = document.getElementById('current-datetime');
        
        const dateStr = now.toLocaleDateString('pt-BR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        const timeStr = now.toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit'
        });
        
        dateTimeElement.textContent = `${dateStr} - ${timeStr}`;
    }

    // Inicializar dashboard
    init() {
        this.updateUserInfo();
        this.updateDateTime();
        this.renderCards();

        // Atualizar horário a cada segundo para mostrar segundos
        setInterval(() => {
            this.updateDateTime();
        }, 1000);

        // Adicionar evento de logout
        document.getElementById('logout-btn').addEventListener('click', () => {
            this.handleLogout();
        });

        // Adicionar animações aos cards
        this.addCardAnimations();
    }

    // Adicionar animações aos cards
    addCardAnimations() {
        const cards = document.querySelectorAll('.dashboard-card');
        cards.forEach((card, index) => {
            // Animação de entrada escalonada
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    // Manipular logout
    handleLogout() {
        if (confirm('Tem certeza que deseja sair?')) {
            authManager.logout();
            this.showScreen('login-screen');
        }
    }

    // Mostrar tela específica
    showScreen(screenId) {
        // Esconder todas as telas
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });

        // Mostrar tela específica
        document.getElementById(screenId).classList.add('active');
    }

    // Atualizar estatísticas em tempo real (simulação)
    updateStats() {
        const statNumbers = document.querySelectorAll('.stat-number');
        statNumbers.forEach(stat => {
            const currentValue = parseInt(stat.textContent);
            const variation = Math.floor(Math.random() * 3) - 1; // -1, 0, ou 1
            const newValue = Math.max(0, currentValue + variation);
            
            if (newValue !== currentValue) {
                stat.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    stat.textContent = newValue;
                    stat.style.transform = 'scale(1)';
                }, 150);
            }
        });
    }

    // Inicializar atualizações periódicas
    startPeriodicUpdates() {
        // Atualizar estatísticas a cada 30 segundos
        setInterval(() => {
            this.updateStats();
        }, 30000);
    }
}

// Instância global do gerenciador do dashboard
const dashboardManager = new DashboardManager();

