/* ==========================================
   TeleBotsHub — Main Application
   ========================================== */

(function () {
    'use strict';

    // ==========================================
    // Inline Data (avoids CORS on file://)
    // ==========================================
    const DATA = {
        "bots": [
            {
                "id": "probe-sherlock",
                "name": "Шерлок",
                "description": "OSINT-бот для поиска информации по человеку. Имя, ник, номер телефона, соцсети — всё в одном месте.",
                "category": "probe",
                "url": "https://736865726c6f636b.com/#NPI4eH5Pc_3y1qNRvbt",
                "image": "https://placehold.co/120x120/1a1a2e/c084fc?text=SH",
                "rating": 4.8,
                "users": "95K",
                "tags": ["OSINT", "пробив", "поиск людей", "соцсети"]
            },
            {
                "id": "probe-enigma",
                "name": "Энигма",
                "description": "VPN и анонимность в одном боте. Быстрое подключение, выбор серверов по всему миру, защита трафика.",
                "category": "probe",
                "url": "https://t.me/Enivpnbot?start=YX31RMIL",
                "image": "https://placehold.co/120x120/1a1a2e/6366f1?text=EN",
                "rating": 4.7,
                "users": "110K",
                "tags": ["VPN", "пробив", "анонимность", "безопасность"]
            },
            {
                "id": "probe-void",
                "name": "Войд",
                "description": "Альтернатива Шерлока для глубокого OSINT-пробива. Поиск по базам данных, проверка людей, трекинг аккаунтов.",
                "category": "probe",
                "url": "https://void.expert/#4xDwfuXgHXCH",
                "image": "https://placehold.co/120x120/1a1a2e/ef4444?text=VD",
                "rating": 4.9,
                "users": "78K",
                "tags": ["OSINT", "пробив", "альтернатива Шерлока", "поиск людей"]
            },
            {
                "id": "probe-himera",
                "name": "Химера",
                "description": "Поиск по базам данных судимостей и криминальных записей. Проверка человека по ФИО, паспорту, номеру телефона.",
                "category": "probe",
                "url": "https://himera-search.net/cabinet/signup?ref=1606974",
                "image": "https://placehold.co/120x120/1a1a2e/f97316?text=HM",
                "rating": 4.8,
                "users": "62K",
                "tags": ["судимости", "криминал", "пробив", "базы данных", "проверка людей"]
            },
            {
                "id": "probe-chatcrawler",
                "name": "ChatCrawler",
                "description": "Пробив Telegram-аккаунтов. История постов, медиа, активность, список групп — полный профиль за секунды.",
                "category": "probe",
                "url": "https://chatcrawler.link/#coolname",
                "image": "https://placehold.co/120x120/1a1a2e/14b8a6?text=CC",
                "rating": 4.6,
                "users": "43K",
                "tags": ["Telegram пробив", "пробив", "профиль", "аккаунты", "OSINT"]
            }
        ],
        "categories": [
            { "id": "trading", "name": "Трейдинг", "icon": "📈", "description": "Боты для торговли криптовалют и акций, сигналы, аналитика" },
            { "id": "ai", "name": "ИИ и нейросети", "icon": "🤖", "description": "ChatGPT, генерация изображений, транскрибация, ИИ-ассистенты" },
            { "id": "utility", "name": "Утилиты", "icon": "🛠", "description": "Конвертеры файлов, QR-коды, погода и другие полезные инструменты" },
            { "id": "finance", "name": "Финансы", "icon": "💰", "description": "Портфели, отслеживание цен, аналитика рынков" },
            { "id": "fun", "name": "Развлечения", "icon": "🎮", "description": "Мемы, музыка, игры и другие боты для отдыха" },
            { "id": "dev", "name": "Для разработчиков", "icon": "💻", "description": "GitHub, код, форматирование и инструменты для разработки" },
            { "id": "productivity", "name": "Продуктивность", "icon": "📋", "description": "Задачи, заметки, напоминания и организация работы" },
            { "id": "probe", "name": "Пробив", "icon": "🔍", "description": "Поиск информации, проверка людей, OSINT, поиск по базам данных" }
        ]
    };

    let allBots = DATA.bots;
    let allCategories = DATA.categories;
    let activeCategory = 'all';
    let searchQuery = '';

    // DOM refs
    const searchInput = document.getElementById('searchInput');
    const botsGrid = document.getElementById('botsGrid');
    const categoriesGrid = document.getElementById('categoriesGrid');
    const catalogCount = document.getElementById('catalogCount');
    const noResults = document.getElementById('noResults');
    const totalBots = document.getElementById('totalBots');
    const totalCategories = document.getElementById('totalCategories');
    const totalUsers = document.getElementById('totalUsers');

    // ==========================================
    // Stats
    // ==========================================
    function updateStats() {
        animateNumber(totalBots, allBots.length);
        animateNumber(totalCategories, allCategories.length);

        const totalUserCount = allBots.reduce((sum, bot) => {
            const num = parseFloat(bot.users.replace('K', ''));
            return sum + (bot.users.includes('K') ? num * 1000 : num);
        }, 0);

        let current = 0;
        const target = totalUserCount;
        const step = Math.ceil(target / 40);
        const interval = setInterval(() => {
            current = Math.min(current + step, target);
            totalUsers.textContent = Math.round(current / 1000) + 'K+';
            if (current >= target) clearInterval(interval);
        }, 30);
    }

    function animateNumber(el, target) {
        let current = 0;
        const step = Math.max(1, Math.ceil(target / 30));
        const interval = setInterval(() => {
            current = Math.min(current + step, target);
            el.textContent = current;
            if (current >= target) clearInterval(interval);
        }, 30);
    }

    // ==========================================
    // Categories
    // ==========================================
    function renderCategories() {
        categoriesGrid.innerHTML = allCategories.map(cat => `
            <div class="category-card" data-category="${cat.id}" role="listitem" tabindex="0"
                 aria-label="Категория: ${cat.name}">
                <div class="category-icon">${cat.icon}</div>
                <div class="category-info">
                    <h3>${cat.name}</h3>
                    <p>${cat.description}</p>
                </div>
            </div>
        `).join('');

        categoriesGrid.querySelectorAll('.category-card').forEach(card => {
            card.addEventListener('click', () => {
                const cat = card.dataset.category;
                setActiveCategory(cat === activeCategory ? 'all' : cat);
                document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' });
            });
            card.addEventListener('keydown', e => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    card.click();
                }
            });
        });
    }

    // ==========================================
    // Filters
    // ==========================================
    function renderFilters() {
        const filtersContainer = document.querySelector('.catalog-filters');
        const filterBtns = allCategories.map(cat => `
            <button class="filter-btn" data-category="${cat.id}" role="tab" aria-selected="false">
                ${cat.icon} ${cat.name}
            </button>
        `).join('');

        filtersContainer.insertAdjacentHTML('beforeend', filterBtns);

        filtersContainer.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                setActiveCategory(btn.dataset.category);
            });
        });
    }

    function setActiveCategory(cat) {
        activeCategory = cat;

        document.querySelectorAll('.filter-btn').forEach(btn => {
            const isActive = btn.dataset.category === cat;
            btn.classList.toggle('active', isActive);
            btn.setAttribute('aria-selected', isActive);
        });

        document.querySelectorAll('.category-card').forEach(card => {
            card.classList.toggle('active', card.dataset.category === cat);
        });

        renderBots();
    }

    // ==========================================
    // Render Bots
    // ==========================================
    function renderBots() {
        let filtered = allBots;

        if (activeCategory !== 'all') {
            filtered = filtered.filter(bot => bot.category === activeCategory);
        }

        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            filtered = filtered.filter(bot =>
                bot.name.toLowerCase().includes(q) ||
                bot.description.toLowerCase().includes(q) ||
                bot.tags.some(tag => tag.toLowerCase().includes(q)) ||
                bot.category.toLowerCase().includes(q)
            );
        }

        const count = filtered.length;
        catalogCount.textContent = count === allBots.length
            ? `Показано всех ${count} ботов`
            : `Найдено ${count} ${getBotWord(count)}`;

        noResults.hidden = count > 0;
        botsGrid.style.display = count > 0 ? '' : 'none';

        botsGrid.innerHTML = filtered.map((bot, i) => `
            <article class="bot-card" role="listitem" style="animation-delay: ${i * 0.03}s">
                <div class="bot-top">
                    <img class="bot-avatar" src="${bot.image}" alt="${bot.name}" width="52" height="52" loading="lazy">
                    <div class="bot-meta">
                        <div class="bot-name">${highlightSearch(bot.name)}</div>
                        <span class="bot-category-badge">${getCategoryName(bot.category)}</span>
                    </div>
                </div>
                <p class="bot-desc">${highlightSearch(bot.description)}</p>
                <div class="bot-tags">
                    ${bot.tags.map(tag => `<span class="bot-tag">${highlightSearch(tag)}</span>`).join('')}
                </div>
                <div class="bot-footer">
                    <div class="bot-rating">
                        <span class="bot-stars">${getStars(bot.rating)}</span>
                        <span>${bot.rating}</span>
                    </div>
                    <span class="bot-users">${bot.users} юзеров</span>
                </div>
                <a href="${bot.url}" class="bot-link" target="_blank" rel="noopener sponsored nofollow"
                   aria-label="Открыть бота ${bot.name} в Telegram">
                    Открыть бота
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M7 17L17 7M17 7H7M17 7V17"/>
                    </svg>
                </a>
            </article>
        `).join('');

        botsGrid.querySelectorAll('.bot-link').forEach(link => {
            link.addEventListener('click', () => {
                if (typeof gtag === 'function') {
                    gtag('event', 'referral_click', {
                        bot_url: link.href,
                        category: link.closest('.bot-card')?.querySelector('.bot-category-badge')?.textContent || ''
                    });
                }
            });
        });
    }

    // ==========================================
    // Helpers
    // ==========================================
    function getCategoryName(id) {
        const cat = allCategories.find(c => c.id === id);
        return cat ? cat.name : id;
    }

    function getStars(rating) {
        const full = Math.floor(rating);
        const half = rating % 1 >= 0.5;
        let stars = '★'.repeat(full);
        if (half) stars += '½';
        return stars;
    }

    function getBotWord(n) {
        const mod10 = n % 10;
        const mod100 = n % 100;
        if (mod100 >= 11 && mod100 <= 19) return 'ботов';
        if (mod10 === 1) return 'бот';
        if (mod10 >= 2 && mod10 <= 4) return 'бота';
        return 'ботов';
    }

    function highlightSearch(text) {
        if (!searchQuery) return text;
        const regex = new RegExp(`(${escapeRegex(searchQuery)})`, 'gi');
        return text.replace(regex, '<mark style="background:var(--accent-glow);color:var(--accent-light);padding:0 2px;border-radius:3px">$1</mark>');
    }

    function escapeRegex(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // ==========================================
    // Event Listeners
    // ==========================================
    let searchTimeout;
    searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            searchQuery = searchInput.value.trim();
            renderBots();
        }, 200);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === '/' && document.activeElement !== searchInput) {
            e.preventDefault();
            searchInput.focus();
        }
        if (e.key === 'Escape') {
            searchInput.blur();
            searchQuery = '';
            searchInput.value = '';
            renderBots();
        }
    });

    const urlParams = new URLSearchParams(window.location.search);
    const qParam = urlParams.get('q');
    if (qParam) {
        searchInput.value = qParam;
        searchQuery = qParam;
    }

    document.querySelectorAll('[data-category-filter]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            setActiveCategory(link.dataset.categoryFilter);
            document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' });
        });
    });

    // ==========================================
    // Init — fetch bots.json, fall back to inline
    // ==========================================
    async function init() {
        try {
            const res = await fetch('bots.json');
            if (res.ok) {
                const data = await res.json();
                allBots = data.bots;
                if (data.categories) allCategories = data.categories;
            }
        } catch (_) {
            // local file:// — use inline DATA
        }
        updateStats();
        renderCategories();
        renderFilters();
        renderBots();
    }
    init();
})();
