/* =====================================================
   MUSEO DINOSAURIA · main.js
   Escena 3D con Three.js: T-Rex → zoom al ojo → visión POV → carrera por la selva
   Todo generado proceduralmente (sin imágenes externas)
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

  /* =====================================================
     ESCENA 3D CON THREE.JS
     ===================================================== */
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const sm = (a, b, x) => { x = clamp((x - a) / (b - a), 0, 1); return x * x * (3 - 2 * x); };

  const canvas = $('#dinoCanvas');
  const loading = $('#loading3d');
  const vignette = $('#vignette');
  const hero = $('#heroContent');
  const hint = $('#scrollHint');
  const hud = $('#povHud');
  const speedEl = $('#hudSpeed');
  const stage = document.querySelector('.scene-stage');
  const capZoom = $('#capZoom');
  const cap1 = $('#cap1');
  const cap2 = $('#cap2');
  const endFade = $('#endFade');
  const zone = $('#portada');

  // Renderer
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(innerWidth, innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // Escena y niebla (selva)
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0a1410);
  scene.fog = new THREE.FogExp2(0x0d1a12, 0.018);

  // Cámaras: externa (ve al T-Rex) y POV (desde sus ojos)
  const camExternal = new THREE.PerspectiveCamera(50, innerWidth / innerHeight, 0.1, 500);
  const camPOV = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 500);
  let activeCam = camExternal;

  /* ---------- LUCES ---------- */
  const hemi = new THREE.HemisphereLight(0xffeebb, 0x223322, 0.7);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xffddaa, 1.4);
  sun.position.set(30, 60, 20);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  sun.shadow.camera.left = -60; sun.shadow.camera.right = 60;
  sun.shadow.camera.top = 60; sun.shadow.camera.bottom = -60;
  scene.add(sun);
  // Rayos de luz volumétricos simulados con sprites
  const rayGeo = new THREE.PlaneGeometry(8, 60);
  const rayMat = new THREE.MeshBasicMaterial({ color: 0xffeecc, transparent: true, opacity: 0.06, side: THREE.DoubleSide, depthWrite: false });
  for (let i = 0; i < 6; i++) {
    const ray = new THREE.Mesh(rayGeo, rayMat);
    ray.position.set(-30 + i * 12, 25, -20 - Math.random() * 30);
    ray.rotation.z = 0.3;
    scene.add(ray);
  }

  /* ---------- SUELO ---------- */
  const groundGeo = new THREE.PlaneGeometry(400, 400, 80, 80);
  // Ondular el terreno
  const pos = groundGeo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), y = pos.getY(i);
    pos.setZ(i, Math.sin(x * 0.1) * Math.cos(y * 0.1) * 1.5);
  }
  groundGeo.computeVertexNormals();
  const groundMat = new THREE.MeshStandardMaterial({ color: 0x2d4a2a, roughness: 1 });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  /* ---------- FUNCIÓN: crear un árbol (tronco + copa) ---------- */
  function makeTree(x, z, scale = 1) {
    const tree = new THREE.Group();
    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.4 * scale, 0.7 * scale, 6 * scale, 8),
      new THREE.MeshStandardMaterial({ color: 0x4a3520, roughness: 1 })
    );
    trunk.position.y = 3 * scale;
    trunk.castShadow = true;
    tree.add(trunk);
    // Copa: varias esferas (estilo helecho/conífera primitiva)
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x2e5a2a, roughness: 0.9 });
    for (let i = 0; i < 4; i++) {
      const leaf = new THREE.Mesh(new THREE.IcosahedronGeometry(2.2 * scale * (1 - i * 0.15), 0), leafMat);
      leaf.position.set((Math.random() - 0.5) * scale, 6 * scale + i * 1.5 * scale, (Math.random() - 0.5) * scale);
      leaf.castShadow = true;
      tree.add(leaf);
    }
    tree.position.set(x, 0, z);
    return tree;
  }

  /* ---------- FUNCIÓN: crear un helecho ---------- */
  function makeFern(x, z) {
    const fern = new THREE.Mesh(
      new THREE.ConeGeometry(1.2, 2, 6),
      new THREE.MeshStandardMaterial({ color: 0x3a6a30, roughness: 1 })
    );
    fern.position.set(x, 1, z);
    fern.castShadow = true;
    return fern;
  }

  /* ---------- POBLAR LA SELVA ---------- */
  const forest = new THREE.Group();
  for (let i = 0; i < 90; i++) {
    const angle = Math.random() * Math.PI * 2;
    const dist = 12 + Math.random() * 80;
    const x = Math.cos(angle) * dist;
    const z = Math.sin(angle) * dist - 30;
    forest.add(makeTree(x, z, 0.7 + Math.random() * 0.8));
  }
  for (let i = 0; i < 120; i++) {
    const x = (Math.random() - 0.5) * 160;
    const z = (Math.random() - 0.5) * 160 - 20;
    if (Math.abs(x) > 4) forest.add(makeFern(x, z));
  }
  scene.add(forest);

  /* ---------- PARTÍCULAS (polvo/polen flotando) ---------- */
  const dustGeo = new THREE.BufferGeometry();
  const dustCount = 600;
  const dustPos = new Float32Array(dustCount * 3);
  for (let i = 0; i < dustCount; i++) {
    dustPos[i * 3] = (Math.random() - 0.5) * 120;
    dustPos[i * 3 + 1] = Math.random() * 30;
    dustPos[i * 3 + 2] = (Math.random() - 0.5) * 120 - 20;
  }
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
  const dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({ color: 0xffeebb, size: 0.25, transparent: true, opacity: 0.5 }));
  scene.add(dust);

  /* =====================================================
     CONSTRUIR UN DINOSAURIO PROCEDURAL (low-poly)
     type: 'trex' | 'herbivore'
     ===================================================== */
  function buildDino(type = 'trex') {
    const dino = new THREE.Group();
    const isTrex = type === 'trex';
    const bodyColor = isTrex ? 0x5a6a4a : 0x7a6a4a;
    const mat = new THREE.MeshStandardMaterial({ color: bodyColor, roughness: 0.85, flatShading: true });
    const darkMat = new THREE.MeshStandardMaterial({ color: 0x3a4530, roughness: 0.9, flatShading: true });

    // Cuerpo
    const body = new THREE.Mesh(new THREE.BoxGeometry(2.4, 2, 3.6), mat);
    body.position.y = 2.6;
    body.castShadow = true;
    dino.add(body);

    // Cabeza
    const head = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.5, 2.2), mat);
    head.position.set(0, 3.6, 2.4);
    head.castShadow = true;
    dino.add(head);
    dino.userData.head = head;

    // Mandíbula (para animar rugido)
    const jaw = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.5, 1.8), darkMat);
    jaw.position.set(0, 2.95, 2.5);
    dino.add(jaw);
    dino.userData.jaw = jaw;

    // Ojos (brillantes)
    const eyeMat = new THREE.MeshStandardMaterial({ color: 0xffaa00, emissive: 0xff6600, emissiveIntensity: 0.8 });
    [-0.55, 0.55].forEach(xOff => {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 8), eyeMat);
      eye.position.set(xOff, 3.9, 3.3);
      dino.add(eye);
    });

    // Dientes
    const toothMat = new THREE.MeshStandardMaterial({ color: 0xf5f0e0 });
    for (let i = 0; i < 6; i++) {
      const tooth = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.3, 4), toothMat);
      tooth.position.set(-0.5 + i * 0.2, 2.78, 3.3);
      tooth.rotation.x = Math.PI;
      dino.add(tooth);
    }

    // Cola (segmentos)
    const tailSegs = [];
    for (let i = 0; i < 5; i++) {
      const seg = new THREE.Mesh(new THREE.BoxGeometry(1.4 - i * 0.22, 1.4 - i * 0.22, 1), mat);
      seg.position.set(0, 2.6 - i * 0.15, -2 - i * 0.9);
      seg.castShadow = true;
      dino.add(seg);
      tailSegs.push(seg);
    }
    dino.userData.tail = tailSegs;

    // Patas traseras (muslo + pantorrilla)
    const legs = [];
    [-0.85, 0.85].forEach(xOff => {
      const thigh = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.6, 1.1), mat);
      thigh.position.set(xOff, 1.8, 0.3);
      thigh.castShadow = true;
      dino.add(thigh);
      const shin = new THREE.Mesh(new THREE.BoxGeometry(0.7, 1.6, 0.8), darkMat);
      shin.position.set(xOff, 0.6, 0.3);
      shin.castShadow = true;
      dino.add(shin);
      legs.push({ thigh, shin, side: xOff > 0 ? 1 : -1 });
    });
    dino.userData.legs = legs;

    // Brazos pequeños (solo T-Rex)
    if (isTrex) {
      [-0.9, 0.9].forEach(xOff => {
        const arm = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.9, 0.35), darkMat);
        arm.position.set(xOff, 2.8, 1.4);
        dino.add(arm);
      });
    } else {
      // Cuernos / cresta para herbívoro
      const horn = new THREE.Mesh(new THREE.ConeGeometry(0.2, 1, 6), toothMat);
      horn.position.set(0, 4.4, 2.8);
      horn.rotation.x = -0.5;
      dino.add(horn);
    }

    // Punto de anclaje de la cámara POV (entre los ojos)
    const eyeAnchor = new THREE.Object3D();
    eyeAnchor.position.set(0, 3.85, 3.0);
    dino.add(eyeAnchor);
    dino.userData.eyeAnchor = eyeAnchor;

    dino.userData.phase = Math.random() * Math.PI * 2;
    return dino;
  }

  /* ---------- T-REX PRINCIPAL ---------- */
  const trex = buildDino('trex');
  trex.scale.setScalar(1.6);
  trex.position.set(0, 0, 0);
  scene.add(trex);

  /* ---------- MANADA DE HERBÍVOROS (lo que persigue) ---------- */
  const herd = [];
  const herdData = [
    { x: -6, z: -22, s: 1.3 }, { x: 5, z: -28, s: 1.1 }, { x: -3, z: -35, s: 1.4 },
    { x: 8, z: -40, s: 1.0 }, { x: -8, z: -45, s: 1.2 }, { x: 2, z: -52, s: 1.3 }
  ];
  herdData.forEach(d => {
    const h = buildDino('herbivore');
    h.scale.setScalar(d.s);
    h.position.set(d.x, 0, d.z);
    h.rotation.y = Math.PI; // miran hacia el T-Rex (huyen)
    scene.add(h);
    herd.push({ mesh: h, baseX: d.x, baseZ: d.z, phase: Math.random() * Math.PI * 2 });
  });

  /* ---------- ANIMACIÓN DE CORRER (aplicada a un dino) ---------- */
  function animateRun(dino, t, speedFactor) {
    const ud = dino.userData;
    const freq = 6 * speedFactor;
    // Patas alternas
    ud.legs.forEach((leg, i) => {
      const swing = Math.sin(t * freq + i * Math.PI) * 0.6 * speedFactor;
      leg.thigh.rotation.x = swing;
      leg.shin.rotation.x = swing * 0.7 - 0.2;
      leg.thigh.position.y = 1.8 + Math.abs(Math.sin(t * freq + i * Math.PI)) * 0.3 * speedFactor;
    });
    // Cola ondea
    ud.tail.forEach((seg, i) => {
      seg.rotation.y = Math.sin(t * freq * 0.8 + i * 0.5) * 0.15 * (i + 1) * 0.3;
    });
    // Cabeza balancea
    ud.head.rotation.x = Math.sin(t * freq) * 0.08 * speedFactor;
    // Mandíbula (rugido leve)
    ud.jaw.rotation.x = Math.sin(t * 3) * 0.05 + 0.05;
    // Cuerpo sube/baja con la zancada
    dino.position.y = Math.abs(Math.sin(t * freq)) * 0.25 * speedFactor;
  }

  /* ---------- LOOP PRINCIPAL ---------- */
  let scrollP = 0;
  let lastSpeed = -1;
  const clock = new THREE.Clock();

  function render() {
    const t = clock.getElapsedTime();
    const dt = clock.getDelta();

    // Fases según scroll
    const zoom = sm(0.05, 0.32, scrollP);
    const cross = sm(0.32, 0.46, scrollP);
    const run = sm(0.55, 0.72, scrollP);
    const end = sm(0.92, 1.0, scrollP);

    // Velocidad de carrera (0 al inicio, máxima en fase run)
    const runSpeed = 0.3 + run * 1.0;

    // Animar T-Rex: quieto al principio, corre cuando entramos en POV
    if (cross > 0.05) {
      animateRun(trex, t, runSpeed);
    } else {
      // Respiración idle
      trex.position.y = Math.sin(t * 1.5) * 0.05;
      trex.userData.jaw.rotation.x = Math.sin(t * 2) * 0.03;
    }

    // Animar manada (siempre corriendo, huyendo)
    herd.forEach(h => {
      animateRun(h.mesh, t + h.phase, 0.9);
      // Se desplazan ligeramente y oscilan
      h.mesh.position.x = h.baseX + Math.sin(t * 0.5 + h.phase) * 1.5;
      h.mesh.position.z = h.baseZ + Math.sin(t * 0.3 + h.phase) * 2 - run * 8;
    });

    // Partículas flotan
    dust.rotation.y = t * 0.02;
    const dp = dust.geometry.attributes.position.array;
    for (let i = 1; i < dp.length; i += 3) {
      dp[i] += Math.sin(t + i) * 0.005;
    }
    dust.geometry.attributes.position.needsUpdate = true;

    /* ---- CÁMARA EXTERNA: ve al T-Rex y hace zoom hacia su cabeza ---- */
    const baseDist = 16;
    const dist = baseDist - zoom * 13; // se acerca
    const height = 6 - zoom * 2.2;
    camExternal.position.set(
      Math.sin(t * 0.2) * 0.5,
      height,
      dist
    );
    // Objetivo: la cabeza del T-Rex
    const headWorld = new THREE.Vector3();
    trex.userData.head.getWorldPosition(headWorld);
    camExternal.lookAt(headWorld.x, headWorld.y - zoom * 0.5, headWorld.z);

    /* ---- CÁMARA POV: entre los ojos del T-Rex ---- */
    const eyeWorld = new THREE.Vector3();
    trex.userData.eyeAnchor.getWorldPosition(eyeWorld);
    camPOV.position.copy(eyeWorld);
    // Mira hacia adelante (donde huye la manada) con leve balanceo
    const lookTarget = new THREE.Vector3(
      eyeWorld.x + Math.sin(t * 6 * runSpeed) * 0.15 * run,
      eyeWorld.y - 0.3 + Math.sin(t * 6 * runSpeed) * 0.1 * run,
      eyeWorld.z - 10
    );
    camPOV.lookAt(lookTarget);
    // FOV aumenta al correr (sensación de velocidad)
    camPOV.fov = 75 + run * 15;
    camPOV.updateProjectionMatrix();

    /* ---- TRANSICIÓN ENTRE CÁMARAS ---- */
    // Mezclamos posiciones durante el fundido (cross)
    if (cross < 1) {
      activeCam = camExternal;
      // Durante la transición acercamos aún más la externa para simular "entrar"
      if (cross > 0) {
        camExternal.position.lerp(eyeWorld, cross * 0.95);
      }
    } else {
      activeCam = camPOV;
    }

    /* ---- TEMBLOR DE CÁMARA (zancadas) en POV ---- */
    if (!reduced && cross > 0.3) {
      const amp = (cross) * (0.08 + run * 0.25);
      camPOV.position.y += Math.sin(t * 12 * runSpeed) * amp;
      camPOV.position.x += Math.cos(t * 9 * runSpeed) * amp * 0.5;
    }

    /* ---- UI / OVERLAYS ---- */
    // Hero y hint se desvanecen
    const hs = sm(0, 0.1, scrollP);
    hero.style.opacity = (1 - hs).toFixed(3);
    hero.style.transform = `translateY(${-hs * 8}vh)`;
    hint.style.opacity = (1 - sm(0, 0.05, scrollP)).toFixed(3);

    // Viñeta POV
    vignette.style.opacity = (cross * (1 - end * 0.5)).toFixed(3);

    // Bandas cinematográficas
    stage.style.setProperty('--lb', (cross * 6 * (1 - end * 0.6)).toFixed(2) + 'vh');

    // HUD
    hud.style.opacity = (cross * (1 - end)).toFixed(3);

    // Subtítulos
    capZoom.style.opacity = (sm(0.12, 0.24, scrollP) * (1 - cross)).toFixed(3);
    cap1.style.opacity = (cross * (1 - run)).toFixed(3);
    cap2.style.opacity = (run * (1 - end)).toFixed(3);

    // Velocímetro
    const sp = Math.round(cross * 12 + run * 20);
    if (sp !== lastSpeed) { speedEl.textContent = sp; lastSpeed = sp; }

    // Fundido final al contenido
    endFade.style.opacity = end.toFixed(3);

    // Niebla se densifica al correr (más inmersión)
    scene.fog.density = 0.018 + run * 0.012;

    renderer.render(scene, activeCam);
    requestAnimationFrame(render);
  }

  /* ---------- CONTROL DE SCROLL ---------- */
  function updateScroll() {
    const rect = zone.getBoundingClientRect();
    const total = zone.offsetHeight - innerHeight;
    scrollP = total > 0 ? clamp(-rect.top / total, 0, 1) : 0;
  }
  addEventListener('scroll', updateScroll, { passive: true });
  updateScroll();

  /* ---------- RESIZE ---------- */
  addEventListener('resize', () => {
    renderer.setSize(innerWidth, innerHeight);
    camExternal.aspect = camPOV.aspect = innerWidth / innerHeight;
    camExternal.updateProjectionMatrix();
    camPOV.updateProjectionMatrix();
  });

  /* ---------- ARRANQUE ---------- */
  // Pequeño delay para asegurar que Three.js terminó de compilar shaders
  requestAnimationFrame(() => {
    render();
    setTimeout(() => loading.classList.add('hidden'), 400);
  });

})();
