const LEVELS = ["A1", "A2", "B1", "B2"];
const LEVEL_KEY = "selectedLevel";

async function loadJSON(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error("Errore nel caricamento di " + path);
  return res.json();
}

function getSelectedLevel() {
  return localStorage.getItem(LEVEL_KEY) || "all";
}

function setSelectedLevel(level) {
  localStorage.setItem(LEVEL_KEY, level);
}

function filterByLevel(items, level) {
  if (!level || level === "all") return items;
  return items.filter(i => i.level === level);
}

function renderLevelFilter(container, onChange) {
  const current = getSelectedLevel();
  const buttons = [{ label: "Tutti", value: "all" }, ...LEVELS.map(l => ({ label: l, value: l }))];
  container.innerHTML = "";
  buttons.forEach(b => {
    const btn = document.createElement("button");
    btn.textContent = b.label;
    if (b.value === current) btn.classList.add("active");
    btn.addEventListener("click", () => {
      setSelectedLevel(b.value);
      container.querySelectorAll("button").forEach(x => x.classList.remove("active"));
      btn.classList.add("active");
      onChange(b.value);
    });
    container.appendChild(btn);
  });
}

function shuffle(array) {
  const a = array.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// localStorage helpers for flashcard knowledge
const KNOWN_KEY = "knownWords";
const REVIEW_KEY = "reviewWords";

function getSet(key) {
  try { return new Set(JSON.parse(localStorage.getItem(key) || "[]")); }
  catch { return new Set(); }
}

function saveSet(key, set) {
  localStorage.setItem(key, JSON.stringify([...set]));
}

function markKnown(word) {
  const known = getSet(KNOWN_KEY);
  const review = getSet(REVIEW_KEY);
  known.add(word);
  review.delete(word);
  saveSet(KNOWN_KEY, known);
  saveSet(REVIEW_KEY, review);
}

function markReview(word) {
  const known = getSet(KNOWN_KEY);
  const review = getSet(REVIEW_KEY);
  review.add(word);
  known.delete(word);
  saveSet(KNOWN_KEY, known);
  saveSet(REVIEW_KEY, review);
}
