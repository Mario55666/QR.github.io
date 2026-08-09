# QUIZ — Cuestionarios interactivos con acceso por QR

Plataforma **en castellano** para diseñar y jugar cuestionarios interactivos tipo concurso
(estilo Kahoot). El **docente** carga las preguntas desde **Word, Markdown o CSV** y obtiene al
instante un **código QR**; los **estudiantes** escanean el QR con su móvil y responden contra el
reloj. Es una **PWA**: se instala en el dispositivo y **funciona sin conexión**.

Diseño visual: **Bauhaus / Estilo Tipográfico Internacional (suizo)** — fondo blanco, retícula
visible, los tres primarios (rojo, azul, amarillo) usados como señal, tipografía de palo seco
(Helvética/Inter) alineada en bandera.

**Novedades:**
- **Editor visual tipo Kahoot** para el docente: riel de preguntas, mosaicos de colores
  editables en línea, marcar la correcta, multimedia (emoji/imagen), tiempo/puntos/tipo. La
  importación desde Word/Markdown/CSV sigue disponible (botón «Importar»).
- **Funciones interactivas** al jugar: modo **Apuesta** (banca de fichas + multiplicador de
  racha), **XP y niveles**, **logros** y una vista **Progreso** con estadísticas persistentes.

> **Sin servidor.** El cuestionario completo viaja **codificado y comprimido dentro del enlace/QR**.
> No hay base de datos ni backend: por eso puede vivir en GitHub Pages y funcionar offline.

---

## Cómo se usa

### Estudiante
1. Escanea el **QR** que proyecta el docente (o abre el enlace que te comparte).
2. Escribe tu nombre y pulsa **Empezar**.
3. Responde cada pregunta antes de que acabe el tiempo. Cuanto más rápido aciertas, más puntos.

No hace falta instalar nada ni registrarse.

### Docente
1. Entra en **Docente** e introduce la contraseña (ver abajo).
2. **Carga** un archivo `.docx`, `.md` o `.csv` (o pega el texto).
3. Revisa la previsualización y pulsa **Generar acceso (QR)**.
4. Proyecta el QR / comparte el enlace. También puedes **descargar el QR** (SVG o PNG) para pegarlo
   en tus diapositivas.

### Contraseña del docente
- Contraseña inicial: **`docente2026`**.
- Cámbiala nada más entrar con **«Cambiar clave»**. Se guarda **solo en ese dispositivo** (como
  hash SHA‑256 en `localStorage`).
- ⚠️ **Aviso honesto:** al ser una app 100 % de navegador sin servidor, esto es una **reja de aula**
  para evitar que un estudiante entre por error al panel — **no** es un sistema de seguridad real.
  Cualquiera con conocimientos técnicos podría leer el código. No la uses para proteger datos
  sensibles.

---

## Formatos de preguntas

Puedes marcar la respuesta correcta de tres maneras según el formato. Tienes ejemplos listos en
la carpeta [`plantillas/`](plantillas/) y dentro de la propia app (botones «Plantilla»).

### 1. Markdown (`.md`) — recomendado
```markdown
# Título del cuestionario

## ¿Cuál es la capital de Perú?
- [x] Lima
- [ ] Cusco
- [ ] Arequipa
(tiempo: 20)

## Selecciona TODOS los números pares
- [x] 2
- [ ] 3
- [x] 4
```
- `#` = título del cuestionario (opcional).
- `##` = enunciado de cada pregunta.
- `- [x]` = respuesta correcta · `- [ ]` = incorrecta. Puedes marcar **varias** correctas.
- `(tiempo: 30)` = segundos para esa pregunta (opcional, por defecto 20).
- `emoji: 🪐` = emoji opcional para la pregunta.
- Verdadero/Falso: usa dos opciones `Verdadero` y `Falso`.

### 2. CSV (`.csv`) — ideal desde Excel
```csv
pregunta,opcion1,opcion2,opcion3,opcion4,correcta,tiempo
"¿Capital de Perú?",Lima,Cusco,Arequipa,Trujillo,1,20
"¿2 + 2?",3,4,5,,2,15
"El Sol es una estrella",Verdadero,Falso,,,V,10
```
- Columna **`correcta`**: número de la opción (**1 = primera**), o letra (`A`, `B`…), o `V`/`F`.
  Para **varias** correctas: `1,3` o `1|3`.
- Columna **`tiempo`**: segundos (opcional).
- Acepta separador `,` o `;` (Excel en español) y detecta la cabecera automáticamente.
- Alternativa: una sola columna `opciones` con las opciones separadas por `|`.

### 3. Word (`.docx`)
- Escribe cada **pregunta** en su propio párrafo (idealmente terminada en `?`).
- Escribe cada **respuesta** en su propio párrafo debajo.
- Marca la respuesta **correcta poniéndola en negrita** (**Lima**). También puedes anteponer `*` o
  añadir `(correcta)`.
- El Word se lee **dentro del navegador** (se descomprime el `.docx` y se extrae el texto); no se
  sube a ningún servidor.

> Si una pregunta no queda bien detectada, ábrela en Markdown/CSV, que son más precisos, o revisa
> que cada pregunta y cada opción estén en párrafos separados.

---

## Instalar como aplicación (PWA)
- **Android/Chrome:** menú ⋮ → «Instalar aplicación» / «Añadir a pantalla de inicio», o el botón
  **Instalar** que aparece en la portada.
- **iPhone/Safari:** botón Compartir → «Añadir a pantalla de inicio».
- Una vez abierta, la app queda **cacheada**: funciona sin conexión. Los estudiantes solo necesitan
  conexión la primera vez que abren el enlace (para descargar la app); después el juego corre local.

---

## Despliegue en GitHub Pages
Este repositorio está pensado para publicarse tal cual:

1. En GitHub: **Settings → Pages**.
2. **Source:** *Deploy from a branch*.
3. Elige la rama (por ejemplo `main`) y carpeta **/(root)**. Guarda.
4. La app quedará disponible en `https://mario55666.github.io/QR.github.io/`.

Todas las rutas del proyecto son **relativas**, por lo que funciona en un subdirectorio de Pages sin
configuración extra. El `service worker` se registra con ámbito relativo.

> El trabajo se ha desarrollado en la rama `claude/kahoot-interactive-platform-bo06jl`. Haz *merge*
> a la rama que publiques en Pages cuando lo revises.

---

## Estructura del proyecto
```
index.html                 App (una sola página, enrutada por hash)
manifest.webmanifest       Manifiesto PWA (instalación)
sw.js                      Service worker (offline / precarga)
assets/
  app.css                  Estilo Bauhaus / Suizo (claro y oscuro)
  app.js                   Router, panel docente, QR, motor de juego
  parse.js                 Importadores CSV / Markdown / Word
  qrcode.js                Generador de QR (Kazuhiko Arase, MIT)
icons/                     Iconos PWA (192/512/maskable) + favicon
plantillas/                Ejemplos .md y .csv
```

## Privacidad
- No hay servidor ni analítica: **nada sale del dispositivo**.
- Los cuestionarios, la contraseña (hash) y las puntuaciones se guardan en `localStorage`.
- El cuestionario que comparte el docente viaja dentro del propio enlace/QR.

## Créditos
- Generador de QR: [`qrcode-generator`](https://github.com/kazuhikoarase/qrcode-generator) (MIT).
- Modelo de juego inspirado en el clon de Kahoot de referencia.
