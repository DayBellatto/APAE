// Dashboard Manager atualizado para funcionar com o novo layout
class DashboardManager {
    constructor() {
        this.dashboardCards = [
            {
                id: 'principal',
                title: 'Principal',
                description: 'Resumo geral e métricas do sistema',
                icon: 'fas fa-home',
                color: 'bg-blue',
                stats: '',
                accessible: true
            },
            {
                id: 'escalas',
                title: 'Escalas',
                description: 'Gerenciamento de escalas de trabalho',
                icon: 'fas fa-calendar-alt',
                color: 'bg-green',
                stats: '',
                accessible: true
            },
            {
                id: 'funcionarios',
                title: 'Funcionários',
                description: 'Gestão de colaboradores e dados pessoais',
                icon: 'fas fa-users',
                color: 'bg-purple',
                stats: '',
                accessible: true
            },
            {
                id: 'pacientes',
                title: 'Pacientes',
                description: 'Prontuários e informações de pacientes',
                icon: 'fas fa-user-check',
                color: 'bg-orange',
                stats: '',
                accessible: true
            },
            {
                id: 'configuracoes',
                title: 'Configurações',
                description: 'Definições do sistema e permissões',
                icon: 'fas fa-cog',
                color: 'bg-red',
                stats: '',
                accessible: false 
            }
        ];
    }

    // Renderizar cards
    renderCards() {
        const cardsGrid = document.getElementById('cards-grid');
        const user = authManager.getCurrentUser();

        cardsGrid.innerHTML = '';

        this.dashboardCards.forEach(card => {
            if (card.id === 'configuracoes' && !authManager.isAdmin()) return;

            const cardElement = this.createCardElement(card, user);
            cardsGrid.appendChild(cardElement);
        });

        this.addCardAnimations();
    }

    // Criar card
    createCardElement(card, user) {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'dashboard-card';
        cardDiv.dataset.module = card.id;

        cardDiv.innerHTML = `
            <div class="card-header">
                <div class="card-icon ${card.color}">
                    <i class="${card.icon}">
</i>
                </div>

                ${card.id === 'configuracoes' && user.isAdmin 
                    ? '<span class="card-badge">Admin</span>' 
                    : ''}
            </div>

            <div class="card-content">
                <h3 class="card-title">${card.title}</h3>
                <p class="card-description">${card.description}</p>

                <div class="card-footer">
                    <span class="card-stats">${card.stats}</span>
                        <button class="card-action" style="
                        background:  #2c3e50;
                        color:white;
                        font-size:12px;
                        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        padding:10px 18px;
                        border-radius:8px;
                        border:none;
                        ">
                        Acessar →
                        </button>
                </div>
            </div>
        `;

        cardDiv.addEventListener('click', () => {
            this.handleCardClick(card.id, card.title);
        });

        return cardDiv;
    }

    // Navegação por módulo
    handleCardClick(moduleId, moduleTitle) {
        const modulePaths = {
            principal: 'Principal/principal.html',
            escalas: 'Escalas/escalas.html',
            funcionarios: 'Funcionarios/func.html',
            pacientes: 'Pacientes/pac.html',
            configuracoes: 'Configuracoes/config.html'
        };

        const path = modulePaths[moduleId];

        if (!path) {
            alert(`Erro: módulo "${moduleTitle}" não encontrado.`);
            return;
        }

        // Ajuste do caminho real da sua pasta
        window.location.href = path;
    }

    // Atualizar infos do usuário
    updateUserInfo() {
        const user = authManager.getCurrentUser();
        if (!user) return;

     

        document.getElementById('welcome-user').textContent = user.name;
        document.getElementById('welcome-message').textContent = 'Bem-vindo!';

        const adminBadge = document.getElementById('admin-badge');
        adminBadge.style.display = user.isAdmin ? 'inline-block' : 'none';
    }

    // Data e hora
    updateDateTime() {
        const now = new Date();
        document.getElementById('current-datetime').textContent =
            now.toLocaleDateString('pt-BR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }) + " - " +
            now.toLocaleTimeString('pt-BR');
    }

    addCardAnimations() {
        const cards = document.querySelectorAll('.dashboard-card');

        cards.forEach((card, index) => {
            card.style.opacity = "0";
            card.style.transform = "translateY(25px)";

            setTimeout(() => {
                card.style.transition = "0.5s ease";
                card.style.opacity = "1";
                card.style.transform = "translateY(0)";
            }, index * 120);
        });
    }

    // Logout
    handleLogout() {
        authManager.logout();
        this.showScreen('login-screen');
    }

    // Mostrar tela
    showScreen(id) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(id).classList.add('active');
    }

    // Inicialização
    init() {
        this.updateUserInfo();
        this.renderCards();
        this.updateDateTime();

        setInterval(() => this.updateDateTime(), 1000);

        document.getElementById('logout-btn').addEventListener('click', () => {
            this.handleLogout();
        });
    }
}

// Instância global
const dashboardManager = new DashboardManager();
