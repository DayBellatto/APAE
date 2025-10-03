// dashboard.js - Arquivo corrigido para funcionar de forma autônoma
 // Classe DashboardManager para gerenciar o estado da aplicação
class DashboardManager {
    constructor() {
        // Dados estáticos para os cards (em uma aplicação real, viriam de uma API)
        this.dashboardCards = [
            {
                id: 'pacientes',
                title: 'Pacientes',
                description: 'Informações de pacientes e gerenciamento de cadastro.',
                icon: 'fas fa-users',
                color: 'bg-blue',
                link: 'http://127.0.0.1:5500/apae/Pacientes/pac.html'
            },
            {
                id: 'especialistas',
                title: 'Especialistas',
                description: 'Gestão de colaboradores e gerenciamento de cadastro.',
                icon: 'fa-solid fa-user-doctor',
                color: 'bg-green',
                link: 'http://127.0.0.1:5500/apae/Funcionarios/func.html'
            },
            {
                id: 'configuracoes',
                title: 'Configurações',
                description: 'Gerenciamento de acessos e inclusões de colaboradores.',
                icon: 'fas fa-cog',
                color: 'bg-purple',
                link: 'http://127.0.0.1:5500/apae/Configuracoes/config.html'
            },
            {
                id: 'escalas',
                title: 'Escalas',
                description: 'Gerenciamento de escalas de trabalho.',
                icon: 'fas fa-calendar',
                color: 'bg-orange',
                link: 'http://127.0.0.1:5500/apae/Escalas/escalas.html'
            }
        ];
    }

    // Método para renderizar os cards na tela
    renderCards() {
        const cardsGrid = document.querySelector('.stats-grid');
        if (!cardsGrid) return;
        
        cardsGrid.innerHTML = '';

        this.dashboardCards.forEach(card => {
            const cardElement = this.createCardElement(card);
            cardsGrid.appendChild(cardElement);
        });
    }

    // Método para criar o elemento HTML de um card
    createCardElement(card) {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'stat-card';
        
        const cardLink = document.createElement('a');
        cardLink.href = card.link;
        cardLink.style.textDecoration = 'none';

        cardLink.innerHTML = `
            <div class="stat-icon ${card.color}">
                <i class="${card.icon}"></i>
            </div>
            <div class="stat-content">
                <h3 class="stat-number">${card.title}</h3>
                <p class="stat-label">${card.description}</p>
            </div>
        `;

        cardDiv.appendChild(cardLink);
        return cardDiv;
    }

    // Método para atualizar a data e hora atual
    updateDateTime() {
        const now = new Date();
        const dateTimeElement = document.getElementById('current-datetime');
        if (!dateTimeElement) return;
        
        const dateStr = now.toLocaleDateString('pt-BR');
        const timeStr = now.toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        dateTimeElement.textContent = `${dateStr} - ${timeStr}`;
    }

    // Método para buscar notícias da API

   
    async fetchNews(query) {
        const newsContent = document.getElementById('news-feed-content');
        const loadingOverlay = document.getElementById('news-loading-overlay');
        
        if (!newsContent || !loadingOverlay) return;

        newsContent.innerHTML = '';
        loadingOverlay.style.display = 'flex';

        const keywords = `APAE, deficiência intelectual, autismo, bem-estar, inclusão`;
        const newsQuery = query || keywords;
        const apiKey = '30195d469ad7425b804ddb481689a6aa';
        const apiUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(newsQuery)}&language=pt&apiKey=${apiKey}`;

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`Erro na API de notícias: ${response.status}`);
            }
            const data = await response.json();
            this.renderNews(data.articles);
        } catch (error) {
            console.error('Falha ao buscar notícias:', error);
            newsContent.innerHTML = `<p class="text-center text-red-500">Erro ao carregar notícias. Tente novamente mais tarde.</p>`;
        } finally {
            loadingOverlay.style.display = 'none';
        }
    }

    // Método para renderizar as notícias na tela
    renderNews(articles) {
        const newsContent = document.getElementById('news-feed-content');
        if (!newsContent) return;

        if (articles.length === 0) {
            newsContent.innerHTML = `<p class="text-center text-gray-500">Nenhum artigo encontrado.</p>`;
            return;
        }

        articles.slice(0, 6).forEach(article => { 
            const articleElement = document.createElement('a');
            articleElement.href = article.url;
            articleElement.target = "_blank";
            articleElement.className = "news-article";

            articleElement.innerHTML = `
                <div class="news-article-content">
                    <h4 class="news-title">${article.title}</h4>
                    <p class="news-description">${article.description || 'Nenhuma descrição disponível.'}</p>
                    <span class="news-link">Leia mais →</span>
                </div>
            `;
            newsContent.appendChild(articleElement);
        });
    }

    // Método de inicialização da aplicação
    init() {
        this.updateDateTime();
        this.fetchNews();

        setInterval(() => {
            this.updateDateTime();
        }, 60000);

        document.getElementById('logout-btn').addEventListener('click', () => {
             // Lógica de logout
            alert('Logout efetuado!');
            window.location.href = 'login.html';
        });

        const newsSearchInput = document.getElementById('news-search-input');
        if (newsSearchInput) {
            newsSearchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.fetchNews(newsSearchInput.value);
                }
            });
        }
    }
}

// Inicia a aplicação após o DOM ser carregado
document.addEventListener('DOMContentLoaded', () => {
    const dashboardManager = new DashboardManager();
    dashboardManager.init();
    
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Login realizado!');
            document.getElementById('login-screen').classList.remove('active');
            document.getElementById('dashboard-screen').classList.add('active');
            dashboardManager.renderCards();
        });
    }
});
