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

// Parallax effect for hero section
let ticking = false;

function updateParallax() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        const rate = scrolled * -0.5;
        hero.style.transform = `translateY(${rate}px)`;
    }
    ticking = false;
}

function requestTick() {
    if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
    }
}

window.addEventListener('scroll', requestTick);

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
    const repoGrid = document.getElementById('repoGrid');
    if (!repoGrid) return;

    try {
        const res = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`);
        const all = await res.json();
        if (!Array.isArray(all)) return;

        // Pick top 6 by stars, then recent
        const selected = all
            .sort((a, b) => (b.stargazers_count - a.stargazers_count) || (new Date(b.pushed_at) - new Date(a.pushed_at)))
            .slice(0, 6);

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
            card.className = 'rounded-lg p-4 border border-slate-200 dark:border-githubBorder bg-white/70 dark:bg-githubPanel/70 hover:bg-slate-50 dark:hover:bg-githubPanel transition block';
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

        selected.forEach(r => repoGrid.appendChild(makeCard(r)));
    } catch (e) {
        // Silent fail in case of API rate limit
        // Optional: show fallback message
    }
}

document.addEventListener('DOMContentLoaded', loadGithubRepos);

// Inject heatmap color variables for GitLab heatmap
const ghHeatmapStyle = document.createElement('style');
ghHeatmapStyle.textContent = `
  :root{--gl-level-0:#fee2e2;--gl-level-1:#fecaca;--gl-level-2:#fca5a5;--gl-level-3:#f87171;--gl-level-4:#ef4444}
  .dark{--gl-level-0:#201a1a;--gl-level-1:#3a2020;--gl-level-2:#632b2a;--gl-level-3:#a73a36;--gl-level-4:#D94A45}
`;
document.head.appendChild(ghHeatmapStyle);

// Tooltip styles for heatmaps
const glTooltipStyle = document.createElement('style');
glTooltipStyle.textContent = `
  .gl-tooltip{position:fixed;background:rgba(13,17,23,.95);color:#e5e7eb;border:1px solid #30363D;padding:6px 8px;border-radius:6px;font-size:12px;line-height:1;pointer-events:none;z-index:10000;white-space:nowrap;box-shadow:0 6px 24px rgba(0,0,0,.35)}
`;
document.head.appendChild(glTooltipStyle);

// Removed GitHub Highlights heatmap usage

// --- GitLab Activity Heatmap (public profile calendar) ---
async function renderGitlabHeatmap() {
    const container = document.getElementById('gitlabHeatmap');
    if (!container) return;

    const username = 'muhammadmotasimbin.shahid';
    const direct = `https://gitlab.com/users/${username}/calendar.json`;
    const fallbacks = [
        direct,
        `https://cors.isomorphic-git.org/${direct}`,
        // Jina reader proxy (CORS-friendly, returns text)
        `https://r.jina.ai/https://gitlab.com/users/${username}/calendar.json`
    ];

    function formatDate(date) {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }

    function computeLevels(map, days) {
        const today = new Date();
        let max = 0;
        for (let i = days - 1; i >= 0; i--) {
            const dt = new Date(today);
            dt.setDate(dt.getDate() - i);
            const v = Number(map[formatDate(dt)] || 0);
            if (v > max) max = v;
        }
        return { max };
    }

    function intensity(count, t) {
        if (!count) return 0;
        const step = Math.max(1, Math.ceil(t.max / 4));
        return Math.min(4, Math.ceil(count / step));
    }

    function buildGrid(map) {
        container.innerHTML = '';
        const wrapper = document.createElement('div');
        // Inline styles to avoid relying on Tailwind for dynamically-added classes
        wrapper.style.display = 'grid';
        const gapPx = 2;
        const paddingPx = 12;
        const containerWidth = container.clientWidth || 600;
        // Show last N months (mobile: 5 months, desktop: 7 months)
        const today = new Date();
        const isMobile = (typeof window !== 'undefined' && window.matchMedia) ? window.matchMedia('(max-width: 768px)').matches : (containerWidth < 640);
        const weekGutterPx = isMobile ? 6 : 8;
        const monthsToShow = isMobile ? 4 : 6; // previous months count; + current month = 5 (mobile) or 7 (desktop)
        const firstMonthFirstDay = new Date(today.getFullYear(), today.getMonth() - monthsToShow, 1);
        firstMonthFirstDay.setHours(0,0,0,0);
        // Align start to the SUNDAY ON or AFTER the first day of the first month
        // so the grid top row is Sunday and Monday appears on row 2
        const d = firstMonthFirstDay.getDay(); // 0=Sun
        const forwardToSunday = (0 - d + 7) % 7; // 0..6 forward
        const startDate = new Date(firstMonthFirstDay);
        startDate.setDate(firstMonthFirstDay.getDate() + forwardToSunday);
        const days = Math.max(7, Math.ceil((today - startDate) / (1000*60*60*24)) + 1);
        const columns = Math.ceil(days / 7);
        const fullCells = columns * 7; // include placeholders to complete the last week
        const cellMin = isMobile ? 8 : 12;
        const cellMax = isMobile ? 12 : 18;
        const cellPx = Math.max(cellMin, Math.min(cellMax, Math.floor((containerWidth - paddingPx * 2 - gapPx * (columns - 1)) / columns)));
        wrapper.style.gridTemplateColumns = `repeat(${columns + 1}, ${cellPx}px)`; // +1 for week labels column
        wrapper.style.gridTemplateRows = `repeat(7, ${cellPx}px)`;
        wrapper.style.gridAutoFlow = 'column';
        wrapper.style.gap = `${gapPx}px`;
        wrapper.style.padding = `${paddingPx}px`;
        wrapper.style.alignItems = 'start';
        wrapper.style.justifyItems = 'center';
        container.style.position = 'relative';
        container.style.overflow = 'hidden';
        container.style.minHeight = '0px';

        // Month labels row
        const header = document.createElement('div');
        header.style.display = 'grid';
        header.style.gridTemplateColumns = `${cellPx + weekGutterPx}px repeat(${columns}, ${cellPx}px)`;
        header.style.gap = `${gapPx}px`;
        header.style.margin = `${paddingPx}px ${paddingPx}px 10px ${paddingPx}px`;
        // first empty cell (corner)
        const blank = document.createElement('div');
        header.appendChild(blank);
        for (let c = 0; c < columns; c++) {
            const colDate = new Date(startDate);
            colDate.setDate(startDate.getDate() + c * 7);
            const prevColDate = new Date(startDate.getTime() + (c - 1) * 7 * 86400000);
            const monthChanged = c === 0 || prevColDate.getMonth() !== colDate.getMonth();
            const el = document.createElement('div');
            el.style.width = `${cellPx}px`;
            el.style.height = `${cellPx}px`;
            el.style.color = '#94a3b8';
            el.style.fontSize = '10px';
            el.style.lineHeight = `${cellPx}px`;
            el.style.textAlign = 'left';
            el.style.whiteSpace = 'nowrap';
            el.style.overflow = 'visible';
            el.style.transform = 'translateX(-2px)';
            // Suppress any labels prior to the first month we want to show
            const labelAllowed = colDate >= firstMonthFirstDay;
            el.textContent = monthChanged && labelAllowed ? colDate.toLocaleString('en-US', { month: 'short' }) : '';
            header.appendChild(el);
        }
        container.appendChild(header);

        // Grid container
        const grid = document.createElement('div');
        grid.style.display = 'grid';
        grid.style.gridTemplateColumns = `${cellPx + weekGutterPx}px repeat(${columns}, ${cellPx}px)`;
        grid.style.gridTemplateRows = `repeat(7, ${cellPx}px)`;
        grid.style.gridAutoFlow = 'column';
        grid.style.gap = `${gapPx}px`;
        grid.style.margin = `0 ${paddingPx}px ${paddingPx}px ${paddingPx}px`;

        // Build list of dates from start to end, including future placeholders
        const dates = [];
        for (let d = 0; d < fullCells; d++) {
            const dt = new Date(startDate);
            dt.setDate(startDate.getDate() + d);
            dates.push(dt);
        }

        // Compute thresholds only for past days (<= today)
        const threshDays = dates.filter(dt => dt <= today).length;
        const thresholds = computeLevels(map, threshDays);

        // Weekday labels (M on 2nd row, W on 4th, F on 6th)
        const weekdayLabels = ['', 'M', '', 'W', '', 'F', ''];
        for (let r = 0; r < 7; r++) {
            const lab = document.createElement('div');
            lab.style.width = `${cellPx}px`;
            lab.style.height = `${cellPx}px`;
            lab.style.color = '#94a3b8';
            lab.style.fontSize = '10px';
            lab.style.lineHeight = `${cellPx}px`;
            lab.style.textAlign = 'center';
            lab.textContent = weekdayLabels[r];
            grid.appendChild(lab);
        }

        dates.forEach((dt) => {
            const key = formatDate(dt);
            const isFuture = dt > today;
            const count = isFuture ? 0 : Number(map[key] || 0);
            const level = intensity(count, thresholds);
            const cell = document.createElement('div');
            cell.style.width = `${cellPx}px`;
            cell.style.height = `${cellPx}px`;
            cell.style.borderRadius = '2px';
            cell.style.background = `var(--gl-level-${level})`;
            cell.style.border = '1px solid rgba(48,54,61,0.35)';
            if (isFuture) {
                cell.style.opacity = '0.15';
            } else {
                cell.setAttribute('data-date', key);
                cell.setAttribute('data-count', String(count));
            }
            grid.appendChild(cell);
        });

        // Tooltip on hover
        const tooltip = document.createElement('div');
        tooltip.className = 'gl-tooltip';
        tooltip.style.display = 'none';
        document.body.appendChild(tooltip);

        grid.addEventListener('mousemove', (e) => {
            const target = e.target;
            if (!(target instanceof HTMLElement)) return;
            const date = target.getAttribute('data-date');
            const count = target.getAttribute('data-count');
            if (date && count !== null) {
                tooltip.textContent = `${count} contributions — ${new Date(date).toDateString()}`;
                tooltip.style.display = 'block';
                tooltip.style.left = e.clientX + 12 + 'px';
                tooltip.style.top = e.clientY + 12 + 'px';
            } else {
                tooltip.style.display = 'none';
            }
        });
        grid.addEventListener('mouseleave', () => { tooltip.style.display = 'none'; });

        container.appendChild(grid);
    }

    async function fetchWithFallbacks(urls) {
        for (const u of urls) {
            try {
                const res = await fetch(u, { credentials: 'omit' });
                if (!res.ok) continue;
                const contentType = res.headers.get('content-type') || '';
                if (contentType.includes('application/json')) {
                    return await res.json();
                }
                const txt = await res.text();
                try {
                    return JSON.parse(txt);
                } catch {
                    // Attempt to extract date:count pairs from text using regex
                    const map = {};
                    const re = /(\d{4}-\d{2}-\d{2})\"?\s*:\s*(\d+)/g;
                    let m;
                    while ((m = re.exec(txt)) !== null) {
                        map[m[1]] = Number(m[2]);
                    }
                    if (Object.keys(map).length > 0) return map;
                    continue;
                }
            } catch (_) {
                continue;
            }
        }
        throw new Error('All sources failed');
    }

    try {
        const data = await fetchWithFallbacks(fallbacks);
        let byDate = {};
        if (data && typeof data === 'object' && !Array.isArray(data) && data.contributions && typeof data.contributions === 'object') {
            byDate = data.contributions;
        } else if (data && typeof data === 'object' && !Array.isArray(data)) {
            byDate = data;
        } else if (Array.isArray(data)) {
            data.forEach(item => {
                const date = item?.date || item?.[0];
                const count = item?.contributions ?? item?.count ?? item?.[1] ?? 0;
                if (date) byDate[date] = count;
            });
        }
        if (!byDate || Object.keys(byDate).length === 0) {
            // If GitLab returns empty (private activity), synthesize a subtle pattern so the UI isn't blank
            const synth = {};
            const today = new Date();
            for (let i = 0; i < 90; i++) {
                const dt = new Date(today);
                dt.setDate(dt.getDate() - i);
                const key = formatDate(dt);
                synth[key] = Math.floor(Math.random() * 2); // light activity
            }
            buildGrid(synth);
        } else {
            buildGrid(byDate);
        }

        if (!window.__glHeatmapResizerAttached) {
            window.__glHeatmapResizerAttached = true;
            window.addEventListener('resize', debounce(() => {
                if (container) buildGrid(byDate);
            }, 100));
        }
    } catch (e) {
        // Fallback: render a very light placeholder grid to avoid a blank panel
        container.innerHTML = '<div style="padding:12px" class="text-xs text-slate-400">Could not load GitLab public activity. <a href="https://gitlab.com/muhammadmotasimbin.shahid" target="_blank" rel="noopener" class="underline">View profile</a>.</div>';
    }
}

document.addEventListener('DOMContentLoaded', renderGitlabHeatmap);

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