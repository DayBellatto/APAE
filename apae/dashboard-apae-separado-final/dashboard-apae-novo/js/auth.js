// ===== AUTHENTICATION MANAGER =====

class AuthManager {
  constructor() {
    this.currentUser = null;
    this.isAuthenticated = false;
    this.loginAttempts = 0;
    this.maxLoginAttempts = 5;
    this.lockoutTime = 15 * 60 * 1000; // 15 minutes
    this.sessionTimeout = 8 * 60 * 60 * 1000; // 8 hours
    
    this.init();
  }

  init() {
    // Check for existing session
    this.checkSession();
    
    // Set up session timeout
    this.setupSessionTimeout();
    
    // Listen for storage changes (multi-tab support)
    window.addEventListener('storage', (e) => {
      if (e.key === 'userData' || e.key === 'isAuthenticated') {
        this.checkSession();
      }
    });
  }

  // Validate email format
  validateEmail(email) {
    return Utils.validation.email(email);
  }

  // Validate password strength
  validatePassword(password) {
    const minLength = 6;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    
    return {
      isValid: password.length >= minLength,
      strength: this.calculatePasswordStrength(password),
      requirements: {
        minLength: password.length >= minLength,
        hasUpperCase,
        hasLowerCase,
        hasNumbers
      }
    };
  }

  calculatePasswordStrength(password) {
    let score = 0;
    
    if (password.length >= 8) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    
    if (score < 2) return 'weak';
    if (score < 4) return 'medium';
    return 'strong';
  }

  // Check if account is locked
  isAccountLocked() {
    const lockoutData = Utils.storage.get('accountLockout');
    if (!lockoutData) return false;
    
    const now = Date.now();
    if (now - lockoutData.timestamp > this.lockoutTime) {
      Utils.storage.remove('accountLockout');
      return false;
    }
    
    return lockoutData.attempts >= this.maxLoginAttempts;
  }

  // Lock account after too many failed attempts
  lockAccount() {
    Utils.storage.set('accountLockout', {
      attempts: this.loginAttempts,
      timestamp: Date.now()
    });
  }

  // Reset login attempts
  resetLoginAttempts() {
    this.loginAttempts = 0;
    Utils.storage.remove('accountLockout');
  }

  // Simulate login with enhanced security
  async login(email, password, rememberMe = false) {
    return new Promise((resolve, reject) => {
      // Check if account is locked
      if (this.isAccountLocked()) {
        const lockoutData = Utils.storage.get('accountLockout');
        const remainingTime = Math.ceil((this.lockoutTime - (Date.now() - lockoutData.timestamp)) / 60000);
        reject(new Error(`Conta bloqueada. Tente novamente em ${remainingTime} minutos.`));
        return;
      }

      // Simulate network delay
      setTimeout(() => {
        // Basic validation
        if (!email || !password) {
          reject(new Error('Preencha todos os campos.'));
          return;
        }

        if (!this.validateEmail(email)) {
          reject(new Error('Email inválido.'));
          return;
        }

        const passwordValidation = this.validatePassword(password);
        if (!passwordValidation.isValid) {
          reject(new Error('Senha deve ter pelo menos 6 caracteres.'));
          return;
        }

        // Simulate authentication
        // In a real app, this would be an API call
        const validCredentials = this.validateCredentials(email, password);
        
        if (!validCredentials) {
          this.loginAttempts++;
          
          if (this.loginAttempts >= this.maxLoginAttempts) {
            this.lockAccount();
            reject(new Error('Muitas tentativas de login. Conta bloqueada por 15 minutos.'));
          } else {
            const remainingAttempts = this.maxLoginAttempts - this.loginAttempts;
            reject(new Error(`Credenciais inválidas. ${remainingAttempts} tentativas restantes.`));
          }
          return;
        }

        // Reset login attempts on successful login
        this.resetLoginAttempts();

        // Create user data
        const userData = this.createUserData(email);
        
        // Set authentication state
        this.currentUser = userData;
        this.isAuthenticated = true;

        // Save to storage
        const storageType = rememberMe ? 'localStorage' : 'sessionStorage';
        this.saveSession(userData, storageType);

        // Set session timeout
        this.setSessionTimeout();

        resolve(userData);
      }, 1000 + Math.random() * 1000); // 1-2 second delay
    });
  }

  // Validate credentials (mock implementation)
  validateCredentials(email, password) {
    // Mock validation - in real app, this would be server-side
    const validUsers = [
      { email: 'admin@apae.com', password: 'admin123' },
      { email: 'user@apae.com', password: 'user123' },
      { email: 'doctor@apae.com', password: 'doctor123' },
      { email: 'nurse@apae.com', password: 'nurse123' }
    ];

    return validUsers.some(user => 
      user.email.toLowerCase() === email.toLowerCase() && 
      user.password === password
    );
  }

  // Create user data based on email
  createUserData(email) {
    const emailLower = email.toLowerCase();
    let role = 'user';
    let name = email.split('@')[0];
    let permissions = ['read'];

    // Determine role based on email
    if (emailLower.includes('admin')) {
      role = 'admin';
      name = 'Administrador';
      permissions = ['read', 'write', 'delete', 'admin'];
    } else if (emailLower.includes('doctor') || emailLower.includes('medico')) {
      role = 'doctor';
      name = 'Dr. ' + name;
      permissions = ['read', 'write'];
    } else if (emailLower.includes('nurse') || emailLower.includes('enfermeiro')) {
      role = 'nurse';
      name = 'Enfermeiro(a) ' + name;
      permissions = ['read', 'write'];
    }

    return {
      id: Utils.generateId(),
      email: email,
      name: name,
      role: role,
      permissions: permissions,
      isAdmin: role === 'admin',
      loginTime: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      avatar: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face&auto=format`
    };
  }

  // Save session to storage
  saveSession(userData, storageType = 'localStorage') {
    const sessionData = {
      userData,
      timestamp: Date.now(),
      expiresAt: Date.now() + this.sessionTimeout
    };

    if (storageType === 'localStorage') {
      Utils.storage.set('isAuthenticated', true);
      Utils.storage.set('userData', userData);
      Utils.storage.set('sessionData', sessionData);
    } else {
      sessionStorage.setItem('isAuthenticated', 'true');
      sessionStorage.setItem('userData', JSON.stringify(userData));
      sessionStorage.setItem('sessionData', JSON.stringify(sessionData));
    }
  }

  // Check existing session
  checkSession() {
    // Check localStorage first
    let sessionData = Utils.storage.get('sessionData');
    let userData = Utils.storage.get('userData');
    let isAuthenticated = Utils.storage.get('isAuthenticated');

    // If not in localStorage, check sessionStorage
    if (!sessionData) {
      try {
        sessionData = JSON.parse(sessionStorage.getItem('sessionData'));
        userData = JSON.parse(sessionStorage.getItem('userData'));
        isAuthenticated = sessionStorage.getItem('isAuthenticated') === 'true';
      } catch (error) {
        console.error('Error parsing session data:', error);
      }
    }

    // Validate session
    if (sessionData && userData && isAuthenticated) {
      const now = Date.now();
      
      // Check if session has expired
      if (now > sessionData.expiresAt) {
        this.logout();
        return false;
      }

      // Check if session is close to expiring (show warning)
      const timeUntilExpiry = sessionData.expiresAt - now;
      if (timeUntilExpiry < 30 * 60 * 1000) { // 30 minutes
        this.showSessionWarning(timeUntilExpiry);
      }

      // Restore session
      this.currentUser = userData;
      this.isAuthenticated = true;
      this.updateLastActivity();
      
      return true;
    }

    return false;
  }

  // Update last activity timestamp
  updateLastActivity() {
    if (this.currentUser) {
      this.currentUser.lastActivity = new Date().toISOString();
      
      // Update in storage
      const sessionData = Utils.storage.get('sessionData') || 
                         JSON.parse(sessionStorage.getItem('sessionData') || '{}');
      
      if (sessionData.userData) {
        sessionData.userData.lastActivity = this.currentUser.lastActivity;
        
        // Save back to appropriate storage
        if (Utils.storage.get('sessionData')) {
          Utils.storage.set('sessionData', sessionData);
          Utils.storage.set('userData', this.currentUser);
        } else {
          sessionStorage.setItem('sessionData', JSON.stringify(sessionData));
          sessionStorage.setItem('userData', JSON.stringify(this.currentUser));
        }
      }
    }
  }

  // Set up session timeout monitoring
  setupSessionTimeout() {
    // Update activity on user interactions
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    const updateActivity = Utils.throttle(() => {
      if (this.isAuthenticated) {
        this.updateLastActivity();
      }
    }, 60000); // Update every minute

    events.forEach(event => {
      document.addEventListener(event, updateActivity, true);
    });
  }

  // Set session timeout
  setSessionTimeout() {
    // Clear existing timeout
    if (this.sessionTimeoutId) {
      clearTimeout(this.sessionTimeoutId);
    }

    // Set new timeout
    this.sessionTimeoutId = setTimeout(() => {
      this.logout();
      NotificationManager.show('Sessão expirada', 'Você foi desconectado por inatividade.', 'warning');
    }, this.sessionTimeout);
  }

  // Show session warning
  showSessionWarning(timeRemaining) {
    const minutes = Math.ceil(timeRemaining / 60000);
    NotificationManager.show(
      'Sessão expirando',
      `Sua sessão expirará em ${minutes} minutos. Clique aqui para renovar.`,
      'warning',
      {
        duration: 10000,
        onClick: () => this.renewSession()
      }
    );
  }

  // Renew session
  renewSession() {
    if (this.isAuthenticated && this.currentUser) {
      const sessionData = {
        userData: this.currentUser,
        timestamp: Date.now(),
        expiresAt: Date.now() + this.sessionTimeout
      };

      // Update storage
      if (Utils.storage.get('sessionData')) {
        Utils.storage.set('sessionData', sessionData);
      } else {
        sessionStorage.setItem('sessionData', JSON.stringify(sessionData));
      }

      this.setSessionTimeout();
      NotificationManager.show('Sessão renovada', 'Sua sessão foi renovada com sucesso.', 'success');
    }
  }

  // Logout
  logout() {
    // Clear session data
    this.currentUser = null;
    this.isAuthenticated = false;

    // Clear storage
    Utils.storage.remove('isAuthenticated');
    Utils.storage.remove('userData');
    Utils.storage.remove('sessionData');
    
    sessionStorage.removeItem('isAuthenticated');
    sessionStorage.removeItem('userData');
    sessionStorage.removeItem('sessionData');

    // Clear timeout
    if (this.sessionTimeoutId) {
      clearTimeout(this.sessionTimeoutId);
    }

    // Dispatch logout event
    window.dispatchEvent(new CustomEvent('auth:logout'));
  }

  // Get current user
  getCurrentUser() {
    return this.currentUser;
  }

  // Check if user is admin
  isAdmin() {
    return this.currentUser && this.currentUser.isAdmin;
  }

  // Check if user has permission
  hasPermission(permission) {
    return this.currentUser && this.currentUser.permissions.includes(permission);
  }

  // Get user role
  getUserRole() {
    return this.currentUser ? this.currentUser.role : null;
  }

  // Change password (mock implementation)
  async changePassword(currentPassword, newPassword) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!currentPassword || !newPassword) {
          reject(new Error('Preencha todos os campos.'));
          return;
        }

        const passwordValidation = this.validatePassword(newPassword);
        if (!passwordValidation.isValid) {
          reject(new Error('Nova senha não atende aos requisitos de segurança.'));
          return;
        }

        // In a real app, this would validate the current password
        // and update it on the server
        resolve({ success: true, message: 'Senha alterada com sucesso.' });
      }, 1000);
    });
  }

  // Request password reset (mock implementation)
  async requestPasswordReset(email) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!email || !this.validateEmail(email)) {
          reject(new Error('Email inválido.'));
          return;
        }

        // In a real app, this would send a reset email
        resolve({ 
          success: true, 
          message: 'Instruções de recuperação enviadas para seu email.' 
        });
      }, 1000);
    });
  }
}

// Create global instance
const authManager = new AuthManager();

// Export for use in other modules
window.AuthManager = AuthManager;
window.authManager = authManager;

