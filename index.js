document.addEventListener('DOMContentLoaded', () => {
    // --- Theme Toggle ---
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    const themeIcon = themeToggle.querySelector('i');

    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        htmlElement.setAttribute('data-theme', newTheme);
        themeIcon.className = newTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        
        // Save preference
        localStorage.setItem('theme', newTheme);
    });

    // --- RTL/LTR Toggle ---
    const langToggle = document.getElementById('lang-toggle');
    langToggle.addEventListener('click', () => {
        const currentDir = htmlElement.getAttribute('dir');
        const newDir = currentDir === 'ltr' ? 'rtl' : 'ltr';
        htmlElement.setAttribute('dir', newDir);
        htmlElement.setAttribute('lang', newDir === 'rtl' ? 'ar' : 'en');
    });

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

    // Initialize theme from local storage if available
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        htmlElement.setAttribute('data-theme', savedTheme);
        themeIcon.className = savedTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }
});
