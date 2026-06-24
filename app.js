/* ============================================================
   Carnet d'entraînement — logique
   Données du programme + navigation + suivi des charges (localStorage)
   ============================================================ */

const PROGRAM = [
  {
    id: "upperA", name: "Upper A", focus: "Haut · Poussée", day: 0,
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
    id: "lowerA", name: "Lower A", focus: "Bas · Quadriceps", day: 1,
    exercises: [
      { id: "la1", name: "Presse à cuisses", alt: "Leg Press", sets: 4, reps: "10-12", rest: "2 min" },
      { id: "la2", name: "Leg extension", alt: "Quadriceps", sets: 4, reps: "12-15", rest: "90s" },
      { id: "la3", name: "Leg curl allongé", alt: "Ischios", sets: 4, reps: "12-15", rest: "90s" },
      { id: "la4", name: "Mollets à la presse", sets: 4, reps: "15-20", rest: "60s" },
      { id: "la5", name: "Abdos machine (crunch)", sets: 3, reps: "15-20", rest: "45s" },
    ],
    note: "Version « moins relou » : que des machines, zéro squat libre. ~40 min, et c'est plié."
  },
  {
    id: "upperB", name: "Upper B", focus: "Haut · Tirage", day: 3,
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
    id: "lowerB", name: "Lower B", focus: "Bas · Fessiers / Ischios", day: 4,
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

const WEEK = [
  { name: "Lun", tag: "Upper A", on: true },
  { name: "Mar", tag: "Lower A", on: true },
  { name: "Mer", tag: "Repos", on: false },
  { name: "Jeu", tag: "Upper B", on: true },
  { name: "Ven", tag: "Lower B", on: true },
  { name: "Sam", tag: "Repos", on: false },
  { name: "Dim", tag: "Repos", on: false },
];

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

const STORE_KEY = "carnet_yanis_v1";
const $ = (s, r = document) => r.querySelector(s);
const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

/* ---------- storage ---------- */
function load() { try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; } catch { return {}; } }
function save(data) { localStorage.setItem(STORE_KEY, JSON.stringify(data)); }

/* ---------- icons ---------- */
const CLOCK = '<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm1-13h-2v6l5 3 1-1.7-4-2.3z"/></svg>';

/* ============ SÉANCES ============ */
let currentSession = PROGRAM[0].id;

function renderWeek() {
  const strip = $("#weekStrip");
  strip.innerHTML = "";
  WEEK.forEach(d => {
    const c = el("div", "day" + (d.on ? " on" : " rest"));
    c.innerHTML = `<span class="d-name">${d.name}</span><span class="d-tag">${d.on ? d.tag : "—"}</span>`;
    strip.appendChild(c);
  });
}

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
  const s = PROGRAM.find(x => x.id === currentSession);
  const idx = PROGRAM.indexOf(s) + 1;
  const wrap = $("#sessionContent");
  wrap.innerHTML = "";

  const card = el("div", "session");
  const banner = el("div", "session-banner");
  banner.dataset.index = "0" + idx;
  banner.innerHTML = `
    <div>
      <h2>${s.name}</h2>
      <div class="s-focus">${s.focus}</div>
    </div>
    <div class="s-count"><b>${s.exercises.length}</b>exercices</div>`;
  card.appendChild(banner);

  s.exercises.forEach((ex, i) => {
    const row = el("div", "ex");
    row.innerHTML = `
      <div class="ex-num">${i + 1}</div>
      <div class="ex-body">
        <div class="ex-name">${esc(ex.name)}</div>
        ${ex.alt ? `<span class="ex-alt">${esc(ex.alt)}</span>` : ""}
      </div>
      <div class="ex-spec">
        <span class="ex-sets"><b>${ex.sets}</b> × ${ex.reps}</span>
        <span class="ex-rest">${CLOCK}${ex.rest}</span>
      </div>`;
    card.appendChild(row);
  });

  const note = el("div", "session-note");
  note.innerHTML = `<b>Note —</b><span>${esc(s.note)}</span>`;
  card.appendChild(note);
  wrap.appendChild(card);
}

/* ============ NUTRITION ============ */
function renderNutrition() {
  const ml = $("#mealList");
  ml.innerHTML = "";
  MEALS.forEach(m => {
    const row = el("div", "meal");
    row.innerHTML = `<div class="meal-when">${m.when}</div><div class="meal-what">${esc(m.what)}</div>`;
    ml.appendChild(row);
  });

  const mi = $("#macroInfo");
  mi.innerHTML = "";
  MACRO_INFO.forEach(m => {
    const c = el("div", "info-card");
    c.innerHTML = `<h3>${m.t} <span>${m.tag}</span></h3><p>${esc(m.d)}</p>`;
    mi.appendChild(c);
  });

  const sl = $("#suppList");
  sl.innerHTML = "";
  SUPPS.forEach(s => {
    const row = el("div", "supp");
    row.innerHTML = `<div class="supp-name">${s.name}</div><div class="supp-use">${esc(s.use)}</div>`;
    sl.appendChild(row);
  });
}

/* ============ SUIVI ============ */
let trackSession = PROGRAM[0].id;

function fillTrackSelect() {
  const sel = $("#trackSession");
  sel.innerHTML = "";
  PROGRAM.forEach(s => {
    const o = el("option"); o.value = s.id; o.textContent = `${s.name} — ${s.focus}`;
    sel.appendChild(o);
  });
  sel.value = trackSession;
  sel.onchange = () => { trackSession = sel.value; renderTrack(); };
}

function best(entries) {
  return entries.reduce((b, e) => (e.w * (e.r || 1) > b.w * (b.r || 1) ? e : b), entries[0]);
}

function renderTrack() {
  const data = load();
  const s = PROGRAM.find(x => x.id === trackSession);
  const wrap = $("#trackContent");
  wrap.innerHTML = "";

  s.exercises.forEach(ex => {
    const entries = (data[ex.id] || []);
    const last = entries[entries.length - 1];
    const rec = entries.length ? best(entries) : null;

    const card = el("div", "track-ex");
    card.innerHTML = `
      <div class="track-top">
        <div class="track-name">${esc(ex.name)}</div>
        <div class="track-target">${ex.sets}×${ex.reps}</div>
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
      entries.slice(-6).reverse().forEach(e => {
        const isBest = rec && e.d === rec.d && e.w === rec.w && e.r === rec.r;
        const chip = el("span", "hist-chip" + (isBest ? " best" : ""));
        chip.innerHTML = `${e.w}×${e.r} <small>${e.d}</small>`;
        histWrap.appendChild(chip);
      });
    }

    $(".track-add", card).onclick = () => {
      const w = parseFloat($("#w_" + ex.id, card).value);
      const r = parseInt($("#r_" + ex.id, card).value, 10);
      if (isNaN(w) || isNaN(r) || w <= 0 || r <= 0) {
        $("#w_" + ex.id, card).focus();
        return;
      }
      const d = new Date();
      const stamp = `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
      const store = load();
      store[ex.id] = store[ex.id] || [];
      store[ex.id].push({ w, r, d: stamp });
      save(store);
      renderTrack();
    };

    wrap.appendChild(card);
  });
}

function exportData() {
  const data = load();
  const s = PROGRAM.find(x => x.id === trackSession);
  let txt = `CARNET YANIS — ${s.name}\n\n`;
  s.exercises.forEach(ex => {
    const entries = data[ex.id] || [];
    txt += `• ${ex.name} (${ex.sets}×${ex.reps})\n`;
    txt += entries.length ? "  " + entries.map(e => `${e.w}kg×${e.r} (${e.d})`).join("  ·  ") + "\n\n" : "  —\n\n";
  });
  if (navigator.share) {
    navigator.share({ title: "Carnet Yanis", text: txt }).catch(() => copyFallback(txt));
  } else {
    copyFallback(txt);
  }
}
function copyFallback(txt) {
  navigator.clipboard?.writeText(txt).then(
    () => flashToast("Copié dans le presse-papier"),
    () => flashToast("Export indisponible")
  );
}
let toastTimer;
function flashToast(msg) {
  let t = $("#toast");
  if (!t) { t = el("div"); t.id = "toast"; document.body.appendChild(t);
    Object.assign(t.style, { position: "fixed", bottom: "84px", left: "50%", transform: "translateX(-50%)",
      background: "#D6FF3D", color: "#0B0B0C", padding: "11px 18px", borderRadius: "999px",
      fontWeight: "700", fontSize: "13px", zIndex: 99, transition: ".25s", boxShadow: "0 8px 24px -8px rgba(0,0,0,.6)" }); }
  t.textContent = msg; t.style.opacity = "1";
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { t.style.opacity = "0"; }, 1800);
}

/* ============ NAVIGATION ============ */
function switchView(target) {
  document.querySelectorAll(".view").forEach(v => v.classList.toggle("hidden", v.dataset.view !== target));
  document.querySelectorAll(".tab").forEach(t => t.classList.toggle("active", t.dataset.target === target));
  window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
}
document.querySelectorAll(".tab").forEach(t => t.onclick = () => switchView(t.dataset.target));

/* ============ DAY HINT ============ */
function dayHint() {
  const map = ["Repos", "Upper A", "Lower A", "Repos", "Upper B", "Lower B", "Repos"];
  // JS getDay: 0=dim..6=sam → on remap vers lun=0
  const js = new Date().getDay();
  const idx = (js + 6) % 7;
  const order = ["Upper A", "Lower A", "Repos", "Upper B", "Lower B", "Repos", "Repos"];
  const today = order[idx];
  $("#dayHint").textContent = today === "Repos" ? "Aujourd'hui · Repos" : "Auj · " + today;
}

/* ============ INIT ============ */
renderWeek();
renderPicker();
renderSession();
renderNutrition();
fillTrackSelect();
renderTrack();
dayHint();
$("#exportBtn").onclick = exportData;

/* ============ PWA ============ */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
}
