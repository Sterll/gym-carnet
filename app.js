/* ============================================================
   Carnet d'entraînement — logique
   Programme + planning éditable + suivi des charges + historique
   Stockage : localStorage (100% sur le téléphone)
   ============================================================ */

const PROGRAM = [
  {
    id: "upperA", name: "Upper A", focus: "Haut · Poussée", short: "Up A",
    exercises: [
      { id: "ua1", name: "Développé couché haltères", sets: 4, reps: "8-10", rest: "2 min" },
      { id: "ua2", name: "Développé incliné machine", alt: "Chest Press incliné", sets: 3, reps: "10-12", rest: "90s" },
      { id: "ua3", name: "Tirage vertical", alt: "Lat Pulldown", sets: 4, reps: "10-12", rest: "90s" },
      { id: "ua4", name: "Rowing assis poulie basse", alt: "Seated Row", sets: 3, reps: "10-12", rest: "90s" },
      { id: "ua5", name: "Élévations latérales haltères", sets: 3, reps: "12-15", rest: "60s" },
      { id: "ua6", name: "Curl biceps haltères", sets: 3, reps: "10-12", rest: "60s" },
      { id: "ua7", name: "Extension triceps poulie", alt: "Corde", sets: 3, reps: "12-15", rest: "60s" },
    ],
    note: "Ta séance préférée. Concentre-toi sur le contrôle : 2 secondes à la descente."
  },
  {
    id: "lowerA", name: "Lower A", focus: "Bas · Quadriceps", short: "Low A",
    exercises: [
      { id: "la1", name: "Presse à cuisses", alt: "Leg Press", sets: 4, reps: "10-12", rest: "2 min" },
      { id: "la2", name: "Leg extension", alt: "Quadriceps", sets: 4, reps: "12-15", rest: "90s" },
      { id: "la3", name: "Leg curl assis", alt: "Ischios (machine assise)", sets: 4, reps: "12-15", rest: "90s" },
      { id: "la4", name: "Mollets à la presse", sets: 4, reps: "15-20", rest: "60s" },
      { id: "la5", name: "Abdos machine (crunch)", sets: 3, reps: "15-20", rest: "45s" },
    ],
    note: "Version « moins relou » : que des machines, zéro squat libre. ~40 min, et c'est plié."
  },
  {
    id: "upperB", name: "Upper B", focus: "Haut · Tirage", short: "Up B",
    exercises: [
      { id: "ub1", name: "Tractions assistées", alt: "ou Lat Pulldown prise large", sets: 4, reps: "8-10", rest: "2 min" },
      { id: "ub2", name: "Rowing machine prise neutre", alt: "Seated / T-bar Row", sets: 4, reps: "10-12", rest: "90s" },
      { id: "ub3", name: "Développé militaire haltères", alt: "ou Shoulder Press machine", sets: 3, reps: "8-10", rest: "90s" },
      { id: "ub4", name: "Développé couché machine", alt: "Chest Press", sets: 3, reps: "10-12", rest: "90s" },
      { id: "ub5", name: "Oiseau / rear delts", alt: "Reverse Pec Deck", sets: 3, reps: "12-15", rest: "60s" },
      { id: "ub6", name: "Curl marteau haltères", sets: 3, reps: "10-12", rest: "60s" },
      { id: "ub7", name: "Dips assistés machine", alt: "ou extension triceps", sets: 3, reps: "10-12", rest: "60s" },
    ],
    note: "C'est ici qu'on retrouve ton dos + biceps. Le dos demande de bien « tirer avec les coudes »."
  },
  {
    id: "lowerB", name: "Lower B", focus: "Bas · Fessiers / Ischios", short: "Low B",
    exercises: [
      { id: "lb1", name: "Hip thrust machine", alt: "ou haltère sur les hanches", sets: 4, reps: "10-12", rest: "90s" },
      { id: "lb2", name: "Leg curl assis", alt: "Ischios", sets: 4, reps: "12-15", rest: "90s" },
      { id: "lb3", name: "Presse à cuisses pieds hauts", alt: "Fessiers / ischios", sets: 3, reps: "12-15", rest: "90s" },
      { id: "lb4", name: "Abducteurs machine", sets: 3, reps: "15-20", rest: "60s" },
      { id: "lb5", name: "Mollets assis", sets: 4, reps: "15-20", rest: "60s" },
    ],
    note: "Toujours que des machines. Pousse fort sur le hip thrust, c'est ton meilleur exo fessiers."
  },
];

const DAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const DAYS_LONG = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
const MONTHS = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
const DEFAULT_SCHEDULE = ["upperA", "lowerA", "rest", "upperB", "lowerB", "rest", "rest"];

const MEALS = [
  { when: "Petit-déj", what: "80g flocons d'avoine + 30g whey + 1 banane + 1 c.à.s beurre de cacahuète + lait entier" },
  { when: "Collation", what: "200g fromage blanc / skyr + miel + poignée d'amandes ou noix" },
  { when: "Déjeuner", what: "150g poulet + 120g riz (cru) + légumes + 1 c.à.s huile d'olive" },
  { when: "Avant salle", what: "2-3 tranches pain complet + thon, ou un shaker maison (lait + banane + whey + avoine)" },
  { when: "Dîner", what: "150g viande ou poisson + pommes de terre ou pâtes (120g cru) + légumes" },
  { when: "Coucher", what: "200g fromage blanc ou un verre de lait entier (optionnel, bonus hardgainer)" },
];
const MACRO_INFO = [
  { t: "Protéines", tag: "la brique", d: "Le plus important pour le muscle. Poulet, dinde, bœuf maigre, œufs, thon/saumon, skyr, lentilles, whey." },
  { t: "Glucides", tag: "le carburant", d: "Ton énergie à la salle. Riz, pâtes, pommes de terre, flocons d'avoine, pain complet, fruits." },
  { t: "Lipides", tag: "les hormones", d: "Santé + production hormonale. Huile d'olive, avocat, amandes/noix, œufs, poissons gras." },
];
const SUPPS = [
  { name: "Whey", use: "Atteindre tes protéines facilement. Le seul vraiment utile au début." },
  { name: "Créatine", use: "3-5g/jour, tous les jours. +force, +volume — le plus prouvé scientifiquement." },
  { name: "Oméga 3", use: "Bonus santé articulaire/cardio si tu manges peu de poisson." },
];

/* ---------- helpers ---------- */
const $ = (s, r = document) => r.querySelector(s);
const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const pad = (n) => String(n).padStart(2, "0");
const isoOf = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const shortOf = (iso) => { const p = iso.split("-"); return `${p[2]}/${p[1]}`; };
const todayISO = () => isoOf(new Date());

// index exercice -> séance parente
const EX_INDEX = {};
PROGRAM.forEach(s => s.exercises.forEach(ex => { EX_INDEX[ex.id] = s; }));
const sessionById = (id) => PROGRAM.find(s => s.id === id) || null;
const sessionLabel = (id) => id === "rest" ? "Repos" : (sessionById(id)?.name || "Repos");

/* ---------- storage ---------- */
const ENTRIES_KEY = "carnet_yanis_v1";
const SCHEDULE_KEY = "carnet_yanis_schedule_v1";
function load() { try { return JSON.parse(localStorage.getItem(ENTRIES_KEY)) || {}; } catch { return {}; } }
function save(data) { localStorage.setItem(ENTRIES_KEY, JSON.stringify(data)); }
function loadSchedule() {
  try { const s = JSON.parse(localStorage.getItem(SCHEDULE_KEY)); return Array.isArray(s) && s.length === 7 ? s : DEFAULT_SCHEDULE.slice(); }
  catch { return DEFAULT_SCHEDULE.slice(); }
}
function saveSchedule(s) { localStorage.setItem(SCHEDULE_KEY, JSON.stringify(s)); }
// normalise une entrée : garantit un champ iso
function entryISO(e) {
  if (e.iso) return e.iso;
  if (e.d && /^\d{2}\/\d{2}$/.test(e.d)) { const [dd, mm] = e.d.split("/"); return `${new Date().getFullYear()}-${mm}-${dd}`; }
  return todayISO();
}

let schedule = loadSchedule();
const CLOCK = '<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm1-13h-2v6l5 3 1-1.7-4-2.3z"/></svg>';

/* ============ SÉANCES : planning éditable ============ */
function renderWeek() {
  const strip = $("#weekStrip");
  strip.innerHTML = "";
  schedule.forEach((sid, i) => {
    const on = sid !== "rest";
    const c = el("div", "day" + (on ? " on" : " rest"));
    c.innerHTML = `<span class="d-name">${DAYS[i]}</span><span class="d-tag">${on ? sessionById(sid).short : "—"}</span>`;
    strip.appendChild(c);
  });
}

function renderWeekEdit() {
  const box = $("#weekEdit");
  box.innerHTML = "";
  schedule.forEach((sid, i) => {
    const row = el("div", "we-row");
    const opts = ['<option value="rest">Repos</option>']
      .concat(PROGRAM.map(s => `<option value="${s.id}">${s.name} — ${s.focus}</option>`)).join("");
    row.innerHTML = `<span class="we-day">${DAYS_LONG[i]}</span>
      <select class="we-select" data-i="${i}">${opts}</select>`;
    const sel = $(".we-select", row);
    sel.value = sid;
    sel.onchange = () => { schedule[i] = sel.value; saveSchedule(schedule); renderWeek(); dayHint(); };
    box.appendChild(row);
  });
}

let weekEditing = false;
function toggleWeekEdit() {
  weekEditing = !weekEditing;
  $("#weekEdit").classList.toggle("hidden", !weekEditing);
  $("#weekStrip").classList.toggle("hidden", weekEditing);
  $("#editWeekBtn").textContent = weekEditing ? "Terminé" : "Modifier";
  $("#editWeekBtn").classList.toggle("on", weekEditing);
  if (weekEditing) renderWeekEdit();
}

let currentSession = PROGRAM[0].id;
function renderPicker() {
  const p = $("#sessionPicker");
  p.innerHTML = "";
  PROGRAM.forEach(s => {
    const b = el("button", "pick" + (s.id === currentSession ? " active" : ""));
    b.innerHTML = `<span class="dot"></span>${s.name}`;
    b.onclick = () => { currentSession = s.id; renderPicker(); renderSession(); };
    p.appendChild(b);
  });
}
function renderSession() {
  const s = sessionById(currentSession);
  const idx = PROGRAM.indexOf(s) + 1;
  const wrap = $("#sessionContent");
  wrap.innerHTML = "";
  const card = el("div", "session");
  const banner = el("div", "session-banner");
  banner.dataset.index = "0" + idx;
  banner.innerHTML = `<div><h2>${s.name}</h2><div class="s-focus">${s.focus}</div></div>
    <div class="s-count"><b>${s.exercises.length}</b>exercices</div>`;
  card.appendChild(banner);
  const startBtn = el("button", "g-start-btn", `<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg> Démarrer la séance`);
  startBtn.onclick = () => startGuided(s.id);
  card.appendChild(startBtn);
  s.exercises.forEach((ex, i) => {
    const row = el("div", "ex");
    row.innerHTML = `<div class="ex-num">${i + 1}</div>
      <div class="ex-body"><div class="ex-name">${esc(ex.name)}</div>${ex.alt ? `<span class="ex-alt">${esc(ex.alt)}</span>` : ""}</div>
      <div class="ex-spec"><span class="ex-sets"><b>${ex.sets}</b> × ${ex.reps}</span><span class="ex-rest">${CLOCK}${ex.rest}</span></div>`;
    card.appendChild(row);
  });
  const note = el("div", "session-note");
  note.innerHTML = `<b>Note —</b><span>${esc(s.note)}</span>`;
  card.appendChild(note);
  wrap.appendChild(card);
}

/* ============ NUTRITION ============ */
function renderNutrition() {
  const ml = $("#mealList"); ml.innerHTML = "";
  MEALS.forEach(m => { const r = el("div", "meal"); r.innerHTML = `<div class="meal-when">${m.when}</div><div class="meal-what">${esc(m.what)}</div>`; ml.appendChild(r); });
  const mi = $("#macroInfo"); mi.innerHTML = "";
  MACRO_INFO.forEach(m => { const c = el("div", "info-card"); c.innerHTML = `<h3>${m.t} <span>${m.tag}</span></h3><p>${esc(m.d)}</p>`; mi.appendChild(c); });
  const sl = $("#suppList"); sl.innerHTML = "";
  SUPPS.forEach(s => { const r = el("div", "supp"); r.innerHTML = `<div class="supp-name">${s.name}</div><div class="supp-use">${esc(s.use)}</div>`; sl.appendChild(r); });
  renderBodyweight();
}

/* ============ SUIVI ============ */
let trackSession = PROGRAM[0].id;
function fillTrackSelect() {
  const sel = $("#trackSession");
  sel.innerHTML = "";
  PROGRAM.forEach(s => { const o = el("option"); o.value = s.id; o.textContent = `${s.name} — ${s.focus}`; sel.appendChild(o); });
  sel.value = trackSession;
  sel.onchange = () => { trackSession = sel.value; renderTrack(); };
  const dateInput = $("#trackDate");
  dateInput.value = todayISO();
  dateInput.max = todayISO();
}
function score(e) { return e.w * (e.r || 1); }
function best(entries) { return entries.reduce((b, e) => (score(e) > score(b) ? e : b), entries[0]); }

function renderTrack() {
  const data = load();
  const s = sessionById(trackSession);
  const wrap = $("#trackContent");
  wrap.innerHTML = "";
  s.exercises.forEach(ex => {
    const entries = (data[ex.id] || []);
    const last = entries[entries.length - 1];
    const rec = entries.length ? best(entries) : null;
    const card = el("div", "track-ex");
    card.innerHTML = `
      <div class="track-top">
        <div class="track-name">${esc(ex.name)} <span class="track-target">${ex.sets}×${ex.reps}</span></div>
        <button class="track-rest" type="button">⏱ <b>${ex.rest}</b></button>
      </div>
      <div class="track-stats">
        <div class="stat"><span>Dernier</span><b>${last ? `${last.w}kg × ${last.r}` : "—"}</b></div>
        <div class="stat record"><span>Record</span><b>${rec ? `${rec.w}kg × ${rec.r}` : "—"}</b></div>
      </div>
      <div class="track-inputs">
        <input type="number" inputmode="decimal" placeholder="kg" id="w_${ex.id}" value="${last ? last.w : ""}">
        <span class="x">×</span>
        <input type="number" inputmode="numeric" placeholder="reps" id="r_${ex.id}" value="${last ? last.r : ""}">
        <button class="track-add" type="button" aria-label="Enregistrer">+</button>
      </div>
      <div class="track-hist"></div>`;
    const histWrap = $(".track-hist", card);
    if (!entries.length) {
      histWrap.innerHTML = `<span class="hist-empty">Aucune entrée. Note ta première charge après l'exo.</span>`;
    } else {
      const start = Math.max(0, entries.length - 6);
      const idxs = [];
      for (let i = entries.length - 1; i >= start; i--) idxs.push(i);
      idxs.forEach(idx => {
        const e = entries[idx];
        const isBest = rec && score(e) === score(rec) && e.w === rec.w;
        const chip = el("span", "hist-chip" + (isBest ? " best" : ""));
        chip.innerHTML = `${e.w}×${e.r} <small>${shortOf(entryISO(e))}</small><i class="chip-del" aria-label="supprimer">✕</i>`;
        chip.title = "Toucher pour supprimer";
        chip.onclick = () => {
          if (!confirm(`Supprimer l'entrée ${e.w}kg × ${e.r} du ${shortOf(entryISO(e))} ?`)) return;
          const store = load();
          if (store[ex.id]) {
            store[ex.id].splice(idx, 1);
            if (!store[ex.id].length) delete store[ex.id];
            save(store);
          }
          renderTrack();
          flashToast("Entrée supprimée");
        };
        histWrap.appendChild(chip);
      });
    }
    $(".track-add", card).onclick = () => {
      const w = parseFloat($("#w_" + ex.id, card).value);
      const r = parseInt($("#r_" + ex.id, card).value, 10);
      if (isNaN(w) || isNaN(r) || w <= 0 || r <= 0) { $("#w_" + ex.id, card).focus(); return; }
      const iso = $("#trackDate").value || todayISO();
      const store = load();
      store[ex.id] = store[ex.id] || [];
      store[ex.id].push({ w, r, iso });
      store[ex.id].sort((a, b) => entryISO(a).localeCompare(entryISO(b)));
      save(store);
      renderTrack();
      flashToast(`Enregistré · ${shortOf(iso)}`);
      startRest(ex.name, restSeconds(ex.rest)); // lance le repos automatiquement
    };
    $(".track-rest", card).onclick = () => startRest(ex.name, restSeconds(ex.rest));
    wrap.appendChild(card);
  });
}

/* ============ TIMER DE REPOS ============ */
function restSeconds(rest) {
  const m = String(rest).match(/(\d+)\s*min/);
  if (m) return parseInt(m[1], 10) * 60;
  const s = String(rest).match(/(\d+)\s*s/);
  return s ? parseInt(s[1], 10) : 60;
}
let restState = null; // { total, left, interval }
function fmtTime(s) { return `${Math.floor(s / 60)}:${pad(s % 60)}`; }
function beep() {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.frequency.value = 880; o.type = "sine";
    g.gain.setValueAtTime(0.001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + 0.02);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    o.start(); o.stop(ctx.currentTime + 0.5);
  } catch { }
}
function paintRest() {
  $("#rtTime").textContent = fmtTime(Math.max(0, restState.left));
  const pct = restState.total ? (restState.left / restState.total) * 100 : 0;
  $("#rtProgress").style.width = Math.max(0, pct) + "%";
}
function startRest(name, seconds) {
  stopRest(true);
  restState = { total: seconds, left: seconds, interval: null };
  $("#rtLabel").textContent = "Repos · " + name;
  $("#restTimer").hidden = false;
  document.body.classList.add("timer-on");
  paintRest();
  restState.interval = setInterval(() => {
    restState.left -= 1;
    paintRest();
    if (restState.left <= 0) {
      clearInterval(restState.interval);
      navigator.vibrate?.([200, 100, 200, 100, 300]);
      beep();
      $("#rtLabel").textContent = "Repos terminé 💪 — c'est reparti";
      $("#rtTime").textContent = "0:00";
      setTimeout(() => { if (restState && restState.left <= 0) stopRest(); }, 4000);
    }
  }, 1000);
}
function stopRest(silent) {
  if (restState?.interval) clearInterval(restState.interval);
  restState = null;
  if (!silent) { $("#restTimer").hidden = true; document.body.classList.remove("timer-on"); }
}
function adjustRest(delta) {
  if (!restState) return;
  restState.left = Math.max(1, restState.left + delta);
  restState.total = Math.max(restState.total, restState.left);
  paintRest();
}

/* ============ GRAPHIQUE (SVG ligne) ============ */
function lineChart(points, { unit = "", goal = null } = {}) {
  if (!points.length) return `<div class="chart-empty">Pas encore de données à afficher.</div>`;
  const W = 320, H = 130, padL = 30, padR = 12, padT = 14, padB = 22;
  const ys = points.map(p => p.y);
  let min = Math.min(...ys), max = Math.max(...ys);
  if (goal != null) { min = Math.min(min, goal); max = Math.max(max, goal); }
  if (min === max) { min -= 1; max += 1; }
  const range = max - min || 1;
  const innerW = W - padL - padR, innerH = H - padT - padB;
  const x = (i) => padL + (points.length === 1 ? innerW / 2 : (i / (points.length - 1)) * innerW);
  const y = (v) => padT + innerH - ((v - min) / range) * innerH;

  const line = points.map((p, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(p.y).toFixed(1)}`).join(" ");
  const area = `${line} L${x(points.length - 1).toFixed(1)},${(padT + innerH).toFixed(1)} L${x(0).toFixed(1)},${(padT + innerH).toFixed(1)} Z`;
  const dots = points.map((p, i) => `<circle cx="${x(i).toFixed(1)}" cy="${y(p.y).toFixed(1)}" r="${i === points.length - 1 ? 4 : 2.6}" class="${i === points.length - 1 ? "dot-last" : "dot"}"/>`).join("");
  const goalLine = goal != null ? `<line x1="${padL}" y1="${y(goal).toFixed(1)}" x2="${W - padR}" y2="${y(goal).toFixed(1)}" class="goal-line"/>` : "";
  // labels axe Y (min/max) + premiers/derniers x
  const yLabels = `<text x="4" y="${(y(max) + 4).toFixed(1)}" class="ax">${(+max.toFixed(1))}</text><text x="4" y="${(y(min) + 4).toFixed(1)}" class="ax">${(+min.toFixed(1))}</text>`;
  const xFirst = `<text x="${padL}" y="${H - 6}" class="ax">${points[0].label}</text>`;
  const xLast = points.length > 1 ? `<text x="${W - padR}" y="${H - 6}" class="ax" text-anchor="end">${points[points.length - 1].label}</text>` : "";
  const lastVal = `<text x="${x(points.length - 1).toFixed(1)}" y="${(y(points[points.length - 1].y) - 9).toFixed(1)}" class="val" text-anchor="middle">${points[points.length - 1].y}${unit}</text>`;

  return `<svg viewBox="0 0 ${W} ${H}" class="chart-svg" preserveAspectRatio="xMidYMid meet">
    ${goalLine}
    <path d="${area}" class="area"/>
    <path d="${line}" class="line"/>
    ${dots}${lastVal}${yLabels}${xFirst}${xLast}
  </svg>`;
}

/* ============ SUIVI POIDS DE CORPS ============ */
const BW_KEY = "carnet_yanis_bw_v1";
function loadBW() { try { return JSON.parse(localStorage.getItem(BW_KEY)) || []; } catch { return []; } }
function saveBW(a) { localStorage.setItem(BW_KEY, JSON.stringify(a)); }
function renderBodyweight() {
  const data = loadBW().slice().sort((a, b) => a.iso.localeCompare(b.iso));
  const curEl = $("#bwCurrent"), deltaEl = $("#bwDelta");
  if (data.length) {
    const cur = data[data.length - 1].kg;
    curEl.textContent = `${cur} kg`;
    if (data.length > 1) {
      const diff = +(cur - data[0].kg).toFixed(1);
      deltaEl.textContent = (diff >= 0 ? "+" : "") + diff + " kg depuis le début";
      deltaEl.className = "bw-delta " + (diff >= 0 ? "up" : "down");
    } else deltaEl.textContent = "1re pesée enregistrée";
  } else { curEl.textContent = "— kg"; deltaEl.textContent = "Ajoute ta première pesée"; deltaEl.className = "bw-delta"; }
  const points = data.map(d => ({ label: shortOf(d.iso), y: d.kg }));
  $("#bwChart").innerHTML = lineChart(points, { unit: "kg" });
}

/* ============ PROGRESSION PAR EXERCICE ============ */
function fillProgSelect() {
  const sel = $("#progExo");
  if (!sel || sel.options.length) return;
  PROGRAM.forEach(s => {
    const grp = document.createElement("optgroup");
    grp.label = s.name;
    s.exercises.forEach(ex => { const o = el("option"); o.value = ex.id; o.textContent = ex.name; grp.appendChild(o); });
    sel.appendChild(grp);
  });
  sel.onchange = renderProgression;
}
function renderProgression() {
  const sel = $("#progExo");
  const exId = sel.value || PROGRAM[0].exercises[0].id;
  const data = load()[exId] || [];
  // une valeur par jour : le poids max ce jour-là
  const byDay = {};
  data.forEach(e => { const iso = entryISO(e); byDay[iso] = Math.max(byDay[iso] || 0, e.w); });
  const points = Object.keys(byDay).sort().map(iso => ({ label: shortOf(iso), y: byDay[iso] }));
  $("#progChart").innerHTML = lineChart(points, { unit: "kg" });
  const meta = $("#progMeta");
  if (points.length >= 2) {
    const gain = +(points[points.length - 1].y - points[0].y).toFixed(1);
    meta.innerHTML = `<span class="${gain >= 0 ? "up" : "down"}">${gain >= 0 ? "+" : ""}${gain} kg</span> entre ta 1re et ta dernière séance · ${points.length} séances notées`;
  } else if (points.length === 1) {
    meta.innerHTML = `Une seule séance notée pour l'instant. Continue, la courbe va monter 📈`;
  } else {
    meta.innerHTML = `Aucune donnée. Note tes charges dans l'onglet Suivi pour voir ta progression ici.`;
  }
}

/* ============ HISTORIQUE / CALENDRIER ============ */
let calRef = new Date(); // mois affiché

// regroupe toutes les entrées par date iso -> { iso: [{exId, name, session, w, r}] }
function buildHistory() {
  const data = load();
  const byDay = {};
  Object.keys(data).forEach(exId => {
    const sess = EX_INDEX[exId];
    if (!sess) return;
    (data[exId] || []).forEach(e => {
      const iso = entryISO(e);
      (byDay[iso] = byDay[iso] || []).push({ exId, name: EX_INDEX[exId] ? exById(exId).name : exId, session: sess, w: e.w, r: e.r });
    });
  });
  return byDay;
}
function exById(id) { return EX_INDEX[id].exercises.find(x => x.id === id); }
// quelles séances ont été faites un jour donné (basé sur les exos loggés)
function sessionsOfDay(items) {
  const ids = [...new Set(items.map(i => i.session.id))];
  return ids.map(id => sessionById(id));
}

function renderHistory() {
  const byDay = buildHistory();
  const allDays = Object.keys(byDay);

  // ---- stats ----
  const now = new Date();
  const thisMonthKey = `${now.getFullYear()}-${pad(now.getMonth() + 1)}`;
  const monthCount = allDays.filter(d => d.startsWith(thisMonthKey)).length;
  // semaine en cours (lun→dim)
  const dow = (now.getDay() + 6) % 7;
  const monday = new Date(now); monday.setDate(now.getDate() - dow); monday.setHours(0, 0, 0, 0);
  const weekCount = allDays.filter(d => { const dt = new Date(d + "T00:00:00"); return dt >= monday; }).length;

  const stats = $("#histStats");
  stats.innerHTML = "";
  [["Séances totales", allDays.length], ["Ce mois", monthCount], ["Cette semaine", weekCount]].forEach(([label, val]) => {
    const c = el("div", "stat-card");
    c.innerHTML = `<b>${val}</b><span>${label}</span>`;
    stats.appendChild(c);
  });

  // ---- grille calendrier ----
  const y = calRef.getFullYear(), m = calRef.getMonth();
  $("#calMonth").textContent = `${MONTHS[m]} ${y}`;
  const grid = $("#calGrid");
  grid.innerHTML = "";
  const first = new Date(y, m, 1);
  const lead = (first.getDay() + 6) % 7; // lundi = 0
  const nbDays = new Date(y, m + 1, 0).getDate();
  for (let i = 0; i < lead; i++) grid.appendChild(el("div", "cal-cell empty"));
  for (let d = 1; d <= nbDays; d++) {
    const iso = `${y}-${pad(m + 1)}-${pad(d)}`;
    const items = byDay[iso];
    const isToday = iso === todayISO();
    const cell = el("button", "cal-cell" + (items ? " has" : "") + (isToday ? " today" : ""));
    cell.type = "button";
    cell.dataset.iso = iso;
    let dots = "";
    if (items) { const n = Math.min(sessionsOfDay(items).length, 3); dots = `<span class="cal-dots">${"<i></i>".repeat(n)}</span>`; }
    cell.innerHTML = `<span class="cal-d">${d}</span>${dots}`;
    if (items) cell.onclick = () => showDay(iso, items);
    grid.appendChild(cell);
  }

  // détail : par défaut le dernier jour entraîné ce mois, sinon rien
  const monthDays = allDays.filter(d => d.startsWith(`${y}-${pad(m + 1)}`)).sort();
  if (monthDays.length) { const last = monthDays[monthDays.length - 1]; showDay(last, byDay[last]); }
  else $("#calDetail").innerHTML = `<div class="cal-detail-empty">Aucune séance enregistrée en ${MONTHS[m].toLowerCase()}. Touche une date marquée d'un point pour voir le détail.</div>`;

  fillProgSelect();
  renderProgression();
}

function showDay(iso, items) {
  const sessions = sessionsOfDay(items);
  const p = iso.split("-");
  const dt = new Date(iso + "T00:00:00");
  const dayName = DAYS_LONG[(dt.getDay() + 6) % 7];
  const box = $("#calDetail");
  box.innerHTML = "";
  const head = el("div", "cd-head");
  head.innerHTML = `<div><span class="cd-date">${dayName} ${p[2]} ${MONTHS[+p[1] - 1].toLowerCase()}</span>
    <span class="cd-sess">${sessions.map(s => s.name).join(" + ")}</span></div>
    <span class="cd-count">${items.length} exo${items.length > 1 ? "s" : ""}</span>`;
  box.appendChild(head);
  // groupé par séance
  sessions.forEach(sess => {
    const list = items.filter(i => i.session.id === sess.id);
    const group = el("div", "cd-group");
    list.forEach(i => {
      const row = el("div", "cd-row");
      row.innerHTML = `<span class="cd-ex">${esc(i.name)}</span><span class="cd-load">${i.w}<small>kg</small> × ${i.r}</span>`;
      group.appendChild(row);
    });
    box.appendChild(group);
  });
  // surligne la cellule active
  document.querySelectorAll(".cal-cell.sel").forEach(c => c.classList.remove("sel"));
  const active = document.querySelector(`.cal-cell[data-iso="${iso}"]`);
  if (active) active.classList.add("sel");
}

/* ============ EXPORT ============ */
function exportData() {
  const data = load();
  const s = sessionById(trackSession);
  let txt = `CARNET YANIS — ${s.name}\n\n`;
  s.exercises.forEach(ex => {
    const entries = data[ex.id] || [];
    txt += `• ${ex.name} (${ex.sets}×${ex.reps})\n`;
    txt += entries.length ? "  " + entries.map(e => `${e.w}kg×${e.r} (${shortOf(entryISO(e))})`).join("  ·  ") + "\n\n" : "  —\n\n";
  });
  if (navigator.share) navigator.share({ title: "Carnet Yanis", text: txt }).catch(() => copyFallback(txt));
  else copyFallback(txt);
}
function copyFallback(txt) {
  navigator.clipboard?.writeText(txt).then(() => flashToast("Copié dans le presse-papier"), () => flashToast("Export indisponible"));
}
let toastTimer;
function flashToast(msg) {
  let t = $("#toast");
  if (!t) {
    t = el("div"); t.id = "toast"; document.body.appendChild(t);
    Object.assign(t.style, { position: "fixed", bottom: "84px", left: "50%", transform: "translateX(-50%)", background: "#D6FF3D", color: "#0B0B0C", padding: "11px 18px", borderRadius: "999px", fontWeight: "700", fontSize: "13px", zIndex: 99, transition: ".25s", boxShadow: "0 8px 24px -8px rgba(0,0,0,.6)", maxWidth: "90vw", textAlign: "center" });
  }
  t.textContent = msg; t.style.opacity = "1";
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { t.style.opacity = "0"; }, 1800);
}

/* ============ SÉANCE GUIDÉE ============ */
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
let guided = null; // { session, i, data:{exId:[{w,r}|null]}, saved }

function startGuided(sessionId) {
  const session = sessionById(sessionId);
  guided = { session, order: session.exercises.slice(), pos: 0, data: {}, warm: {}, saved: false };
  $("#guided").hidden = false;
  document.body.classList.add("guided-open");
  renderGuided();
}
function closeGuided() {
  persistGuided();
  guided = null;
  $("#guided").hidden = true;
  document.body.classList.remove("guided-open");
  stopRest();
  renderTrack();
}
function persistGuided() {
  if (!guided || guided.saved) return;
  guided.saved = true;
  const store = load();
  const iso = todayISO();
  let saved = false;
  Object.keys(guided.data).forEach(exId => {
    const sets = guided.data[exId].filter(s => s && s.w > 0 && s.r > 0);
    if (!sets.length) return;
    const bestSet = sets.reduce((b, s) => (s.w * s.r > b.w * b.r ? s : b), sets[0]);
    store[exId] = store[exId] || [];
    store[exId].push({ w: bestSet.w, r: bestSet.r, iso });
    store[exId].sort((a, b) => entryISO(a).localeCompare(entryISO(b)));
    saved = true;
  });
  if (saved) save(store);
}

function renderGuided() {
  const s = guided.session;
  $("#gSessionName").textContent = s.name;
  $("#gExCount").textContent = `Exercice ${guided.pos + 1}/${guided.order.length}`;
  $("#gBar").style.width = (guided.pos / guided.order.length * 100) + "%";
  $("#gPrev").hidden = false; $("#gNext").hidden = false; $("#gDone").hidden = true;
  $("#gPrev").disabled = guided.pos === 0;
  $("#gNext").textContent = guided.pos === guided.order.length - 1 ? "Terminer 💪" : "Suivant ›";
  renderGuidedExercise();
}

function renderGuidedExercise() {
  const ex = guided.order[guided.pos];
  const last = (load()[ex.id] || []).slice(-1)[0];
  if (!guided.data[ex.id]) guided.data[ex.id] = new Array(ex.sets).fill(null);
  const sets = guided.data[ex.id];

  // séries d'approche : seulement sur le 1er exo de la séance
  const isFirst = ex.id === guided.session.exercises[0].id;
  let warmHTML = "";
  if (isFirst) {
    if (!guided.warm[ex.id]) guided.warm[ex.id] = [];
    const done = guided.warm[ex.id];
    let warmSets = null;
    if (last) {
      const w1 = Math.max(1, Math.round(last.w * 0.4));
      const w2 = Math.max(1, Math.round(last.w * 0.65));
      warmSets = [{ w: w1, r: 10 }, { w: w2, r: 5 }];
    }
    warmHTML = `<div class="g-warm">
      <span class="g-warm-title">🔥 Échauffement — séries d'approche</span>
      ${warmSets
        ? `<div class="g-warm-sets">${warmSets.map((s, i) => `<button class="g-warm-chip${done[i] ? " done" : ""}" data-i="${i}" type="button">${done[i] ? "✓ " : ""}~${s.w}kg × ${s.r}</button>`).join("")}</div>`
        : `<p class="g-warm-empty">Première fois sur cet exo : fais 2 séries très légères pour sentir le mouvement avant d'attaquer tes vraies séries.</p>`}
      <span class="g-warm-hint">Elles comptent pas dans ton suivi. Repos court entre (~45s).</span>
    </div>`;
  }

  let html = `<div class="g-ex">
    <span class="g-ex-target">${ex.sets} × ${ex.reps} reps · repos ${ex.rest}</span>
    <h2 class="g-ex-name">${esc(ex.name)}</h2>
    ${ex.alt ? `<span class="g-ex-alt">${esc(ex.alt)}</span>` : ""}
    ${last
      ? `<div class="g-last">Dernière fois : <b>${last.w}kg × ${last.r}</b> — fais au moins pareil, voire plus 💪</div>`
      : `<div class="g-last muted">Première fois : trouve un poids où tu finis tes reps proprement.</div>`}
    ${warmHTML}
    <div class="g-sets">`;
  for (let k = 0; k < ex.sets; k++) {
    const d = sets[k];
    html += `<div class="g-set${d ? " done" : ""}">
      <span class="g-set-n">${k + 1}</span>
      <input class="g-w" type="number" inputmode="decimal" placeholder="kg" value="${d ? d.w : (last ? last.w : "")}">
      <span class="g-x">×</span>
      <input class="g-r" type="number" inputmode="numeric" placeholder="reps" value="${d ? d.r : ""}">
      <button class="g-check" data-k="${k}" type="button">${d ? "✓" : "OK"}</button>
    </div>`;
  }
  html += `</div>
    <div class="g-actions">
      <button class="g-busy" id="gBusy" type="button"><svg viewBox="0 0 24 24"><path d="M12 6V3L8 7l4 4V8a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5H5a7 7 0 0 0 7 7 7 7 0 0 0 7-7c0-3.87-3.13-7-7-7z"/></svg> Machine occupée</button>
      <button class="g-skip" id="gSkip" type="button">Passer l'exo ›</button>
    </div>
  </div>`;
  $("#gBody").innerHTML = html;
  $("#gBody").scrollTop = 0;

  const busyBtn = $("#gBusy");
  busyBtn.onclick = machineBusy;
  busyBtn.disabled = guided.pos >= guided.order.length - 1;
  $("#gSkip").onclick = skipExercise;

  $$(".g-warm-chip", $("#gBody")).forEach(btn => {
    btn.onclick = () => {
      const i = +btn.dataset.i;
      guided.warm[ex.id][i] = !guided.warm[ex.id][i];
      renderGuidedExercise();
    };
  });

  $$(".g-check", $("#gBody")).forEach(btn => {
    btn.onclick = () => {
      const k = +btn.dataset.k;
      const row = btn.closest(".g-set");
      const w = parseFloat($(".g-w", row).value);
      const r = parseInt($(".g-r", row).value, 10);
      if (isNaN(w) || isNaN(r) || w <= 0 || r <= 0) { $(".g-w", row).focus(); return; }
      const already = !!guided.data[ex.id][k];
      guided.data[ex.id][k] = { w, r };
      renderGuidedExercise();
      if (!already) startRest(ex.name, restSeconds(ex.rest)); // timer auto à la validation
    };
  });
}

function guidedNext() {
  if (guided.pos === guided.order.length - 1) { finishGuided(); return; }
  guided.pos++; renderGuided();
}
function guidedPrev() { if (guided.pos > 0) { guided.pos--; renderGuided(); } }

function skipExercise() {
  if (!confirm("Passer cet exercice ? Essaie de pas le zapper si tu peux 😏")) return;
  const ex = guided.order[guided.pos];
  delete guided.data[ex.id]; // pas de données pour un exo zappé
  guided.order.splice(guided.pos, 1);
  stopRest();
  if (guided.pos >= guided.order.length) { finishGuided(); return; }
  renderGuided();
  flashToast("Exo passé");
}

function machineBusy() {
  if (guided.pos >= guided.order.length - 1) { flashToast("C'est déjà le dernier exo"); return; }
  const ex = guided.order[guided.pos];
  guided.order.splice(guided.pos, 1);      // on retire l'exo courant
  guided.order.splice(guided.pos + 1, 0, ex); // et on le remet juste après le prochain
  stopRest();
  renderGuided(); // pos ne bouge pas → pointe maintenant sur l'exo suivant
  flashToast("Machine occupée — on y revient juste après 🔄");
}

function finishGuided() {
  persistGuided();
  const s = guided.session;
  let exDone = 0, setsDone = 0, volume = 0;
  Object.keys(guided.data).forEach(exId => {
    const done = guided.data[exId].filter(x => x && x.w > 0 && x.r > 0);
    if (done.length) { exDone++; setsDone += done.length; done.forEach(x => volume += x.w * x.r); }
  });
  $("#gBar").style.width = "100%";
  $("#gExCount").textContent = "Terminée";
  $("#gBody").innerHTML = `<div class="g-finish">
    <div class="g-finish-badge">💪</div>
    <h2 class="g-finish-title">Séance terminée</h2>
    <p class="g-finish-sub">${s.name} — bien joué Yanis</p>
    <div class="g-finish-stats">
      <div><b>${exDone}</b><span>exercices</span></div>
      <div><b>${setsDone}</b><span>séries</span></div>
      <div><b>${Math.round(volume)}</b><span>kg soulevés</span></div>
    </div>
    <p class="g-finish-note">Tout est enregistré dans ton historique. Maintenant : mange tes 3000 kcal et dors bien, c'est là que le muscle se construit.</p>
  </div>`;
  $("#gPrev").hidden = true; $("#gNext").hidden = true; $("#gDone").hidden = false;
  stopRest();
}

/* ============ NAVIGATION ============ */
function switchView(target) {
  document.querySelectorAll(".view").forEach(v => v.classList.toggle("hidden", v.dataset.view !== target));
  document.querySelectorAll(".tab").forEach(t => t.classList.toggle("active", t.dataset.target === target));
  if (target === "historique") renderHistory();
  if (target === "suivi") renderTrack();
  window.scrollTo({ top: 0 });
}
document.querySelectorAll(".tab").forEach(t => t.onclick = () => switchView(t.dataset.target));

/* ============ DAY HINT ============ */
function dayHint() {
  const idx = (new Date().getDay() + 6) % 7;
  const sid = schedule[idx];
  $("#dayHint").textContent = sid === "rest" ? "Auj · Repos" : "Auj · " + sessionById(sid).name;
}

/* ============ INIT ============ */
renderWeek();
renderPicker();
renderSession();
renderNutrition();
fillTrackSelect();
renderTrack();
dayHint();

$("#editWeekBtn").onclick = toggleWeekEdit;
$("#exportBtn").onclick = exportData;
$("#calPrev").onclick = () => { calRef = new Date(calRef.getFullYear(), calRef.getMonth() - 1, 1); renderHistory(); };
$("#calNext").onclick = () => { calRef = new Date(calRef.getFullYear(), calRef.getMonth() + 1, 1); renderHistory(); };

// poids de corps
$("#bwBtn").onclick = () => {
  const kg = parseFloat($("#bwInput").value);
  if (isNaN(kg) || kg <= 0) { $("#bwInput").focus(); return; }
  const arr = loadBW();
  const iso = todayISO();
  const existing = arr.find(e => e.iso === iso);
  if (existing) existing.kg = kg; else arr.push({ iso, kg });
  saveBW(arr);
  $("#bwInput").value = "";
  renderBodyweight();
  flashToast(`Poids enregistré · ${kg} kg`);
};
$("#bwInput").addEventListener("keydown", e => { if (e.key === "Enter") $("#bwBtn").click(); });

// timer de repos
$("#rtStop").onclick = () => stopRest();
$("#rtMinus").onclick = () => adjustRest(-15);
$("#rtPlus").onclick = () => adjustRest(15);

// séance guidée
$("#gClose").onclick = closeGuided;
$("#gPrev").onclick = guidedPrev;
$("#gNext").onclick = guidedNext;
$("#gDone").onclick = closeGuided;

/* ============ PWA ============ */
if ("serviceWorker" in navigator) window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
