document.addEventListener('DOMContentLoaded', () => {
    // --- Theme Toggle ---
    const themeToggles = [document.getElementById('theme-toggle'), document.getElementById('dash-theme-toggle')].filter(Boolean);
    const htmlElement = document.documentElement;

    function updateThemeUI(theme) {
        htmlElement.setAttribute('data-theme', theme);
        themeToggles.forEach(btn => {
            const icon = btn.querySelector('i');
            if (icon) icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        });
        localStorage.setItem('theme', theme);
        if (typeof updateChartTheme === 'function') {
            updateChartTheme();
        }
        if (typeof updateCharts === 'function') {
            updateCharts();
        }
    }



    themeToggles.forEach(btn => {
        btn.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            updateThemeUI(newTheme);
        });
    });

    // Initialize Theme
    const savedTheme = localStorage.getItem('theme') || htmlElement.getAttribute('data-theme') || 'light';
    updateThemeUI(savedTheme);

    // --- RTL/LTR Toggle ---
    const langToggles = [document.getElementById('lang-toggle'), document.getElementById('dash-lang-toggle')].filter(Boolean);

    function updateLangUI(dir) {
        htmlElement.setAttribute('dir', dir);
        htmlElement.setAttribute('lang', dir === 'rtl' ? 'ar' : 'en');
        langToggles.forEach(btn => {
            const span = btn.querySelector('span');
            if (span) {
                span.textContent = dir.toUpperCase();
            } else {
                btn.textContent = dir.toUpperCase();
            }
        });
        localStorage.setItem('dir', dir);
    }

    langToggles.forEach(btn => {
        btn.addEventListener('click', () => {
            const currentDir = htmlElement.getAttribute('dir') || 'ltr';
            const newDir = currentDir === 'ltr' ? 'rtl' : 'ltr';
            updateLangUI(newDir);
        });
    });

    // Initialize Language
    const savedDir = localStorage.getItem('dir') || htmlElement.getAttribute('dir') || 'ltr';
    updateLangUI(savedDir);




    // Header is fully static — no scroll-based padding or size changes

    // --- Hamburger Menu Toggle ---
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (hamburgerBtn && mobileMenu) {
        // Toggle open/close on hamburger click
        hamburgerBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            hamburgerBtn.classList.toggle('open');
            mobileMenu.classList.toggle('open');
        });

        // Close menu only on actual navigation links (not accordion toggles)
        mobileMenu.querySelectorAll('.mobile-nav-link:not(.mobile-nav-toggle)').forEach(link => {
            link.addEventListener('click', () => {
                hamburgerBtn.classList.remove('open');
                mobileMenu.classList.remove('open');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenu.contains(e.target) && !hamburgerBtn.contains(e.target)) {
                hamburgerBtn.classList.remove('open');
                mobileMenu.classList.remove('open');
            }
        });

        // --- Accordion Toggles (Home & Dashboard sub-menus) ---
        document.querySelectorAll('.mobile-nav-toggle').forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                e.stopPropagation();
                const targetId = toggle.getAttribute('data-target');
                const subMenu = document.getElementById(targetId);
                const isOpen = toggle.classList.contains('open');

                // Close all open sub-menus first
                document.querySelectorAll('.mobile-nav-toggle').forEach(t => t.classList.remove('open'));
                document.querySelectorAll('.mobile-sub-menu').forEach(s => s.classList.remove('open'));

                // Open clicked one if it was closed
                if (!isOpen) {
                    toggle.classList.add('open');
                    subMenu.classList.add('open');
                }
            });
        });
    }

    // --- Reveal Animations on Scroll ---
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');

                // If it's a number, trigger the counter
                const numberEl = entry.target.querySelector('.stat-number');
                if (numberEl) {
                    animateValue(numberEl, 0, parseInt(numberEl.getAttribute('data-count')), 2000);
                }
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- Counter Animation Function ---
    function animateValue(obj, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = Math.floor(progress * (end - start) + start).toLocaleString();
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    // --- Dynamic Navigation Highlighting ---
    function highlightNav() {
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';

        // Desktop Nav
        document.querySelectorAll('.nav-link, .dropdown-item').forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPath) {
                link.classList.add('active');

                // If it's a dropdown item, also highlight the parent nav-link
                const parentNavContainer = link.closest('.nav-item');
                if (parentNavContainer) {
                    const parentLink = parentNavContainer.querySelector('.nav-link');
                    if (parentLink) parentLink.classList.add('active');
                }
            }
        });

        // Mobile Nav
        document.querySelectorAll('.mobile-nav-link').forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPath) {
                link.classList.add('active');

                // If it's a sub-link, open the parent sub-menu
                if (link.classList.contains('mobile-sub-link')) {
                    const subMenu = link.closest('.mobile-sub-menu');
                    const toggle = document.querySelector(`[data-target="${subMenu.id}"]`);
                    if (toggle && subMenu) {
                        toggle.classList.add('open');
                        subMenu.classList.add('open');
                        toggle.classList.add('active');
                    }
                }
            }
        });
    }

    highlightNav();

});
