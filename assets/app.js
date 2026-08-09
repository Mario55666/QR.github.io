/* =========================================================================
   app.js — QUIZ (PWA). Router, acceso docente, QR, y motor de juego.
   Estilo Bauhaus / Tipográfico Internacional. Todo funciona sin servidor:
   el cuestionario viaja codificado en el enlace/QR.
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
  var db = { teacherHash: "", library: [], scores: {}, theme: "", name: "" };
  function saveDb() { try { localStorage.setItem(STORE, JSON.stringify(db)); } catch (e) {} }
  function loadDb() { try { var r = localStorage.getItem(STORE); if (r) db = Object.assign(db, JSON.parse(r)); } catch (e) {} }

  // ----------------------------- hash contraseña -----------------------------
  async function sha256Hex(str) {
    if (window.crypto && crypto.subtle) {
      var buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
      return Array.from(new Uint8Array(buf)).map(function (b) { return b.toString(16).padStart(2, "0"); }).join("");
    }
    // Reserva (contexto no seguro): hash simple, suficiente como reja de aula
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
          emoji: o.e || "",
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
  function shareURL(payload) {
    return location.origin + location.pathname + "#j=" + payload;
  }

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

  // =====================================================================
  //  ROUTER
  // =====================================================================
  var teacherUnlocked = false;

  function parseHash() {
    var h = location.hash || "";
    if (h.indexOf("#j=") === 0) return { view: "play", payload: h.slice(3) };
    if (h.indexOf("j=") === 1) return { view: "play", payload: h.slice(3) };
    if (h === "#docente" || h === "#/docente") return { view: "teacher" };
    if (h === "#unirse" || h === "#/unirse") return { view: "join" };
    return { view: "home" };
  }

  function route() {
    var r = parseHash();
    if (r.view === "play") return viewPlayLoad(r.payload);
    if (r.view === "teacher") return viewTeacher();
    if (r.view === "join") return viewJoin();
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
      '<button data-nav="docente">' + I.teacher + "<span>Docente</span></button>" +
      '<button data-theme title="Cambiar tema" aria-label="Cambiar tema">' + (isDark ? I.sun : I.moon) + "</button>" +
      "</nav></div></header>" +
      "<main><div class=\"wrap\">" + inner + "</div></main>" +
      '<footer class="footer"><div class="wrap"><span>QUIZ · PWA offline</span><span>Bauhaus / Estilo Internacional</span><span>Instalable · Acceso por QR</span></div></footer>'
    );
  }
  function paint(inner) {
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
      '<p class="lead">Plataforma para diseñar y jugar cuestionarios tipo concurso. El docente carga las preguntas; los estudiantes acceden escaneando un código QR. Funciona sin conexión y se instala como aplicación.</p>' +
      installBar() +
      '<div class="routes">' +
      '<section class="route"><span class="swatch sw-rojo"></span><span class="route-tag">Para estudiantes</span>' +
      "<h2>Unirme a un<br>cuestionario</h2>" +
      '<p class="help">Escanea el código QR que proyecta tu docente, o pega el enlace que te compartió.</p>' +
      '<div class="fill"></div><button class="btn btn-rojo btn-lg" data-go="unirse">' + I.student + " Unirme ahora</button></section>" +
      '<section class="route"><span class="swatch sw-azul"></span><span class="route-tag">Para docentes</span>' +
      "<h2>Crear y<br>compartir</h2>" +
      '<p class="help">Carga tus preguntas desde Word, Markdown o CSV y genera al instante un QR para tu clase.</p>' +
      '<div class="fill"></div><button class="btn btn-azul btn-lg" data-go="docente">' + I.teacher + " Entrar como docente</button></section>" +
      "</div>" +
      steps()
    );
    APP.querySelectorAll("[data-go]").forEach(function (b) { b.addEventListener("click", function () { go("#" + b.dataset.go); }); });
    wireInstall();
  }

  function steps() {
    var s = [
      ["01", "Carga", "El docente sube un archivo Word, Markdown o CSV con las preguntas y respuestas."],
      ["02", "Genera", "La app crea un enlace y un código QR que contiene el cuestionario completo."],
      ["03", "Juega", "Los estudiantes escanean, responden contra el reloj y ven su puntuación."],
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
  //  VISTA: UNIRME (estudiante pega enlace/código)
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
      var payload = v;
      var idx = v.indexOf("#j=");
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
        '<p class="help mt-3">' + esc(err.message || "El código está incompleto o dañado. Pide a tu docente que te lo comparta de nuevo.") + "</p>" +
        '<button class="btn btn-negro mt-3" data-home>Volver al inicio</button></div>');
      APP.querySelector("[data-home]").addEventListener("click", function () { go("#inicio"); });
    });
  }

  function startIntro(quiz, payload) {
    var n = quiz.questions.length;
    paint(
      '<div class="eyebrow">Cuestionario</div>' +
      '<h1 class="display" style="font-size:clamp(30px,6vw,66px)">' + esc(quiz.title || "Sin título") + "</h1>" +
      '<div class="slab mt-5" style="max-width:560px">' +
      '<div class="between"><span class="index-num" style="font-size:28px">' + n + '</span><span class="help">' + (n === 1 ? "pregunta" : "preguntas") + "</span></div>" +
      '<div class="field mt-3"><label class="label">Tu nombre</label>' +
      '<input class="input input-xl" id="pname" maxlength="20" placeholder="Escribe tu nombre" value="' + esc(db.name || "") + '"></div>' +
      '<label class="label" style="display:flex;gap:10px;align-items:center;text-transform:none;font-weight:600"><input type="checkbox" id="pshuffle"> Barajar el orden de las preguntas</label>' +
      '<button class="btn btn-rojo btn-lg btn-block mt-3" id="startbtn">' + I.play + " Empezar</button></div>"
    );
    APP.querySelector("#startbtn").addEventListener("click", function () {
      var name = (APP.querySelector("#pname").value || "").trim() || "Estudiante";
      db.name = name; saveDb();
      var shuffle = APP.querySelector("#pshuffle").checked;
      Game.start(quiz, { name: name, shuffle: shuffle, payload: payload });
    });
  }

  // =====================================================================
  //  VISTA: DOCENTE
  // =====================================================================
  function viewTeacher() {
    if (!teacherUnlocked) return teacherGate();
    teacherPanel();
  }

  function teacherGate() {
    paint(
      '<div class="eyebrow">Acceso restringido</div>' +
      '<h1 class="display" style="font-size:clamp(34px,6vw,64px)">Panel del<br>docente</h1>' +
      '<div class="slab mt-5" style="max-width:460px">' +
      '<div class="field"><label class="label">' + I.lock + ' Contraseña</label>' +
      '<input class="input input-xl" type="password" id="pw" placeholder="••••••••" autocomplete="current-password"></div>' +
      '<button class="btn btn-azul btn-lg btn-block" id="enter">Entrar</button>' +
      '<p class="help mt-3">Contraseña inicial: <strong>docente2026</strong> — cámbiala al entrar. Es una reja de aula del lado del navegador, no un sistema de seguridad.</p>' +
      "</div>"
    );
    var pw = APP.querySelector("#pw");
    function tryEnter() {
      sha256Hex(pw.value).then(function (h) {
        if (h === currentHash()) { teacherUnlocked = true; teacherPanel(); }
        else { toast("Contraseña incorrecta", "rojo"); pw.value = ""; pw.focus(); }
      });
    }
    APP.querySelector("#enter").addEventListener("click", tryEnter);
    pw.addEventListener("keydown", function (e) { if (e.key === "Enter") tryEnter(); });
    pw.focus();
  }

  var draft = null; // cuestionario en edición { title, questions }

  function teacherPanel() {
    paint(
      '<div class="between"><div><div class="eyebrow">Docente</div><h1 class="display" style="font-size:clamp(28px,5vw,52px)">Cargar preguntas</h1></div>' +
      '<div class="stack gap-2"><button class="btn btn-sm" data-changepw>' + I.lock + ' Cambiar clave</button>' +
      '<button class="btn btn-sm" data-logout>Salir</button></div></div>' +
      '<div class="teacher-grid mt-5">' +
      // Columna izquierda: entrada
      "<div><div class=\"slab\">" +
      '<div class="between"><label class="label" style="margin:0">Fuente de preguntas</label>' +
      '<div class="seg" data-srcseg><button class="on" data-src="file">Archivo</button><button data-src="paste">Pegar texto</button></div></div>' +
      '<div id="srcfile" class="mt-3"><div class="dropzone" id="dz"><div class="big">' + I.upload + " Word · Markdown · CSV</div>" +
      '<p class="help">Arrastra tu archivo aquí o pulsa para elegir. Formatos: .docx, .md, .csv</p>' +
      '<button class="btn btn-negro mt-3" id="pickbtn">Elegir archivo</button>' +
      '<input type="file" id="file" accept=".docx,.md,.markdown,.csv,.tsv,.txt" hidden></div></div>' +
      '<div id="srcpaste" class="mt-3 hidden"><textarea class="textarea" id="pastebox" style="min-height:200px" placeholder="Pega aquí en formato Markdown o CSV…"></textarea>' +
      '<button class="btn btn-negro mt-3" id="parsepaste">Procesar texto</button></div>' +
      '<hr class="divider"><div class="between"><span class="help" style="margin:0">¿No sabes el formato?</span>' +
      '<div class="stack gap-2" style="align-items:flex-end"><button class="btn btn-sm" data-tpl="md">Plantilla Markdown</button>' +
      '<button class="btn btn-sm" data-tpl="csv">Plantilla CSV</button></div></div>' +
      "</div>" +
      '<div class="note mt-3">' + I.check + " Marca la respuesta correcta con <strong>[x]</strong> (Markdown), en <strong>negrita</strong> (Word) o con el número/letra en la columna <strong>correcta</strong> (CSV).</div>" +
      "</div>" +
      // Columna derecha: previsualización / salida
      '<div id="out"><div class="slab"><div class="eyebrow">Previsualización</div><h3 class="h-section">Aún no hay preguntas</h3>' +
      '<p class="help mt-3">Carga un archivo o pega el texto para ver aquí las preguntas y generar el código QR.</p>' +
      libraryList() + "</div></div>" +
      "</div>"
    );

    APP.querySelector("[data-logout]").addEventListener("click", function () { teacherUnlocked = false; draft = null; go("#inicio"); });
    APP.querySelector("[data-changepw]").addEventListener("click", changePassword);

    // segmento fuente
    APP.querySelectorAll("[data-src]").forEach(function (b) {
      b.addEventListener("click", function () {
        APP.querySelectorAll("[data-src]").forEach(function (x) { x.classList.remove("on"); });
        b.classList.add("on");
        APP.querySelector("#srcfile").classList.toggle("hidden", b.dataset.src !== "file");
        APP.querySelector("#srcpaste").classList.toggle("hidden", b.dataset.src !== "paste");
      });
    });
    // archivo
    var file = APP.querySelector("#file"), dz = APP.querySelector("#dz");
    APP.querySelector("#pickbtn").addEventListener("click", function () { file.click(); });
    file.addEventListener("change", function () { if (file.files[0]) handleFile(file.files[0]); });
    ["dragover", "dragenter"].forEach(function (ev) { dz.addEventListener(ev, function (e) { e.preventDefault(); dz.classList.add("drag"); }); });
    ["dragleave", "drop"].forEach(function (ev) { dz.addEventListener(ev, function (e) { e.preventDefault(); dz.classList.remove("drag"); }); });
    dz.addEventListener("drop", function (e) { var f = e.dataTransfer.files[0]; if (f) handleFile(f); });
    // pegar
    APP.querySelector("#parsepaste").addEventListener("click", function () {
      var txt = APP.querySelector("#pastebox").value;
      if (!txt.trim()) { toast("Pega algún texto", "rojo"); return; }
      var isCsv = /[,;\t].*[,;\t]/.test(txt.split(/\r?\n/)[0] || "");
      var res = isCsv ? P.parseCSV(txt) : P.parsePlain(txt);
      acceptDraft(res, "texto pegado");
    });
    // plantillas
    APP.querySelectorAll("[data-tpl]").forEach(function (b) { b.addEventListener("click", function () { loadTemplate(b.dataset.tpl); }); });
  }

  function handleFile(f) {
    var name = f.name || "archivo";
    var ext = (name.split(".").pop() || "").toLowerCase();
    if (ext === "docx") {
      f.arrayBuffer().then(function (ab) { return P.parseDocx(ab); })
        .then(function (res) { acceptDraft(res, name); })
        .catch(function (e) { toast("No se pudo leer el Word: " + (e.message || e), "rojo"); });
    } else {
      var rd = new FileReader();
      rd.onload = function () {
        P.parseFile(name, rd.result, null).then(function (res) { acceptDraft(res, name); })
          .catch(function (e) { toast("Error al procesar: " + (e.message || e), "rojo"); });
      };
      rd.readAsText(f);
    }
  }

  function loadTemplate(kind) {
    var md = "# Mi cuestionario\n\n## ¿Cuál es la capital de Perú?\n- [x] Lima\n- [ ] Cusco\n- [ ] Arequipa\n- [ ] Trujillo\n(tiempo: 20)\n\n## Selecciona los números pares\n- [x] 2\n- [ ] 3\n- [x] 4\n- [ ] 5\n\n## El agua hierve a 100°C a nivel del mar\n- [x] Verdadero\n- [ ] Falso";
    var csv = "pregunta,opcion1,opcion2,opcion3,opcion4,correcta,tiempo\n\"¿Cuál es la capital de Perú?\",Lima,Cusco,Arequipa,Trujillo,1,20\n\"¿2 + 2?\",3,4,5,,2,15\n\"El Sol es una estrella\",Verdadero,Falso,,,V,10";
    APP.querySelectorAll("[data-src]").forEach(function (x) { x.classList.toggle("on", x.dataset.src === "paste"); });
    APP.querySelector("#srcfile").classList.add("hidden");
    APP.querySelector("#srcpaste").classList.remove("hidden");
    APP.querySelector("#pastebox").value = kind === "md" ? md : csv;
    toast("Plantilla cargada — pulsa «Procesar texto»");
  }

  function acceptDraft(res, sourceName) {
    var qs = (res.questions || []).filter(P.isValid);
    if (!qs.length) {
      toast("No se detectaron preguntas válidas. Revisa el formato.", "rojo");
      return;
    }
    draft = { title: res.title || guessTitle(sourceName), questions: qs };
    renderDraft();
    toast(qs.length + (qs.length === 1 ? " pregunta cargada" : " preguntas cargadas"));
  }
  function guessTitle(name) { return (name || "Cuestionario").replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").trim() || "Cuestionario"; }

  function renderDraft() {
    var out = APP.querySelector("#out");
    var typeLabel = { quiz: "Opción única", multi: "Varias correctas", truefalse: "V/F" };
    var previews = draft.questions.map(function (q, i) {
      var opts = q.choices.map(function (c, ci) {
        var ok = q.correct.indexOf(ci) >= 0;
        return '<div class="opt ' + (ok ? "ok" : "") + '"><span class="mk">' + (ok ? I.check : "") + "</span><span>" + esc(c) + "</span></div>";
      }).join("");
      return '<div class="q-preview"><div class="q-head"><span class="n">' + (i + 1) + '</span><span class="qx">' + esc(q.text) +
        '</span><span class="q-meta">' + typeLabel[q.type] + " · " + q.time + "s</span></div>" + opts + "</div>";
    }).join("");

    out.innerHTML =
      '<div class="slab"><div class="between"><div><div class="eyebrow">Previsualización</div>' +
      '<div class="index-num" style="font-size:40px">' + draft.questions.length + '<span class="help" style="font-size:14px"> preguntas</span></div></div></div>' +
      '<div class="field mt-3"><label class="label">Título</label><input class="input" id="dtitle" value="' + esc(draft.title) + '"></div>' +
      '<div class="stack gap-2"><button class="btn btn-azul btn-block" id="genqr">' + I.qr + " Generar acceso (QR)</button>" +
      '<div class="row"><button class="btn" id="testplay">' + I.play + " Probar</button>" +
      '<button class="btn" id="savelib">Guardar</button></div></div>' +
      '<hr class="divider"><div id="qrout"></div>' +
      "<div style=\"max-height:420px;overflow:auto\" class=\"mt-3\">" + previews + "</div>" +
      "</div>";

    APP.querySelector("#dtitle").addEventListener("input", function (e) { draft.title = e.target.value; });
    APP.querySelector("#genqr").addEventListener("click", generateAccess);
    APP.querySelector("#testplay").addEventListener("click", function () {
      Game.start({ title: draft.title, questions: draft.questions }, { name: db.name || "Docente", shuffle: false, preview: true });
    });
    APP.querySelector("#savelib").addEventListener("click", function () {
      db.library = db.library || [];
      db.library.unshift({ id: "L" + Date.now(), title: draft.title, questions: draft.questions, date: Date.now() });
      db.library = db.library.slice(0, 30);
      saveDb();
      toast("Guardado en tu biblioteca");
    });
  }

  function generateAccess() {
    var qrout = APP.querySelector("#qrout");
    qrout.innerHTML = '<p class="help">Generando…</p>';
    encodeQuiz({ title: draft.title, questions: draft.questions }).then(function (payload) {
      var url = shareURL(payload);
      var qr = makeQR(url);
      if (!qr) {
        qrout.innerHTML = '<div class="note rojo">' + I.x + " El cuestionario es demasiado grande para un solo código QR (" + url.length +
          " caracteres). El <strong>enlace</strong> sigue funcionando — compártelo por chat, o divide el cuestionario en dos.</div>" +
          linkLine(url);
        wireLinkLine(url);
        return;
      }
      var svg = qrSVG(qr, 320);
      qrout.innerHTML =
        '<div class="qr-box"><div id="qrsvg">' + svg + "</div>" +
        '<div class="help" style="color:#111">Escanea para jugar · ' + draft.questions.length + " preguntas</div></div>" +
        '<div class="row mt-3"><button class="btn btn-sm" id="dlsvg">' + I.download + " QR (SVG)</button>" +
        '<button class="btn btn-sm" id="dlpng">' + I.download + " QR (PNG)</button>" +
        '<button class="btn btn-sm" id="openplay">' + I.play + " Abrir</button></div>" +
        linkLine(url);
      wireLinkLine(url);
      APP.querySelector("#dlsvg").addEventListener("click", function () { downloadText((draft.title || "quiz") + "-qr.svg", svg, "image/svg+xml"); });
      APP.querySelector("#dlpng").addEventListener("click", function () { svgToPng(svg, 800, (draft.title || "quiz") + "-qr.png"); });
      APP.querySelector("#openplay").addEventListener("click", function () { window.open(url, "_blank"); });
    }).catch(function (e) { qrout.innerHTML = '<div class="note rojo">Error: ' + esc(e.message || e) + "</div>"; });
  }

  function linkLine(url) {
    return '<div class="link-line mt-3"><input id="sharelink" readonly value="' + esc(url) + '"><button id="copylink">' + I.copy + " Copiar</button></div>";
  }
  function wireLinkLine(url) {
    var b = APP.querySelector("#copylink"); if (!b) return;
    b.addEventListener("click", function () {
      var inp = APP.querySelector("#sharelink"); inp.select();
      (navigator.clipboard ? navigator.clipboard.writeText(url) : Promise.reject()).then(function () { toast("Enlace copiado"); })
        .catch(function () { try { document.execCommand("copy"); toast("Enlace copiado"); } catch (e) { toast("Copia manual", "rojo"); } });
    });
  }

  function libraryList() {
    if (!db.library || !db.library.length) return "";
    var items = db.library.map(function (q) {
      return '<div class="between" style="border-top:2px solid var(--linea);padding:10px 0"><span style="font-weight:700">' + esc(q.title) +
        '</span><span class="help" style="margin:0">' + q.questions.length + " preg. <button class=\"btn btn-sm\" data-lib=\"" + q.id + '">Abrir</button> <button class="btn btn-sm" data-libdel="' + q.id + '">' + I.trash + "</button></span></div>";
    }).join("");
    return '<hr class="divider"><div class="eyebrow">Tu biblioteca (este dispositivo)</div>' + items;
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

  // Delegación para biblioteca (abrir / borrar)
  document.addEventListener("click", function (e) {
    var t = e.target.closest && e.target.closest("[data-lib],[data-libdel]");
    if (!t) return;
    if (t.dataset.lib) {
      var q = (db.library || []).find(function (x) { return x.id === t.dataset.lib; });
      if (q) { draft = { title: q.title, questions: q.questions }; renderDraft(); window.scrollTo(0, 0); }
    } else if (t.dataset.libdel) {
      db.library = (db.library || []).filter(function (x) { return x.id !== t.dataset.libdel; });
      saveDb(); if (draft) renderDraft(); else teacherPanel();
    }
  });

  // =====================================================================
  //  MOTOR DE JUEGO
  // =====================================================================
  var Game = (function () {
    var g = null, root = null, timer = null;

    function start(quiz, opts) {
      var qs = quiz.questions.filter(P.isValid).map(function (q) { return JSON.parse(JSON.stringify(q)); });
      if (opts.shuffle) qs = shuffle(qs);
      g = { quiz: quiz, opts: opts, qs: qs, i: 0, score: 0, streak: 0, best: 0, correct: 0, answers: [], phase: "q", picked: [], answered: false, total: 0, t0: 0 };
      root = el('<div class="game"></div>');
      document.body.appendChild(root);
      document.addEventListener("keydown", keys);
      renderQ();
    }
    function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }

    function keys(e) {
      if (!g) return;
      if (e.key === "Escape") return quit();
      if (g.phase === "q") { var n = parseInt(e.key, 10); var q = g.qs[g.i]; if (n >= 1 && n <= q.choices.length) pick(n - 1); }
      else if (g.phase === "fb" && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); next(); }
    }

    function topbar() {
      var pct = (g.i / g.qs.length) * 100;
      return '<div class="game-top"><button class="game-quit cell" data-quit>' + I.back + " Salir</button>" +
        '<div class="cell prog"><div class="prog-track"><div class="prog-fill" style="width:' + pct + '%"></div></div></div>' +
        '<div class="cell tnum">' + (g.i + 1) + " / " + g.qs.length + "</div>" +
        '<div class="cell tnum" id="scorecell">' + g.score + "</div></div>";
    }

    function renderQ() {
      var q = g.qs[g.i]; g.phase = "q"; g.answered = false; g.picked = [];
      var multi = q.type === "multi";
      var kind = q.type === "truefalse" ? "Verdadero o Falso" : multi ? "Elige todas las correctas" : "Elige una respuesta";
      var answers = q.choices.map(function (c, i) {
        return '<button class="answer p' + i + '" data-a="' + i + '"><span class="glyph">' + GLYPH[i] + "</span>" +
          '<span class="lab">' + esc(c) + '</span><span class="key">' + KEYS[i] + "</span></button>";
      }).join("");
      root.innerHTML = topbar() +
        '<div class="game-stage"><div class="q-zone">' +
        '<div class="timer" id="timer"><div class="fillbar" id="fillbar" style="height:100%"></div><div class="num" id="tnum">' + q.time + '</div><div class="lab">seg</div></div>' +
        '<div class="q-statement"><div class="q-kind">' + kind + "</div>" + (q.emoji ? '<div class="q-emoji">' + esc(q.emoji) + "</div>" : "") +
        '<div class="q-text">' + esc(q.text) + "</div></div></div>" +
        '<div class="answers" id="answers">' + answers + "</div>" +
        (multi ? '<button class="btn btn-azul btn-lg" id="confirm">' + I.check + " Confirmar</button>" : "") +
        "</div>";
      root.querySelector("[data-quit]").addEventListener("click", quit);
      root.querySelectorAll("[data-a]").forEach(function (b) {
        b.addEventListener("click", function () { multi ? toggle(+b.dataset.a, b) : pick(+b.dataset.a); });
      });
      if (multi) root.querySelector("#confirm").addEventListener("click", confirmMulti);
      startTimer(q.time);
    }

    function toggle(i, btn) {
      var at = g.picked.indexOf(i);
      if (at >= 0) { g.picked.splice(at, 1); btn.classList.remove("sel"); }
      else { g.picked.push(i); btn.classList.add("sel"); }
    }
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
      var gained = 0;
      if (ok) {
        g.correct++; g.streak++; g.best = Math.max(g.best, g.streak);
        if (q.points !== "none") {
          var base = q.points === "double" ? 2000 : 1000;
          var speed = clamp(1 - elapsed / (g.total * 2), 0.5, 1);
          gained = Math.round(base * speed);
          if (g.streak >= 2) gained += Math.min(g.streak - 1, 5) * 100;
        }
      } else { g.streak = 0; }
      g.score += gained; g.answers.push({ text: q.text, ok: ok, gained: gained });
      feedback(ok, gained, q, picked);
    }

    function feedback(ok, gained, q, picked) {
      g.phase = "fb";
      root.querySelectorAll("#answers [data-a]").forEach(function (b) {
        var i = +b.dataset.a; b.disabled = true;
        if (q.correct.indexOf(i) >= 0) b.classList.add("correct");
        else if (picked.indexOf(i) >= 0) b.classList.add("wrong-pick");
        else b.classList.add("wrong");
      });
      var cf = root.querySelector("#confirm"); if (cf) cf.remove();
      var sc = root.querySelector("#scorecell"); if (sc) sc.textContent = g.score;
      var last = g.i + 1 >= g.qs.length;
      var streakHtml = ok && g.streak >= 2 ? '<span class="streak">Racha ×' + g.streak + "</span>" : "";
      var v = el('<div class="verdict ' + (ok ? "ok" : "no") + '"><span class="tag">' + (ok ? "Correcto" : "Incorrecto") + "</span>" +
        '<span class="pts">' + (ok && gained ? "+" + gained + " puntos" : ok ? "¡Bien!" : "0 puntos") + "</span>" + streakHtml +
        '<button class="btn ' + (ok ? "btn-azul" : "btn-negro") + '" id="next" style="margin-left:auto">' + (last ? "Ver resultado" : "Siguiente " + I.arrow) + "</button></div>");
      root.querySelector(".game-stage").appendChild(v);
      root.querySelector("#next").addEventListener("click", next);
    }

    function next() { if (g.i + 1 >= g.qs.length) return finish(); g.i++; renderQ(); }

    function finish() {
      clearInterval(timer);
      var total = g.qs.length, acc = Math.round((g.correct / total) * 100);
      var key = g.opts.payload ? "p" + hash32(g.opts.payload) : "t" + hash32(g.quiz.title);
      db.scores = db.scores || {}; db.scores[key] = db.scores[key] || [];
      var entry = { name: g.opts.name, score: g.score, acc: acc, date: Date.now() };
      db.scores[key].push(entry); db.scores[key].sort(function (a, b) { return b.score - a.score; });
      db.scores[key] = db.scores[key].slice(0, 20); saveDb();
      var grade = acc >= 90 ? "Excelente" : acc >= 70 ? "Muy bien" : acc >= 50 ? "Aprobado" : acc >= 30 ? "Sigue practicando" : "A repasar";
      var best = db.scores[key].slice(0, 5).map(function (s, i) {
        return '<div class="between" style="border-top:2px solid var(--linea);padding:8px 0"><span class="tnum" style="font-weight:800">' + (i + 1) + ". " + esc(s.name) +
          '</span><span class="tnum" style="font-weight:800;color:var(--azul)">' + s.score + "</span></div>";
      }).join("");
      root.innerHTML = topbarStatic() +
        '<div class="game-stage"><div class="result">' +
        '<div class="eyebrow">Resultado · ' + esc(g.opts.name) + "</div>" +
        '<div class="score tnum">' + g.score + "</div>" +
        '<div class="index-num" style="font-size:22px;color:var(--rojo);text-transform:uppercase;font-weight:800">' + grade + "</div>" +
        '<div class="result-stats"><div class="rs azul"><div class="n tnum">' + g.correct + '</div><div class="l">Aciertos</div></div>' +
        '<div class="rs rojo"><div class="n tnum">' + (total - g.correct) + '</div><div class="l">Fallos</div></div>' +
        '<div class="rs"><div class="n tnum">' + acc + '%</div><div class="l">Precisión</div></div>' +
        '<div class="rs"><div class="n tnum">' + g.best + '</div><div class="l">Mejor racha</div></div></div>' +
        (best ? '<div class="mt-3"><div class="eyebrow">Mejores puntuaciones (este dispositivo)</div>' + best + "</div>" : "") +
        '<div class="row mt-3"><button class="btn btn-rojo btn-lg" id="again">' + I.play + " Jugar otra vez</button>" +
        '<button class="btn btn-lg" id="exit">' + I.home + " Salir</button></div>" +
        "</div></div>";
      root.querySelector("#again").addEventListener("click", function () { var q = g.quiz, o = g.opts; cleanup(); start(q, o); });
      root.querySelector("#exit").addEventListener("click", function () { var prev = g.opts.preview; cleanup(); if (prev) { go("#docente"); } else { go("#inicio"); } });
    }
    function topbarStatic() {
      return '<div class="game-top"><button class="game-quit cell" id="qq">' + I.back + " Salir</button>" +
        '<div class="cell grow"></div><div class="cell">Resultado</div></div>';
    }

    function quit() {
      if (g && g.phase !== "result" && !confirm("¿Salir del cuestionario? Se perderá el progreso.")) return;
      var prev = g && g.opts.preview; cleanup(); if (prev) go("#docente"); else go("#inicio");
    }
    function cleanup() { clearInterval(timer); document.removeEventListener("keydown", keys); if (root) root.remove(); root = null; g = null; }

    return { start: start };
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
    var img = new Image();
    var blob = new Blob([svg], { type: "image/svg+xml" });
    var url = URL.createObjectURL(blob);
    img.onload = function () {
      var cv = document.createElement("canvas"); cv.width = cv.height = size;
      var ctx = cv.getContext("2d"); ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, size, size);
      ctx.drawImage(img, 0, 0, size, size); URL.revokeObjectURL(url);
      cv.toBlob(function (b) { var a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = safeName(filename); a.click(); });
    };
    img.onerror = function () { toast("No se pudo generar el PNG; usa el SVG", "rojo"); };
    img.src = url;
  }

  // PWA install prompt
  var deferredPrompt = null;
  window.addEventListener("beforeinstallprompt", function (e) { e.preventDefault(); deferredPrompt = e; showInstall(); });
  function showInstall() { var b = document.getElementById("installbar"); if (b && deferredPrompt) b.classList.remove("hidden"); }
  function wireInstall() {
    if (deferredPrompt) showInstall();
    var btn = document.getElementById("installbtn");
    if (btn) btn.addEventListener("click", function () {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      deferredPrompt.userChoice.finally(function () { deferredPrompt = null; var b = document.getElementById("installbar"); if (b) b.classList.add("hidden"); });
    });
  }

  // Service worker
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
