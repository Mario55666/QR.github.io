/* =========================================================================
   parse.js — Importadores de preguntas: CSV, Markdown y Word (.docx)
   Cada importador devuelve un objeto cuestionario:
     { title, questions: [ { type, text, emoji, time, points, choices[], correct[] } ] }
   Sin dependencias externas. Compatible con navegador y Node (para pruebas).
   ========================================================================= */
(function (global) {
  "use strict";

  var TIME_DEFAULT = 20;

  function makeQuestion(text) {
    return { type: "quiz", text: (text || "").trim(), emoji: "", time: TIME_DEFAULT, points: "std", choices: [], correct: [] };
  }

  // --- normaliza/valida una pregunta antes de aceptarla ---
  function finalize(q) {
    q.text = (q.text || "").trim();
    q.choices = q.choices.map(function (c) { return (c || "").trim(); }).filter(function (c) { return c.length; });
    q.correct = Array.from(new Set(q.correct)).filter(function (i) { return i >= 0 && i < q.choices.length; }).sort(function (a, b) { return a - b; });
    if (!q.correct.length && q.choices.length) q.correct = [0]; // por defecto la primera
    // Detección de tipo
    var norm = q.choices.map(function (c) { return c.toLowerCase(); });
    var isVF = q.choices.length === 2 &&
      ((norm[0].indexOf("verdadero") === 0 || norm[0] === "v" || norm[0] === "sí" || norm[0] === "si" || norm[0] === "true") &&
        (norm[1].indexOf("falso") === 0 || norm[1] === "f" || norm[1] === "no" || norm[1] === "false"));
    if (isVF) q.type = "truefalse";
    else if (q.correct.length > 1) q.type = "multi";
    else q.type = "quiz";
    if (!(q.time > 0)) q.time = TIME_DEFAULT;
    return q;
  }

  function isValid(q) {
    return q && q.text && q.choices.length >= 2 && q.correct.length >= 1;
  }

  // =====================================================================
  //  CSV  (compatible con Excel; separador , o ;)
  //  Cabecera flexible:  pregunta, opcion1..opcionN, correcta, tiempo, tipo
  //  o posicional:       pregunta, op1, op2, op3, op4, correcta, tiempo
  // =====================================================================
  function detectDelim(sample) {
    var firstLine = sample.split(/\r?\n/)[0] || "";
    var c = (firstLine.match(/,/g) || []).length;
    var s = (firstLine.match(/;/g) || []).length;
    var t = (firstLine.match(/\t/g) || []).length;
    if (t >= c && t >= s) return "\t";
    return s > c ? ";" : ",";
  }

  function parseCSVRows(text, delim) {
    var rows = [], row = [], field = "", i = 0, inQ = false;
    text = text.replace(/^﻿/, ""); // BOM
    while (i < text.length) {
      var ch = text[i];
      if (inQ) {
        if (ch === '"') {
          if (text[i + 1] === '"') { field += '"'; i += 2; continue; }
          inQ = false; i++; continue;
        }
        field += ch; i++; continue;
      }
      if (ch === '"') { inQ = true; i++; continue; }
      if (ch === delim) { row.push(field); field = ""; i++; continue; }
      if (ch === "\n" || ch === "\r") {
        if (ch === "\r" && text[i + 1] === "\n") i++;
        row.push(field); rows.push(row); row = []; field = ""; i++; continue;
      }
      field += ch; i++;
    }
    if (field.length || row.length) { row.push(field); rows.push(row); }
    return rows.filter(function (r) { return r.some(function (c) { return String(c).trim().length; }); });
  }

  function parseCorrectToken(tok, choices) {
    // devuelve array de índices 0-based
    if (tok == null) return [];
    var out = [];
    String(tok).split(/[|,;\/]+/).forEach(function (part) {
      part = part.trim();
      if (!part) return;
      var n = parseInt(part, 10);
      if (!isNaN(n) && String(n) === part) { out.push(n - 1); return; } // 1-based
      var up = part.toUpperCase();
      if (/^[A-H]$/.test(up)) { out.push(up.charCodeAt(0) - 65); return; }
      if (up === "V" || up === "VERDADERO" || up === "TRUE" || up === "SÍ" || up === "SI") { out.push(0); return; }
      if (up === "F" || up === "FALSO" || up === "FALSE" || up === "NO") { out.push(1); return; }
      // texto literal de la opción
      var idx = choices.map(function (c) { return c.toLowerCase(); }).indexOf(part.toLowerCase());
      if (idx >= 0) out.push(idx);
    });
    return out;
  }

  function parseCSV(text) {
    var delim = detectDelim(text);
    var rows = parseCSVRows(text, delim);
    if (!rows.length) return { title: "", questions: [] };

    // ¿Hay cabecera?
    var head = rows[0].map(function (c) { return c.trim().toLowerCase(); });
    var hasHeader = head.some(function (c) { return /pregunta|question|enunciado/.test(c); });
    var map = null;
    if (hasHeader) {
      map = { q: -1, correct: -1, time: -1, type: -1, opts: [] };
      head.forEach(function (name, idx) {
        if (/pregunta|question|enunciado/.test(name)) map.q = idx;
        else if (/correct|respuesta|answer|clave/.test(name)) map.correct = idx;
        else if (/tiempo|time|segundos|seg/.test(name)) map.time = idx;
        else if (/tipo|type/.test(name)) map.type = idx;
        else if (/opci|option|resp|alt|choice/.test(name)) map.opts.push(idx);
        else map.opts.push(idx); // columnas extra = opciones
      });
      rows = rows.slice(1);
    }

    // añade una o varias opciones (permite varias separadas por | dentro de una celda)
    function addChoices(q, v) {
      v = (v || "").trim();
      if (!v) return;
      v.split(/\s*\|\s*/).forEach(function (p) { p = p.trim(); if (p) q.choices.push(p); });
    }

    var questions = [];
    rows.forEach(function (r) {
      var q = makeQuestion();
      var correctTok, timeTok;
      if (map) {
        q.text = (r[map.q] || "").trim();
        map.opts.forEach(function (ci) { addChoices(q, r[ci]); });
        correctTok = map.correct >= 0 ? r[map.correct] : "";
        timeTok = map.time >= 0 ? r[map.time] : "";
      } else {
        // posicional: pregunta, ...opciones, correcta, tiempo
        // heurística: última columna numérica pequeña = tiempo; penúltima = correcta
        var cells = r.slice();
        q.text = (cells.shift() || "").trim();
        // ¿tiempo al final?
        var last = (cells[cells.length - 1] || "").trim();
        if (/^\d{1,3}$/.test(last) && +last <= 300 && cells.length >= 3) { timeTok = cells.pop(); }
        correctTok = (cells.pop() || "").trim();
        cells.forEach(function (v) { addChoices(q, v); });
      }
      if (timeTok) { var t = parseInt(timeTok, 10); if (t > 0) q.time = t; }
      q.correct = parseCorrectToken(correctTok, q.choices);
      finalize(q);
      if (isValid(q)) questions.push(q);
    });
    return { title: "", questions: questions };
  }

  // =====================================================================
  //  PLANO / MARKDOWN  (también base para Word)
  //  # Título
  //  ## ¿Pregunta?              (o  "1. ¿Pregunta?"  o línea que acaba en ?)
  //  - [x] correcta   /   * correcta   /   línea en negrita (Word)
  //  - [ ] incorrecta
  //  (tiempo: 30)
  // =====================================================================
  var BOLD = ""; // marcador interno de negrita (Word)

  var optionRe = /^\s*(?:\[[ xX]\]|[-*+•·▪◦])\s*(.*)$/;
  var letterOptRe = /^\s*([a-hA-H])\s*[\).]\s+(.*)$/;
  var numQreRe = /^\s*\d{1,3}\s*[\).\-]\s+(.*)$/;
  var headRe = /^\s*#{2,6}\s+(.*)$/;
  var titleRe = /^\s*#\s+(.*)$/;
  var pregLabelRe = /^\s*pregunta\s*\d*\s*[:.\-)]\s*(.*)$/i;
  var timeRe = /^\(?\s*(?:tiempo|time|⏱)\s*[:=]?\s*(\d{1,3})/i;
  var emojiRe = /^\s*emoji\s*[:=]\s*(.+)$/i;

  function extractCorrect(body) {
    var correct = false;
    var m = body.match(/^\[([ xX])\]\s*(.*)$/);
    if (m) { correct = m[1].toLowerCase() === "x"; body = m[2]; }
    if (body.indexOf(BOLD) >= 0) { correct = true; body = body.replace(new RegExp(BOLD, "g"), ""); }
    if (/^[✔✓☑★]\s*/.test(body)) { correct = true; body = body.replace(/^[✔✓☑★]\s*/, ""); }
    if (/\s*[✔✓☑★]\s*$/.test(body)) { correct = true; body = body.replace(/\s*[✔✓☑★]\s*$/, ""); }
    if (/\(\s*(?:correcta?|correct|ok|verdadero|v)\s*\)\s*$/i.test(body)) { correct = true; body = body.replace(/\s*\([^)]*\)\s*$/, ""); }
    if (/\s\*+$/.test(body) || /^\*+\s*\S/.test(body) === false) { /* noop */ }
    if (/\s\*$/.test(body)) { correct = true; body = body.replace(/\s*\*+$/, ""); }
    return { correct: correct, text: body.trim() };
  }

  function parsePlain(text) {
    var lines = String(text).split(/\r?\n/);
    var title = "";
    var questions = [];
    var cur = null;

    function push() {
      if (cur) { finalize(cur); if (isValid(cur)) questions.push(cur); }
      cur = null;
    }
    function start(t) { push(); cur = makeQuestion(t); }

    for (var li = 0; li < lines.length; li++) {
      var raw = lines[li];
      var line = raw.replace(/\s+$/, "");
      var t = line.trim();
      if (!t) continue;
      var m;

      if ((m = t.match(titleRe)) && !questions.length && !cur) { title = m[1].trim(); continue; }
      if ((m = t.match(headRe))) { start(m[1].trim()); continue; }
      if ((m = t.match(pregLabelRe))) { start(m[1].trim()); continue; }
      if ((m = t.match(timeRe))) { if (cur) cur.time = +m[1]; continue; }
      if ((m = t.match(emojiRe))) { if (cur) cur.emoji = m[1].trim(); continue; }

      // opción explícita (bullet / casilla)
      if ((m = t.match(optionRe))) {
        if (!cur) start("Pregunta");
        var r = extractCorrect(m[1]);
        if (r.text) { cur.choices.push(r.text); if (r.correct) cur.correct.push(cur.choices.length - 1); }
        continue;
      }
      // opción con letra  a) ...
      if ((m = t.match(letterOptRe)) && cur && cur.choices.length < 8) {
        var r2 = extractCorrect(m[2]);
        if (r2.text) { cur.choices.push(r2.text); if (r2.correct) cur.correct.push(cur.choices.length - 1); }
        continue;
      }
      // pregunta numerada  1. ...
      if ((m = t.match(numQreRe))) { start(m[1].trim()); continue; }

      // línea suelta (Word sin viñetas):
      var boldLine = t.indexOf(BOLD) >= 0;
      var clean = t.replace(new RegExp(BOLD, "g"), "").trim();
      var looksQuestion = /[?？:：]$/.test(clean);

      if (!cur || (looksQuestion && cur.choices.length > 0)) {
        start(clean);
      } else if (cur.choices.length === 0 && looksQuestion) {
        cur.text = (cur.text ? cur.text + " " : "") + clean;
      } else if (cur.choices.length === 0 && !looksQuestion && !cur.text) {
        cur.text = clean;
      } else {
        // es una opción de la pregunta actual
        var rr = extractCorrect(boldLine ? BOLD + clean : clean);
        if (rr.text) { cur.choices.push(rr.text); if (rr.correct) cur.correct.push(cur.choices.length - 1); }
      }
    }
    push();
    return { title: title, questions: questions };
  }

  // =====================================================================
  //  DOCX  (ZIP -> word/document.xml -> texto con negritas marcadas)
  // =====================================================================
  function u32(dv, off) { return dv.getUint32(off, true); }
  function u16(dv, off) { return dv.getUint16(off, true); }

  async function inflateRaw(bytes) {
    if (typeof DecompressionStream === "undefined") throw new Error("nozip");
    var ds = new DecompressionStream("deflate-raw");
    var stream = new Blob([bytes]).stream().pipeThrough(ds);
    var ab = await new Response(stream).arrayBuffer();
    return new Uint8Array(ab);
  }

  async function unzipEntry(arrayBuffer, wantedName) {
    var bytes = new Uint8Array(arrayBuffer);
    var dv = new DataView(arrayBuffer);
    // buscar End Of Central Directory (0x06054b50) desde el final
    var eocd = -1;
    for (var i = bytes.length - 22; i >= 0 && i >= bytes.length - 22 - 65536; i--) {
      if (u32(dv, i) === 0x06054b50) { eocd = i; break; }
    }
    if (eocd < 0) throw new Error("zip");
    var cdOffset = u32(dv, eocd + 16);
    var count = u16(dv, eocd + 10);
    var p = cdOffset;
    for (var e = 0; e < count; e++) {
      if (u32(dv, p) !== 0x02014b50) break;
      var method = u16(dv, p + 10);
      var compSize = u32(dv, p + 20);
      var nameLen = u16(dv, p + 28);
      var extraLen = u16(dv, p + 30);
      var commentLen = u16(dv, p + 32);
      var localOff = u32(dv, p + 42);
      var name = new TextDecoder().decode(bytes.subarray(p + 46, p + 46 + nameLen));
      if (name === wantedName) {
        // cabecera local
        var lNameLen = u16(dv, localOff + 26);
        var lExtraLen = u16(dv, localOff + 28);
        var dataStart = localOff + 30 + lNameLen + lExtraLen;
        var comp = bytes.subarray(dataStart, dataStart + compSize);
        if (method === 0) return comp.slice();
        return await inflateRaw(comp);
      }
      p += 46 + nameLen + extraLen + commentLen;
    }
    throw new Error("noentry");
  }

  function xmlDecode(s) {
    return s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'").replace(/&#(\d+);/g, function (_, d) { return String.fromCharCode(+d); })
      .replace(/&amp;/g, "&");
  }

  function docxXmlToText(xml) {
    // separar por párrafos <w:p ...> ... </w:p>
    var out = [];
    var paras = xml.split(/<w:p[ >]/);
    for (var i = 1; i < paras.length; i++) {
      var body = paras[i];
      var endP = body.indexOf("</w:p>");
      if (endP >= 0) body = body.slice(0, endP);
      // procesar cada run <w:r> ... </w:r>
      var text = "";
      var boldLen = 0, totalLen = 0;
      var runs = body.split(/<w:r[ >]/);
      for (var r = 1; r < runs.length; r++) {
        var run = runs[r];
        var endR = run.indexOf("</w:r>");
        if (endR >= 0) run = run.slice(0, endR);
        var rpr = "";
        var mr = run.match(/<w:rPr>([\s\S]*?)<\/w:rPr>/);
        if (mr) rpr = mr[1];
        var bold = /<w:b\b(?![^>]*w:val="(?:0|false|none)")/.test(rpr);
        var runText = "";
        var tRe = /<w:t[^>]*>([\s\S]*?)<\/w:t>/g, tm;
        while ((tm = tRe.exec(run))) runText += xmlDecode(tm[1]);
        if (/<w:tab\b/.test(run)) runText += " ";
        text += runText;
        totalLen += runText.replace(/\s/g, "").length;
        if (bold) boldLen += runText.replace(/\s/g, "").length;
      }
      text = text.trim();
      if (text) {
        // si la mayoría del párrafo va en negrita -> marcar como correcta
        if (totalLen > 0 && boldLen >= totalLen * 0.6) text = BOLD + text;
        out.push(text);
      }
    }
    return out.join("\n");
  }

  async function parseDocx(arrayBuffer) {
    var xmlBytes = await unzipEntry(arrayBuffer, "word/document.xml");
    var xml = new TextDecoder().decode(xmlBytes);
    var text = docxXmlToText(xml);
    return parsePlain(text);
  }

  // =====================================================================
  //  Despachador
  // =====================================================================
  async function parseFile(name, dataText, arrayBuffer) {
    var ext = (name.split(".").pop() || "").toLowerCase();
    if (ext === "csv" || ext === "tsv") return parseCSV(dataText);
    if (ext === "docx") return await parseDocx(arrayBuffer);
    if (ext === "md" || ext === "markdown" || ext === "txt" || ext === "text") return parsePlain(dataText);
    // desconocido: intentar CSV si tiene comas/;, si no, plano
    if (dataText && /[,;\t].*[,;\t]/.test(dataText.split(/\r?\n/)[0] || "")) return parseCSV(dataText);
    return parsePlain(dataText || "");
  }

  var API = { parseCSV: parseCSV, parsePlain: parsePlain, parseDocx: parseDocx, parseFile: parseFile, finalize: finalize, isValid: isValid, _BOLD: BOLD };
  if (typeof module !== "undefined" && module.exports) module.exports = API;
  global.QAParse = API;
})(typeof window !== "undefined" ? window : globalThis);
