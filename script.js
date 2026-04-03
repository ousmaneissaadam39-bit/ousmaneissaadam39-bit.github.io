/**
 * PORTFOLIO CYBERSECURITY — script.js
 * Auteur : [Ton Prénom Nom]
 * Description : Interactions, animations, validation formulaire
 *
 * Sécurité :
 *  - Toutes les entrées utilisateur sont "échappées" avant d'être
 *    insérées dans le DOM (protection XSS)
 *  - Le champ honeypot bloque les robots spammeurs
 */

'use strict'; // Mode strict : moins de bugs silencieux

/* ============================================================
   UTILITAIRE — Échappe le HTML (protection XSS)
   Transforme < > & " ' en entités HTML sûres
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

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  // Le follower suit avec un petit délai (interpolation)
  function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = followerX + 'px';
    follower.style.top  = followerY + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Agrandir le curseur sur les éléments interactifs
  const interactives = document.querySelectorAll('a, button, .project-card, .contact-channel, .filter-btn');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform   = 'translate(-50%, -50%) scale(2)';
      follower.style.transform = 'translate(-50%, -50%) scale(1.5)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform   = 'translate(-50%, -50%) scale(1)';
      follower.style.transform = 'translate(-50%, -50%) scale(1)';
    });
  });
})();

/* ============================================================
   NAVBAR — scroll + hamburger menu
   ============================================================ */
(function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  const allLinks  = document.querySelectorAll('.nav-link');

  // Ajoute la classe scrolled quand on descend
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
    updateActiveLink();
    toggleBackToTop();
  }, { passive: true }); // passive = meilleure performance

  // Menu hamburger (mobile)
  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    // Empêche le scroll du body quand le menu est ouvert
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Ferme le menu si on clique sur un lien
  allLinks.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Ferme le menu si on clique à l'extérieur
  document.addEventListener('click', e => {
    if (navLinks.classList.contains('open') && !navLinks.contains(e.target) && !hamburger.contains(e.target)) {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  // Met en surbrillance le lien correspondant à la section visible
  function updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
      const top    = section.offsetTop;
      const height = section.offsetHeight;
      const id     = section.getAttribute('id');
      const link   = document.querySelector(`.nav-link[href="#${id}"]`);

      if (link) {
        link.classList.toggle('active', scrollPos >= top && scrollPos < top + height);
      }
    });
  }
})();

/* ============================================================
   TYPEWRITER EFFECT — Texte défilant dans le hero
   ============================================================ */
(function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;

  // Modifie ces phrases selon ta spécialité
  const phrases = [
    'Cybersecurity Engineer',
    'Network Specialist',
    'Ethical Hacker',
    'Cloud Security Enthusiast',
    'CTF Player',
  ];

  let phraseIndex  = 0;
  let charIndex    = 0;
  let isDeleting   = false;
  let delay        = 120;

  function type() {
    const current = phrases[phraseIndex];

    if (isDeleting) {
      el.textContent = current.substring(0, charIndex - 1);
      charIndex--;
      delay = 60;
    } else {
      el.textContent = current.substring(0, charIndex + 1);
      charIndex++;
      delay = 120;
    }

    if (!isDeleting && charIndex === current.length) {
      delay = 2000;  // Pause après avoir fini d'écrire
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      delay = 500;
    }

    setTimeout(type, delay);
  }

  setTimeout(type, 1000);
})();

/* ============================================================
   PARTICULES FLOTTANTES — fond du hero
   ============================================================ */
(function initParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  const COUNT = 30; // Nombre de particules

  for (let i = 0; i < COUNT; i++) {
    const p = document.createElement('div');
    p.className = 'particle';

    // Position et taille aléatoires
    p.style.left      = Math.random() * 100 + '%';
    p.style.width     = (Math.random() * 3 + 1) + 'px';
    p.style.height    = p.style.width;
    p.style.animationDuration  = (Math.random() * 15 + 8) + 's';
    p.style.animationDelay     = (Math.random() * 10) + 's';

    container.appendChild(p);
  }
})();

/* ============================================================
   ANIMATION À L'APPARITION (remplacement d'AOS)
   Déclenche les animations quand les éléments deviennent visibles
   ============================================================ */
(function initScrollReveal() {
  const elements = document.querySelectorAll('[data-aos]');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          // Déclenche les barres de progression si c'est une skill-fill
          entry.target.querySelectorAll('.skill-fill[data-width]').forEach(bar => {
            bar.style.width = bar.dataset.width + '%';
          });
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
  );

  elements.forEach(el => observer.observe(el));

  // Cas spécial : barres de progression déjà visibles au chargement
  document.querySelectorAll('.skill-category.is-visible .skill-fill[data-width]').forEach(bar => {
    bar.style.width = bar.dataset.width + '%';
  });
})();

/* ============================================================
   COMPTEUR ANIMÉ — statistiques du hero
   ============================================================ */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (!counters.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const duration = 1500; // ms
      const step   = duration / target;
      let current  = 0;

      const timer = setInterval(() => {
        current++;
        el.textContent = current;
        if (current >= target) clearInterval(timer);
      }, step);

      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
})();

/* ============================================================
   FILTRE PROJETS
   ============================================================ */
(function initProjectFilters() {
  const buttons = document.querySelectorAll('.filter-btn');
  const cards   = document.querySelectorAll('.project-card');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Mise à jour de l'état actif
      buttons.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filter = btn.dataset.filter;

      cards.forEach(card => {
        const category = card.dataset.category;
        const show = filter === 'all' || category === filter;

        // Animation de disparition/apparition
        if (show) {
          card.classList.remove('hidden');
          card.style.animation = 'fadeInUp 0.4s ease forwards';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
})();

/* ============================================================
   FORMULAIRE DE CONTACT — validation + sécurité XSS
   ============================================================ */
(function initContactForm() {
  const form       = document.getElementById('contactForm');
  if (!form) return;

  const submitBtn  = document.getElementById('submitBtn');
  const successMsg = document.getElementById('formSuccess');

  // Récupère les champs
  const fields = {
    name:    { el: document.getElementById('contactName'),    err: document.getElementById('nameError')    },
    email:   { el: document.getElementById('contactEmail'),   err: document.getElementById('emailError')   },
    subject: { el: document.getElementById('contactSubject'), err: document.getElementById('subjectError') },
    message: { el: document.getElementById('contactMessage'), err: document.getElementById('messageError') },
  };

  // Règles de validation
  const validators = {
    name:    v => v.trim().length >= 2   || 'Le nom doit contenir au moins 2 caractères.',
    email:   v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || 'Adresse email invalide.',
    subject: v => v.trim().length >= 3   || 'L\'objet doit contenir au moins 3 caractères.',
    message: v => v.trim().length >= 10  || 'Le message doit contenir au moins 10 caractères.',
  };

  // Valide un seul champ
  function validateField(name) {
    const { el, err } = fields[name];
    const value       = el.value;
    const result      = validators[name](value);

    if (result === true) {
      el.classList.remove('error');
      err.textContent = '';
      return true;
    } else {
      el.classList.add('error');
      // escapeHTML protège contre XSS au cas où un message d'erreur contiendrait < >
      err.textContent = escapeHTML(result);
      return false;
    }
  }

  // Validation en temps réel à la saisie
  Object.keys(fields).forEach(name => {
    fields[name].el.addEventListener('blur',  () => validateField(name));
    fields[name].el.addEventListener('input', () => {
      if (fields[name].el.classList.contains('error')) validateField(name);
    });
  });

  // Soumission du formulaire
  form.addEventListener('submit', function(e) {
    e.preventDefault();

    // Vérification du honeypot (anti-spam)
    const honeypot = form.querySelector('input[name="website"]');
    if (honeypot && honeypot.value.trim() !== '') {
      console.log('Spam détecté, formulaire ignoré.');
      return; // Robot détecté, on arrête silencieusement
    }

    // Valide tous les champs
    const isValid = Object.keys(fields).every(name => validateField(name));
    if (!isValid) return;

    // Simule l'envoi (remplace par ton service d'envoi réel)
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Envoi en cours...</span>';

    // ⚠️ ICI tu connecteras ton backend ou service (Formspree, EmailJS, etc.)
    // Exemple avec Formspree : action="https://formspree.io/f/TON_ID"
    setTimeout(() => {
      // Succès simulé
      submitBtn.innerHTML = '<i class="fas fa-check"></i> <span>Envoyé !</span>';
      successMsg.removeAttribute('hidden');
      form.reset();

      // Réinitialise le bouton après 4 secondes
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
  if (!btn) return;
  btn.classList.toggle('visible', window.scrollY > 400);
}

(function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ============================================================
   FOOTER — Année et date de build dynamiques
   ============================================================ */
(function initFooter() {
  const yearEl  = document.getElementById('currentYear');
  const buildEl = document.getElementById('buildDate');
  const now     = new Date();

  if (yearEl)  yearEl.textContent  = now.getFullYear();
  if (buildEl) buildEl.textContent = now.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
})();

/* ============================================================
   ANIMATION BARRES DE COMPÉTENCES (au scroll)
   ============================================================ */
(function initSkillBars() {
  const bars = document.querySelectorAll('.skill-fill[data-width]');
  if (!bars.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.width = entry.target.dataset.width + '%';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(bar => observer.observe(bar));
})();

/* ============================================================
   KEYFRAME ANIMATION DYNAMIQUE
   ============================================================ */
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0);    }
  }
`;
document.head.appendChild(style);

/* ============================================================
   LOG DE BIENVENUE dans la console du navigateur
   ============================================================ */
console.log('%c[SEC_ENGINR] Portfolio chargé avec succès ✓', 'color: #00ff88; font-family: monospace; font-size: 14px; font-weight: bold;');
console.log('%cContacte-moi : ton.email@example.com', 'color: #00d4ff; font-family: monospace; font-size: 11px;');
