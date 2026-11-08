/* CONDUITE PRIVÉE — scripts de la page d'accueil (maquette v7) */
(function () {
  'use strict';

  var doc = document.documentElement;
  doc.classList.add('js');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------
     Configuration de la réservation.
     Pour brancher un futur système (API maison, outil de réservation,
     CRM…), il suffit de remplacer submitRequest() : la page lui passe un
     objet normalisé et attend une promesse.
     ------------------------------------------------------------------ */
  var BOOKING = {
    // Page de réservation complète (à créer) : la demande rapide y sera
    // transmise en paramètres d'URL pour pré-remplir le formulaire.
    reservationPage: null, // ex. 'reservation.html'
    submitRequest: function (payload) {
      // Exemple futur : return fetch('/api/demandes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      return Promise.resolve(payload);
    }
  };

  /* ---------- En-tête : fond au défilement ---------- */
  var header = document.querySelector('[data-header]');
  var mobileBar = document.querySelector('.mobile-bar');
  var hero = document.querySelector('.hero');
  // La barre mobile apparaît une fois le hero dépassé.
  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle('is-scrolled', y > 24);
    if (mobileBar && hero) mobileBar.classList.toggle('is-visible', y > hero.offsetHeight * 0.6);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Menu mobile ---------- */
  var burger = document.querySelector('[data-burger]');
  var menu = document.getElementById('menu');
  function closeMenu() {
    if (!burger) return;
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Ouvrir le menu');
    menu.classList.remove('is-open');
  }
  if (burger && menu) {
    burger.addEventListener('click', function () {
      var open = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', String(!open));
      burger.setAttribute('aria-label', open ? 'Ouvrir le menu' : 'Fermer le menu');
      menu.classList.toggle('is-open', !open);
    });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) closeMenu(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });
  }

  /* ---------- Demande rapide ---------- */
  var form = document.querySelector('[data-quick]');
  if (form) {
    var msg = form.querySelector('[data-quick-msg]');
    var dateInput = form.querySelector('#q-date');
    if (dateInput) {
      var t = new Date();
      dateInput.min = t.getFullYear() + '-' + String(t.getMonth() + 1).padStart(2, '0') + '-' + String(t.getDate()).padStart(2, '0');
    }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var missing = [];
      Array.prototype.forEach.call(form.querySelectorAll('[required]'), function (el) {
        var empty = !String(el.value).trim();
        el.setAttribute('aria-invalid', empty ? 'true' : 'false');
        if (empty) missing.push(form.querySelector('label[for="' + el.id + '"]').textContent.toLowerCase());
      });
      if (missing.length) {
        msg.textContent = 'Merci de préciser : ' + missing.join(', ') + '.';
        form.querySelector('[aria-invalid="true"]').focus();
        return;
      }
      var data = new FormData(form);
      var payload = {};
      data.forEach(function (v, k) { payload[k] = String(v).trim(); });

      if (BOOKING.reservationPage) {
        window.location.href = BOOKING.reservationPage + '?' + new URLSearchParams(payload).toString();
        return;
      }
      BOOKING.submitRequest(payload).then(function () {
        msg.textContent = 'Merci. Votre trajet ' + payload.depart + ' → ' + payload.destination +
          ' est prêt à être complété (coordonnées, demandes particulières) sur la page Réservation, à venir.';
      });
    });
    form.addEventListener('input', function (e) {
      if (e.target.getAttribute('aria-invalid') === 'true' && String(e.target.value).trim()) e.target.setAttribute('aria-invalid', 'false');
    });
  }

  /* ---------- Apparition au défilement ---------- */
  var revealTargets = document.querySelectorAll('.section-head, .exp-photo, .exp-copy, .moments li, .avis-head, .quote, .service, .car, .zone-copy, .zone-map, .person, .faq-list, .final-inner');
  if (!reduceMotion && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.remove('is-pending'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    var vh = window.innerHeight;
    Array.prototype.forEach.call(revealTargets, function (el, i) {
      el.classList.add('reveal');
      // Seuls les éléments sous la ligne de flottaison sont animés : la page reste complète au chargement.
      if (el.getBoundingClientRect().top > vh) {
        el.classList.add('is-pending');
        el.style.transitionDelay = (i % 4) * 70 + 'ms';
        io.observe(el);
      }
    });
  }

  /* ---------- Vidéo du hero : pause si mouvement réduit ---------- */
  var heroVideo = document.querySelector('[data-hero-video]');
  if (heroVideo && reduceMotion) { heroVideo.removeAttribute('autoplay'); heroVideo.pause(); }

  /* ---------- Année ---------- */
  var y = document.querySelector('[data-year]');
  if (y) y.textContent = new Date().getFullYear();
})();
