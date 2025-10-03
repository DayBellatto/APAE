// Dashboard authentication and user management
class DashboardAuth {
  constructor() {
    this.currentUser = null;
    this.init();
  }

  init() {
    this.checkAuthentication();
    this.bindEvents();
  }

  checkAuthentication() {
    const userData = localStorage.getItem('apae_user');
    const loginTime = localStorage.getItem('apae_login_time');
    
    if (!userData || !loginTime) {
      this.redirectToLogin();
      return;
    }

    // Check if session is still valid (24 hours)
    const loginDate = new Date(loginTime);
    const now = new Date();
    const hoursDiff = (now - loginDate) / (1000 * 60 * 60);
    
    if (hoursDiff > 24) {
      this.logout();
      return;
    }

    try {
      this.currentUser = JSON.parse(userData);
      this.updateUserInterface();
    } catch (error) {
      console.error('Error parsing user data:', error);
      this.redirectToLogin();
    }
  }

  updateUserInterface() {
    if (!this.currentUser) return;

    // Update welcome message
    const welcomeTitle = document.querySelector('.welcome-title');
    if (welcomeTitle) {
      welcomeTitle.textContent = `Bem-vindo de volta, ${this.currentUser.name}! 👋`;
    }

    // Update user info in header if exists
    const userNameElement = document.querySelector('.user-name');
    if (userNameElement) {
      userNameElement.textContent = this.currentUser.name;
    }

    const userRoleElement = document.querySelector('.user-role');
    if (userRoleElement) {
      userRoleElement.textContent = this.getRoleDisplayName(this.currentUser.role);
    }

    // Show admin badge if user is admin
    if (this.currentUser.role === 'admin') {
      const adminBadge = document.querySelector('.admin-badge');
      if (adminBadge) {
        adminBadge.style.display = 'inline-block';
      }
    }

    // Update navigation based on user role
    this.updateNavigationByRole();
  }

  getRoleDisplayName(role) {
    const roleNames = {
      'admin': 'Administrador',
      'user': 'Usuário',
      'doctor': 'Médico'
    };
    return roleNames[role] || 'Usuário';
  }

  updateNavigationByRole() {
    const navItems = document.querySelectorAll('.nav-item');
    
    // Hide certain menu items based on user role
    if (this.currentUser.role !== 'admin') {
      navItems.forEach(item => {
        const link = item.querySelector('.nav-link');
        const text = link?.textContent?.trim();
        
        // Hide admin-only sections
        if (text === 'Configurações' || text === 'Relatórios') {
          item.style.display = 'none';
        }
      });
    }
  }

  bindEvents() {
    // Logout button
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.logout();
      });
    }

    // Navigation items
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleNavigation(link);
      });
    });
  }

  handleNavigation(link) {
    // Remove active class from all nav items
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.remove('active');
    });

    // Add active class to clicked item
    const navItem = link.closest('.nav-item');
    if (navItem) {
      navItem.classList.add('active');
    }

    // Handle different navigation actions
    const text = link.textContent.trim();
    
    switch (text) {
      case 'Dashboard':
        this.showDashboardView();
        break;
      case 'Pacientes':
        this.showPatientsView();
        break;
      case 'Funcionários':
        this.showStaffView();
        break;
      case 'Escalas':
        this.showSchedulesView();
        break;
      case 'Relatórios':
        this.showReportsView();
        break;
      case 'Configurações':
        this.showSettingsView();
        break;
      default:
        console.log(`Navigation to ${text} not implemented yet`);
    }
  }

  showDashboardView() {
    // This is the default view, already loaded
    console.log('Dashboard view active');
  }

  showPatientsView() {
    this.showComingSoon('Pacientes');
  }

  showStaffView() {
    this.showComingSoon('Funcionários');
  }

  showSchedulesView() {
    this.showComingSoon('Escalas');
  }

  showReportsView() {
    if (this.currentUser.role !== 'admin') {
      this.showAccessDenied();
      return;
    }
    this.showComingSoon('Relatórios');
  }

  showSettingsView() {
    if (this.currentUser.role !== 'admin') {
      this.showAccessDenied();
      return;
    }
    this.showComingSoon('Configurações');
  }

  showComingSoon(section) {
    alert(`Seção "${section}" em desenvolvimento. Em breve estará disponível!`);
  }

  showAccessDenied() {
    alert('Acesso negado. Você não tem permissão para acessar esta seção.');
  }

  logout() {
    // Clear stored data
    localStorage.removeItem('apae_user');
    localStorage.removeItem('apae_login_time');
    
    // Show logout message
    this.showLogoutMessage();
    
    // Redirect to login after a short delay
    setTimeout(() => {
      this.redirectToLogin();
    }, 1000);
  }

  showLogoutMessage() {
    // Create a temporary message
    const message = document.createElement('div');
    message.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      padding: 2rem;
      border-radius: 0.75rem;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
      z-index: 1000;
      text-align: center;
      border: 1px solid #e5e7eb;
    `;
    message.innerHTML = `
      <i class="fas fa-sign-out-alt" style="font-size: 2rem; color: #ef4444; margin-bottom: 1rem;"></i>
      <h3 style="margin-bottom: 0.5rem; color: #1f2937;">Logout realizado com sucesso!</h3>
      <p style="color: #6b7280;">Redirecionando para o login...</p>
    `;
    
    document.body.appendChild(message);
    
    // Remove message after delay
    setTimeout(() => {
      document.body.removeChild(message);
    }, 1000);
  }

  redirectToLogin() {
    window.location.href = 'login.html';
  }

  getCurrentUser() {
    return this.currentUser;
  }

  isAdmin() {
    return this.currentUser && this.currentUser.role === 'admin';
  }

  isDoctor() {
    return this.currentUser && this.currentUser.role === 'doctor';
  }
}

// Initialize dashboard auth when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.dashboardAuth = new DashboardAuth();
});

