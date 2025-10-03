// Arquivo principal - Controla o fluxo da aplicação
class AppManager {
    constructor() {
        this.init();
    }

    init() {
        // Verificar autenticação ao carregar a página
        this.checkInitialAuth();

        // Configurar eventos do formulário de login
        this.setupLoginForm();

        // Configurar outros eventos globais
        this.setupGlobalEvents();
    }

    // Verificar autenticação inicial
    checkInitialAuth() {
        this.showLoading(true);

        setTimeout(() => {
            if (authManager.checkAuth()) {
                this.showDashboard();
            } else {
                this.showLogin();
            }
            this.showLoading(false);
        }, 1000);
    }

    // Configurar formulário de login
    setupLoginForm() {
        const loginForm = document.getElementById('login-form');
        const loginBtn = document.getElementById('login-btn');
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');

        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = emailInput.value.trim();
            const password = passwordInput.value.trim();

            // Limpar mensagens de erro anteriores
            this.clearErrors();

            // Mostrar estado de carregamento
            this.setLoginLoading(true);

            try {
                const userData = await authManager.login(email, password);
                console.log('Login bem-sucedido:', userData);
                this.showDashboard();
            } catch (error) {
                console.error('Erro no login:', error);
                this.showError('email-error', error.message);
            } finally {
                this.setLoginLoading(false);
            }
        });

        // Validação em tempo real do email
        emailInput.addEventListener('blur', () => {
            const email = emailInput.value.trim();
            if (email && !authManager.validateEmail(email)) {
                this.showError('email-error', 'Email inválido.');
            } else {
                this.clearError('email-error');
            }
        });
    }

    // Configurar eventos globais
    setupGlobalEvents() {
        // Tecla ESC para fechar modais/overlays
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.showLoading(false);
            }
        });

        // Prevenir envio de formulários vazios
        document.addEventListener('submit', (e) => {
            const form = e.target;
            if (form.tagName === 'FORM') {
                const inputs = form.querySelectorAll('input[required]');
                let hasEmpty = false;

                inputs.forEach(input => {
                    if (!input.value.trim()) {
                        hasEmpty = true;
                        input.classList.add('error');
                    } else {
                        input.classList.remove('error');
                    }
                });

                if (hasEmpty) {
                    e.preventDefault();
                }
            }
        });
    }

    // Mostrar tela de login
    showLogin() {
        this.showScreen('login-screen');
        // Limpar formulário
        document.getElementById('login-form').reset();
        this.clearErrors();
    }

    // Mostrar dashboard
    showDashboard() {
        this.showScreen('dashboard-screen');
        dashboardManager.init();
    }

    // Mostrar tela específica
    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
    }

    // Mostrar/esconder loading
    showLoading(show) {
        const overlay = document.getElementById('loading-overlay');
        if (show) {
            overlay.classList.add('show');
        } else {
            overlay.classList.remove('show');
        }
    }

    // Definir estado de carregamento do login
    setLoginLoading(loading) {
        const loginBtn = document.getElementById('login-btn');
        const btnText = loginBtn.querySelector('.btn-text');
        const btnLoading = loginBtn.querySelector('.btn-loading');

        if (loading) {
            btnText.style.display = 'none';
            btnLoading.style.display = 'inline-block';
            loginBtn.disabled = true;
        } else {
            btnText.style.display = 'inline-block';
            btnLoading.style.display = 'none';
            loginBtn.disabled = false;
        }
    }

    // Mostrar erro
    showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
    }

    // Limpar erro específico
    clearError(elementId) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.classList.remove('show');
        }
    }

    // Limpar todos os erros
    clearErrors() {
        document.querySelectorAll('.error-message').forEach(element => {
            element.textContent = '';
            element.classList.remove('show');
        });
    }
}

// Inicializar aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    new AppManager();
});

// Funções utilitárias globais
window.utils = {
    // Formatar data
    formatDate: (date) => {
        return new Date(date).toLocaleDateString('pt-BR');
    },

    // Formatar hora
    formatTime: (date) => {
        return new Date(date).toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    // Debounce para otimizar eventos
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};
