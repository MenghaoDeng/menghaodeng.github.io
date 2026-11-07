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
    const lang = document.documentElement.lang;
    if (lang === 'zh-Hans') themeToggle.title = night ? '切换至日间模式' : '切换至夜间模式';
    if (lang === 'zh-Hant') themeToggle.title = night ? '切換至日間模式' : '切換至夜間模式';
    themeToggle.setAttribute('aria-label', themeToggle.title);
  }
}

// English remains the default; visitors can persist an explicit language choice.
// Only locally authored strings are used as HTML. Names, links and the English CV stay intact.
const translatedSelectors = [
  '.skip-link', '.wordmark', 'nav a[href="#about"]', 'nav a[href="#research"]',
  'nav a[href="#background"]', 'nav a[href="#publications"]', 'nav a[href="#contact"]',
  '#name', '.study-year', '.affiliation', '.name-zh',
  '.profile-links a[href*="hkubs"]', '.profile-links a[href$=".pdf"]',
  '#about-heading', '.introduction', '#research-heading', '.interest-list li:nth-child(1)',
  '.interest-list li:nth-child(2)', '.interest-list li:nth-child(3)', '#background-heading',
  '.education:nth-child(1) h3', '.education:nth-child(1) .education-date',
  '.education:nth-child(1) p:nth-of-type(1)', '.education:nth-child(1) p:nth-of-type(2)',
  '.education:nth-child(2) h3', '.education:nth-child(2) p', '#publications-heading',
  '#publication-fireworks h3', '#publication-fireworks p:last-child',
  '#publication-lstm h3 a', '#publication-lstm p:last-child', '.footer-inner span:last-child'
];
const englishContent = translatedSelectors.map(selector => document.querySelector(selector).innerHTML);
const languages = {
  en: englishContent,
  'zh-Hans': [
    '跳至正文', '邓梦毫', '关于我', '研究兴趣', '教育经历', '精选论文', '联系方式',
    '邓梦毫', '金融学博士生 · 二年级', '香港大学经管学院<br>香港大学', 'Menghao Deng',
    '港大主页', '英文简历（PDF）', '关于我',
    '我目前是香港大学<a href="https://www.hkubs.hku.hk/">经管学院</a>金融学二年级博士生，于 2025 年获得香港大学数学理学学士学位。我尤其关注量化研究、机器学习、行为金融和文本分析。',
    '研究兴趣', '人工智能的商业应用', '公司金融', '金融科技', '教育经历',
    '金融学博士', '二年级', '香港大学经管学院', '香港大学', '数学理学学士', '香港大学',
    '精选论文', '中国春节期间烟花相关 PM<sub>2.5</sub> 与无人机表演关注度',
    '<em>npj Clean Air</em> · 2026 年 10 月 29 日录用。',
    '用于精确股价预测的 LSTM 模型隐藏单元分析',
    '<em>第一届数据分析与机器学习国际会议论文集（DAML 2023）</em>，第 411–416 页。SciTePress，2024 年。',
    '最后更新：<time datetime="2026-11-07">2026 年 11 月 7 日</time>'
  ],
  'zh-Hant': [
    '跳至正文', '鄧夢毫', '關於我', '研究興趣', '教育經歷', '精選論文', '聯絡方式',
    '鄧夢毫', '金融學博士生 · 二年級', '香港大學經管學院<br>香港大學', 'Menghao Deng',
    '港大主頁', '英文履歷（PDF）', '關於我',
    '我目前是香港大學<a href="https://www.hkubs.hku.hk/">經管學院</a>金融學二年級博士生，於 2025 年獲得香港大學數學理學學士學位。我尤其關注量化研究、機器學習、行為金融和文本分析。',
    '研究興趣', '人工智能的商業應用', '公司金融', '金融科技', '教育經歷',
    '金融學博士', '二年級', '香港大學經管學院', '香港大學', '數學理學學士', '香港大學',
    '精選論文', '中國春節期間煙花相關 PM<sub>2.5</sub> 與無人機表演關注度',
    '<em>npj Clean Air</em> · 2026 年 10 月 29 日獲接納。',
    '用於精確股價預測的 LSTM 模型隱藏單元分析',
    '<em>第一屆數據分析與機器學習國際會議論文集（DAML 2023）</em>，第 411–416 頁。SciTePress，2024 年。',
    '最後更新：<time datetime="2026-11-07">2026 年 11 月 7 日</time>'
  ]
};
const languageSelect = document.getElementById('language-select');
const englishTitle = document.title;
const metaDescription = document.querySelector('meta[name="description"]');
const englishDescription = metaDescription.content;
function applyLanguage(requested) {
  const lang = Object.prototype.hasOwnProperty.call(languages, requested) ? requested : 'en';
  document.documentElement.lang = lang;
  translatedSelectors.forEach((selector, index) => {
    document.querySelector(selector).innerHTML = languages[lang][index];
  });
  const chinese = lang !== 'en';
  const traditional = lang === 'zh-Hant';
  document.title = chinese ? `${traditional ? '鄧夢毫 | 香港大學金融學博士生' : '邓梦毫 | 香港大学金融学博士生'}` : englishTitle;
  metaDescription.content = chinese ? document.querySelector('.introduction').textContent : englishDescription;
  document.querySelector('.name-zh').lang = chinese ? 'en' : 'zh-Hans';
  document.querySelector('.wordmark').setAttribute('aria-label', chinese ? (traditional ? '鄧夢毫，首頁' : '邓梦毫，首页') : 'Menghao Deng, home');
  document.querySelector('nav').setAttribute('aria-label', chinese ? (traditional ? '主要導覽' : '主导航') : 'Main navigation');
  document.querySelector('.portrait img').alt = chinese ? (traditional ? '鄧夢毫的照片' : '邓梦毫的照片') : 'Portrait of Menghao Deng';
  document.querySelector('.identity-contact').setAttribute('aria-label', chinese ? (traditional ? '聯絡資訊' : '联系信息') : 'Contact information');
  document.querySelector('.profile-links').setAttribute('aria-label', chinese ? (traditional ? '個人檔案連結' : '个人资料链接') : 'Professional profiles');
  languageSelect.value = lang;
  applyTheme(document.documentElement.dataset.theme);
}
let savedLanguage = 'en';
try { savedLanguage = localStorage.getItem('menghao-language') || 'en'; } catch (_) {}
applyLanguage(savedLanguage);
languageSelect.closest('label').hidden = false;
languageSelect.addEventListener('change', () => {
  applyLanguage(languageSelect.value);
  try { localStorage.setItem('menghao-language', languageSelect.value); } catch (_) {}
});

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
