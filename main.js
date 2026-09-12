/* ============ BASE ============ */
:root{
  --bg:#0a0f0d; --bg-2:#0e1512; --card:#121a16; --line:rgba(233,240,236,.09);
  --text:#eaf2ee; --muted:#a7bcb1; --amber:#ffb347; --amber-2:#ff8c1a; --lime:#9fd66b;
  --radius:18px; --font-title:'Cinzel',serif; --font-body:'Inter',system-ui,sans-serif;
}
*{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth}
body{background:var(--bg);color:var(--text);font-family:var(--font-body);line-height:1.65;overflow-x:hidden}
img{display:block;max-width:100%}
::selection{background:var(--amber);color:#201302}
.container{width:min(1180px,92%);margin-inline:auto}
.section{padding:110px 0;scroll-margin-top:70px}
.section-alt{background:var(--bg-2)}
.kicker{color:var(--amber);text-transform:uppercase;letter-spacing:.35em;font-size:.78rem;font-weight:700;margin-bottom:14px}
h1,h2,h3{font-family:var(--font-title);line-height:1.15}
h2{font-size:clamp(1.9rem,3.6vw,2.9rem);margin-bottom:18px}
.lead{color:var(--muted);max-width:68ch;margin-bottom:12px}
.lead b{color:var(--text)}

/* ============ NAVBAR ============ */
.navbar{position:fixed;top:0;left:0;right:0;z-index:50;display:flex;align-items:center;justify-content:space-between;
  padding:16px 4%;transition:.35s;background:linear-gradient(rgba(0,0,0,.6),transparent)}
.navbar.scrolled{background:rgba(8,12,10,.92);backdrop-filter:blur(12px);padding:10px 4%;box-shadow:0 8px 30px rgba(0,0,0,.4)}
.brand{font-family:var(--font-title);color:var(--text);text-decoration:none;font-size:1.05rem;letter-spacing:.12em;white-space:nowrap}
.brand b{color:var(--amber)}
.nav{display:flex;gap:26px;align-items:center}
.nav a{color:var(--muted);text-decoration:none;font-size:.92rem;font-weight:600;transition:.25s}
.nav a:hover{color:var(--amber)}
.nav-toggle{display:none;flex-direction:column;gap:5px;background:none;border:0;cursor:pointer;padding:6px}
.nav-toggle span{width:26px;height:2px;background:var(--text)}

/* ============ BOTONES ============ */
.btn{display:inline-block;background:linear-gradient(135deg,var(--amber),var(--amber-2));color:#1a1005;font-weight:800;
  padding:14px 28px;border-radius:999px;text-decoration:none;letter-spacing:.03em;box-shadow:0 10px 30px rgba(255,140,26,.2);transition:.25s}
.btn:hover{transform:translateY(-2px);box-shadow:0 14px 36px rgba(255,140,26,.35)}
.btn-ghost{background:transparent;color:var(--text);border:1px solid rgba(255,255,255,.35);box-shadow:none}
.btn-ghost:hover{border-color:var(--amber);color:var(--amber)}
.btn-small{padding:9px 20px}

/* ============ ESCENA 3D (PORTADA) ============ */
.scene-scroll{height:520vh;position:relative}
.scene-stage{position:sticky;top:0;height:100vh;height:100dvh;overflow:hidden;background:radial-gradient(circle at 50% 30%,#1a2e22,#05080a 75%)}
#dinoCanvas{position:absolute;inset:0;width:100%;height:100%;display:block}
.cine-bar{position:absolute;left:0;right:0;height:var(--lb,0vh);background:#000;z-index:3;pointer-events:none}
.cine-bar.top{top:0}.cine-bar.bottom{bottom:0}
.pov-vignette{position:absolute;inset:0;z-index:2;pointer-events:none;opacity:0;transition:opacity .2s;
  background:radial-gradient(ellipse at center,transparent 45%,rgba(0,0,0,.7) 100%)}
.hero-content{position:absolute;inset:0;z-index:4;display:flex;flex-direction:column;align-items:center;justify-content:center;
  text-align:center;padding:0 6%;background:linear-gradient(rgba(0,0,0,.25),rgba(0,0,0,.05) 40%,rgba(0,0,0,.4))}
.hero-kicker{color:var(--amber);letter-spacing:.45em;text-transform:uppercase;font-size:.78rem;font-weight:700;margin-bottom:16px;text-shadow:0 2px 14px #000}
.hero-content h1{font-size:clamp(2.6rem,8vw,6.2rem);letter-spacing:.06em;text-shadow:0 6px 40px rgba(0,0,0,.85)}
.hero-content h1 span{color:var(--amber)}
.hero-sub{max-width:56ch;color:#dfe9e3;margin:18px auto 30px;text-shadow:0 2px 18px #000}
.hero-cta{display:flex;gap:16px;flex-wrap:wrap;justify-content:center}
.scroll-hint{position:absolute;bottom:26px;left:50%;transform:translateX(-50%);z-index:4;display:flex;flex-direction:column;
  align-items:center;gap:6px;color:#e8f0ec;font-size:.75rem;letter-spacing:.28em;text-transform:uppercase;text-shadow:0 2px 10px #000}
.scroll-hint i{font-style:normal;animation:bob 1.6s infinite}
@keyframes bob{50%{transform:translateY(7px)}}
.pov-hud{position:absolute;inset:0;z-index:4;pointer-events:none;opacity:0;font-family:ui-monospace,SFMono-Regular,Menlo,monospace}
.hud-top{position:absolute;top:calc(var(--lb,0vh) + 18px);left:50%;transform:translateX(-50%);display:flex;gap:12px;align-items:center;
  background:rgba(0,0,0,.45);border:1px solid rgba(255,255,255,.15);border-radius:999px;padding:8px 18px;font-size:.75rem;
  letter-spacing:.14em;color:#d8ffe9;backdrop-filter:blur(4px);white-space:nowrap}
.hud-rec{width:9px;height:9px;border-radius:50%;background:#ff4b4b;animation:blink 1s infinite}
@keyframes blink{50%{opacity:.25}}
.hud-speed b{color:var(--amber)}
.captions{position:absolute;inset:0;z-index:4;pointer-events:none}
.hud-caption{position:absolute;bottom:calc(var(--lb,0vh) + 34px);left:50%;transform:translateX(-50%);width:min(680px,86%);
  text-align:center;font-size:clamp(.95rem,1.6vw,1.15rem);color:#f2fff6;text-shadow:0 2px 14px #000;opacity:0;letter-spacing:.04em}
.end-fade{position:absolute;inset:0;background:var(--bg);opacity:0;z-index:5;pointer-events:none}
.loading-3d{position:absolute;inset:0;z-index:6;display:flex;align-items:center;justify-content:center;
  background:var(--bg);color:var(--amber);letter-spacing:.3em;text-transform:uppercase;font-size:.8rem;transition:opacity .6s}
.loading-3d.hidden{opacity:0;pointer-events:none}

/* ============ BANNER CITA ============ */
.banner{position:relative;padding:140px 6%;text-align:center;overflow:hidden;
  background:linear-gradient(135deg,#0d1a12,#1a2e1f 50%,#0d1a12)}
.banner::before{content:'🦕';position:absolute;font-size:40vh;opacity:.04;top:50%;left:50%;transform:translate(-50%,-50%)}
.banner blockquote,.banner p{position:relative}
.banner blockquote{font-family:var(--font-title);font-size:clamp(1.6rem,4vw,3rem);color:#fff;text-shadow:0 4px 30px #000}
.banner p{color:var(--amber);letter-spacing:.3em;text-transform:uppercase;font-size:.78rem;margin-top:14px}

/* ============ EL MUSEO ============ */
.two-col{display:grid;grid-template-columns:1.05fr .95fr;gap:56px;align-items:center}
.checklist{list-style:none;margin-top:22px;display:grid;gap:10px}
.checklist li{padding-left:30px;position:relative;color:var(--muted)}
.checklist li::before{content:'✓';position:absolute;left:0;color:var(--lime);font-weight:800}
.stats{display:grid;grid-template-columns:1fr 1fr;gap:18px}
.stat{background:var(--card);border:1px solid var(--line);border-radius:var(--radius);padding:28px 20px;text-align:center}
.stat-num{font-family:var(--font-title);font-size:2.4rem;color:var(--amber);display:block;line-height:1.1}
.stat-label{color:var(--muted);font-size:.85rem}

/* ============ TARJETAS EXPOSICIONES (visuales CSS, sin fotos) ============ */
.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(255px,1fr));gap:22px;margin-top:44px}
.card{background:var(--card);border:1px solid var(--line);border-radius:var(--radius);overflow:hidden;transition:.35s;display:flex;flex-direction:column}
.card:hover{transform:translateY(-6px);border-color:rgba(255,179,71,.35);box-shadow:0 22px 50px rgba(0,0,0,.5)}
.card-visual{height:210px;width:100%;position:relative;overflow:hidden}
.card-visual::after{content:'';position:absolute;inset:0;background:linear-gradient(transparent 55%,rgba(0,0,0,.5))}
.v-rex{background:radial-gradient(circle at 60% 40%,#3a2e1a,#1a1408); }
.v-rex::before{content:'🦖';position:absolute;font-size:7rem;left:50%;top:45%;transform:translate(-50%,-50%);filter:drop-shadow(0 8px 20px #000)}
.v-sauropod{background:linear-gradient(180deg,#2a3a2e,#14201a)}
.v-sauropod::before{content:'🦕';position:absolute;font-size:7rem;left:50%;top:45%;transform:translate(-50%,-50%);filter:drop-shadow(0 8px 20px #000)}
.v-cretacico{background:radial-gradient(circle at 50% 50%,#2e3a1a,#0f1408)}
.v-cretacico::before{content:'🌿🦖🌿';position:absolute;font-size:4rem;left:50%;top:45%;transform:translate(-50%,-50%);letter-spacing:.2em}
.v-lab{background:linear-gradient(135deg,#1a2428,#0d1418)}
.v-lab::before{content:'🔬🦴';position:absolute;font-size:5rem;left:50%;top:45%;transform:translate(-50%,-50%);letter-spacing:.3em}
.card-body{padding:22px;display:flex;flex-direction:column;gap:10px;flex:1}
.card h3{font-size:1.12rem}
.card p{color:var(--muted);font-size:.93rem;flex:1}
.tag{align-self:flex-start;font-size:.68rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;padding:6px 12px;
  border-radius:999px;background:rgba(159,214,107,.1);color:var(--lime);border:1px solid rgba(159,214,107,.3)}
.notes{margin-top:26px;color:var(--muted);font-size:.88rem}

/* ============ GALERÍA (generada con gradientes CSS) ============ */
.gallery{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-top:50px}
.gallery figure{position:relative;border-radius:14px;overflow:hidden;aspect-ratio:4/3;border:1px solid var(--line)}
.g-img{width:100%;height:100%;transition:.6s}
.g1{background:radial-gradient(circle at 50% 60%,#3a2e1a,#0d0a05)}
.g1::before{content:'🦖';position:absolute;font-size:5rem;left:50%;top:45%;transform:translate(-50%,-50%)}
.g2{background:radial-gradient(circle at 50% 50%,#4a3a20,#1a1208)}
.g2::before{content:'💀';position:absolute;font-size:5rem;left:50%;top:45%;transform:translate(-50%,-50%)}
.g3{background:radial-gradient(circle at 50% 40%,#1a2a3a,#050a14)}
.g3::before{content:'🌙🦕';position:absolute;font-size:4rem;left:50%;top:45%;transform:translate(-50%,-50%);letter-spacing:.2em}
.g4{background:linear-gradient(180deg,#2a3a2e,#0d1410)}
.g4::before{content:'🦕';position:absolute;font-size:5rem;left:50%;top:45%;transform:translate(-50%,-50%)}
.gallery figure{position:relative}
.gallery figure:hover .g-img{transform:scale(1.08)}
.gallery figcaption{position:absolute;left:0;right:0;bottom:0;padding:30px 14px 10px;font-size:.78rem;color:var(--text);z-index:2;
  background:linear-gradient(transparent,rgba(0,0,0,.85))}

/* ============ EXPERIENCIAS ============ */
.exp-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:22px;margin-top:44px}
.exp{background:var(--card);border:1px solid var(--line);border-left:4px solid var(--amber);border-radius:14px;padding:26px;
  display:flex;flex-direction:column;gap:12px}
.exp-vr{background:linear-gradient(rgba(13,26,18,.85),rgba(10,15,13,.92)),radial-gradient(circle at 50% 50%,#2e3a1a,#0a0f0d)}
.exp-head{display:flex;align-items:center;gap:12px}
.exp-icon{font-size:1.6rem}
.exp h3{font-size:1.08rem;flex:1}
.price-chip{background:rgba(255,179,71,.1);color:var(--amber);border:1px solid rgba(255,179,71,.3);padding:5px 12px;
  border-radius:999px;font-weight:800;font-size:.85rem;white-space:nowrap}
.price-chip.free{background:rgba(159,214,107,.1);color:var(--lime);border-color:rgba(159,214,107,.3)}
.exp p{color:var(--muted);font-size:.92rem;flex:1}
.exp-meta{display:flex;gap:14px;flex-wrap:wrap;font-size:.8rem;color:#cfe0d6}
.times{display:flex;gap:8px;flex-wrap:wrap;list-style:none}
.times li{font-family:ui-monospace,Menlo,monospace;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.12);
  padding:4px 10px;border-radius:8px;font-size:.8rem}

/* ============ PRECIOS ============ */
.prices{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:22px;margin-top:44px}
.price-card{background:var(--card);border:1px solid var(--line);border-radius:var(--radius);padding:30px 26px;
  display:flex;flex-direction:column;gap:14px;position:relative;overflow:hidden;transition:.3s}
.price-card:hover{transform:translateY(-5px);border-color:rgba(255,179,71,.3)}
.price-card h3{font-size:1rem;letter-spacing:.06em;text-transform:uppercase}
.amount{font-family:var(--font-title);font-size:2.7rem;line-height:1}
.amount sup{font-size:1.2rem;color:var(--amber)}
.price-card ul{list-style:none;display:grid;gap:8px;color:var(--muted);font-size:.9rem;flex:1;align-content:start}
.price-card li{padding-left:20px;position:relative}
.price-card li::before{content:'▸';position:absolute;left:0;color:var(--amber)}
.price-card.featured{border-color:var(--amber);background:linear-gradient(180deg,rgba(255,179,71,.08),var(--card))}
.ribbon{position:absolute;top:16px;right:-38px;transform:rotate(35deg);background:var(--amber);color:#201302;font-size:.66rem;
  font-weight:800;letter-spacing:.12em;padding:6px 44px;text-transform:uppercase}

/* ============ HORARIOS ============ */
.sched-grid{display:grid;grid-template-columns:1fr 1.5fr;gap:26px;margin-top:44px}
.table-card{background:var(--card);border:1px solid var(--line);border-radius:var(--radius);padding:26px}
.table-card h3{margin-bottom:16px;font-size:1.08rem}
.table-scroll{overflow-x:auto}
table{width:100%;border-collapse:collapse;font-size:.92rem;min-width:420px}
th{text-align:left;font-size:.7rem;letter-spacing:.18em;text-transform:uppercase;color:var(--amber);padding:10px 12px;border-bottom:1px solid var(--line)}
td{padding:12px;border-bottom:1px solid var(--line);color:var(--muted);vertical-align:top}
tr:last-child td{border-bottom:0}
td b{color:var(--text)}
.pill{display:inline-block;padding:3px 10px;border-radius:999px;font-size:.72rem;font-weight:700;white-space:nowrap}
.pill.inc{background:rgba(159,214,107,.12);color:var(--lime)}
.pill.extra{background:rgba(255,179,71,.1);color:var(--amber)}

/* ============ VISITA ============ */
.visit-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:22px;margin-top:44px}
.vcard{background:var(--card);border:1px solid var(--line);border-radius:var(--radius);padding:26px}
.vcard h3{font-size:1rem;margin-bottom:12px;color:var(--amber)}
.vcard ul{list-style:none;display:grid;gap:8px}
.vcard li{color:var(--muted);font-size:.92rem}

/* ============ FOOTER ============ */
footer{background:#070b09;border-top:1px solid var(--line);padding:70px 0 30px}
.foot-grid{display:grid;grid-template-columns:1.3fr 1fr 1fr 1fr;gap:34px}
.foot-grid h4{font-size:.78rem;letter-spacing:.22em;text-transform:uppercase;color:var(--amber);margin-bottom:14px}
.foot-grid a{color:var(--muted);text-decoration:none;display:block;padding:4px 0;font-size:.9rem}
.foot-grid a:hover{color:var(--amber)}
.foot-bottom{margin-top:46px;padding-top:22px;border-top:1px solid var(--line);color:#7d948a;font-size:.8rem;
  display:flex;justify-content:space-between;gap:14px;flex-wrap:wrap}

/* ============ REVEAL AL SCROLL ============ */
.js .reveal{opacity:0;transform:translateY(26px);transition:opacity .8s ease,transform .8s ease}
.js .reveal.visible{opacity:1;transform:none}

/* ============ RESPONSIVE ============ */
@media(max-width:900px){
  .nav{position:fixed;top:64px;left:0;right:0;flex-direction:column;background:rgba(11,16,14,.97);padding:26px;gap:18px;
    transform:translateY(-140%);transition:.4s;backdrop-filter:blur(10px)}
  .nav.open{transform:none}
  .nav-toggle{display:flex}
  .two-col,.sched-grid{grid-template-columns:1fr}
  .gallery{grid-template-columns:1fr 1fr}
  .foot-grid{grid-template-columns:1fr 1fr}
  .section{padding:80px 0}
}
@media(max-width:520px){
  .stats{grid-template-columns:1fr 1fr}
  .gallery{grid-template-columns:1fr}
  .hud-top{font-size:.62rem;padding:6px 12px}
}
@media(prefers-reduced-motion:reduce){
  html{scroll-behavior:auto}
  .scroll-hint i,.hud-rec{animation:none}
  .js .reveal{transition:none;opacity:1;transform:none}
}
