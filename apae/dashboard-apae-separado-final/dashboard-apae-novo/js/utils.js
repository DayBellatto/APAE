// ===== UTILITY FUNCTIONS =====

class Utils {
  // Debounce function
  static debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        timeout = null;
        if (!immediate) func(...args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func(...args);
    };
  }

  // Throttle function
  static throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  // Format date
  static formatDate(date, options = {}) {
    const defaultOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return new Date(date).toLocaleDateString('pt-BR', { ...defaultOptions, ...options });
  }

  // Format time
  static formatTime(date, options = {}) {
    const defaultOptions = {
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(date).toLocaleTimeString('pt-BR', { ...defaultOptions, ...options });
  }

  // Format relative time
  static formatRelativeTime(date) {
    const now = new Date();
    const diff = now - new Date(date);
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return 'agora mesmo';
    if (minutes < 60) return `${minutes} min atrás`;
    if (hours < 24) return `${hours}h atrás`;
    if (days < 7) return `${days} dias atrás`;
    return this.formatDate(date);
  }

  // Generate random ID
  static generateId(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  // Local storage helpers
  static storage = {
    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (error) {
        console.error('Error saving to localStorage:', error);
        return false;
      }
    },

    get(key, defaultValue = null) {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
      } catch (error) {
        console.error('Error reading from localStorage:', error);
        return defaultValue;
      }
    },

    remove(key) {
      try {
        localStorage.removeItem(key);
        return true;
      } catch (error) {
        console.error('Error removing from localStorage:', error);
        return false;
      }
    },

    clear() {
      try {
        localStorage.clear();
        return true;
      } catch (error) {
        console.error('Error clearing localStorage:', error);
        return false;
      }
    }
  };

  // DOM helpers
  static dom = {
    // Create element with attributes and children
    create(tag, attributes = {}, children = []) {
      const element = document.createElement(tag);
      
      Object.entries(attributes).forEach(([key, value]) => {
        if (key === 'className') {
          element.className = value;
        } else if (key === 'innerHTML') {
          element.innerHTML = value;
        } else if (key === 'textContent') {
          element.textContent = value;
        } else {
          element.setAttribute(key, value);
        }
      });

      children.forEach(child => {
        if (typeof child === 'string') {
          element.appendChild(document.createTextNode(child));
        } else {
          element.appendChild(child);
        }
      });

      return element;
    },

    // Query selector with error handling
    $(selector, context = document) {
      try {
        return context.querySelector(selector);
      } catch (error) {
        console.error('Invalid selector:', selector);
        return null;
      }
    },

    // Query selector all with error handling
    $$(selector, context = document) {
      try {
        return Array.from(context.querySelectorAll(selector));
      } catch (error) {
        console.error('Invalid selector:', selector);
        return [];
      }
    },

    // Add event listener with cleanup
    on(element, event, handler, options = {}) {
      if (!element) return null;
      
      element.addEventListener(event, handler, options);
      
      // Return cleanup function
      return () => element.removeEventListener(event, handler, options);
    },

    // Remove all children
    empty(element) {
      if (!element) return;
      while (element.firstChild) {
        element.removeChild(element.firstChild);
      }
    },

    // Check if element is visible
    isVisible(element) {
      if (!element) return false;
      const rect = element.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    },

    // Smooth scroll to element
    scrollTo(element, options = {}) {
      if (!element) return;
      
      const defaultOptions = {
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      };
      
      element.scrollIntoView({ ...defaultOptions, ...options });
    }
  };

  // Animation helpers
  static animation = {
    // Animate number counting
    countUp(element, start, end, duration = 1000) {
      if (!element) return;
      
      const startTime = performance.now();
      const range = end - start;
      
      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease-out)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (range * easeOut));
        
        element.textContent = current;
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          element.textContent = end;
        }
      };
      
      requestAnimationFrame(animate);
    },

    // Fade in element
    fadeIn(element, duration = 300) {
      if (!element) return Promise.resolve();
      
      return new Promise(resolve => {
        element.style.opacity = '0';
        element.style.display = 'block';
        
        const start = performance.now();
        
        const animate = (currentTime) => {
          const elapsed = currentTime - start;
          const progress = Math.min(elapsed / duration, 1);
          
          element.style.opacity = progress;
          
          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            resolve();
          }
        };
        
        requestAnimationFrame(animate);
      });
    },

    // Fade out element
    fadeOut(element, duration = 300) {
      if (!element) return Promise.resolve();
      
      return new Promise(resolve => {
        const start = performance.now();
        const startOpacity = parseFloat(getComputedStyle(element).opacity);
        
        const animate = (currentTime) => {
          const elapsed = currentTime - start;
          const progress = Math.min(elapsed / duration, 1);
          
          element.style.opacity = startOpacity * (1 - progress);
          
          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            element.style.display = 'none';
            resolve();
          }
        };
        
        requestAnimationFrame(animate);
      });
    },

    // Slide up element
    slideUp(element, duration = 300) {
      if (!element) return Promise.resolve();
      
      return new Promise(resolve => {
        const height = element.offsetHeight;
        element.style.overflow = 'hidden';
        element.style.height = height + 'px';
        
        const start = performance.now();
        
        const animate = (currentTime) => {
          const elapsed = currentTime - start;
          const progress = Math.min(elapsed / duration, 1);
          
          element.style.height = (height * (1 - progress)) + 'px';
          
          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            element.style.display = 'none';
            element.style.height = '';
            element.style.overflow = '';
            resolve();
          }
        };
        
        requestAnimationFrame(animate);
      });
    },

    // Slide down element
    slideDown(element, duration = 300) {
      if (!element) return Promise.resolve();
      
      return new Promise(resolve => {
        element.style.display = 'block';
        const height = element.offsetHeight;
        element.style.overflow = 'hidden';
        element.style.height = '0px';
        
        const start = performance.now();
        
        const animate = (currentTime) => {
          const elapsed = currentTime - start;
          const progress = Math.min(elapsed / duration, 1);
          
          element.style.height = (height * progress) + 'px';
          
          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            element.style.height = '';
            element.style.overflow = '';
            resolve();
          }
        };
        
        requestAnimationFrame(animate);
      });
    }
  };

  // Validation helpers
  static validation = {
    email(email) {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(email);
    },

    phone(phone) {
      const regex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
      return regex.test(phone);
    },

    cpf(cpf) {
      cpf = cpf.replace(/[^\d]/g, '');
      if (cpf.length !== 11) return false;
      
      // Check for repeated digits
      if (/^(\d)\1{10}$/.test(cpf)) return false;
      
      // Validate check digits
      let sum = 0;
      for (let i = 0; i < 9; i++) {
        sum += parseInt(cpf.charAt(i)) * (10 - i);
      }
      let digit1 = 11 - (sum % 11);
      if (digit1 > 9) digit1 = 0;
      
      sum = 0;
      for (let i = 0; i < 10; i++) {
        sum += parseInt(cpf.charAt(i)) * (11 - i);
      }
      let digit2 = 11 - (sum % 11);
      if (digit2 > 9) digit2 = 0;
      
      return digit1 === parseInt(cpf.charAt(9)) && digit2 === parseInt(cpf.charAt(10));
    },

    required(value) {
      return value !== null && value !== undefined && value.toString().trim() !== '';
    },

    minLength(value, min) {
      return value && value.length >= min;
    },

    maxLength(value, max) {
      return !value || value.length <= max;
    }
  };

  // Format helpers
  static format = {
    currency(value, currency = 'BRL') {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: currency
      }).format(value);
    },

    number(value, options = {}) {
      return new Intl.NumberFormat('pt-BR', options).format(value);
    },

    phone(phone) {
      const cleaned = phone.replace(/\D/g, '');
      if (cleaned.length === 11) {
        return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
      } else if (cleaned.length === 10) {
        return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
      }
      return phone;
    },

    cpf(cpf) {
      const cleaned = cpf.replace(/\D/g, '');
      if (cleaned.length === 11) {
        return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}-${cleaned.slice(9)}`;
      }
      return cpf;
    }
  };

  // URL helpers
  static url = {
    getParams() {
      return new URLSearchParams(window.location.search);
    },

    getParam(name) {
      return this.getParams().get(name);
    },

    setParam(name, value) {
      const url = new URL(window.location);
      url.searchParams.set(name, value);
      window.history.pushState({}, '', url);
    },

    removeParam(name) {
      const url = new URL(window.location);
      url.searchParams.delete(name);
      window.history.pushState({}, '', url);
    }
  };

  // Device detection
  static device = {
    isMobile() {
      return window.innerWidth <= 768;
    },

    isTablet() {
      return window.innerWidth > 768 && window.innerWidth <= 1024;
    },

    isDesktop() {
      return window.innerWidth > 1024;
    },

    isTouchDevice() {
      return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }
  };

  // Performance helpers
  static performance = {
    measure(name, fn) {
      const start = performance.now();
      const result = fn();
      const end = performance.now();
      console.log(`${name}: ${end - start}ms`);
      return result;
    },

    async measureAsync(name, fn) {
      const start = performance.now();
      const result = await fn();
      const end = performance.now();
      console.log(`${name}: ${end - start}ms`);
      return result;
    }
  };
}

// Export for use in other modules
window.Utils = Utils;

