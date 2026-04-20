let allWords = [];
let deck = [];
let currentIndex = 0;
let flipped = false;
let mode = "all";

const cardArea = document.getElementById("cardArea");
const actions = document.getElementById("actions");
const progress = document.getElementById("progress");

async function init() {
  try {
    allWords = await loadJSON("data/vocabulary.json");
  } catch (e) {
    cardArea.innerHTML = `<div class="empty-state">Impossibile caricare i vocaboli. Avvia il sito tramite un server (vedi README).</div>`;
    return;
  }

  renderLevelFilter(document.getElementById("levelFilter"), () => buildDeck());

  document.querySelectorAll("#modeFilter button").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#modeFilter button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      mode = btn.dataset.mode;
      buildDeck();
    });
  });

  document.getElementById("knowBtn").addEventListener("click", () => {
    markKnown(deck[currentIndex].en);
    next();
  });
  document.getElementById("reviewBtn").addEventListener("click", () => {
    markReview(deck[currentIndex].en);
    next();
  });
  document.getElementById("skipBtn").addEventListener("click", next);

  buildDeck();
}

function buildDeck() {
  const level = getSelectedLevel();
  let words = filterByLevel(allWords, level);
  const known = getSet(KNOWN_KEY);
  const review = getSet(REVIEW_KEY);
  if (mode === "new") words = words.filter(w => !known.has(w.en) && !review.has(w.en));
  else if (mode === "review") words = words.filter(w => review.has(w.en));
  deck = shuffle(words);
  currentIndex = 0;
  flipped = false;
  render();
}

function render() {
  if (deck.length === 0) {
    cardArea.innerHTML = `<div class="empty-state">Nessuna parola in questa selezione. Prova a cambiare livello o modalità!</div>`;
    actions.style.display = "none";
    progress.textContent = "";
    return;
  }
  if (currentIndex >= deck.length) {
    cardArea.innerHTML = `<div class="empty-state">🎉 Hai finito il mazzo! Cambia filtro o ricarica per ricominciare.</div>`;
    actions.style.display = "none";
    progress.textContent = "";
    return;
  }
  const w = deck[currentIndex];
  progress.textContent = `Parola ${currentIndex + 1} di ${deck.length}`;
  cardArea.innerHTML = `
    <div class="flashcard" id="card">
      ${flipped
        ? `<div class="translation">${w.it}</div>
           <div class="example">
             "${w.example}"
             <button class="speak-btn" data-speak="example" title="Ascolta la frase">🔊</button>
           </div>
           <span class="level-badge">${w.level}</span>`
        : `<div class="word">
             ${w.en}
             <button class="speak-btn" data-speak="word" title="Ascolta la pronuncia">🔊</button>
           </div>
           <div class="hint">(clicca per vedere la traduzione)</div>
           <span class="level-badge">${w.level}</span>`}
    </div>
  `;
  document.getElementById("card").addEventListener("click", () => {
    flipped = !flipped;
    render();
  });
  cardArea.querySelectorAll(".speak-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      speak(btn.dataset.speak === "example" ? w.example : w.en);
    });
  });
  actions.style.display = flipped ? "flex" : "none";
}

function next() {
  currentIndex++;
  flipped = false;
  render();
}

init();
