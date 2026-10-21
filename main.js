// Parallel columns can be visible together; highlight the selected anchor.
const sectionLinks = [...document.querySelectorAll('nav a[href^="#"]')];
function updateCurrentLink() {
  const activeHash = window.location.hash || '#about';
  for (const link of sectionLinks) {
    if (link.getAttribute('href') === activeHash) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  }
}
window.addEventListener('hashchange', updateCurrentLink);
updateCurrentLink();

// The head script selects the initial palette before the stylesheet loads.
const themeToggle = document.getElementById('theme-toggle');
const systemTheme = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
let chosenTheme = null;
try {
  const storedTheme = localStorage.getItem('menghao-theme');
  if (storedTheme === 'light' || storedTheme === 'night') chosenTheme = storedTheme;
} catch (_) {}

function applyTheme(theme) {
  const night = theme === 'night';
  document.documentElement.dataset.theme = night ? 'night' : 'light';
  document.documentElement.style.colorScheme = night ? 'dark' : 'light';
  document.querySelector('meta[name="theme-color"]').content = night ? '#0e1929' : '#f7f9fb';
  if (themeToggle) {
    themeToggle.setAttribute('aria-pressed', String(night));
    themeToggle.title = night ? 'Switch to day mode' : 'Switch to night mode';
  }
}

applyTheme(chosenTheme || (systemTheme && systemTheme.matches ? 'night' : 'light'));
if (themeToggle) {
  themeToggle.hidden = false;
  themeToggle.addEventListener('click', () => {
    chosenTheme = document.documentElement.dataset.theme === 'night' ? 'light' : 'night';
    applyTheme(chosenTheme);
    try { localStorage.setItem('menghao-theme', chosenTheme); } catch (_) {}
  });
}
if (systemTheme && systemTheme.addEventListener) {
  systemTheme.addEventListener('change', (event) => {
    if (!chosenTheme) applyTheme(event.matches ? 'night' : 'light');
  });
}
