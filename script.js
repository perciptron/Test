// ===== NAV SCROLL =====
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

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
applyStagger('.speakers-grid', '.speaker-card', 0);
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

document.querySelectorAll('.hero-stat-number, .about-highlight-number').forEach(el => {
    if (/\d/.test(el.textContent)) counterObserver.observe(el);
});

// ===== SALEBOT POPUP =====
const overlay = document.getElementById('salebotOverlay');
const popup = overlay.querySelector('.salebot-popup');

window.openSalebotPopup = function() {
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    // Focus trap
    const focusable = popup.querySelectorAll('input, button, a, select, textarea');
    if (focusable.length) focusable[0].focus();
};

window.closeSalebotPopup = function(e, force) {
    if (force || e.target === overlay) {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
};

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
        window.closeSalebotPopup(null, true);
    }
});

// ===== IMAGE FALLBACK =====
document.querySelectorAll('.speaker-photo').forEach(img => {
    img.addEventListener('error', function() {
        this.style.display = 'none';
        const placeholder = this.nextElementSibling;
        if (placeholder) placeholder.style.display = 'flex';
    });
});
