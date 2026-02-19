const hamburger = document.querySelector(".navbar-hamburger");
const menu = document.querySelector(".navbar-hamburger-menu");

console.log('[navbar.js] Script loaded');

// Load Font Awesome
const fontAwesomeScript = document.createElement('script');
fontAwesomeScript.src = 'https://kit.fontawesome.com/6ba8d5bf94.js';
fontAwesomeScript.crossOrigin = 'anonymous';
document.head.appendChild(fontAwesomeScript);

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

// ===== THEME TOGGLE FUNCTIONALITY =====
console.log('[navbar.js] Setting up theme toggle functions');

window.getCurrentTheme = function() {
  const attr = document.documentElement.getAttribute('data-theme');
  if (attr) return attr;
  const saved = localStorage.getItem('theme');
  if (saved) return saved;
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

window.applyTheme = function(theme) {
  if (theme === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
  else document.documentElement.removeAttribute('data-theme');

  localStorage.setItem('theme', theme);
  window.updateToggles(theme);

  // Change logo based on theme
  const logoImg = document.querySelector('img.navbar-logo');
  
  if (!logoImg) {
    console.error('[applyTheme] No logo image found!');
    return;
  }
  
  const src = logoImg.getAttribute('src');
  console.log('[applyTheme] Current logo src:', src);
  let newSrc = src;
  
  if (theme === 'dark') {
    newSrc = src.replace(/Icon_LightPrimary\.png/g, 'Icon_Dark.png');
  } else {
    newSrc = src.replace(/Icon_Dark\.png/g, 'Icon_LightPrimary.png');
  }
  
  console.log('[applyTheme] New logo src:', newSrc);
  
  if (newSrc !== src) {
    logoImg.setAttribute('src', newSrc);
    console.log('[applyTheme] Logo updated successfully');
  }
  
  localStorage.setItem('theme', theme);
  console.log('[applyTheme] Theme saved to localStorage');
  window.updateToggles(theme);
};

window.updateToggles = function(theme) {
  console.log('[updateToggles] Updating for theme:', theme);
  const themeToggle = document.getElementById('themeToggle');
  const themeToggleMobile = document.getElementById('themeToggleMobile');
  
  console.log('[updateToggles] Found desktop toggle:', !!themeToggle);
  console.log('[updateToggles] Found mobile toggle:', !!themeToggleMobile);
  
  const isDark = theme === 'dark';
  if (themeToggle) themeToggle.checked = isDark;
  if (themeToggleMobile) themeToggleMobile.checked = isDark;
};

window.initThemeToggles = function() {
  console.log('[initThemeToggles] Starting initialization');
  const themeToggle = document.getElementById('themeToggle');
  const themeToggleMobile = document.getElementById('themeToggleMobile');
  
  if (!themeToggle) {
    console.error('[initThemeToggles] Desktop toggle NOT found');
    return false;
  }
  if (!themeToggleMobile) {
    console.error('[initThemeToggles] Mobile toggle NOT found');
    return false;
  }
  
  console.log('[initThemeToggles] Both toggles found, initializing...');
  
  // Get current theme
  const currentTheme = window.getCurrentTheme();
  window.updateToggles(currentTheme);
  
  // Desktop toggle listener
  themeToggle.addEventListener('change', function() {
    console.log('[initThemeToggles] Desktop toggle changed to:', this.checked);
    const newTheme = this.checked ? 'dark' : 'light';
    window.applyTheme(newTheme);
    themeToggleMobile.checked = this.checked;
  });
  
  // Mobile toggle listener
  themeToggleMobile.addEventListener('change', function() {
    console.log('[initThemeToggles] Mobile toggle changed to:', this.checked);
    const newTheme = this.checked ? 'dark' : 'light';
    window.applyTheme(newTheme);
    themeToggle.checked = this.checked;
  });
  
  console.log('[initThemeToggles] Initialization complete');
  return true;
};

// Try to initialize immediately
console.log('[navbar.js] Attempting to initialize theme toggles');
if (!window.initThemeToggles()) {
  console.log('[navbar.js] Toggles not ready, will retry');
  // If toggles aren't ready yet, try again after a short delay
  setTimeout(function() {
    console.log('[navbar.js] Retrying theme toggle initialization');
    window.initThemeToggles();
  }, 100);
}

// Load SiteSearch360 search plugin
(function loadSiteSearch360(){
  try {
    const ssScript = document.createElement('script');
    ssScript.async = true;
    ssScript.src = 'https://js.sitesearch360.com/plugin/bundle/56979.js';
    document.head.appendChild(ssScript);
    console.log('[navbar.js] SiteSearch360 script appended');
  } catch (e) {
    console.error('[navbar.js] Failed to append SiteSearch360 script', e);
  }
})();