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
