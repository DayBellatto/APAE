// Módulo de Autenticação
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.isAuthenticated = false;
    }

    // Validar email
    validateEmail(email) {
        return /\S+@\S+\.\S+/.test(email);
    }

    // Simular login
    async login(email, password) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (!email || !password) {
                    reject(new Error('Preencha todos os campos.'));
                    return;
                }

                if (!this.validateEmail(email)) {
                    reject(new Error('Email inválido.'));
                    return;
                }

                // Simular diferentes tipos de usuário
                const isAdmin = email.toLowerCase().includes('admin');
                const userData = {
                    email: email,
                    name: email.split('@')[0],
                    isAdmin: isAdmin,
                    loginTime: new Date().toISOString()
                };

                this.currentUser = userData;
                this.isAuthenticated = true;

                // Salvar no localStorage
                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('userData', JSON.stringify(userData));

                resolve(userData);
            }, 1000); // Simular delay de rede
        });
    }

    // Logout
    logout() {
        this.currentUser = null;
        this.isAuthenticated = false;
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('userData');
    }

    // Verificar se está autenticado
    checkAuth() {
        const authStatus = localStorage.getItem('isAuthenticated');
        const userData = localStorage.getItem('userData');

        if (authStatus === 'true' && userData) {
            this.isAuthenticated = true;
            this.currentUser = JSON.parse(userData);
            return true;
        }

        return false;
    }

    // Obter usuário atual
    getCurrentUser() {
        return this.currentUser;
    }

    // Verificar se é admin
    isAdmin() {
        return this.currentUser && this.currentUser.isAdmin;
    }
}

// Instância global do gerenciador de autenticação
const authManager = new AuthManager();
