const hamburger = document.querySelector(".navbar-hamburger");
const menu = document.querySelector(".navbar-hamburger-menu");

if (hamburger && menu) {
  hamburger.addEventListener("click", () => {
    menu.classList.toggle("open");
    hamburger.classList.toggle("active");
  });

  menu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      menu.classList.remove("open");
      hamburger.classList.remove("active");
    });
  });
}

// Dropdowns
function setupDropdowns(scope) {
  const dropdowns = scope.querySelectorAll('.navbar-dropdown');
  dropdowns.forEach(dropdown => {
    const btn = dropdown.querySelector('.navbar-dropbtn');
    const content = dropdown.querySelector('.navbar-dropdown-content');
    if (!btn || !content) return;

    if (window.innerWidth > 1100) {
      dropdown.addEventListener('mouseenter', () => content.classList.add('open'));
      dropdown.addEventListener('mouseleave', () => content.classList.remove('open'));
    }
    btn.addEventListener('click', (e) => {
      if (window.innerWidth <= 1100) {
        e.preventDefault();
        content.classList.toggle('open');
      }
    });
  });
}
setupDropdowns(document);

// Responsive dropdown safety
window.addEventListener('resize', () => {
  document.querySelectorAll('.navbar-dropdown-content, .district-content').forEach(el => {
    if (window.innerWidth <= 1100) {
      el.style.maxWidth = '100vw';
    } else {
      el.style.maxWidth = '';
    }
  });
});

// Theme Toggle Functionality
function initThemeToggle() {
  // Wait for theme toggle elements to be available
  function waitForThemeToggle(callback, maxAttempts = 20) {
    const themeToggle = document.getElementById('themeToggle');
    const themeToggleMobile = document.getElementById('themeToggleMobile');
    
    if (themeToggle && themeToggleMobile) {
      callback(themeToggle, themeToggleMobile);
    } else if (maxAttempts > 0) {
      setTimeout(() => waitForThemeToggle(callback, maxAttempts - 1), 100);
    }
  }
  
  waitForThemeToggle(function(themeToggle, themeToggleMobile) {
    // Get current theme from localStorage or detect from page
    function getCurrentTheme() {
      const styleLink = document.querySelector('link[rel="stylesheet"]');
      if (styleLink) {
        const href = styleLink.getAttribute('href');
        if (href.includes('dark.css')) {
          return 'dark';
        }
      }
      return localStorage.getItem('theme') || 'light';
    }
    
    // Apply theme to document
    function applyTheme(theme) {
      const styleLink = document.querySelector('link[rel="stylesheet"]');
      if (!styleLink) return;
      
      const href = styleLink.getAttribute('href');
      let newHref = href;
      
      if (theme === 'dark') {
        // Replace any occurrence of light.css with dark.css
        newHref = href.replace(/light\.css/g, 'dark.css');
      } else {
        // Replace any occurrence of dark.css with light.css
        newHref = href.replace(/dark\.css/g, 'light.css');
      }
      
      // Only update if the href actually changed
      if (newHref !== href) {
        styleLink.setAttribute('href', newHref);
      }
      
      localStorage.setItem('theme', theme);
      updateToggleState(theme);
    }
    
    // Update toggle switch to reflect current theme
    function updateToggleState(theme) {
      const isDark = theme === 'dark';
      themeToggle.checked = isDark;
      themeToggleMobile.checked = isDark;
    }
    
    // Initialize theme on page load
    const currentTheme = getCurrentTheme();
    updateToggleState(currentTheme);
    
    // Add event listeners
    themeToggle.addEventListener('change', () => {
      const newTheme = themeToggle.checked ? 'dark' : 'light';
      applyTheme(newTheme);
      themeToggleMobile.checked = themeToggle.checked;
    });
    
    themeToggleMobile.addEventListener('change', () => {
      const newTheme = themeToggleMobile.checked ? 'dark' : 'light';
      applyTheme(newTheme);
      themeToggle.checked = themeToggleMobile.checked;
    });
  });
}

// Initialize theme toggle when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initThemeToggle);
} else {
  initThemeToggle();
}
