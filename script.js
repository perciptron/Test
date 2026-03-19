// ===== NAV SCROLL =====
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ===== BURGER MENU =====
const burger = document.getElementById('navBurger');
const mobileMenu = document.getElementById('mobileMenu');

if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
        const isOpen = burger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        burger.setAttribute('aria-expanded', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu();
        });
    });
}

window.closeMobileMenu = function() {
    if (burger && mobileMenu) {
        burger.classList.remove('active');
        mobileMenu.classList.remove('active');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }
};

// ===== FAQ ACCORDION =====
document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item');
        const isOpen = item.getAttribute('aria-expanded') === 'true';

        // Close all
        document.querySelectorAll('.faq-item').forEach(i => {
            i.setAttribute('aria-expanded', 'false');
            i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        });

        // Toggle current
        if (!isOpen) {
            item.setAttribute('aria-expanded', 'true');
            btn.setAttribute('aria-expanded', 'true');
        }
    });
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ===== SCROLL REVEAL WITH STAGGER =====
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Apply stagger delays to grid children
function applyStagger(containerSelector, childSelector, baseDelay) {
    document.querySelectorAll(containerSelector).forEach(container => {
        container.querySelectorAll(childSelector).forEach((child, i) => {
            child.style.transitionDelay = (baseDelay + i * 0.08) + 's';
        });
    });
}

applyStagger('.benefits-grid', '.benefit-card', 0);
applyStagger('.speakers-pyramid', '.speaker-card-h', 0);
applyStagger('.for-whom-grid', '.for-whom-card', 0);
applyStagger('.faq-list', '.faq-item', 0);

// ===== COUNTER ANIMATION =====
function animateCounter(el) {
    const text = el.textContent;
    const match = text.match(/(\d+)/);
    if (!match) return;

    const target = parseInt(match[0]);
    const prefix = text.slice(0, text.indexOf(match[0]));
    const suffix = text.slice(text.indexOf(match[0]) + match[0].length);
    const duration = 1200;
    const start = performance.now();

    function update(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(target * eased);
        el.textContent = prefix + current + suffix;
        if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.hero-stat-num, .about-highlight-number').forEach(el => {
    if (/\d/.test(el.textContent)) counterObserver.observe(el);
});

// ===== MODAL POPUP (per TZ) =====
function openModal() {
    document.getElementById('modalOverlay').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('modalOverlay').classList.remove('active');
    document.body.style.overflow = '';
}

function closeModalOutside(e) {
    if (e.target === e.currentTarget) closeModal();
}

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
    // Focus trap for modal
    if (e.key === 'Tab' && document.getElementById('modalOverlay').classList.contains('active')) {
        const modal = document.querySelector('.modal');
        const focusable = modal.querySelectorAll('input, button, select, textarea, a[href]');
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
});

// ===== IMAGE FALLBACK =====
document.querySelectorAll('.speaker-photo-h').forEach(img => {
    img.addEventListener('error', function() {
        this.style.display = 'none';
        const placeholder = this.nextElementSibling;
        if (placeholder) placeholder.style.display = 'flex';
    });
});

// ===== HERO PARALLAX =====
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const mesh = document.querySelector('.hero-mesh');
    const grid = document.querySelector('.hero-grid');
    if (mesh && scrollY < window.innerHeight) {
        mesh.style.transform = `scale(1) translate(0, ${scrollY * 0.15}px)`;
    }
    if (grid && scrollY < window.innerHeight) {
        grid.style.transform = `translateY(${scrollY * 0.08}px)`;
    }
}, { passive: true });
