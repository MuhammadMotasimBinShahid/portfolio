const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

// --- Smooth scroll ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (!href || href === '#') return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: prefersReducedMotion.matches ? 'auto' : 'smooth', block: 'start' });
        if (!prefersReducedMotion.matches && window.innerWidth <= 900) {
            requestAnimationFrame(() => {
                window.scrollBy({ top: -getScrollOffset() + 16, behavior: 'auto' });
            });
        }
    });
});

// --- Active nav (sidebar + mobile) ---
const navSections = ['home', 'about', 'experience', 'skills', 'projects', 'contact'];
const sidebarLinks = document.querySelectorAll('.nav-link[data-nav]');
const mobLinks = document.querySelectorAll('.mob-nav-link[data-nav-section]');

function getScrollOffset() {
    const w = window.innerWidth;
    if (w <= 600) return 72;
    if (w <= 900) return 88;
    return 220;
}

function updateActiveNavLink() {
    let current = 'home';
    const offset = getScrollOffset();
    navSections.forEach(id => {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - offset) current = id;
    });

    sidebarLinks.forEach(link => {
        link.classList.toggle('active', link.dataset.nav === current);
    });
    mobLinks.forEach(link => {
        link.classList.toggle('active', link.dataset.navSection === current);
    });
}

let scrollRAF;
window.addEventListener('scroll', () => {
    if (scrollRAF) cancelAnimationFrame(scrollRAF);
    scrollRAF = requestAnimationFrame(updateActiveNavLink);
}, { passive: true });
updateActiveNavLink();

// --- Scroll reveal ---
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    if (prefersReducedMotion.matches) {
        reveals.forEach(el => el.classList.add('is-visible'));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach(el => observer.observe(el));
}

// --- Stat counters ---
function initCounters() {
    const counters = document.querySelectorAll('.stat-value[data-count]');
    if (!counters.length) return;

    let started = false;

    function animateCounts() {
        if (started) return;
        started = true;

        counters.forEach(counter => {
            const target = parseInt(counter.dataset.count, 10);
            const suffix = counter.dataset.suffix || '';
            const duration = 1200;
            const start = performance.now();

            function step(now) {
                const p = Math.min(1, (now - start) / duration);
                const eased = 1 - Math.pow(1 - p, 3);
                counter.textContent = Math.round(target * eased) + suffix;
                if (p < 1) requestAnimationFrame(step);
            }
            requestAnimationFrame(step);
        });
    }

    const about = document.getElementById('about');
    if (!about) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounts();
                observer.disconnect();
            }
        });
    }, { threshold: 0.2 });

    observer.observe(about);
}

// --- CV download ---
function initCvDownload() {
    const cvUrl = 'Muhammad_Motasim_Bin_Shahid_CV.pdf';

    function handleCvDownload(e) {
        e.preventDefault();
        const link = document.createElement('a');
        link.href = cvUrl;
        link.download = 'Muhammad_Motasim_CV.pdf';
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showNotification('CV download started!', 'success');
        if (typeof gtag === 'function') gtag('event', 'cta_click', { label: 'cv_download' });
    }

    document.getElementById('cvDownload')?.addEventListener('click', handleCvDownload);
    document.getElementById('cvDownloadHero')?.addEventListener('click', handleCvDownload);
}

// --- Notifications ---
function showNotification(message, type = 'info') {
    document.querySelector('.notification')?.remove();

    const bgColor = type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6';
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `<div style="display:flex;align-items:center;justify-content:space-between;gap:1rem"><span>${message}</span><button type="button" aria-label="Dismiss" style="background:none;border:none;color:#fff;font-size:1.5rem;cursor:pointer;line-height:1">&times;</button></div>`;
    notification.style.background = bgColor;
    notification.querySelector('button').addEventListener('click', () => notification.remove());
    document.body.appendChild(notification);
    requestAnimationFrame(() => { notification.style.transform = 'translateX(0)'; });
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(120%)';
            setTimeout(() => notification.remove(), 400);
        }
    }, 5000);
}

// --- Contact form ---
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.textContent;
        btn.disabled = true;
        btn.textContent = 'Sending…';

        try {
            const res = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: { Accept: 'application/json' }
            });
            if (res.ok) {
                form.reset();
                showNotification('Message sent! I\'ll get back to you soon.', 'success');
                if (typeof gtag === 'function') gtag('event', 'cta_click', { label: 'contact_form' });
            } else {
                showNotification('Something went wrong. Please email me directly.', 'error');
            }
        } catch {
            showNotification('Network error. Please try again or email directly.', 'error');
        } finally {
            btn.disabled = false;
            btn.textContent = originalText;
        }
    });
}

// --- Analytics CTAs ---
function initAnalytics() {
    document.querySelector('a[href="#projects"]')?.addEventListener('click', () => {
        if (typeof gtag === 'function') gtag('event', 'cta_click', { label: 'view_projects' });
    });
    document.querySelector('a[href="#contact"]')?.addEventListener('click', () => {
        if (typeof gtag === 'function') gtag('event', 'cta_click', { label: 'contact' });
    });
}

// --- Init ---
document.addEventListener('DOMContentLoaded', () => {
    const year = String(new Date().getFullYear());
    document.getElementById('year')?.replaceChildren(document.createTextNode(year));
    document.getElementById('yearFooter')?.replaceChildren(document.createTextNode(year));

    initScrollReveal();
    initCounters();
    initCvDownload();
    initContactForm();
    initAnalytics();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') document.querySelectorAll('.notification').forEach(n => n.remove());
});
