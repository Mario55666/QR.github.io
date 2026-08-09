/* =========================================================================
   app.js — QUIZ (PWA). Router, editor visual tipo Kahoot, QR y motor de juego
   con funciones interactivas (apuestas, racha, XP/niveles, logros, estadísticas).
   Estilo Bauhaus / DesignQuizz. Todo sin servidor: el cuestionario viaja en el QR.
   ========================================================================= */
(function () {
  "use strict";

  var P = window.QAParse;
  var APP = document.getElementById("app");

  // Contraseña docente por defecto: "docente2026" (cámbiala tras entrar).
  var DEFAULT_HASH = "849018898d5676cde9c6723b4604bd196d65e33c25304ec6e71fd7cc56af9a98";

  // ----------------------------- iconos -----------------------------
  var I = {
    student: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10L12 5 2 10l10 5 10-5z"/><path d="M6 12v5c0 1 2.7 3 6 3s6-2 6-3v-5"/></svg>',
    teacher: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="13" rx="1"/><path d="M3 20h18"/><path d="M8 9h8M8 12h5"/></svg>',
    qr: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 3h8v8H3V3zm2 2v4h4V5H5zm8-2h8v8h-8V3zm2 2v4h4V5h-4zM3 13h8v8H3v-8zm2 2v4h4v-4H5zm10-2h2v2h-2v-2zm4 0h2v2h-2v-2zm-4 4h2v2h-2v-2zm2 2h2v2h-2v-2zm2-2h2v2h-2v-2z"/></svg>',
    play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M5 3l16 9L5 21z"/></svg>',
    upload: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 16V4M7 9l5-5 5 5M4 20h16"/></svg>',
    download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v12M7 11l5 5 5-5M4 20h16"/></svg>',
    copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="12" height="12" rx="1"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12l5 5L20 6"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"/></svg>',
    lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="10" width="16" height="11" rx="1"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>',
    trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/></svg>',
    install: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 8v6M9 11l3 3 3-3"/></svg>',
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/></svg>',
    sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19"/></svg>',
    moon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
    dup: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="12" height="12" rx="1"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>',
    image: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9.5" r="1.5"/><path d="M21 16l-5-5L5 20"/></svg>',
    chart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg>',
    trophy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/></svg>',
    flame: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2s5 4.5 5 10a5 5 0 0 1-10 0c0-1.5.5-2.7 1-3.5C8 10 9 12 9 12s-1-6 3-10z"/></svg>',
    coin: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>',
  };
  // Formas geométricas (posición de respuesta)
  var GLYPH = [
    '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3l9 16H3z"/></svg>',
    '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l10 10-10 10L2 12z"/></svg>',
    '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>',
    '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="18" height="18"/></svg>',
    '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3 6.5 7 .6-5.3 4.6 1.6 6.9L12 17.6 5.7 20.6l1.6-6.9L2 9.1l7-.6z"/></svg>',
    '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3l7 4v10l-7 4-7-4V7z"/></svg>',
  ];
  var KEYS = ["1", "2", "3", "4", "5", "6"];

  // Logros
  var ACHV = [
    { id: "inicio", em: "🎬", t: "Primera partida", d: "Juega tu primer cuestionario", test: function (s) { return s.games >= 1; } },
    { id: "racha5", em: "🔥", t: "En racha", d: "Consigue una racha de 5", test: function (s) { return s.bestStreak >= 5; } },
    { id: "perfecto", em: "🌟", t: "Sin fallos", d: "Termina con 100% de aciertos", test: function (s) { return s.perfect; } },
    { id: "nivel5", em: "🚀", t: "Nivel 5", d: "Alcanza el nivel 5", test: function (s) { return level(s.xp) >= 5; } },
    { id: "ricacho", em: "💰", t: "Gran apostador", d: "Llega a 5000 en modo apuesta", test: function (s) { return s.maxBank >= 5000; } },
    { id: "veterano", em: "🏆", t: "Veterano", d: "Completa 10 partidas", test: function (s) { return s.games >= 10; } },
  ];

  // ----------------------------- utilidades -----------------------------
  function el(html) { var d = document.createElement("div"); d.innerHTML = html.trim(); return d.firstChild; }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }

  function toast(msg, kind) {
    var wrap = document.getElementById("toasts");
    var t = el('<div class="toast ' + (kind || "") + '">' + (kind === "rojo" ? I.x : I.check) + "<span>" + esc(msg) + "</span></div>");
    wrap.appendChild(t);
    setTimeout(function () { t.style.opacity = "0"; t.style.transition = "opacity .3s"; setTimeout(function () { t.remove(); }, 300); }, 2400);
  }

  // ----------------------------- almacenamiento -----------------------------
  var STORE = "qr_quiz_v1";
  var db = { teacherHash: "", library: [], scores: {}, theme: "", name: "", stats: null };
  function defStats() { return { xp: 0, games: 0, correct: 0, questions: 0, bestScore: 0, bestStreak: 0, maxBank: 0, perfect: false, achievements: [], history: [] }; }
  function saveDb() { try { localStorage.setItem(STORE, JSON.stringify(db)); } catch (e) {} }
  function loadDb() {
    try { var r = localStorage.getItem(STORE); if (r) db = Object.assign(db, JSON.parse(r)); } catch (e) {}
    if (!db.stats) db.stats = defStats();
  }

  // XP / nivel
  function level(xp) { return Math.floor(Math.sqrt((xp || 0) / 100)) + 1; }
  function xpForLevel(l) { return (l - 1) * (l - 1) * 100; }

  // ----------------------------- hash contraseña -----------------------------
  async function sha256Hex(str) {
    if (window.crypto && crypto.subtle) {
      var buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
      return Array.from(new Uint8Array(buf)).map(function (b) { return b.toString(16).padStart(2, "0"); }).join("");
    }
    var h = 5381; for (var i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) >>> 0;
    return "x" + h.toString(16);
  }
  function currentHash() { return db.teacherHash || DEFAULT_HASH; }

  // ----------------------------- codificación cuestionario -----------------------------
  function packQuiz(quiz) {
    return {
      t: quiz.title || "",
      q: (quiz.questions || []).map(function (q) {
        var o = { x: q.text, c: q.choices, a: q.correct };
        if (q.time && q.time !== 20) o.s = q.time;
        if (q.type && q.type !== "quiz") o.k = q.type === "truefalse" ? "v" : "m";
        if (q.points === "double") o.p = 2; else if (q.points === "none") o.p = 0;
        if (q.emoji) o.e = q.emoji;
        if (q.image) o.g = q.image;
        return o;
      }),
    };
  }
  function unpackQuiz(p) {
    return {
      title: p.t || "",
      questions: (p.q || []).map(function (o) {
        return {
          text: o.x || "", choices: o.c || [], correct: o.a || [],
          time: o.s || 20,
          type: o.k === "v" ? "truefalse" : o.k === "m" ? "multi" : "quiz",
          points: o.p === 2 ? "double" : o.p === 0 ? "none" : "std",
          emoji: o.e || "", image: o.g || "",
        };
      }),
    };
  }
  function b64url(bytes) {
    var bin = ""; for (var i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }
  function unb64url(s) {
    s = s.replace(/-/g, "+").replace(/_/g, "/"); while (s.length % 4) s += "=";
    var bin = atob(s), a = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) a[i] = bin.charCodeAt(i);
    return a;
  }
  async function encodeQuiz(quiz) {
    var json = JSON.stringify(packQuiz(quiz));
    var bytes = new TextEncoder().encode(json);
    if (typeof CompressionStream !== "undefined") {
      var cs = new CompressionStream("deflate-raw");
      var stream = new Blob([bytes]).stream().pipeThrough(cs);
      var comp = new Uint8Array(await new Response(stream).arrayBuffer());
      return "1" + b64url(comp);
    }
    return "0" + b64url(bytes);
  }
  async function decodeQuiz(str) {
    var flag = str[0], data = unb64url(str.slice(1)), bytes = data;
    if (flag === "1") {
      if (typeof DecompressionStream === "undefined") throw new Error("Este navegador no puede descomprimir el cuestionario.");
      var ds = new DecompressionStream("deflate-raw");
      var stream = new Blob([data]).stream().pipeThrough(ds);
      bytes = new Uint8Array(await new Response(stream).arrayBuffer());
    }
    return unpackQuiz(JSON.parse(new TextDecoder().decode(bytes)));
  }
  function shareURL(payload) { return location.origin + location.pathname + "#j=" + payload; }

  // ----------------------------- QR -----------------------------
  function makeQR(text) {
    var levels = ["M", "L"];
    for (var i = 0; i < levels.length; i++) {
      try { var qr = qrcode(0, levels[i]); qr.addData(text); qr.make(); return qr; } catch (e) {}
    }
    return null;
  }
  function qrSVG(qr, size) {
    size = size || 320;
    var n = qr.getModuleCount(), quiet = 2, total = n + quiet * 2, cell = size / total, rects = "";
    for (var r = 0; r < n; r++) for (var c = 0; c < n; c++) {
      if (qr.isDark(r, c)) rects += '<rect x="' + ((c + quiet) * cell).toFixed(2) + '" y="' + ((r + quiet) * cell).toFixed(2) + '" width="' + cell.toFixed(2) + '" height="' + cell.toFixed(2) + '"/>';
    }
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + size + " " + size + '" shape-rendering="crispEdges"><rect width="' + size + '" height="' + size + '" fill="#ffffff"/><g fill="#111111">' + rects + "</g></svg>";
  }

  // ----------------------------- modelo de pregunta / cuestionario -----------------------------
  function newQuestion() { return { text: "", choices: ["", "", "", ""], correct: [], time: 20, points: "std", type: "quiz", emoji: "", image: "" }; }
  function newDraft() { return { title: "", questions: [newQuestion()] }; }
  function qReady(q) {
    var filled = q.choices.filter(function (c) { return (c || "").trim(); }).length;
    return (q.text || "").trim() && filled >= 2 && q.correct.length >= 1 && q.correct.every(function (i) { return q.choices[i] && q.choices[i].trim(); });
  }

  // =====================================================================
  //  ROUTER
  // =====================================================================
  var teacherUnlocked = false;

  function parseHash() {
    var h = location.hash || "";
    if (h.indexOf("#j=") === 0) return { view: "play", payload: h.slice(3) };
    if (h === "#docente") return { view: "teacher" };
    if (h === "#unirse") return { view: "join" };
    if (h === "#progreso") return { view: "stats" };
    return { view: "home" };
  }
  function route() {
    var r = parseHash();
    if (r.view === "play") return viewPlayLoad(r.payload);
    if (r.view === "teacher") return viewTeacher();
    if (r.view === "join") return viewJoin();
    if (r.view === "stats") return viewStats();
    return viewHome();
  }
  window.addEventListener("hashcha" + "nge", route);
  function go(hash) { if (location.hash === hash) route(); else location.hash = hash; }

  // ----------------------------- cabecera / pie -----------------------------
  function chrome(inner) {
    var isDark = document.documentElement.getAttribute("data-theme") === "dark";
    return (
      '<header class="topbar"><div class="wrap">' +
      '<a class="logo" href="#inicio"><span class="logo-mark"><i></i><i></i><i></i><i></i></span>' +
      '<span class="logo-txt">QUIZ<small>ACCESO POR QR</small></span></a>' +
      '<nav class="topnav">' +
      '<button data-nav="inicio">' + I.home + "<span>Inicio</span></button>" +
      '<button data-nav="unirse">' + I.student + "<span>Unirme</span></button>" +
      '<button data-nav="progreso">' + I.chart + "<span>Progreso</span></button>" +
      '<button data-nav="docente">' + I.teacher + "<span>Docente</span></button>" +
      '<button data-theme title="Cambiar tema" aria-label="Cambiar tema">' + (isDark ? I.sun : I.moon) + "</button>" +
      "</nav></div></header>" +
      '<main><div class="wrap">' + inner + "</div></main>" +
      '<footer class="footer"><div class="wrap"><span>QUIZ · PWA offline</span><span>Bauhaus / DesignQuizz</span><span>Instalable · Acceso por QR</span></div></footer>'
    );
  }
  function paint(inner) {
    // cierra cualquier modal o juego activo al cambiar de vista
    document.querySelectorAll(".modal-back").forEach(function (m) { m.remove(); });
    if (typeof Game !== "undefined" && Game.abort) Game.abort();
    APP.innerHTML = chrome(inner);
    APP.querySelectorAll("[data-nav]").forEach(function (b) {
      b.addEventListener("click", function () { var n = b.dataset.nav; go(n === "inicio" ? "#inicio" : "#" + n); });
    });
    var tb = APP.querySelector("[data-theme]"); if (tb) tb.addEventListener("click", toggleTheme);
    window.scrollTo(0, 0);
  }

  // =====================================================================
  //  VISTA: INICIO
  // =====================================================================
  function viewHome() {
    paint(
      '<div class="eyebrow">Cuestionarios interactivos</div>' +
      '<h1 class="display">La forma<br>sigue a la<br>función.</h1>' +
      '<p class="lead">Diseña cuestionarios tipo concurso con un editor visual, compártelos por código QR y juégalos con apuestas, rachas, niveles y logros. Funciona sin conexión y se instala como aplicación.</p>' +
      installBar() +
      '<div class="routes">' +
      '<section class="route"><span class="swatch sw-rojo"></span><span class="route-tag">Para estudiantes</span>' +
      "<h2>Unirme a un<br>cuestionario</h2>" +
      '<p class="help">Escanea el código QR que proyecta tu docente, o pega el enlace que te compartió.</p>' +
      '<div class="fill"></div><button class="btn btn-rojo btn-lg" data-go="unirse">' + I.student + " Unirme ahora</button></section>" +
      '<section class="route"><span class="swatch sw-azul"></span><span class="route-tag">Para docentes</span>' +
      "<h2>Crear y<br>compartir</h2>" +
      '<p class="help">Escribe tus preguntas en un editor visual o impórtalas desde Word, Markdown o CSV, y genera al instante un QR.</p>' +
      '<div class="fill"></div><button class="btn btn-azul btn-lg" data-go="docente">' + I.teacher + " Entrar como docente</button></section>" +
      "</div>" +
      steps()
    );
    APP.querySelectorAll("[data-go]").forEach(function (b) { b.addEventListener("click", function () { go("#" + b.dataset.go); }); });
    wireInstall();
  }
  function steps() {
    var s = [
      ["01", "Crea", "El docente escribe las preguntas en el editor visual o las importa desde un archivo."],
      ["02", "Comparte", "La app genera un enlace y un código QR que contiene el cuestionario completo."],
      ["03", "Juega", "Los estudiantes escanean y juegan con apuestas, racha, XP, niveles y logros."],
    ].map(function (x) {
      return '<div class="slab"><div class="index-num" style="font-size:34px">' + x[0] + "</div><h3 style=\"margin:8px 0;font-size:20px\">" + x[1] + '</h3><p class="help">' + x[2] + "</p></div>";
    }).join("");
    return '<div class="mt-5"><div class="eyebrow">Cómo funciona</div><div class="routes" style="border-width:2px">' +
      '<div style="display:grid;grid-template-columns:1fr 1fr 1fr" class="steps">' + s + "</div></div></div>";
  }
  function installBar() {
    return '<div class="install-bar hidden" id="installbar"><strong>' + I.install + " Instalar aplicación</strong>" +
      '<span class="help" style="color:inherit">Añádela a tu pantalla de inicio para usarla sin conexión.</span>' +
      '<button class="btn btn-negro btn-sm" id="installbtn">Instalar</button></div>';
  }

  // =====================================================================
  //  VISTA: UNIRME
  // =====================================================================
  function viewJoin() {
    paint(
      '<div class="eyebrow">Estudiante</div><h1 class="display" style="font-size:clamp(34px,6vw,64px)">Unirme al<br>cuestionario</h1>' +
      '<div class="slab mt-5" style="max-width:640px">' +
      '<div class="field"><label class="label">Pega el enlace o el código QR que te compartieron</label>' +
      '<textarea class="textarea" id="joinlink" placeholder="https://…#j=…  o el texto del código"></textarea>' +
      '<p class="help">Si escaneas el QR con la cámara del teléfono, se abrirá solo — no necesitas pegar nada.</p></div>' +
      '<button class="btn btn-rojo btn-lg btn-block" id="joinbtn">' + I.play + " Entrar</button></div>"
    );
    APP.querySelector("#joinbtn").addEventListener("click", function () {
      var v = (APP.querySelector("#joinlink").value || "").trim();
      if (!v) { toast("Pega el enlace o el código", "rojo"); return; }
      var payload = v, idx = v.indexOf("#j=");
      if (idx >= 0) payload = v.slice(idx + 3);
      payload = payload.trim().replace(/\s+/g, "");
      go("#j=" + payload);
    });
  }

  // =====================================================================
  //  VISTA: JUGAR (carga desde payload)
  // =====================================================================
  function viewPlayLoad(payload) {
    paint('<div class="slab"><div class="eyebrow">Cargando…</div><h2 class="h-section">Preparando el cuestionario</h2></div>');
    decodeQuiz(payload).then(function (quiz) {
      if (!quiz.questions || !quiz.questions.length) throw new Error("El cuestionario está vacío.");
      startIntro(quiz, payload);
    }).catch(function (err) {
      paint('<div class="slab"><div class="eyebrow" style="color:var(--rojo)">Enlace no válido</div>' +
        '<h2 class="h-section">No pudimos abrir el cuestionario</h2>' +
        '<p class="help mt-3">' + esc(err.message || "El código está incompleto o dañado.") + "</p>" +
        '<button class="btn btn-negro mt-3" data-home>Volver al inicio</button></div>');
      APP.querySelector("[data-home]").addEventListener("click", function () { go("#inicio"); });
    });
  }

  function startIntro(quiz, payload) {
    var n = quiz.questions.filter(qReady).length || quiz.questions.length;
    paint(
      '<div class="eyebrow">Cuestionario</div>' +
      '<h1 class="display" style="font-size:clamp(30px,6vw,66px)">' + esc(quiz.title || "Sin título") + "</h1>" +
      '<div class="slab mt-5" style="max-width:600px">' +
      '<div class="between"><span class="index-num" style="font-size:28px">' + n + '</span><span class="help">' + (n === 1 ? "pregunta" : "preguntas") + "</span></div>" +
      '<div class="field mt-3"><label class="label">Tu nombre</label>' +
      '<input class="input input-xl" id="pname" maxlength="20" placeholder="Escribe tu nombre" value="' + esc(db.name || "") + '"></div>' +
      '<div class="field"><label class="label">Modo de juego</label>' +
      '<div class="seg" id="modeseg" style="width:100%"><button class="on" data-mode="clasico" style="flex:1">Clásico</button>' +
      '<button data-mode="apuesta" style="flex:1">' + I.coin + " Apuesta</button></div>" +
      '<p class="help">En <strong>Apuesta</strong> empiezas con 1000 fichas y arriesgas antes de responder; la racha multiplica lo que ganas.</p></div>' +
      '<label class="label" style="display:flex;gap:10px;align-items:center;text-transform:none;font-weight:600"><input type="checkbox" id="pshuffle"> Barajar el orden de las preguntas</label>' +
      '<button class="btn btn-rojo btn-lg btn-block mt-3" id="startbtn">' + I.play + " Empezar</button></div>"
    );
    var mode = "clasico";
    APP.querySelectorAll("[data-mode]").forEach(function (b) {
      b.addEventListener("click", function () { mode = b.dataset.mode; APP.querySelectorAll("[data-mode]").forEach(function (x) { x.classList.remove("on"); }); b.classList.add("on"); });
    });
    APP.querySelector("#startbtn").addEventListener("click", function () {
      var name = (APP.querySelector("#pname").value || "").trim() || "Estudiante";
      db.name = name; saveDb();
      Game.start(quiz, { name: name, shuffle: APP.querySelector("#pshuffle").checked, payload: payload, mode: mode });
    });
  }

  // =====================================================================
  //  VISTA: PROGRESO (estadísticas / gamificación)
  // =====================================================================
  function viewStats() {
    var s = db.stats || defStats();
    var lv = level(s.xp), inLv = s.xp - xpForLevel(lv), need = xpForLevel(lv + 1) - xpForLevel(lv);
    var avg = s.history.length ? Math.round(s.history.reduce(function (a, h) { return a + h.score; }, 0) / s.history.length) : 0;
    var acc = s.questions ? Math.round((s.correct / s.questions) * 100) : 0;
    var achv = ACHV.map(function (a) {
      var got = s.achievements.indexOf(a.id) >= 0;
      return '<div class="achv ' + (got ? "got" : "") + '"><span class="em">' + a.em + '</span><span><span class="t">' + a.t + '</span><br><span class="d">' + a.d + "</span></span></div>";
    }).join("");
    var hist = s.history.slice(0, 8).map(function (h) {
      return '<div class="between" style="border-top:2px solid var(--linea);padding:8px 0"><span style="font-weight:700">' + esc(h.title || "Cuestionario") +
        '<span class="help" style="margin:0 0 0 8px;display:inline">' + (h.mode === "apuesta" ? "Apuesta" : "Clásico") + " · " + (h.acc || 0) + '%</span></span><span class="tnum" style="font-weight:900;color:var(--azul)">' + h.score + "</span></div>";
    }).join("") || '<p class="help">Aún no has jugado ninguna partida.</p>';

    paint(
      '<div class="eyebrow">Tu progreso</div><h1 class="display" style="font-size:clamp(32px,6vw,60px)">Progreso</h1>' +
      '<div class="slab mt-5"><div class="xp-wrap"><div class="level-chip">N' + lv + "</div>" +
      '<div style="flex:1"><div class="between"><span class="xp-lab">Nivel ' + lv + " · " + s.xp + ' XP</span><span class="xp-lab">' + inLv + " / " + need + ' para nivel ' + (lv + 1) + '</span></div>' +
      '<div class="xp-bar"><div class="xp-fill" style="width:' + (need ? Math.round((inLv / need) * 100) : 0) + '%"></div></div></div></div></div>' +
      '<div class="dash mt-3">' +
      '<div class="d azul"><div class="n tnum">' + s.games + '</div><div class="l">Partidas</div></div>' +
      '<div class="d"><div class="n tnum">' + acc + '%</div><div class="l">Precisión global</div></div>' +
      '<div class="d azul"><div class="n tnum">' + s.bestScore + '</div><div class="l">Mejor puntuación</div></div>' +
      '<div class="d rojo"><div class="n tnum">' + s.bestStreak + '</div><div class="l">Mejor racha</div></div>' +
      '<div class="d"><div class="n tnum">' + avg + '</div><div class="l">Media</div></div>' +
      '<div class="d"><div class="n tnum">' + s.maxBank + '</div><div class="l">Banca máx.</div></div>' +
      "</div>" +
      '<div class="mt-5"><div class="eyebrow">Logros ' + s.achievements.length + " / " + ACHV.length + '</div><div class="achv-grid">' + achv + "</div></div>" +
      '<div class="mt-5"><div class="eyebrow">Historial reciente</div><div class="slab">' + hist + "</div></div>" +
      '<div class="mt-3"><button class="btn btn-sm btn-danger" id="resetstats">' + I.trash + " Borrar mi progreso</button></div>"
    );
    APP.querySelector("#resetstats").addEventListener("click", function () {
      if (!confirm("¿Borrar todo tu progreso (XP, niveles, logros, historial)?")) return;
      db.stats = defStats(); saveDb(); viewStats(); toast("Progreso borrado");
    });
  }

  // =====================================================================
  //  VISTA: DOCENTE  (editor visual tipo Kahoot)
  // =====================================================================
  function viewTeacher() { if (!teacherUnlocked) return teacherGate(); teacherEditor(); }

  function teacherGate() {
    paint(
      '<div class="eyebrow">Acceso restringido</div>' +
      '<h1 class="display" style="font-size:clamp(34px,6vw,64px)">Panel del<br>docente</h1>' +
      '<div class="slab mt-5" style="max-width:460px">' +
      '<div class="field"><label class="label">' + I.lock + ' Contraseña</label>' +
      '<input class="input input-xl" type="password" id="pw" placeholder="Contraseña" autocomplete="current-password"></div>' +
      '<button class="btn btn-azul btn-lg btn-block" id="enter">Entrar</button>' +
      '<p class="help mt-3">Contraseña inicial: <strong>docente2026</strong> — cámbiala al entrar. Es una reja de aula del lado del navegador, no un sistema de seguridad.</p>' +
      "</div>"
    );
    var pw = APP.querySelector("#pw");
    function tryEnter() {
      sha256Hex(pw.value).then(function (h) {
        if (h === currentHash()) { teacherUnlocked = true; teacherEditor(); }
        else { toast("Contraseña incorrecta", "rojo"); pw.value = ""; pw.focus(); }
      });
    }
    APP.querySelector("#enter").addEventListener("click", tryEnter);
    pw.addEventListener("keydown", function (e) { if (e.key === "Enter") tryEnter(); });
    pw.focus();
  }

  var draft = null;   // cuestionario en edición
  var editIx = 0;     // pregunta activa

  function teacherEditor() {
    if (!draft) draft = newDraft();
    editIx = clamp(editIx, 0, draft.questions.length - 1);
    var q = draft.questions[editIx];

    paint(
      '<div class="editor-top">' +
      '<input class="title-in" id="etitle" placeholder="Ingresar título…" value="' + esc(draft.title) + '">' +
      '<button class="btn btn-sm" data-import>' + I.upload + " Importar</button>" +
      '<button class="btn btn-sm" data-lib>Biblioteca</button>' +
      '<button class="btn btn-sm" data-save>Guardar</button>' +
      '<button class="btn btn-sm" data-test>' + I.play + " Probar</button>" +
      '<button class="btn btn-sm btn-azul" data-qr>' + I.qr + " Generar QR</button>" +
      '<button class="btn btn-sm" data-changepw title="Cambiar clave">' + I.lock + "</button>" +
      '<button class="btn btn-sm" data-logout>Salir</button>' +
      "</div>" +
      '<div class="ed-grid">' + railHTML() + '<div class="ed-main" id="edmain">' + mainHTML(q) + "</div></div>"
    );

    // top actions
    APP.querySelector("#etitle").addEventListener("input", function (e) { draft.title = e.target.value; });
    APP.querySelector("[data-logout]").addEventListener("click", function () { teacherUnlocked = false; draft = null; editIx = 0; go("#inicio"); });
    APP.querySelector("[data-changepw]").addEventListener("click", changePassword);
    APP.querySelector("[data-import]").addEventListener("click", openImport);
    APP.querySelector("[data-lib]").addEventListener("click", openLibrary);
    APP.querySelector("[data-save]").addEventListener("click", saveDraft);
    APP.querySelector("[data-test]").addEventListener("click", function () {
      var ready = draft.questions.filter(qReady);
      if (!ready.length) { toast("Completa al menos una pregunta para probar", "rojo"); return; }
      Game.start({ title: draft.title, questions: ready }, { name: db.name || "Docente", shuffle: false, preview: true, mode: "clasico" });
    });
    APP.querySelector("[data-qr]").addEventListener("click", openQrModal);
    bindRail();
    bindMain();
  }

  function railHTML() {
    var typeShort = { quiz: "Única", multi: "Múltiple", truefalse: "V/F" };
    var thumbs = draft.questions.map(function (q, i) {
      var ready = qReady(q);
      return '<button class="q-thumb ' + (i === editIx ? "on" : "") + '" data-q="' + i + '"><span class="n">' + (i + 1) + '</span>' +
        '<span class="tt"><span class="qx">' + (esc(q.text) || '<span class="warn">Sin texto</span>') + '</span>' +
        '<span class="meta">' + typeShort[q.type] + " · " + q.time + "s" + (ready ? "" : ' · <span class="warn">incompleta</span>') + "</span></span></button>";
    }).join("");
    return '<div class="q-rail"><div class="rail-head">Preguntas · ' + draft.questions.length + "</div>" + thumbs +
      '<div class="row" style="gap:8px"><button class="btn btn-sm btn-azul" data-addq style="flex:1">' + I.plus + " Añadir</button></div></div>";
  }

  function mainHTML(q) {
    var isTF = q.type === "truefalse", isMulti = q.type === "multi";
    var media;
    if (q.image) media = '<div class="media"><button class="btn btn-sm rmmedia" data-rmmedia>' + I.x + '</button><img src="' + esc(q.image) + '" alt=""></div>';
    else if (q.emoji) media = '<div class="media"><button class="btn btn-sm rmmedia" data-rmmedia>' + I.x + '</button><div class="emoji-big">' + esc(q.emoji) + "</div></div>";
    else media = '<div class="media"><div><div class="hint">' + I.image + " Multimedia (opcional)</div>" +
      '<div class="row"><input class="emoji-in" id="emojiin" maxlength="4" placeholder="🙂"><button class="btn btn-sm" data-pickimg>' + I.image + " Imagen</button>" +
      '<input type="file" id="imgfile" accept="image/*" hidden></div></div></div>';

    var tiles = q.choices.map(function (c, i) {
      var on = q.correct.indexOf(i) >= 0;
      return '<div class="ans-edit p' + i + '"><span class="glyph">' + GLYPH[i] + "</span>" +
        '<input class="atext" data-atext="' + i + '" value="' + esc(c) + '" placeholder="Añadir respuesta ' + (i + 1) + (i > 1 ? " (opcional)" : "") + '"' + (isTF ? " readonly" : "") + ">" +
        '<button class="cor ' + (on ? "on" : "") + '" data-cor="' + i + '" title="Marcar correcta" aria-label="Marcar correcta">' + I.check + "</button>" +
        (!isTF && q.choices.length > 2 ? '<button class="del" data-del="' + i + '" title="Quitar">' + I.trash + "</button>" : "") + "</div>";
    }).join("");

    return '<textarea class="q-input" id="qtext" maxlength="240" placeholder="Escribe tu pregunta">' + esc(q.text) + "</textarea>" +
      media +
      '<div class="ans-grid">' + tiles + "</div>" +
      (!isTF && q.choices.length < 6 ? '<button class="btn btn-sm mt-3" data-addans>' + I.plus + " Añadir más respuestas</button>" : "") +
      '<div class="ed-settings">' +
      '<div class="f"><span class="label">Tipo</span><div class="seg" id="typeseg">' +
      '<button class="' + (q.type === "quiz" ? "on" : "") + '" data-type="quiz">Única</button>' +
      '<button class="' + (isMulti ? "on" : "") + '" data-type="multi">Varias</button>' +
      '<button class="' + (isTF ? "on" : "") + '" data-type="truefalse">V/F</button></div></div>' +
      '<div class="f"><span class="label">Tiempo</span><select class="select" id="qtime" style="width:auto">' +
      [5, 10, 20, 30, 45, 60, 90, 120].map(function (t) { return '<option value="' + t + '"' + (q.time === t ? " selected" : "") + ">" + t + " s</option>"; }).join("") + "</select></div>" +
      '<div class="f"><span class="label">Puntos</span><select class="select" id="qpts" style="width:auto">' +
      '<option value="std"' + (q.points === "std" ? " selected" : "") + ">Estándar</option>" +
      '<option value="double"' + (q.points === "double" ? " selected" : "") + ">Dobles</option>" +
      '<option value="none"' + (q.points === "none" ? " selected" : "") + ">Sin puntos</option></select></div>" +
      '<div class="f" style="margin-left:auto"><span class="label">' + (isMulti ? "Marca todas las correctas" : "Marca la correcta") + "</span></div>" +
      "</div>";
  }

  function remain(fn) { // re-render solo el panel principal
    var q = draft.questions[editIx];
    APP.querySelector("#edmain").innerHTML = mainHTML(q);
    APP.querySelector(".ed-grid").replaceChild(el(railHTML()), APP.querySelector(".q-rail"));
    bindRail(); bindMain();
    if (fn) fn();
  }

  function bindRail() {
    APP.querySelectorAll("[data-q]").forEach(function (b) { b.addEventListener("click", function () { editIx = +b.dataset.q; remain(); }); });
    var add = APP.querySelector("[data-addq]");
    if (add) add.addEventListener("click", function () { draft.questions.push(newQuestion()); editIx = draft.questions.length - 1; remain(); });
  }

  function bindMain() {
    var q = draft.questions[editIx];
    var qt = APP.querySelector("#qtext");
    qt.addEventListener("input", function () {
      q.text = qt.value;
      var thumb = APP.querySelector('.q-thumb[data-q="' + editIx + '"] .qx');
      if (thumb) thumb.textContent = q.text || "Sin texto";
    });
    APP.querySelectorAll("[data-atext]").forEach(function (inp) {
      inp.addEventListener("input", function () { q.choices[+inp.dataset.atext] = inp.value; });
    });
    APP.querySelectorAll("[data-cor]").forEach(function (b) {
      b.addEventListener("click", function () {
        var i = +b.dataset.cor;
        if (q.type === "multi") { var at = q.correct.indexOf(i); if (at >= 0) q.correct.splice(at, 1); else q.correct.push(i); }
        else q.correct = [i];
        remain();
      });
    });
    APP.querySelectorAll("[data-del]").forEach(function (b) {
      b.addEventListener("click", function () {
        var i = +b.dataset.del; if (q.choices.length <= 2) return;
        q.choices.splice(i, 1);
        q.correct = q.correct.filter(function (c) { return c !== i; }).map(function (c) { return c > i ? c - 1 : c; });
        remain();
      });
    });
    var addans = APP.querySelector("[data-addans]");
    if (addans) addans.addEventListener("click", function () { if (q.choices.length < 6) { q.choices.push(""); remain(); } });
    APP.querySelectorAll("[data-type]").forEach(function (b) { b.addEventListener("click", function () { changeType(b.dataset.type); }); });
    APP.querySelector("#qtime").addEventListener("change", function (e) { q.time = +e.target.value; remain(); });
    APP.querySelector("#qpts").addEventListener("change", function (e) { q.points = e.target.value; });
    // media
    var emojiin = APP.querySelector("#emojiin");
    if (emojiin) emojiin.addEventListener("change", function () { q.emoji = emojiin.value.trim(); if (q.emoji) remain(); });
    var pickimg = APP.querySelector("[data-pickimg]"), imgfile = APP.querySelector("#imgfile");
    if (pickimg) pickimg.addEventListener("click", function () { imgfile.click(); });
    if (imgfile) imgfile.addEventListener("change", function () { if (imgfile.files[0]) loadImage(imgfile.files[0], q); });
    var rm = APP.querySelector("[data-rmmedia]");
    if (rm) rm.addEventListener("click", function () { q.image = ""; q.emoji = ""; remain(); });
  }

  function changeType(type) {
    var q = draft.questions[editIx];
    if (q.type === type) return;
    if (type === "truefalse") { q.choices = ["Verdadero", "Falso"]; q.correct = q.correct.filter(function (c) { return c < 2; }); if (!q.correct.length) q.correct = [0]; }
    else { if (q.type === "truefalse") { q.choices = ["", "", "", ""]; q.correct = []; } if (type === "quiz" && q.correct.length > 1) q.correct = [q.correct[0]]; }
    q.type = type; remain();
  }

  function loadImage(file, q) {
    if (file.size > 500000) { toast("Imagen muy pesada (máx 500 KB para que quepa en el QR)", "rojo"); }
    var rd = new FileReader();
    rd.onload = function () { q.image = rd.result; q.emoji = ""; remain(); };
    rd.readAsDataURL(file);
  }

  function saveDraft() {
    var ready = draft.questions.filter(qReady);
    if (!ready.length) { toast("Completa al menos una pregunta para guardar", "rojo"); return; }
    db.library = db.library || [];
    db.library.unshift({ id: "L" + Date.now(), title: draft.title || "Cuestionario", questions: JSON.parse(JSON.stringify(draft.questions)), date: Date.now() });
    db.library = db.library.slice(0, 30); saveDb();
    toast("Guardado en tu biblioteca");
  }

  // ---- Importar (Word / Markdown / CSV / pegar) ----
  function openImport() {
    var m = openModal(
      "<h3>Importar preguntas</h3><p class=\"help\">Se añaden a las preguntas actuales. Formatos: Word (.docx), Markdown (.md) o CSV.</p>" +
      '<div class="dropzone mt-3" id="idz"><div class="big">' + I.upload + " Arrastra o elige un archivo</div>" +
      '<button class="btn btn-negro mt-3" id="ipick">Elegir archivo</button><input type="file" id="ifile" accept=".docx,.md,.markdown,.csv,.tsv,.txt" hidden></div>' +
      '<div class="field mt-3"><label class="label">…o pega el texto (Markdown / CSV)</label><textarea class="textarea" id="ipaste" style="min-height:120px" placeholder="## ¿Pregunta?\n- [x] correcta\n- [ ] otra"></textarea></div>' +
      '<div class="between"><div class="stack gap-2"><button class="btn btn-sm" data-tpl="md">Plantilla MD</button><button class="btn btn-sm" data-tpl="csv">Plantilla CSV</button></div>' +
      '<div class="modal-actions" style="margin:0"><button class="btn" data-cancel>Cerrar</button><button class="btn btn-azul" id="iproc">Procesar</button></div></div>'
    );
    var ifile = m.querySelector("#ifile"), idz = m.querySelector("#idz");
    m.querySelector("#ipick").addEventListener("click", function () { ifile.click(); });
    ifile.addEventListener("change", function () { if (ifile.files[0]) importFile(ifile.files[0], m); });
    ["dragover", "dragenter"].forEach(function (ev) { idz.addEventListener(ev, function (e) { e.preventDefault(); idz.classList.add("drag"); }); });
    ["dragleave", "drop"].forEach(function (ev) { idz.addEventListener(ev, function (e) { e.preventDefault(); idz.classList.remove("drag"); }); });
    idz.addEventListener("drop", function (e) { var f = e.dataTransfer.files[0]; if (f) importFile(f, m); });
    m.querySelector("#iproc").addEventListener("click", function () {
      var txt = m.querySelector("#ipaste").value;
      if (!txt.trim()) { toast("Pega texto o elige un archivo", "rojo"); return; }
      var isCsv = /[,;\t].*[,;\t]/.test(txt.split(/\r?\n/)[0] || "");
      appendImported((isCsv ? P.parseCSV(txt) : P.parsePlain(txt)), m);
    });
    m.querySelectorAll("[data-tpl]").forEach(function (b) {
      b.addEventListener("click", function () {
        var md = "# Mi cuestionario\n\n## ¿Cuál es la capital de Perú?\n- [x] Lima\n- [ ] Cusco\n- [ ] Arequipa\n\n## Selecciona los números pares\n- [x] 2\n- [ ] 3\n- [x] 4";
        var csv = "pregunta,opcion1,opcion2,opcion3,correcta,tiempo\n\"¿Capital de Perú?\",Lima,Cusco,Quito,1,20\n\"¿2 + 2?\",3,4,5,2,15";
        m.querySelector("#ipaste").value = b.dataset.tpl === "md" ? md : csv;
      });
    });
    m.querySelector("[data-cancel]").addEventListener("click", function () { m.remove(); });
  }
  function importFile(f, m) {
    var name = f.name || "archivo", ext = (name.split(".").pop() || "").toLowerCase();
    if (ext === "docx") {
      f.arrayBuffer().then(function (ab) { return P.parseDocx(ab); }).then(function (r) { appendImported(r, m); })
        .catch(function (e) { toast("No se pudo leer el Word: " + (e.message || e), "rojo"); });
    } else {
      var rd = new FileReader();
      rd.onload = function () { P.parseFile(name, rd.result, null).then(function (r) { appendImported(r, m); }).catch(function (e) { toast("Error: " + (e.message || e), "rojo"); }); };
      rd.readAsText(f);
    }
  }
  function appendImported(res, m) {
    var qs = (res.questions || []).filter(P.isValid).map(function (q) { return { text: q.text, choices: q.choices, correct: q.correct, time: q.time || 20, points: q.points || "std", type: q.type || "quiz", emoji: q.emoji || "", image: "" }; });
    if (!qs.length) { toast("No se detectaron preguntas válidas", "rojo"); return; }
    // si el borrador está vacío (1 pregunta en blanco), reemplaza; si no, añade
    var onlyEmpty = draft.questions.length === 1 && !qReady(draft.questions[0]);
    if (onlyEmpty) draft.questions = qs; else draft.questions = draft.questions.concat(qs);
    if (!draft.title && res.title) draft.title = res.title;
    editIx = draft.questions.length - 1;
    if (m) m.remove();
    teacherEditor();
    toast(qs.length + (qs.length === 1 ? " pregunta importada" : " preguntas importadas"));
  }

  // ---- Biblioteca ----
  function openLibrary() {
    var list = (db.library || []).map(function (q) {
      return '<div class="between" style="border-top:2px solid var(--linea);padding:10px 0"><span style="font-weight:700">' + esc(q.title) +
        '<span class="help" style="display:inline;margin:0 0 0 8px">' + q.questions.length + " preg.</span></span>" +
        '<span class="stack gap-2" style="flex-direction:row"><button class="btn btn-sm" data-libopen="' + q.id + '">Abrir</button>' +
        '<button class="btn btn-sm btn-danger" data-libdel="' + q.id + '">' + I.trash + "</button></span></div>";
    }).join("") || '<p class="help">Aún no has guardado cuestionarios.</p>';
    var m = openModal("<h3>Tu biblioteca</h3><p class=\"help\">Guardada en este dispositivo.</p><div class=\"mt-3\">" + list + '</div><div class="modal-actions"><button class="btn" data-cancel>Cerrar</button></div>');
    m.querySelector("[data-cancel]").addEventListener("click", function () { m.remove(); });
    m.querySelectorAll("[data-libopen]").forEach(function (b) {
      b.addEventListener("click", function () {
        var q = db.library.find(function (x) { return x.id === b.dataset.libopen; });
        if (q) { draft = { title: q.title, questions: JSON.parse(JSON.stringify(q.questions)) }; editIx = 0; m.remove(); teacherEditor(); }
      });
    });
    m.querySelectorAll("[data-libdel]").forEach(function (b) {
      b.addEventListener("click", function () { db.library = db.library.filter(function (x) { return x.id !== b.dataset.libdel; }); saveDb(); m.remove(); openLibrary(); });
    });
  }

  // ---- Generar QR (modal) ----
  function openQrModal() {
    var ready = draft.questions.filter(qReady);
    if (!ready.length) { toast("Completa al menos una pregunta", "rojo"); return; }
    var m = openModal('<h3>Acceso al cuestionario</h3><p class="help">' + ready.length + " pregunta(s) lista(s). Genera el código para tu clase.</p>" +
      '<div id="qrbody" class="mt-3"><p class="help">Generando…</p></div>' +
      '<div class="modal-actions"><button class="btn" data-cancel>Cerrar</button></div>');
    m.querySelector("[data-cancel]").addEventListener("click", function () { m.remove(); });
    var quiz = { title: draft.title || "Cuestionario", questions: ready };
    encodeQuiz(quiz).then(function (payload) {
      var url = shareURL(payload), body = m.querySelector("#qrbody"), qr = makeQR(url);
      if (!qr) {
        body.innerHTML = '<div class="note rojo">' + I.x + " Demasiado grande para un QR (" + url.length + " caracteres" + (quiz.questions.some(function (q) { return q.image; }) ? ", quizá por las imágenes" : "") +
          "). El <strong>enlace</strong> funciona igual.</div>" + linkLine(url);
        wireLinkLine(url, m); return;
      }
      var svg = qrSVG(qr, 320);
      body.innerHTML = '<div class="qr-box"><div id="qrsvg">' + svg + '</div><div class="help" style="color:#111">Escanea para jugar · ' + quiz.questions.length + " preguntas</div></div>" +
        '<div class="row mt-3"><button class="btn btn-sm" id="dlsvg">' + I.download + ' SVG</button><button class="btn btn-sm" id="dlpng">' + I.download + ' PNG</button>' +
        '<button class="btn btn-sm" id="openplay">' + I.play + ' Abrir</button></div>' + linkLine(url);
      wireLinkLine(url, m);
      m.querySelector("#dlsvg").addEventListener("click", function () { downloadText((quiz.title || "quiz") + "-qr.svg", svg, "image/svg+xml"); });
      m.querySelector("#dlpng").addEventListener("click", function () { svgToPng(svg, 800, (quiz.title || "quiz") + "-qr.png"); });
      m.querySelector("#openplay").addEventListener("click", function () { window.open(url, "_blank"); });
    }).catch(function (e) { m.querySelector("#qrbody").innerHTML = '<div class="note rojo">Error: ' + esc(e.message || e) + "</div>"; });
  }
  function linkLine(url) { return '<div class="link-line mt-3"><input id="sharelink" readonly value="' + esc(url) + '"><button id="copylink">' + I.copy + " Copiar</button></div>"; }
  function wireLinkLine(url, root) {
    var b = (root || APP).querySelector("#copylink"); if (!b) return;
    b.addEventListener("click", function () {
      (root || APP).querySelector("#sharelink").select();
      (navigator.clipboard ? navigator.clipboard.writeText(url) : Promise.reject()).then(function () { toast("Enlace copiado"); })
        .catch(function () { try { document.execCommand("copy"); toast("Enlace copiado"); } catch (e) { toast("Copia manual", "rojo"); } });
    });
  }

  function changePassword() {
    var m = openModal(
      "<h3>Cambiar contraseña</h3><p class=\"help\">Se guarda solo en este dispositivo (como hash).</p>" +
      '<div class="field mt-3"><label class="label">Nueva contraseña</label><input class="input" type="password" id="np1"></div>' +
      '<div class="field"><label class="label">Repite la contraseña</label><input class="input" type="password" id="np2"></div>' +
      '<div class="modal-actions"><button class="btn" data-cancel>Cancelar</button><button class="btn btn-azul" data-ok>Guardar</button></div>'
    );
    m.querySelector("[data-cancel]").addEventListener("click", function () { m.remove(); });
    m.querySelector("[data-ok]").addEventListener("click", function () {
      var a = m.querySelector("#np1").value, b = m.querySelector("#np2").value;
      if (a.length < 4) { toast("Mínimo 4 caracteres", "rojo"); return; }
      if (a !== b) { toast("No coinciden", "rojo"); return; }
      sha256Hex(a).then(function (h) { db.teacherHash = h; saveDb(); m.remove(); toast("Contraseña actualizada"); });
    });
  }

  // =====================================================================
  //  MOTOR DE JUEGO (con apuestas, racha, XP, logros)
  // =====================================================================
  var Game = (function () {
    var g = null, root = null, timer = null;

    function start(quiz, opts) {
      var qs = quiz.questions.filter(qReady).map(function (q) { return JSON.parse(JSON.stringify(q)); });
      if (!qs.length) { toast("El cuestionario no tiene preguntas completas", "rojo"); return; }
      if (opts.shuffle) qs = shuffle(qs);
      g = { quiz: quiz, opts: opts, qs: qs, i: 0, score: 0, streak: 0, best: 0, correct: 0, answers: [], phase: "q", picked: [], answered: false, total: 0, t0: 0, xpGain: 0 };
      if (opts.mode === "apuesta") { g.bank = 1000; g.wager = 200; g.maxBank = 1000; }
      root = el('<div class="game"></div>'); document.body.appendChild(root);
      document.addEventListener("keydown", keys);
      renderQ();
    }
    function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
    function mult() { return 1 + Math.min(Math.max(g.streak - 1, 0), 5) * 0.2; }

    function keys(e) {
      if (!g) return;
      if (e.key === "Escape") return quit();
      if (g.phase === "q") { var n = parseInt(e.key, 10); var q = g.qs[g.i]; if (n >= 1 && n <= q.choices.length) pick(n - 1); }
      else if (g.phase === "fb" && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); next(); }
    }

    function topbar() {
      var pct = (g.i / g.qs.length) * 100;
      var right = g.opts.mode === "apuesta"
        ? '<div class="cell bankcell">' + I.coin + " " + g.bank + "</div>"
        : '<div class="cell tnum" id="scorecell">' + g.score + "</div>";
      return '<div class="game-top"><button class="game-quit cell" data-quit>' + I.back + " Salir</button>" +
        '<div class="cell prog"><div class="prog-track"><div class="prog-fill" style="width:' + pct + '%"></div></div></div>' +
        '<div class="cell tnum">' + (g.i + 1) + " / " + g.qs.length + "</div>" + right + "</div>";
    }

    function renderQ() {
      var q = g.qs[g.i]; g.phase = "q"; g.answered = false; g.picked = [];
      var multi = q.type === "multi";
      var kind = q.type === "truefalse" ? "Verdadero o Falso" : multi ? "Elige todas las correctas" : "Elige una respuesta";
      var media = q.image ? '<img src="' + esc(q.image) + '" alt="" style="max-height:150px;max-width:100%;border:var(--borde) solid var(--linea)">' : (q.emoji ? '<div class="q-emoji">' + esc(q.emoji) + "</div>" : "");
      var answers = q.choices.map(function (c, i) {
        return '<button class="answer p' + i + '" data-a="' + i + '"><span class="glyph">' + GLYPH[i] + "</span>" +
          '<span class="lab">' + esc(c) + '</span><span class="key">' + KEYS[i] + "</span></button>";
      }).join("");
      var bet = g.opts.mode === "apuesta" ? betBar() : "";
      root.innerHTML = topbar() +
        '<div class="game-stage"><div class="q-zone">' +
        '<div class="timer" id="timer"><div class="fillbar" id="fillbar" style="height:100%"></div><div class="num" id="tnum">' + q.time + '</div><div class="lab">seg</div></div>' +
        '<div class="q-statement"><div class="q-kind">' + kind + (g.streak >= 2 ? '  ·  <span class="mult-badge hot">' + I.flame + " x" + mult().toFixed(1) + "</span>" : "") + "</div>" + media +
        '<div class="q-text">' + esc(q.text) + "</div></div></div>" + bet +
        '<div class="answers" id="answers">' + answers + "</div>" +
        (multi ? '<button class="btn btn-azul btn-lg" id="confirm">' + I.check + " Confirmar</button>" : "") +
        "</div>";
      root.querySelector("[data-quit]").addEventListener("click", quit);
      root.querySelectorAll("[data-a]").forEach(function (b) { b.addEventListener("click", function () { multi ? toggle(+b.dataset.a, b) : pick(+b.dataset.a); }); });
      if (multi) root.querySelector("#confirm").addEventListener("click", confirmMulti);
      if (g.opts.mode === "apuesta") bindBet();
      startTimer(q.time);
    }

    function betBar() {
      return '<div class="bet-bar"><span class="bank">' + I.coin + " <span id=\"bankn\">" + g.bank + "</span></span>" +
        '<div class="wager-ctl"><span class="xp-lab">Apuesta</span><input type="range" id="wager" min="0" max="' + g.bank + '" step="50" value="' + Math.min(g.wager, g.bank) + '">' +
        '<span class="wnum" id="wnum">' + Math.min(g.wager, g.bank) + "</span></div>" +
        '<button class="qbtn" data-w="0">Nada</button><button class="qbtn" data-w="half">½</button><button class="qbtn" data-w="all">Todo</button></div>';
    }
    function bindBet() {
      var r = root.querySelector("#wager"), wn = root.querySelector("#wnum");
      function setW(v) { g.wager = clamp(Math.round(v), 0, g.bank); r.value = g.wager; wn.textContent = g.wager; }
      r.addEventListener("input", function () { setW(+r.value); });
      root.querySelectorAll("[data-w]").forEach(function (b) {
        b.addEventListener("click", function () { var d = b.dataset.w; setW(d === "all" ? g.bank : d === "half" ? g.bank / 2 : 0); });
      });
      setW(Math.min(g.wager, g.bank));
    }

    function toggle(i, btn) { var at = g.picked.indexOf(i); if (at >= 0) { g.picked.splice(at, 1); btn.classList.remove("sel"); } else { g.picked.push(i); btn.classList.add("sel"); } }
    function startTimer(secs) {
      clearInterval(timer); g.total = secs; g.t0 = performance.now();
      var fill = root.querySelector("#fillbar"), num = root.querySelector("#tnum"), tm = root.querySelector("#timer");
      timer = setInterval(function () {
        var left = Math.max(0, secs - (performance.now() - g.t0) / 1000);
        if (fill) fill.style.height = (left / secs) * 100 + "%";
        if (num) num.textContent = Math.ceil(left);
        if (tm) tm.classList.toggle("low", left <= secs * 0.25);
        if (left <= 0) { clearInterval(timer); if (!g.answered) resolve([], g.total); }
      }, 90);
    }
    function pick(i) { if (g.answered) return; resolve([i], (performance.now() - g.t0) / 1000); }
    function confirmMulti() { if (g.answered) return; if (!g.picked.length) { toast("Selecciona al menos una", "rojo"); return; } resolve(g.picked.slice(), (performance.now() - g.t0) / 1000); }

    function resolve(picked, elapsed) {
      g.answered = true; clearInterval(timer);
      var q = g.qs[g.i];
      var cs = q.correct.slice().sort(), ps = picked.slice().sort();
      var ok = ps.length === cs.length && ps.every(function (v, k) { return v === cs[k]; });
      var speed = clamp(1 - elapsed / (g.total * 2), 0.5, 1);
      var gained = 0, delta = 0;
      if (ok) {
        g.correct++; g.streak++; g.best = Math.max(g.best, g.streak);
        g.xpGain += 10 + Math.min(g.streak, 5) * 2;
        if (g.opts.mode === "apuesta") {
          var w = clamp(g.wager, 0, g.bank);
          delta = Math.round(w * mult() * (0.6 + 0.4 * speed));
          g.bank += delta; g.maxBank = Math.max(g.maxBank, g.bank); g.score = g.bank;
        } else if (q.points !== "none") {
          var base = q.points === "double" ? 2000 : 1000;
          gained = Math.round(base * speed); if (g.streak >= 2) gained += Math.min(g.streak - 1, 5) * 100;
          g.score += gained;
        }
      } else {
        g.streak = 0;
        if (g.opts.mode === "apuesta") {
          var lw = clamp(g.wager, 0, g.bank); g.bank = Math.max(0, g.bank - lw); delta = -lw;
          if (g.bank === 0) { g.bank = 100; g.rescued = true; } g.score = g.bank;
        }
      }
      g.answers.push({ text: q.text, ok: ok, gained: g.opts.mode === "apuesta" ? delta : gained });
      feedback(ok, g.opts.mode === "apuesta" ? delta : gained, q, picked);
    }

    function feedback(ok, val, q, picked) {
      g.phase = "fb";
      root.querySelectorAll("#answers [data-a]").forEach(function (b) {
        var i = +b.dataset.a; b.disabled = true;
        if (q.correct.indexOf(i) >= 0) b.classList.add("correct");
        else if (picked.indexOf(i) >= 0) b.classList.add("wrong-pick");
        else b.classList.add("wrong");
      });
      var cf = root.querySelector("#confirm"); if (cf) cf.remove();
      var sc = root.querySelector("#scorecell"); if (sc) sc.textContent = g.score;
      var bn = root.querySelector(".bankcell"); if (bn) bn.innerHTML = I.coin + " " + g.bank;
      var last = g.i + 1 >= g.qs.length;
      var streakHtml = ok && g.streak >= 2 ? '<span class="streak">' + I.flame + " x" + g.streak + "</span>" : "";
      var ptsTxt;
      if (g.opts.mode === "apuesta") ptsTxt = (val >= 0 ? "+" + val : val) + " fichas" + (g.rescued ? " · ¡Rescate!" : "");
      else ptsTxt = ok && val ? "+" + val + " puntos" : ok ? "¡Bien!" : "0 puntos";
      g.rescued = false;
      var v = el('<div class="verdict ' + (ok ? "ok" : "no") + '"><span class="tag">' + (ok ? "Correcto" : "Incorrecto") + "</span>" +
        '<span class="pts">' + ptsTxt + "</span>" + streakHtml +
        '<button class="btn ' + (ok ? "btn-azul" : "btn-negro") + '" id="next" style="margin-left:auto">' + (last ? "Ver resultado" : "Siguiente " + I.arrow) + "</button></div>");
      root.querySelector(".game-stage").appendChild(v);
      root.querySelector("#next").addEventListener("click", next);
    }

    function next() { if (g.i + 1 >= g.qs.length) return finish(); g.i++; renderQ(); }

    function finish() {
      clearInterval(timer);
      var total = g.qs.length, acc = Math.round((g.correct / total) * 100);
      // Estadísticas persistentes / XP / logros
      var s = db.stats || (db.stats = defStats());
      var lvBefore = level(s.xp);
      s.xp += g.xpGain; s.games += 1; s.correct += g.correct; s.questions += total;
      s.bestScore = Math.max(s.bestScore, g.score); s.bestStreak = Math.max(s.bestStreak, g.best);
      if (g.opts.mode === "apuesta") s.maxBank = Math.max(s.maxBank, g.maxBank || g.bank);
      if (acc === 100) s.perfect = true;
      s.history.unshift({ title: g.quiz.title, score: g.score, acc: acc, mode: g.opts.mode, date: Date.now() });
      s.history = s.history.slice(0, 30);
      var newAch = [];
      ACHV.forEach(function (a) { if (s.achievements.indexOf(a.id) < 0 && a.test(s)) { s.achievements.push(a.id); newAch.push(a); } });
      var lvAfter = level(s.xp), leveled = lvAfter > lvBefore;
      saveDb();

      // Mejores puntuaciones del cuestionario (por dispositivo)
      var key = g.opts.payload ? "p" + hash32(g.opts.payload) : "t" + hash32(g.quiz.title);
      db.scores = db.scores || {}; db.scores[key] = db.scores[key] || [];
      db.scores[key].push({ name: g.opts.name, score: g.score, acc: acc, date: Date.now() });
      db.scores[key].sort(function (a, b) { return b.score - a.score; });
      db.scores[key] = db.scores[key].slice(0, 20); saveDb();

      var grade = acc >= 90 ? "Excelente" : acc >= 70 ? "Muy bien" : acc >= 50 ? "Aprobado" : acc >= 30 ? "Sigue practicando" : "A repasar";
      var best = db.scores[key].slice(0, 5).map(function (x, i) {
        return '<div class="between" style="border-top:2px solid var(--linea);padding:8px 0"><span class="tnum" style="font-weight:800">' + (i + 1) + ". " + esc(x.name) +
          '</span><span class="tnum" style="font-weight:800;color:var(--azul)">' + x.score + "</span></div>";
      }).join("");
      var achHtml = newAch.length ? '<div class="mt-3"><div class="eyebrow">¡Logros desbloqueados!</div><div class="achv-grid">' +
        newAch.map(function (a) { return '<div class="achv got"><span class="em">' + a.em + '</span><span><span class="t">' + a.t + "</span></span></div>"; }).join("") + "</div>" : "";
      var lvHtml = leveled ? '<div class="mult-badge hot" style="font-size:15px;padding:8px 14px">' + I.flame + " ¡Subiste a nivel " + lvAfter + "!</div>" : "";

      root.innerHTML = topbarStatic() +
        '<div class="game-stage"><div class="result">' +
        '<div class="eyebrow">Resultado · ' + esc(g.opts.name) + (g.opts.mode === "apuesta" ? " · Apuesta" : "") + "</div>" +
        '<div class="score tnum">' + g.score + "</div>" +
        '<div class="between" style="justify-content:flex-start;gap:14px"><div class="index-num" style="font-size:22px;color:var(--rojo);text-transform:uppercase;font-weight:800">' + grade + "</div>" + lvHtml + "</div>" +
        '<div class="result-stats"><div class="rs azul"><div class="n tnum">' + g.correct + '</div><div class="l">Aciertos</div></div>' +
        '<div class="rs rojo"><div class="n tnum">' + (total - g.correct) + '</div><div class="l">Fallos</div></div>' +
        '<div class="rs"><div class="n tnum">' + acc + '%</div><div class="l">Precisión</div></div>' +
        '<div class="rs"><div class="n tnum">+' + g.xpGain + '</div><div class="l">XP ganada</div></div></div>' +
        achHtml +
        (best ? '<div class="mt-3"><div class="eyebrow">Mejores puntuaciones (este dispositivo)</div>' + best + "</div>" : "") +
        '<div class="row mt-3"><button class="btn btn-rojo btn-lg" id="again">' + I.play + " Jugar otra vez</button>" +
        '<button class="btn btn-lg" id="progress">' + I.chart + " Mi progreso</button>" +
        '<button class="btn btn-lg" id="exit">' + I.home + " Salir</button></div>" +
        "</div></div>";
      root.querySelector("#again").addEventListener("click", function () { var q = g.quiz, o = g.opts; cleanup(); start(q, o); });
      root.querySelector("#progress").addEventListener("click", function () { cleanup(); go("#progreso"); });
      root.querySelector("#exit").addEventListener("click", function () { var prev = g.opts.preview; cleanup(); go(prev ? "#docente" : "#inicio"); });
    }
    function topbarStatic() { return '<div class="game-top"><button class="game-quit cell" id="qq">' + I.back + ' Salir</button><div class="cell grow"></div><div class="cell">Resultado</div></div>'; }

    function quit() {
      if (g && g.phase !== "result" && !confirm("¿Salir del cuestionario? Se perderá el progreso.")) return;
      var prev = g && g.opts.preview; cleanup(); go(prev ? "#docente" : "#inicio");
    }
    function cleanup() { clearInterval(timer); document.removeEventListener("keydown", keys); if (root) root.remove(); root = null; g = null; }

    return { start: start, abort: function () { if (g || root) cleanup(); } };
  })();

  function hash32(s) { var h = 5381; for (var i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0; return h.toString(36); }

  // =====================================================================
  //  MODALES / TEMA / PWA / DESCARGAS
  // =====================================================================
  function openModal(html) {
    var back = el('<div class="modal-back"><div class="modal">' + html + "</div></div>");
    document.body.appendChild(back);
    back.addEventListener("click", function (e) { if (e.target === back) back.remove(); });
    var m = back.querySelector(".modal"); m.remove = function () { back.remove(); };
    return m;
  }
  function toggleTheme() {
    var cur = document.documentElement.getAttribute("data-theme");
    var next = cur === "dark" ? "light" : cur === "light" ? "dark" : (matchMedia("(prefers-color-scheme: dark)").matches ? "light" : "dark");
    document.documentElement.setAttribute("data-theme", next); db.theme = next; saveDb(); route();
  }
  function downloadText(name, text, mime) {
    var blob = new Blob([text], { type: mime || "text/plain" });
    var a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = safeName(name); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
  }
  function safeName(n) { return n.replace(/[^\w.\-]+/g, "-").toLowerCase(); }
  function svgToPng(svg, size, filename) {
    var img = new Image(); var blob = new Blob([svg], { type: "image/svg+xml" }); var url = URL.createObjectURL(blob);
    img.onload = function () {
      var cv = document.createElement("canvas"); cv.width = cv.height = size;
      var ctx = cv.getContext("2d"); ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, size, size);
      ctx.drawImage(img, 0, 0, size, size); URL.revokeObjectURL(url);
      cv.toBlob(function (b) { var a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = safeName(filename); a.click(); });
    };
    img.onerror = function () { toast("No se pudo generar el PNG; usa el SVG", "rojo"); };
    img.src = url;
  }

  var deferredPrompt = null;
  window.addEventListener("beforeinstallprompt", function (e) { e.preventDefault(); deferredPrompt = e; showInstall(); });
  function showInstall() { var b = document.getElementById("installbar"); if (b && deferredPrompt) b.classList.remove("hidden"); }
  function wireInstall() {
    if (deferredPrompt) showInstall();
    var btn = document.getElementById("installbtn");
    if (btn) btn.addEventListener("click", function () {
      if (!deferredPrompt) return; deferredPrompt.prompt();
      deferredPrompt.userChoice.finally(function () { deferredPrompt = null; var b = document.getElementById("installbar"); if (b) b.classList.add("hidden"); });
    });
  }

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () { navigator.serviceWorker.register("./sw.js").catch(function () {}); });
  }

  // =====================================================================
  //  ARRANQUE
  // =====================================================================
  loadDb();
  if (db.theme) document.documentElement.setAttribute("data-theme", db.theme);
  route();
})();
