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

const themeManager = new ThemeManager();
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

// --- CV Download ---
function initCvDownload() {
    const cvDownloadBtn = document.getElementById('cvDownload');
    const cvDownloadHero = document.getElementById('cvDownloadHero');

    function handleCvDownload(e) {
        e.preventDefault();
        const cvUrl = 'Muhammad_Motasim_FullStack_Developer_CV.pdf';
        const link = document.createElement('a');
        link.href = cvUrl;
        link.download = 'Muhammad_Motasim_CV.pdf';
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showNotification('CV download started!', 'success');
    }

    if (cvDownloadBtn) cvDownloadBtn.addEventListener('click', handleCvDownload);
    if (cvDownloadHero) {
        cvDownloadHero.addEventListener('click', (e) => {
            handleCvDownload(e);
            if (typeof gtag === 'function') gtag('event', 'cta_click', { label: 'cv_download' });
        });
    }
}

// --- Smooth Scroll ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// --- Navbar ---
const navbar = document.querySelector('.navbar');
function updateNavbarBackground() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop > 100) {
        navbar.style.background = 'rgba(13, 17, 23, 0.98)';
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(13, 17, 23, 0.95)';
        navbar.style.boxShadow = 'none';
    }
}
window.addEventListener('scroll', updateNavbarBackground, { passive: true });

// --- Active Nav Link ---
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobLinks = document.querySelectorAll('.mob-nav-link');
    let current = '';
    sections.forEach(section => {
        if (window.pageYOffset >= section.offsetTop - 200) {
            current = section.getAttribute('id');
        }
    });
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
    });
    mobLinks.forEach(link => {
        link.classList.remove('active');
        if (link.dataset.navSection === current) link.classList.add('active');
    });
}
let scrollRAF;
window.addEventListener('scroll', () => {
    if (scrollRAF) cancelAnimationFrame(scrollRAF);
    scrollRAF = requestAnimationFrame(updateActiveNavLink);
}, { passive: true });

// --- Notification System ---
function showNotification(message, type = 'info') {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const bgColor = type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6';
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `<div style="display:flex;align-items:center;justify-content:space-between;gap:1rem"><span>${message}</span><button onclick="this.closest('.notification').remove()" style="background:none;border:none;color:#fff;font-size:1.5rem;cursor:pointer;line-height:1">&times;</button></div>`;
    notification.style.cssText = `position:fixed;top:20px;right:20px;background:${bgColor};color:#fff;padding:1rem 1.5rem;border-radius:12px;box-shadow:0 8px 24px rgba(0,0,0,.2);z-index:10000;transform:translateX(120%);transition:transform .4s cubic-bezier(.22,1,.36,1);max-width:400px;backdrop-filter:blur(8px)`;
    document.body.appendChild(notification);
    requestAnimationFrame(() => { notification.style.transform = 'translateX(0)'; });
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(120%)';
            setTimeout(() => notification.remove(), 400);
        }
    }, 5000);
}

// --- Hero Depth / Parallax ---
function initHeroDepth() {
    const hero = document.getElementById('home');
    if (!hero) return;
    const heroVisual = hero.querySelector('.hero-visual');

    const updateScrollDepth = () => {
        hero.style.setProperty('--hero-scroll', `${Math.max(-20, window.scrollY * -0.05)}px`);
    };
    updateScrollDepth();
    window.addEventListener('scroll', updateScrollDepth, { passive: true });

    if (!(hasFinePointer.matches && !prefersReducedMotion.matches)) return;

    let frameId = null, targetX = 0, targetY = 0, currentX = 0, currentY = 0;

    const applyHeroMotion = () => {
        currentX += (targetX - currentX) * 0.12;
        currentY += (targetY - currentY) * 0.12;
        hero.style.setProperty('--pointer-x', currentX.toFixed(3));
        hero.style.setProperty('--pointer-y', currentY.toFixed(3));
        if (heroVisual) {
            heroVisual.style.setProperty('--hero-rotate-x', `${(-currentY * 0.9).toFixed(2)}deg`);
            heroVisual.style.setProperty('--hero-rotate-y', `${(currentX * 1.35).toFixed(2)}deg`);
        }
        if (Math.abs(targetX - currentX) > 0.001 || Math.abs(targetY - currentY) > 0.001) {
            frameId = requestAnimationFrame(applyHeroMotion);
        } else {
            frameId = null;
        }
    };
    const queueHeroMotion = () => { if (frameId === null) frameId = requestAnimationFrame(applyHeroMotion); };

    hero.addEventListener('pointermove', (e) => {
        const rect = hero.getBoundingClientRect();
        targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        targetY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
        queueHeroMotion();
    });
    hero.addEventListener('pointerleave', () => { targetX = 0; targetY = 0; queueHeroMotion(); });
}

// --- Tilt Cards ---
function bindTiltCard(card) {
    if (card.dataset.tiltBound === 'true') return;
    card.dataset.tiltBound = 'true';
    card.classList.add('tilt-card');
    if (!(hasFinePointer.matches && !prefersReducedMotion.matches)) return;

    const resetTilt = () => {
        card.style.setProperty('--tilt-rotate-x', '0deg');
        card.style.setProperty('--tilt-rotate-y', '0deg');
        card.style.setProperty('--glow-x', '50%');
        card.style.setProperty('--glow-y', '50%');
        card.classList.remove('is-tilting');
    };
    card.addEventListener('pointermove', (e) => {
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;
        card.style.setProperty('--tilt-rotate-x', `${((0.5 - py) * 6).toFixed(2)}deg`);
        card.style.setProperty('--tilt-rotate-y', `${((px - 0.5) * 6).toFixed(2)}deg`);
        card.style.setProperty('--glow-x', `${(px * 100).toFixed(2)}%`);
        card.style.setProperty('--glow-y', `${(py * 100).toFixed(2)}%`);
        card.classList.add('is-tilting');
    });
    card.addEventListener('pointerleave', resetTilt);
    card.addEventListener('pointercancel', resetTilt);
    resetTilt();
}

function initTiltCards(root = document) {
    root.querySelectorAll('.js-tilt').forEach(bindTiltCard);
}

// --- Particle Background ---
function initParticles() {
    if (prefersReducedMotion.matches) return;
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    const isMobile = window.innerWidth < 768;
    const PARTICLE_COUNT = isMobile ? 18 : 45;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.3;
            this.vy = (Math.random() - 0.5) * 0.3;
            this.size = Math.random() * 1.8 + 0.5;
            this.opacity = Math.random() * 0.4 + 0.1;
            this.color = Math.random() > 0.5 ? '88,166,255' : '217,74,69';
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color},${this.opacity})`;
            ctx.fill();
        }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

    function drawLines() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const maxDist = isMobile ? 100 : 150;
                if (dist < maxDist) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(88,166,255,${0.06 * (1 - dist / maxDist)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        drawLines();
        requestAnimationFrame(animate);
    }
    animate();
}

// --- Animated Stat Counters ---
function initCounters() {
    const counters = document.querySelectorAll('.stat-number[data-count]');
    if (!counters.length) return;

    counters.forEach(counter => {
        const target = parseInt(counter.dataset.count, 10);
        const suffix = counter.dataset.suffix || '';

        ScrollTrigger.create({
            trigger: counter,
            start: 'top 85%',
            once: true,
            onEnter: () => {
                gsap.to({ val: 0 }, {
                    val: target,
                    duration: 1.8,
                    ease: 'power2.out',
                    onUpdate: function () {
                        counter.textContent = Math.round(this.targets()[0].val) + suffix;
                    }
                });
            }
        });
    });
}

// --- GSAP Scroll Animations ---
function initGSAPAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    // Hero entrance: stagger children
    const heroCopy = document.querySelector('.hero-copy');
    if (heroCopy) {
        const heroChildren = heroCopy.querySelectorAll('[data-reveal]');
        gsap.fromTo(heroChildren,
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 1, stagger: 0.18, ease: 'power3.out', delay: 0.3 }
        );
    }
    const heroVisual = document.querySelector('.hero-visual [data-reveal]');
    if (heroVisual) {
        gsap.fromTo(heroVisual,
            { opacity: 0, y: 50, scale: 0.95 },
            { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: 'power3.out', delay: 0.7 }
        );
    }

    // Section reveals with GSAP ScrollTrigger
    document.querySelectorAll('section:not(#home)').forEach(section => {
        const reveals = section.querySelectorAll('[data-reveal]');
        if (!reveals.length) return;

        gsap.fromTo(reveals,
            { opacity: 0, y: 50 },
            {
                opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out',
                scrollTrigger: { trigger: section, start: 'top 80%', once: true }
            }
        );
    });

    // About hook text reveal
    const aboutHook = document.querySelector('.about-hook');
    if (aboutHook) {
        gsap.fromTo(aboutHook,
            { opacity: 0, x: -30 },
            {
                opacity: 1, x: 0, duration: 1, ease: 'power3.out',
                scrollTrigger: { trigger: aboutHook, start: 'top 80%', once: true }
            }
        );
    }

    // 3D icon cards scale-in
    document.querySelectorAll('.icon-3d').forEach(icon => {
        gsap.fromTo(icon,
            { scale: 0, rotateY: -90 },
            {
                scale: 1, rotateY: 0, duration: 0.7, ease: 'back.out(1.7)',
                scrollTrigger: { trigger: icon, start: 'top 85%', once: true }
            }
        );
    });

    // Skill cards stagger
    const skillCards = document.querySelectorAll('.skill-card');
    if (skillCards.length) {
        gsap.fromTo(skillCards,
            { opacity: 0, y: 40, scale: 0.95 },
            {
                opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out',
                scrollTrigger: { trigger: '.skill-matrix', start: 'top 80%', once: true }
            }
        );
    }

    // CTA band slide up
    const ctaBand = document.querySelector('.cta-band');
    if (ctaBand) {
        gsap.fromTo(ctaBand,
            { opacity: 0, y: 60 },
            {
                opacity: 1, y: 0, duration: 1, ease: 'power3.out',
                scrollTrigger: { trigger: ctaBand, start: 'top 85%', once: true }
            }
        );
    }

    // Stat cards
    const statCards = document.querySelectorAll('.stat-card');
    if (statCards.length) {
        gsap.fromTo(statCards,
            { opacity: 0, y: 30, scale: 0.9 },
            {
                opacity: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.12, ease: 'back.out(1.4)',
                scrollTrigger: { trigger: statCards[0].parentElement, start: 'top 85%', once: true }
            }
        );
    }

    initCounters();
}

// --- Gradient Border Angle Animation ---
function initGradientBorders() {
    if (prefersReducedMotion.matches) return;
    let angle = 0;
    function tick() {
        angle = (angle + 0.5) % 360;
        document.documentElement.style.setProperty('--gradient-angle', `${angle}deg`);
        requestAnimationFrame(tick);
    }
    tick();
}

// --- GitHub Repos ---
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

        const eligible = all.filter(r => !r.fork && !r.archived && !r.disabled && r.description);
        const pinned = pinnedRepoNames.map(name => eligible.find(r => r.name === name)).filter(Boolean);
        const selected = [
            ...pinned,
            ...eligible.filter(r => !pinnedRepoNames.includes(r.name))
                .sort((a, b) => (b.stargazers_count - a.stargazers_count) || (new Date(b.pushed_at) - new Date(a.pushed_at)))
        ].slice(0, 6);

        if (!selected.length) return;

        repoGrid.innerHTML = '';
        selected.forEach(r => {
            const card = document.createElement('a');
            card.href = r.html_url;
            card.target = '_blank';
            card.rel = 'noopener';
            card.className = 'rounded-lg p-4 border border-githubBorder bg-githubPanel/70 hover:bg-githubPanel transition block js-tilt gradient-border-card';
            card.innerHTML = `
                <div class="font-semibold mb-1 text-white">${r.name}</div>
                <div class="text-sm text-slate-300 mb-3">${(r.description || '').substring(0, 120)}</div>
                <div class="flex items-center gap-4 text-xs text-slate-400">
                    <span><i class="fas fa-code mr-1"></i>${r.language || '—'}</span>
                    <span><i class="fas fa-star mr-1"></i>${r.stargazers_count || 0}</span>
                    <span><i class="fas fa-code-branch mr-1"></i>${r.forks_count || 0}</span>
                    <span class="ml-auto">Updated ${new Date(r.pushed_at).toLocaleDateString()}</span>
                </div>`;
            repoGrid.appendChild(card);
        });
        initTiltCards(repoGrid);
        repoSection.hidden = false;
    } catch (e) {
        repoSection.hidden = true;
    }
}

// --- Initialize Everything ---
document.addEventListener('DOMContentLoaded', () => {
    initCvDownload();
    initHeroDepth();
    initTiltCards();
    initParticles();
    initGradientBorders();
    loadGithubRepos();

    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());

    // GA4 tracking
    const viewWork = document.querySelector('a[href="#projects"]');
    if (viewWork) viewWork.addEventListener('click', () => {
        if (typeof gtag === 'function') gtag('event', 'cta_click', { label: 'view_work' });
    });
    const collaborate = document.querySelector('a[href="#contact"]');
    if (collaborate) collaborate.addEventListener('click', () => {
        if (typeof gtag === 'function') gtag('event', 'cta_click', { label: 'collaborate' });
    });

    // GSAP animations (deferred to let DOM settle)
    requestAnimationFrame(() => {
        initGSAPAnimations();
    });
});

// Keyboard: Escape closes notifications
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.notification').forEach(n => n.remove());
    }
});

// Smooth page transition
window.addEventListener('beforeunload', () => {
    document.body.classList.remove('loaded');
});
