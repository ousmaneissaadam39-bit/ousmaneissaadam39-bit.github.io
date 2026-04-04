/**
 * PORTFOLIO — OUSMANE ISSA ADAM
 * script.js v2.0
 * Effets : Matrix rain, Glitch, Typewriter, Animations scroll
 */

'use strict';

/* ============================================================
   SÉCURITÉ — Échapper le HTML (anti-XSS)
   ============================================================ */
function escapeHTML(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(String(str)));
  return div.innerHTML;
}

/* ============================================================
   CURSEUR PERSONNALISÉ
   ============================================================ */
(function initCursor() {
  const cursor   = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  if (!cursor || !follower) return;

  let mouseX = 0, mouseY = 0, fx = 0, fy = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX; mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  (function animate() {
    fx += (mouseX - fx) * 0.12;
    fy += (mouseY - fy) * 0.12;
    follower.style.left = fx + 'px';
    follower.style.top  = fy + 'px';
    requestAnimationFrame(animate);
  })();

  document.querySelectorAll('a, button, .project-card, .filter-btn, .contact-channel').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = 'translate(-50%,-50%) scale(2.5)';
      follower.style.transform = 'translate(-50%,-50%) scale(1.8)';
      follower.style.opacity = '0.8';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'translate(-50%,-50%) scale(1)';
      follower.style.transform = 'translate(-50%,-50%) scale(1)';
      follower.style.opacity = '0.4';
    });
  });
})();

/* ============================================================
   EFFET MATRIX RAIN
   ============================================================ */
(function initMatrixRain() {
  const container = document.getElementById('matrixRain');
  if (!container) return;

  const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノ<>/\\[]{}|=+*#@!?%&ABCDEF';
  const COLUMNS = Math.floor(window.innerWidth / 25);

  for (let i = 0; i < COLUMNS; i++) {
    const col = document.createElement('div');
    col.className = 'matrix-column';

    // Génère une chaîne aléatoire de caractères
    let text = '';
    for (let j = 0; j < 20; j++) {
      text += chars[Math.floor(Math.random() * chars.length)] + '\n';
    }
    col.textContent = text;

    col.style.left     = (i * 25) + 'px';
    col.style.animationDuration = (Math.random() * 8 + 5) + 's';
    col.style.animationDelay   = (Math.random() * 10) + 's';
    col.style.fontSize = (Math.random() * 6 + 10) + 'px';
    col.style.opacity  = (Math.random() * 0.5 + 0.1).toString();

    container.appendChild(col);
  }
})();

/* ============================================================
   PARTICULES FLOTTANTES
   ============================================================ */
(function initParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  for (let i = 0; i < 25; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left              = Math.random() * 100 + '%';
    p.style.width             = (Math.random() * 3 + 1) + 'px';
    p.style.height            = p.style.width;
    p.style.animationDuration = (Math.random() * 15 + 8) + 's';
    p.style.animationDelay    = (Math.random() * 10) + 's';
    container.appendChild(p);
  }
})();

/* ============================================================
   NAVBAR — scroll + hamburger
   ============================================================ */
(function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
    updateActiveLink();
    toggleBackToTop();
  }, { passive: true });

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  document.addEventListener('click', e => {
    if (navLinks.classList.contains('open') && !navLinks.contains(e.target) && !hamburger.contains(e.target)) {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  function updateActiveLink() {
    const scrollPos = window.scrollY + 120;
    document.querySelectorAll('section[id]').forEach(section => {
      const link = document.querySelector(`.nav-link[href="#${section.id}"]`);
      if (link) {
        const inView = scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight;
        link.classList.toggle('active', inView);
      }
    });
  }
})();

/* ============================================================
   TYPEWRITER — Titres défilants
   ============================================================ */
(function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;

  const phrases = [
    'Cybersecurity Engineer',
    'Network Infrastructure Specialist',
    'Ethical Hacker in Training',
    'AWS Cloud Security Practitioner',
    'CTF Player & Problem Solver',
  ];

  let phraseIdx = 0, charIdx = 0, isDeleting = false, delay = 120;

  function type() {
    const current = phrases[phraseIdx];
    el.textContent = isDeleting
      ? current.substring(0, --charIdx)
      : current.substring(0, ++charIdx);

    if (!isDeleting && charIdx === current.length) {
      delay = 2200; isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      delay = 500;
    } else {
      delay = isDeleting ? 55 : 120;
    }
    setTimeout(type, delay);
  }
  setTimeout(type, 1200);
})();

/* ============================================================
   ANIMATIONS SCROLL (IntersectionObserver)
   ============================================================ */
(function initScrollReveal() {
  const elements = document.querySelectorAll('[data-aos]');
  if (!elements.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        // Déclenche les barres de compétences
        entry.target.querySelectorAll('.skill-fill[data-width]').forEach(bar => {
          bar.style.width = bar.dataset.width + '%';
        });
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

  elements.forEach(el => observer.observe(el));
})();

/* ============================================================
   BARRES DE COMPÉTENCES
   ============================================================ */
(function initSkillBars() {
  const bars = document.querySelectorAll('.skill-fill[data-width]');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.width = entry.target.dataset.width + '%';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  bars.forEach(b => observer.observe(b));
})();

/* ============================================================
   COMPTEURS ANIMÉS
   ============================================================ */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const step = Math.max(30, 1500 / target);
      let current = 0;
      const timer = setInterval(() => {
        el.textContent = ++current;
        if (current >= target) clearInterval(timer);
      }, step);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => observer.observe(c));
})();

/* ============================================================
   FILTRES PROJETS
   ============================================================ */
(function initFilters() {
  const buttons = document.querySelectorAll('.filter-btn');
  const cards   = document.querySelectorAll('.project-card');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filter = btn.dataset.filter;
      cards.forEach(card => {
        const show = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('hidden', !show);
        if (show) card.style.animation = 'fadeInUp 0.4s ease forwards';
      });
    });
  });
})();

/* ============================================================
   FORMULAIRE DE CONTACT
   ============================================================ */
(function initContactForm() {
  const form       = document.getElementById('contactForm');
  if (!form) return;
  const submitBtn  = document.getElementById('submitBtn');
  const successMsg = document.getElementById('formSuccess');

  const fields = {
    name:    { el: document.getElementById('contactName'),    err: document.getElementById('nameError')    },
    email:   { el: document.getElementById('contactEmail'),   err: document.getElementById('emailError')   },
    subject: { el: document.getElementById('contactSubject'), err: document.getElementById('subjectError') },
    message: { el: document.getElementById('contactMessage'), err: document.getElementById('messageError') },
  };

  const validators = {
    name:    v => v.trim().length >= 2  || 'Le nom doit contenir au moins 2 caractères.',
    email:   v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || 'Adresse email invalide.',
    subject: v => v.trim().length >= 3  || 'L\'objet doit contenir au moins 3 caractères.',
    message: v => v.trim().length >= 10 || 'Le message doit contenir au moins 10 caractères.',
  };

  function validateField(name) {
    const { el, err } = fields[name];
    const result = validators[name](el.value);
    el.classList.toggle('error', result !== true);
    err.textContent = result === true ? '' : escapeHTML(result);
    return result === true;
  }

  Object.keys(fields).forEach(name => {
    fields[name].el.addEventListener('blur',  () => validateField(name));
    fields[name].el.addEventListener('input', () => {
      if (fields[name].el.classList.contains('error')) validateField(name);
    });
  });

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    // Anti-spam honeypot
    const hp = form.querySelector('input[name="website"]');
    if (hp && hp.value.trim() !== '') return;

    const isValid = Object.keys(fields).every(n => validateField(n));
    if (!isValid) return;

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Envoi en cours...</span>';

    // Remplace par ton service réel (Formspree, EmailJS, etc.)
    setTimeout(() => {
      submitBtn.innerHTML = '<i class="fas fa-check"></i> <span>Envoyé !</span>';
      successMsg.removeAttribute('hidden');
      form.reset();

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> <span>Envoyer le message</span>';
        successMsg.setAttribute('hidden', '');
      }, 4000);
    }, 1500);
  });
})();

/* ============================================================
   BOUTON RETOUR EN HAUT
   ============================================================ */
function toggleBackToTop() {
  const btn = document.getElementById('backToTop');
  if (btn) btn.classList.toggle('visible', window.scrollY > 400);
}
document.getElementById('backToTop')?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ============================================================
   FOOTER — Année et date dynamiques
   ============================================================ */
(function() {
  const now = new Date();
  const yearEl  = document.getElementById('currentYear');
  const buildEl = document.getElementById('buildDate');
  if (yearEl)  yearEl.textContent  = now.getFullYear();
  if (buildEl) buildEl.textContent = now.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
})();

/* ============================================================
   ANIMATION CSS dynamique
   ============================================================ */
const styleTag = document.createElement('style');
styleTag.textContent = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(styleTag);

/* ============================================================
   EASTER EGG console
   ============================================================ */
console.log('%c ██████╗ ██╗ █████╗ ', 'color: #00ff88; font-family: monospace; font-size: 12px;');
console.log('%c██╔═══██╗██║██╔══██╗', 'color: #00ff88; font-family: monospace; font-size: 12px;');
console.log('%c██║   ██║██║███████║', 'color: #00ff88; font-family: monospace; font-size: 12px;');
console.log('%c██║   ██║██║██╔══██║', 'color: #00ff88; font-family: monospace; font-size: 12px;');
console.log('%c╚██████╔╝██║██║  ██║', 'color: #00ff88; font-family: monospace; font-size: 12px;');
console.log('%c ╚═════╝ ╚═╝╚═╝  ╚═╝', 'color: #00ff88; font-family: monospace; font-size: 12px;');
console.log('%c[SEC] OUSMANE ISSA ADAM — Cybersecurity & Networks', 'color: #00d4ff; font-family: monospace; font-size: 11px; font-weight: bold;');
console.log('%cousmaneissaadam39@gmail.com', 'color: #8baab8; font-family: monospace; font-size: 10px;');
