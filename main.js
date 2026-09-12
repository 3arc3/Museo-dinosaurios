/* =====================================================
   MUSEO DINOSAURIA · main.js
   Secuencia: portada T-rex → zoom al ojo → visión POV → carrera
   ===================================================== */
(function () {
  'use strict';
  document.documentElement.classList.add('js');
  const $ = (s) => document.querySelector(s);

  /* ---------- Año del footer ---------- */
  $('#year').textContent = new Date().getFullYear();

  /* ---------- Navbar sólida al hacer scroll ---------- */
  const navbar = $('#navbar');
  addEventListener('scroll', () => navbar.classList.toggle('scrolled', scrollY > 40), { passive: true });

  /* ---------- Menú móvil ---------- */
  const nav = $('#nav'), toggle = $('#navToggle');
  toggle.addEventListener('click', () => nav.classList.toggle('open'));
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));

  /* ---------- Aparición de secciones al scroll ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  /* ---------- Contadores animados de estadísticas ---------- */
  const cio = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      cio.unobserve(e.target);
      const el = e.target, target = +el.dataset.target, dur = 1400, t0 = performance.now();
      (function tick(t) {
        const k = Math.min(1, (t - t0) / dur);
        el.textContent = Math.round(target * (1 - Math.pow(1 - k, 3))).toLocaleString('es-ES');
        if (k < 1) requestAnimationFrame(tick);
      })(t0);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('.stat-num').forEach(el => cio.observe(el));

  /* ---------- SECUENCIA CINEMATOGRÁFICA DE PORTADA ---------- */
  const zone    = $('#portada');
  const stage   = document.querySelector('.zoom-stage');
  const shake   = $('#stageShake');
  const trex    = $('#layerTrex');
  const pov     = $('#pov1'),  povImg   = pov.querySelector('img');
  const chase   = $('#pov2'),  chaseImg = chase.querySelector('img');
  const hero    = $('#heroContent');
  const hint    = $('#scrollHint');
  const hud     = $('#povHud');
  const speedEl = $('#hudSpeed');
  const capZoom = $('#capZoom');
  const cap1    = $('#cap1');
  const cap2    = $('#cap2');
  const endFade = $('#endFade');

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const sm = (a, b, x) => { x = clamp((x - a) / (b - a), 0, 1); return x * x * (3 - 2 * x); }; // smoothstep

  let lastSpeed = -1;

  function frame(t) {
    const rect  = zone.getBoundingClientRect();
    const total = zone.offsetHeight - innerHeight;
    const p = total > 0 ? clamp(-rect.top / total, 0, 1) : 0;

    // Fases de la secuencia
    const zoom  = sm(0.06, 0.34, p);   // la cámara se acerca al ojo del T-rex
    const cross = sm(0.34, 0.48, p);   // fundido a la visión en 1ª persona
    const run   = sm(0.62, 0.78, p);   // corte a la carrera junto a la manada
    const end   = sm(0.92, 1.00, p);   // fundido final hacia el contenido

    // Capa T-rex: zoom progresivo hacia la cabeza
    trex.style.transform = `scale(${1 + zoom * 2.6})`;
    trex.style.opacity   = (1 - cross).toFixed(3);
    trex.style.filter    = `brightness(${1 - zoom * 0.35}) saturate(${1 + zoom * 0.15})`;

    // Capa POV: entra con fundido y efecto "dolly" (acercamiento continuo = correr)
    pov.style.opacity     = cross.toFixed(3);
    povImg.style.transform = `scale(${1 + sm(0.34, 0.92, p) * 0.35})`;

    // Capa de carrera final
    chase.style.opacity    = run.toFixed(3);
    chaseImg.style.transform = `scale(${1.06 + sm(0.62, 1, p) * 0.14})`;

    // Título y pista de scroll se desvanecen al empezar
    const hs = sm(0, 0.10, p);
    hero.style.opacity   = (1 - hs).toFixed(3);
    hero.style.transform = `translateY(${-hs * 8}vh)`;
    hint.style.opacity   = (1 - sm(0, 0.05, p)).toFixed(3);

    // Bandas cinematográficas + HUD de "visión T-rex"
    stage.style.setProperty('--lb', (cross * 5 * (1 - end * 0.6)).toFixed(2) + 'vh');
    hud.style.opacity = (cross * (1 - end)).toFixed(3);

    // Subtítulos narrativos
    capZoom.style.opacity = (sm(0.12, 0.22, p) * (1 - cross)).toFixed(3);
    cap1.style.opacity    = (cross * (1 - run)).toFixed(3);
    cap2.style.opacity    = (run * (1 - end)).toFixed(3);

    // Velocímetro del HUD
    const sp = Math.round(cross * 14 + run * 18);
    if (sp !== lastSpeed) { speedEl.textContent = sp; lastSpeed = sp; }

    // Fundido hacia la primera sección de contenido
    endFade.style.opacity = end.toFixed(3);

    // Temblor de cámara (zancadas del T-rex)
    if (!reduced && cross > 0) {
      const amp = cross * (3 + 6 * p) * (1 + 0.35 * run);
      const s = t / 1000;
      const x = Math.sin(s * 9.2)  * amp * 0.50 + Math.sin(s * 21.7) * amp * 0.18;
      const y = Math.sin(s * 17.3) * amp * 0.55 + Math.sin(s * 31.1) * amp * 0.12;
      const r = Math.sin(s * 7.7)  * amp * 0.05;
      shake.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${r}deg)`;
    } else {
      shake.style.transform = '';
    }

    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
