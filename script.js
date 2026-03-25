// Theme Management
class ThemeManager {
    constructor() {
        this.theme = 'dark';
        this.init();
    }

    init() {
        this.setTheme('dark');
        this.bindEvents();
    }

    setTheme(theme) {
        const enforced = 'dark';
        document.documentElement.setAttribute('data-theme', enforced);
            document.documentElement.classList.add('dark');
        localStorage.setItem('theme', enforced);
        this.theme = enforced;
    }

    toggleTheme() {
        // No-op: theme is enforced to dark
        this.setTheme('dark');
    }

    bindEvents() {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.setAttribute('hidden', 'hidden');
            themeToggle.style.display = 'none';
        }
    }
}

// Initialize theme manager
const themeManager = new ThemeManager();
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

// CV Download functionality
function initCvDownload() {
    const cvDownloadBtn = document.getElementById('cvDownload');
    const cvDownloadHero = document.getElementById('cvDownloadHero');
    
    function handleCvDownload(e) {
        e.preventDefault();
        
        // CV file path - using the actual CV file
        const cvUrl = 'Muhammad_Motasim_FullStack_Developer_CV.pdf';
        
        // Create a temporary link element
        const link = document.createElement('a');
        link.href = cvUrl;
        link.download = 'Muhammad_Motasim_CV.pdf';
        link.target = '_blank';
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Show notification
        showNotification('CV download started!', 'success');
    }
    
    if (cvDownloadBtn) {
        cvDownloadBtn.addEventListener('click', handleCvDownload);
    }
    
    if (cvDownloadHero) {
        cvDownloadHero.addEventListener('click', (e) => {
            handleCvDownload(e);
            if (typeof gtag === 'function') gtag('event', 'cta_click', { label: 'cv_download' });
        });
    }
}

// Mobile Navigation Toggle (Tailwind hidden <-> flex)
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        const isOpen = navMenu.style.transform === 'translateX(0px)';
        if (isOpen) {
            navMenu.style.transform = 'translateX(-100%)';
        } else {
            navMenu.style.transform = 'translateX(0)';
        }
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.style.transform = 'translateX(-100%)';
    }));
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar background change on scroll
const navbar = document.querySelector('.navbar');
let lastScrollTop = 0;

function updateNavbarBackground() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const isDark = true;
    
    if (scrollTop > 100) {
        navbar.style.background = isDark ? 'rgba(13, 17, 23, 0.98)' : 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = isDark ? 'rgba(13, 17, 23, 0.95)' : 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
}

window.addEventListener('scroll', updateNavbarBackground);

// Update navbar background when theme changes
const originalToggleTheme = themeManager.toggleTheme;
themeManager.toggleTheme = function() {
    originalToggleTheme.call(this);
    setTimeout(updateNavbarBackground, 50);
};

// Reveal on scroll (Tailwind utilities)
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            el.classList.remove('opacity-0', 'translate-y-6');
            el.classList.add('opacity-100', 'translate-y-0');
            revealObserver.unobserve(el);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    // Apply reveal base state to elements marked with data-reveal
    const revealEls = document.querySelectorAll('[data-reveal]');
    revealEls.forEach(el => {
        el.classList.add('opacity-0', 'translate-y-6', 'transition', 'duration-700');
        revealObserver.observe(el);
    });

    // Initialize CV download functionality
    initCvDownload();
    initHeroDepth();
    initTiltCards();
    const yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = String(new Date().getFullYear());
    }
    // Track primary CTA clicks (GA4)
    const viewWork = document.querySelector('a[href="#projects"]');
    if (viewWork) viewWork.addEventListener('click', () => {
        if (typeof gtag === 'function') gtag('event', 'cta_click', { label: 'view_work' });
    });
    const collaborate = document.querySelector('a[href="#contact"]');
    if (collaborate) collaborate.addEventListener('click', () => {
        if (typeof gtag === 'function') gtag('event', 'cta_click', { label: 'collaborate' });
    });
    
    // Add page transition class
    document.body.classList.add('page-transition');
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});

// Enhanced email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Enhanced notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    const bgColor = type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6';
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${bgColor};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
        font-family: 'Inter', sans-serif;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    }, 5000);
}

// (Removed typing animation for Tailwind template hero)

function initHeroDepth() {
    const hero = document.getElementById('home');
    if (!hero) return;
    const heroVisual = hero.querySelector('.hero-visual');

    const updateScrollDepth = () => {
        const depthShift = Math.max(-20, window.scrollY * -0.05);
        hero.style.setProperty('--hero-scroll', `${depthShift}px`);
    };

    updateScrollDepth();
    window.addEventListener('scroll', updateScrollDepth, { passive: true });

    if (!(hasFinePointer.matches && !prefersReducedMotion.matches)) {
        return;
    }

    let frameId = null;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const applyHeroMotion = () => {
        currentX += (targetX - currentX) * 0.12;
        currentY += (targetY - currentY) * 0.12;

        hero.style.setProperty('--pointer-x', currentX.toFixed(3));
        hero.style.setProperty('--pointer-y', currentY.toFixed(3));

        if (heroVisual) {
            heroVisual.style.setProperty('--hero-rotate-x', `${(-currentY * 0.9).toFixed(2)}deg`);
            heroVisual.style.setProperty('--hero-rotate-y', `${(currentX * 1.35).toFixed(2)}deg`);
        }

        const stillMoving = Math.abs(targetX - currentX) > 0.001 || Math.abs(targetY - currentY) > 0.001;
        if (stillMoving) {
            frameId = window.requestAnimationFrame(applyHeroMotion);
        } else {
            frameId = null;
        }
    };

    const queueHeroMotion = () => {
        if (frameId !== null) return;
        frameId = window.requestAnimationFrame(applyHeroMotion);
    };

    hero.addEventListener('pointermove', (event) => {
        const rect = hero.getBoundingClientRect();
        targetX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
        targetY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
        queueHeroMotion();
    });

    hero.addEventListener('pointerleave', () => {
        targetX = 0;
        targetY = 0;
        queueHeroMotion();
    });
}

function bindTiltCard(card) {
    if (card.dataset.tiltBound === 'true') return;
    card.dataset.tiltBound = 'true';
    card.classList.add('tilt-card');

    if (!(hasFinePointer.matches && !prefersReducedMotion.matches)) {
        return;
    }

    const resetTilt = () => {
        card.style.setProperty('--tilt-rotate-x', '0deg');
        card.style.setProperty('--tilt-rotate-y', '0deg');
        card.style.setProperty('--glow-x', '50%');
        card.style.setProperty('--glow-y', '50%');
        card.classList.remove('is-tilting');
    };

    card.addEventListener('pointermove', (event) => {
        const rect = card.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width;
        const py = (event.clientY - rect.top) / rect.height;
        const rotateY = (px - 0.5) * 6;
        const rotateX = (0.5 - py) * 6;

        card.style.setProperty('--tilt-rotate-x', `${rotateX.toFixed(2)}deg`);
        card.style.setProperty('--tilt-rotate-y', `${rotateY.toFixed(2)}deg`);
        card.style.setProperty('--glow-x', `${(px * 100).toFixed(2)}%`);
        card.style.setProperty('--glow-y', `${(py * 100).toFixed(2)}%`);
        card.classList.add('is-tilting');
    });

    card.addEventListener('pointerleave', resetTilt);
    card.addEventListener('pointercancel', resetTilt);
    resetTilt();
}

function initTiltCards(root = document) {
    const tiltTargets = root.querySelectorAll('.js-tilt');
    tiltTargets.forEach(bindTiltCard);
}

// (Removed old hover JS; Tailwind handles hover effects)

// Active navigation link highlighting with smooth transitions
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Throttled scroll event for better performance
let scrollTimeout;
window.addEventListener('scroll', () => {
    if (scrollTimeout) {
        clearTimeout(scrollTimeout);
    }
    scrollTimeout = setTimeout(updateActiveNavLink, 10);
});

// Enhanced social links with ripple effect
document.addEventListener('DOMContentLoaded', () => {
    const socialLinks = document.querySelectorAll('.social-link');
    
    socialLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
});

// Add ripple animation to CSS
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        line-height: 1;
        transition: opacity 0.3s ease;
    }
    
    .notification-close:hover {
        opacity: 0.8;
    }
    
    .hamburger.active .bar:nth-child(1) {
        transform: rotate(-45deg) translate(-5px, 6px);
    }
    
    .hamburger.active .bar:nth-child(2) {
        opacity: 0;
    }
    
    .hamburger.active .bar:nth-child(3) {
        transform: rotate(45deg) translate(-5px, -6px);
    }
`;
document.head.appendChild(rippleStyle);

// Lazy loading for images (if any are added later)
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
});

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debouncing to scroll events
const debouncedScrollHandler = debounce(() => {
    updateActiveNavLink();
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);

// Add smooth page transitions
window.addEventListener('beforeunload', () => {
    document.body.classList.remove('loaded');
});

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add loading animation to sections
    const sections = document.querySelectorAll('section');
    sections.forEach((section, index) => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            section.style.transition = 'all 0.6s ease';
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }, index * 200);
    });
    // (Hover effects handled via Tailwind classes)
});

// --- GitHub Repo Cards (lightweight public fetch) ---
async function loadGithubRepos() {
    const username = 'MuhammadMotasimBinShahid';
    const pinnedRepoNames = ['mini-form-builder'];
    const repoSection = document.getElementById('repos');
    const repoGrid = document.getElementById('repoGrid');
    if (!repoGrid || !repoSection) return;

    try {
        const res = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`);
        if (!res.ok) return;
        const all = await res.json();
        if (!Array.isArray(all)) return;

        const eligible = all
            .filter((repo) => !repo.fork && !repo.archived && !repo.disabled && repo.description);

        const byRelevance = (a, b) => {
            return (b.stargazers_count - a.stargazers_count) || (new Date(b.pushed_at) - new Date(a.pushed_at));
        };

        const pinned = pinnedRepoNames
            .map((name) => eligible.find((repo) => repo.name === name))
            .filter(Boolean);

        const selected = [
            ...pinned,
            ...eligible
                .filter((repo) => !pinnedRepoNames.includes(repo.name))
                .sort(byRelevance),
        ].slice(0, 6);

        if (selected.length === 0) return;

        const makeCard = (r) => {
            const lang = r.language || '—';
            const stars = r.stargazers_count || 0;
            const forks = r.forks_count || 0;
            const updated = new Date(r.pushed_at).toLocaleDateString();
            const desc = r.description ? r.description.substring(0, 120) : '';

            const card = document.createElement('a');
            card.href = r.html_url;
            card.target = '_blank';
            card.rel = 'noopener';
            card.className = 'rounded-lg p-4 border border-slate-200 dark:border-githubBorder bg-white/70 dark:bg-githubPanel/70 hover:bg-slate-50 dark:hover:bg-githubPanel transition block js-tilt';
            card.innerHTML = `
                <div class="font-semibold mb-1 text-slate-900 dark:text-white">${r.name}</div>
                <div class="text-sm text-slate-600 dark:text-slate-300 mb-3">${desc}</div>
                <div class="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-400">
                    <span><i class="fas fa-code mr-1"></i>${lang}</span>
                    <span><i class="fas fa-star mr-1"></i>${stars}</span>
                    <span><i class="fas fa-code-branch mr-1"></i>${forks}</span>
                    <span class="ml-auto">Updated ${updated}</span>
                </div>
            `;
            return card;
        };

        repoGrid.innerHTML = '';
        selected.forEach(r => repoGrid.appendChild(makeCard(r)));
        initTiltCards(repoGrid);
        repoSection.hidden = false;
    } catch (e) {
        repoSection.hidden = true;
    }
}

document.addEventListener('DOMContentLoaded', loadGithubRepos);

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close mobile menu if open
        if (navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
        
        // Close notifications
        const notifications = document.querySelectorAll('.notification');
        notifications.forEach(notification => notification.remove());
    }
});

// Add touch support for mobile devices
let touchStartY = 0;
let touchEndY = 0;

document.addEventListener('touchstart', (e) => {
    touchStartY = e.changedTouches[0].screenY;
});

document.addEventListener('touchend', (e) => {
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartY - touchEndY;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe up - could be used for navigation
        } else {
            // Swipe down - could be used for navigation
        }
    }
}

// Experience Show More/Less Functionality
function toggleExperience(button) {
    const experienceList = button.previousElementSibling;
    const hiddenItems = experienceList.querySelectorAll('.experience-item.hidden');
    const isExpanded = button.classList.contains('expanded');
    
    if (isExpanded) {
        // Hide items
        hiddenItems.forEach(item => {
            item.style.display = 'none';
        });
        button.innerHTML = 'Show More <i class="fas fa-chevron-down" style="margin-left: 0.25rem; font-size: 0.8rem; transition: transform 0.3s ease;"></i>';
        button.classList.remove('expanded');
    } else {
        // Show items
        hiddenItems.forEach(item => {
            item.style.display = 'list-item';
        });
        button.innerHTML = 'Show Less <i class="fas fa-chevron-up" style="margin-left: 0.25rem; font-size: 0.8rem; transition: transform 0.3s ease;"></i>';
        button.classList.add('expanded');
    }
}
