// Login functionality
class LoginManager {
  constructor() {
    this.validCredentials = [
      { email: 'admin@apae.com', password: 'admin123', name: 'Administrador', role: 'admin' },
      { email: 'user@apae.com', password: 'user123', name: 'Usuário', role: 'user' },
      { email: 'doctor@apae.com', password: 'doctor123', name: 'Dr. Silva', role: 'doctor' }
    ];
    
    this.init();
  }

  init() {
    this.bindEvents();
    this.setupFormValidation();
  }

  bindEvents() {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => this.handleLogin(e));
    }

    // Add enter key support for form fields
    const inputs = document.querySelectorAll('.form-control');
    inputs.forEach(input => {
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.handleLogin(e);
        }
      });
    });
  }

  setupFormValidation() {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    if (emailInput) {
      emailInput.addEventListener('blur', () => this.validateEmail());
      emailInput.addEventListener('input', () => this.clearError('email'));
    }

    if (passwordInput) {
      passwordInput.addEventListener('blur', () => this.validatePassword());
      passwordInput.addEventListener('input', () => this.clearError('password'));
    }
  }

  validateEmail() {
    const email = document.getElementById('email').value;
    const emailError = document.getElementById('email-error');
    
    if (!email) {
      this.showError('email', 'Email é obrigatório');
      return false;
    }
    
    if (!this.isValidEmail(email)) {
      this.showError('email', 'Email inválido');
      return false;
    }
    
    this.clearError('email');
    return true;
  }

  validatePassword() {
    const password = document.getElementById('password').value;
    
    if (!password) {
      this.showError('password', 'Senha é obrigatória');
      return false;
    }
    
    if (password.length < 3) {
      this.showError('password', 'Senha deve ter pelo menos 3 caracteres');
      return false;
    }
    
    this.clearError('password');
    return true;
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  showError(field, message) {
    const errorElement = document.getElementById(`${field}-error`);
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.classList.add('show');
    }
  }

  clearError(field) {
    const errorElement = document.getElementById(`${field}-error`);
    if (errorElement) {
      errorElement.textContent = '';
      errorElement.classList.remove('show');
    }
  }

  async handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Clear previous errors
    this.clearError('email');
    this.clearError('password');
    
    // Validate fields
    const isEmailValid = this.validateEmail();
    const isPasswordValid = this.validatePassword();
    
    if (!isEmailValid || !isPasswordValid) {
      return;
    }
    
    // Show loading state
    this.setLoadingState(true);
    
    try {
      // Simulate API call delay
      await this.delay(1000);
      
      const user = this.authenticateUser(email, password);
      
      if (user) {
        this.onLoginSuccess(user);
      } else {
        this.onLoginError();
      }
    } catch (error) {
      console.error('Login error:', error);
      this.onLoginError();
    } finally {
      this.setLoadingState(false);
    }
  }

  authenticateUser(email, password) {
    return this.validCredentials.find(cred => 
      cred.email === email && cred.password === password
    );
  }

  onLoginSuccess(user) {
    // Store user data
    localStorage.setItem('apae_user', JSON.stringify(user));
    localStorage.setItem('apae_login_time', new Date().toISOString());
    
    // Show success message briefly
    this.showSuccessMessage();
    
    // Redirect to dashboard after a short delay
    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 1500);
  }

  onLoginError() {
    this.showError('password', 'Email ou senha incorretos. Tente: admin@apae.com / admin123');
    
    // Shake animation for form
    const form = document.getElementById('login-form');
    if (form) {
      form.style.animation = 'shake 0.5s ease-in-out';
      setTimeout(() => {
        form.style.animation = '';
      }, 500);
    }
  }

  showSuccessMessage() {
    const submitBtn = document.getElementById('login-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    
    if (btnText && btnLoading) {
      btnText.style.display = 'none';
      btnLoading.style.display = 'inline-flex';
      btnLoading.innerHTML = '<i class="fas fa-check"></i> Sucesso! Redirecionando...';
      submitBtn.style.backgroundColor = '#10b981';
    }
  }

  setLoadingState(isLoading) {
    const submitBtn = document.getElementById('login-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    
    if (isLoading) {
      submitBtn.disabled = true;
      btnText.style.display = 'none';
      btnLoading.style.display = 'inline-flex';
    } else {
      submitBtn.disabled = false;
      btnText.style.display = 'inline';
      btnLoading.style.display = 'none';
    }
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Initialize login manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new LoginManager();
});

// Add shake animation CSS
const style = document.createElement('style');
style.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
  }
`;
document.head.appendChild(style);

