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
  const themeToggle = document.getElementById('themeToggle');
  const themeToggleMobile = document.getElementById('themeToggleMobile');
  const htmlElement = document.documentElement;
  
  // Get current theme from localStorage or default to light
  function getCurrentTheme() {
    return localStorage.getItem('theme') || 'light';
  }
  
  // Apply theme to document
  function applyTheme(theme) {
    const styleLink = document.querySelector('link[rel="stylesheet"]');
    if (styleLink) {
      const href = styleLink.getAttribute('href');
      if (theme === 'dark') {
        styleLink.setAttribute('href', href.replace('light.css', 'dark.css'));
      } else {
        styleLink.setAttribute('href', href.replace('dark.css', 'light.css'));
      }
    }
    localStorage.setItem('theme', theme);
    updateToggleState(theme);
  }
  
  // Update toggle switch to reflect current theme
  function updateToggleState(theme) {
    const isDark = theme === 'dark';
    if (themeToggle) themeToggle.checked = isDark;
    if (themeToggleMobile) themeToggleMobile.checked = isDark;
  }
  
  // Initialize theme on page load
  const currentTheme = getCurrentTheme();
  updateToggleState(currentTheme);
  
  // Add event listeners
  if (themeToggle) {
    themeToggle.addEventListener('change', () => {
      const newTheme = themeToggle.checked ? 'dark' : 'light';
      applyTheme(newTheme);
      if (themeToggleMobile) themeToggleMobile.checked = themeToggle.checked;
    });
  }
  
  if (themeToggleMobile) {
    themeToggleMobile.addEventListener('change', () => {
      const newTheme = themeToggleMobile.checked ? 'dark' : 'light';
      applyTheme(newTheme);
      if (themeToggle) themeToggle.checked = themeToggleMobile.checked;
    });
  }
}

// Initialize theme toggle when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initThemeToggle);
} else {
  initThemeToggle();
}
