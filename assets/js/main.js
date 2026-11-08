/* CONDUITE PRIVÉE — scripts de la page d'accueil (maquette v4) */
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
  var revealTargets = document.querySelectorAll('.section-head, .cards-4 .card, .feature, .vehicle, .step, .offer, .zone-map, .chips, .placeholder-block, .quick, .faq-list, .final-box');
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

  /* ---------- Traînées de phares (hero et bandeau) ---------- */
  function Trails(canvas) {
    var ctx = canvas.getContext('2d');
    var soft = canvas.hasAttribute('data-trails-soft');
    var w = 0, h = 0, dpr = 1, lanes = [], raf = 0, running = false, last = 0;

    function lane(i, n) {
      var base = soft ? 0.5 + (i - n / 2) * 0.06 : 0.72 + i * 0.045;
      var amp = soft ? 0.08 : 0.10 + i * 0.012;
      var warm = i % 3 !== 1; // phares blancs/dorés, feux arrière rouges
      var dir = warm ? 1 : -1;
      var comets = [];
      var count = soft ? 2 : 3;
      for (var c = 0; c < count; c++) comets.push({ t: Math.random(), speed: 0.035 + Math.random() * 0.05, len: 0.12 + Math.random() * 0.16 });
      return { base: base, amp: amp, phase: i * 0.7, warm: warm, dir: dir, comets: comets, width: soft ? 1.2 : 1 + (i % 2) * 0.8 };
    }
    function point(l, t) {
      var x = -0.1 * w + t * 1.2 * w;
      var y = h * (l.base - l.amp * Math.sin(t * Math.PI * 0.9 + l.phase * 0.2) * (1 - t * 0.35));
      return [x, y];
    }
    function resize() {
      var r = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width; h = r.height;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = soft ? 5 : (w < 700 ? 5 : 7);
      lanes = []; for (var i = 0; i < n; i++) lanes.push(lane(i, n));
      draw(0);
    }
    function draw(dt) {
      ctx.clearRect(0, 0, w, h);
      lanes.forEach(function (l) {
        // trait de fond (route)
        ctx.beginPath();
        for (var s = 0; s <= 60; s++) { var p = point(l, s / 60); if (s) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]); }
        ctx.strokeStyle = 'rgba(255,255,255,0.035)'; ctx.lineWidth = 1; ctx.stroke();

        l.comets.forEach(function (c) {
          c.t += c.speed * dt * l.dir;
          if (c.t > 1 + c.len) c.t = -c.len;
          if (c.t < -c.len) c.t = 1 + c.len;
          var steps = 26;
          for (var k = 0; k < steps; k++) {
            var a = c.t - (k / steps) * c.len * l.dir;
            var b = c.t - ((k + 1) / steps) * c.len * l.dir;
            var p1 = point(l, a), p2 = point(l, b);
            var alpha = (1 - k / steps) * (soft ? 0.25 : 0.45);
            ctx.beginPath(); ctx.moveTo(p1[0], p1[1]); ctx.lineTo(p2[0], p2[1]);
            ctx.strokeStyle = l.warm ? 'rgba(225,235,250,' + alpha + ')' : 'rgba(110,150,215,' + alpha * 0.8 + ')';
            ctx.lineWidth = l.width * (1 - k / steps * 0.6);
            ctx.lineCap = 'round';
            ctx.stroke();
          }
        });
      });
    }
    function loop(now) {
      var dt = last ? Math.min((now - last) / 1000, 0.05) : 0;
      last = now;
      draw(dt);
      if (running) raf = requestAnimationFrame(loop);
    }
    function start() { if (running || reduceMotion) return; running = true; last = 0; raf = requestAnimationFrame(loop); }
    function stop() { running = false; cancelAnimationFrame(raf); }

    resize();
    window.addEventListener('resize', resize);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) { en[0].isIntersecting ? start() : stop(); }).observe(canvas);
    } else { start(); }
  }
  Array.prototype.forEach.call(document.querySelectorAll('[data-trails]'), function (c) {
    if (c.getContext) Trails(c);
  });

  /* ---------- Année ---------- */
  var y = document.querySelector('[data-year]');
  if (y) y.textContent = new Date().getFullYear();
})();
