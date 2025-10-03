// ===== MAIN APPLICATION CONTROLLER =====

class AppManager {
  constructor() {
    this.isInitialized = false;
    this.loadingScreen = null;
    this.currentScreen = 'loading';
    
    this.init();
  }

  async init() {
    try {
      // Show loading screen
      this.showLoadingScreen();
      
      // Initialize core systems
      await this.initializeCore();
      
      // Check authentication
      await this.checkAuthentication();
      
      // Initialize UI
      this.initializeUI();
      
      // Mark as initialized
      this.isInitialized = true;
      
      console.log('✅ Application initialized successfully');
      
    } catch (error) {
      console.error('❌ Application initialization failed:', error);
      this.handleInitializationError(error);
    }
  }

  showLoadingScreen() {
    this.loadingScreen = Utils.dom.$('#loading-screen');
    if (this.loadingScreen) {
      this.loadingScreen.classList.remove('hidden');
      this.currentScreen = 'loading';
    }
  }

  hideLoadingScreen() {
    if (this.loadingScreen) {
      this.loadingScreen.classList.add('hidden');
      
      // Remove from DOM after animation
      setTimeout(() => {
        if (this.loadingScreen && this.loadingScreen.parentNode) {
          this.loadingScreen.parentNode.removeChild(this.loadingScreen);
        }
      }, 500);
    }
  }

  async initializeCore() {
    // Simulate initialization time
    await this.delay(1000);
    
    // Initialize Feather Icons
    if (typeof feather !== 'undefined') {
      feather.replace();
    }
    
    // Initialize global error handling
    this.setupErrorHandling();
    
    // Initialize performance monitoring
    this.setupPerformanceMonitoring();
    
    // Initialize service worker (if available)
    this.initializeServiceWorker();
    
    console.log('✅ Core systems initialized');
  }

  async checkAuthentication() {
    // Wait for authManager to be available
    let attempts = 0;
    while (typeof authManager === 'undefined' && attempts < 10) {
      await this.delay(100);
      attempts++;
    }
    
    // Simulate auth check delay
    await this.delay(500);
    
    // Check if authManager is available and user is authenticated
    if (typeof authManager !== 'undefined' && authManager.checkAuth && authManager.checkAuth()) {
      console.log('✅ User authenticated');
      this.showDashboard();
    } else {
      console.log('ℹ️ User not authenticated');
      this.showLogin();
    }
  }

  initializeUI() {
    this.setupLoginForm();
    this.setupGlobalEventListeners();
    this.setupKeyboardShortcuts();
    this.setupAccessibility();
    
    console.log('✅ UI initialized');
  }

  setupLoginForm() {
    const loginForm = Utils.dom.$('#login-form');
    if (!loginForm) return;

    const emailInput = Utils.dom.$('#email');
    const passwordInput = Utils.dom.$('#password');
    const passwordToggle = Utils.dom.$('#password-toggle');
    const loginBtn = Utils.dom.$('#login-btn');
    const rememberMe = Utils.dom.$('#remember-me');

    // Password visibility toggle
    if (passwordToggle && passwordInput) {
      passwordToggle.addEventListener('click', () => {
        const isPassword = passwordInput.type === 'password';
        passwordInput.type = isPassword ? 'text' : 'password';
        
        const icon = passwordToggle.querySelector('i');
        if (icon) {
          icon.setAttribute('data-feather', isPassword ? 'eye-off' : 'eye');
          feather.replace();
        }
      });
    }

    // Form submission
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      await this.handleLogin();
    });

    // Real-time validation
    if (emailInput) {
      emailInput.addEventListener('blur', () => {
        this.validateEmail(emailInput.value);
      });
      
      emailInput.addEventListener('input', () => {
        this.clearError('email-error');
      });
    }

    if (passwordInput) {
      passwordInput.addEventListener('input', () => {
        this.clearError('password-error');
        this.updatePasswordStrength(passwordInput.value);
      });
    }

    // Auto-focus email field
    if (emailInput && this.currentScreen === 'login') {
      setTimeout(() => emailInput.focus(), 100);
    }
  }

  async handleLogin() {
    const emailInput = Utils.dom.$('#email');
    const passwordInput = Utils.dom.$('#password');
    const rememberMe = Utils.dom.$('#remember-me');
    const loginBtn = Utils.dom.$('#login-btn');

    if (!emailInput || !passwordInput || !loginBtn) return;

    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const remember = rememberMe ? rememberMe.checked : false;

    // Clear previous errors
    this.clearAllErrors();

    // Client-side validation
    if (!this.validateLoginForm(email, password)) {
      return;
    }

    // Show loading state
    this.setLoginLoading(true);

    try {
      // Wait for authManager to be available
      let attempts = 0;
      while (typeof authManager === 'undefined' && attempts < 10) {
        await this.delay(100);
        attempts++;
      }

      if (typeof authManager === 'undefined') {
        throw new Error('Sistema de autenticação não disponível.');
      }

      // Attempt login
      const userData = await authManager.login(email, password, remember);
      
      // Success
      console.log('✅ Login successful:', userData);
      
      if (typeof NotificationManager !== 'undefined') {
        NotificationManager.success(
          'Login realizado',
          `Bem-vindo, ${userData.name}!`
        );
      }
      
      // Show dashboard
      this.showDashboard();
      
    } catch (error) {
      console.error('❌ Login failed:', error);
      
      // Show error
      this.showError('password-error', error.message);
      
      // Shake form on error
      const loginCard = Utils.dom.$('.login-card');
      if (loginCard) {
        loginCard.classList.add('animate-shake');
        setTimeout(() => {
          loginCard.classList.remove('animate-shake');
        }, 500);
      }
      
    } finally {
      this.setLoginLoading(false);
    }
  }

  validateLoginForm(email, password) {
    let isValid = true;

    // Email validation
    if (!email) {
      this.showError('email-error', 'Email é obrigatório.');
      isValid = false;
    } else if (!Utils.validation.email(email)) {
      this.showError('email-error', 'Email inválido.');
      isValid = false;
    }

    // Password validation
    if (!password) {
      this.showError('password-error', 'Senha é obrigatória.');
      isValid = false;
    } else if (password.length < 6) {
      this.showError('password-error', 'Senha deve ter pelo menos 6 caracteres.');
      isValid = false;
    }

    return isValid;
  }

  validateEmail(email) {
    if (email && !Utils.validation.email(email)) {
      this.showError('email-error', 'Email inválido.');
      return false;
    }
    this.clearError('email-error');
    return true;
  }

  updatePasswordStrength(password) {
    // This could show a password strength indicator
    // For now, just validate minimum requirements
    if (password.length > 0 && password.length < 6) {
      this.showError('password-error', 'Senha muito curta.');
    } else {
      this.clearError('password-error');
    }
  }

  setLoginLoading(loading) {
    const loginBtn = Utils.dom.$('#login-btn');
    if (!loginBtn) return;

    const btnContent = loginBtn.querySelector('.btn-content');
    const btnLoading = loginBtn.querySelector('.btn-loading');

    if (loading) {
      loginBtn.classList.add('loading');
      loginBtn.disabled = true;
      if (btnContent) btnContent.style.display = 'none';
      if (btnLoading) btnLoading.style.display = 'flex';
    } else {
      loginBtn.classList.remove('loading');
      loginBtn.disabled = false;
      if (btnContent) btnContent.style.display = 'flex';
      if (btnLoading) btnLoading.style.display = 'none';
    }
  }

  showError(elementId, message) {
    const errorElement = Utils.dom.$(`#${elementId}`);
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.classList.add('show');
    }
  }

  clearError(elementId) {
    const errorElement = Utils.dom.$(`#${elementId}`);
    if (errorElement) {
      errorElement.textContent = '';
      errorElement.classList.remove('show');
    }
  }

  clearAllErrors() {
    const errorElements = Utils.dom.$$('.error-message');
    errorElements.forEach(element => {
      element.textContent = '';
      element.classList.remove('show');
    });
  }

  setupGlobalEventListeners() {
    // Handle auth events
    window.addEventListener('auth:logout', () => {
      this.handleLogout();
    });

    // Handle online/offline events
    window.addEventListener('online', () => {
      console.log('✅ Connection restored');
    });

    window.addEventListener('offline', () => {
      console.log('⚠️ Connection lost');
    });

    // Handle visibility change
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        console.log('📱 App hidden');
      } else {
        console.log('📱 App visible');
        // Refresh data when app becomes visible
        if (this.currentScreen === 'dashboard') {
          this.refreshDashboardData();
        }
      }
    });

    // Handle beforeunload
    window.addEventListener('beforeunload', (e) => {
      if (typeof authManager !== 'undefined' && authManager.isAuthenticated) {
        // Update last activity
        authManager.updateLastActivity();
      }
    });
  }

  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Global shortcuts
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'k':
            // Focus search (handled by dashboard)
            break;
          case 'l':
            // Logout
            if (typeof authManager !== 'undefined' && authManager.isAuthenticated) {
              e.preventDefault();
              this.handleLogout();
            }
            break;
          case 'd':
            // Toggle theme
            e.preventDefault();
            if (window.DashboardManager) {
              DashboardManager.toggleTheme();
            }
            break;
        }
      }

      // Escape key
      if (e.key === 'Escape') {
        // Close modals, dropdowns, etc.
        this.closeAllOverlays();
      }
    });
  }

  setupAccessibility() {
    // Add skip link
    const skipLink = Utils.dom.create('a', {
      href: '#main-content',
      className: 'skip-link',
      textContent: 'Pular para o conteúdo principal'
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);

    // Add focus indicators
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
      }
    });

    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-navigation');
    });

    // Announce page changes to screen readers
    this.setupScreenReaderAnnouncements();
  }

  setupScreenReaderAnnouncements() {
    const announcer = Utils.dom.create('div', {
      id: 'screen-reader-announcer',
      'aria-live': 'polite',
      'aria-atomic': 'true',
      className: 'sr-only'
    });
    
    document.body.appendChild(announcer);
  }

  announceToScreenReader(message) {
    const announcer = Utils.dom.$('#screen-reader-announcer');
    if (announcer) {
      announcer.textContent = message;
    }
  }

  setupErrorHandling() {
    // Global error handler
    window.addEventListener('error', (e) => {
      console.error('Global error:', e.error);
      this.handleGlobalError(e.error);
    });

    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (e) => {
      console.error('Unhandled promise rejection:', e.reason);
      this.handleGlobalError(e.reason);
    });
  }

  handleGlobalError(error) {
    // Don't show error notifications for network errors during development
    if (error.message && error.message.includes('Loading')) {
      return;
    }

    NotificationManager.error(
      'Erro inesperado',
      'Ocorreu um erro inesperado. Tente recarregar a página.',
      {
        actions: [
          {
            label: 'Recarregar',
            style: 'btn-primary',
            onClick: () => window.location.reload()
          }
        ]
      }
    );
  }

  setupPerformanceMonitoring() {
    // Monitor performance
    if ('performance' in window) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const perfData = performance.getEntriesByType('navigation')[0];
          if (perfData) {
            console.log('📊 Performance metrics:', {
              loadTime: Math.round(perfData.loadEventEnd - perfData.loadEventStart),
              domContentLoaded: Math.round(perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart),
              totalTime: Math.round(perfData.loadEventEnd - perfData.fetchStart)
            });
          }
        }, 0);
      });
    }
  }

  initializeServiceWorker() {
    if ('serviceWorker' in navigator) {
      // Service worker could be implemented for offline functionality
      console.log('🔧 Service Worker support detected');
    }
  }

  showLogin() {
    this.hideLoadingScreen();
    this.showScreen('login-screen');
    this.currentScreen = 'login';
    
    // Focus email input
    setTimeout(() => {
      const emailInput = Utils.dom.$('#email');
      if (emailInput) emailInput.focus();
    }, 100);
    
    this.announceToScreenReader('Tela de login carregada');
  }

  showDashboard() {
    this.hideLoadingScreen();
    window.location.href = 'dashboard.html';
    this.announceToScreenReader("Dashboard carregado");
  }

  showScreen(screenId) {
    const screens = Utils.dom.$$('.screen');
    screens.forEach(screen => {
      screen.classList.remove('active');
    });

    const targetScreen = Utils.dom.$(`#${screenId}`);
    if (targetScreen) {
      targetScreen.classList.add('active');
    }
  }

  handleLogout() {
    this.currentScreen = 'login';
    this.showLogin();
    
    // Clear form
    const loginForm = Utils.dom.$('#login-form');
    if (loginForm) {
      loginForm.reset();
    }
    
    this.clearAllErrors();
    
    NotificationManager.info(
      'Sessão encerrada',
      'Você foi desconectado com sucesso.'
    );
  }

  refreshDashboardData() {
    if (this.currentScreen === 'dashboard' && window.DashboardManager) {
      DashboardManager.refreshStats();
    }
  }

  closeAllOverlays() {
    // Close dropdowns
    const dropdowns = Utils.dom.$$('.open');
    dropdowns.forEach(dropdown => {
      dropdown.classList.remove('open');
    });

    // Hide search results
    if (window.DashboardManager) {
      DashboardManager.hideSearchResults();
    }
  }

  handleInitializationError(error) {
    // Show error screen
    document.body.innerHTML = `
      <div class="error-screen">
        <div class="error-content">
          <h1>Erro de Inicialização</h1>
          <p>Não foi possível carregar a aplicação.</p>
          <p class="error-details">${error.message}</p>
          <button onclick="window.location.reload()" class="btn btn-primary">
            Tentar Novamente
          </button>
        </div>
      </div>
    `;
  }

  // Utility method for delays
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Public API
  getCurrentScreen() {
    return this.currentScreen;
  }

  isReady() {
    return this.isInitialized;
  }
}

// Initialize application when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit more to ensure all scripts are loaded
    setTimeout(() => {
      window.app = new AppManager();
    }, 100);
  });
} else {
  // Wait a bit to ensure all scripts are loaded
  setTimeout(() => {
    window.app = new AppManager();
  }, 100);
}

// Export for debugging
window.AppManager = AppManager;

