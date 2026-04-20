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

// Priority list of high-quality TTS voices to prefer over robotic system voices.
const PREFERRED_VOICES = [
  "Google UK English Female",
  "Google UK English Male",
  "Google US English",
  "Microsoft Libby Online (Natural) - English (United Kingdom)",
  "Microsoft Ryan Online (Natural) - English (United Kingdom)",
  "Microsoft Jenny Online (Natural) - English (United States)",
];

function getBestVoice() {
  const voices = window.speechSynthesis.getVoices();
  for (const name of PREFERRED_VOICES) {
    const v = voices.find(v => v.name === name);
    if (v) return v;
  }
  return voices.find(v => v.lang === "en-GB") || voices.find(v => v.lang.startsWith("en")) || null;
}

function speakTTS(text) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "en-GB";
  utter.rate = 0.92;
  const voice = getBestVoice();
  if (voice) utter.voice = voice;
  window.speechSynthesis.speak(utter);
}

// Speak a single word/expression using real recorded audio from the Free Dictionary API.
// Falls back to TTS if no audio is found or the fetch fails.
async function speakWord(text) {
  // Strip "to " prefix so "to eat" looks up "eat".
  const lookup = text.replace(/^to\s+/i, "").trim().split(/[\s,]+/)[0];
  try {
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(lookup)}`);
    if (res.ok) {
      const data = await res.json();
      const phonetics = data[0]?.phonetics ?? [];
      let audioUrl = phonetics.find(p => p.audio)?.audio ?? "";
      if (audioUrl) {
        if (audioUrl.startsWith("//")) audioUrl = "https:" + audioUrl;
        new Audio(audioUrl).play();
        return;
      }
    }
  } catch (_) {}
  // Fallback: TTS for the full original text.
  speakTTS(text);
}

// Sentences go straight to TTS (dictionary API only handles single words).
function speakSentence(text) {
  speakTTS(text);
}

// Some browsers load voices asynchronously; trigger a load early.
if ("speechSynthesis" in window) {
  window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
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
