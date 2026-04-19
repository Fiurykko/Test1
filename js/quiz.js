const QUIZ_LENGTH = 10;
let allQuestions = [];
let questions = [];
let current = 0;
let score = 0;
let wrongQuestions = [];

const quizArea = document.getElementById("quizArea");

async function init() {
  try {
    allQuestions = await loadJSON("data/quiz.json");
  } catch (e) {
    quizArea.innerHTML = `<div class="empty-state">Impossibile caricare le domande. Avvia il sito tramite un server (vedi README).</div>`;
    return;
  }
  renderLevelFilter(document.getElementById("levelFilter"), startQuiz);
  startQuiz();
}

function startQuiz(onlyWrong = false) {
  const level = getSelectedLevel();
  let pool = onlyWrong && wrongQuestions.length > 0
    ? wrongQuestions
    : filterByLevel(allQuestions, level);
  if (pool.length === 0) {
    quizArea.innerHTML = `<div class="empty-state">Nessuna domanda per questo livello. Cambia filtro!</div>`;
    return;
  }
  questions = shuffle(pool).slice(0, Math.min(QUIZ_LENGTH, pool.length));
  current = 0;
  score = 0;
  wrongQuestions = [];
  renderQuestion();
}

function renderQuestion() {
  if (current >= questions.length) return renderResults();
  const q = questions[current];
  quizArea.innerHTML = `
    <div class="progress">Domanda ${current + 1} di ${questions.length}</div>
    <div class="quiz-question">
      <div class="q-text">${q.question}</div>
      <div class="options">
        ${q.options.map((opt, i) => `<button data-i="${i}">${opt}</button>`).join("")}
      </div>
      <div class="feedback" id="feedback" style="display:none;"></div>
    </div>
  `;
  quizArea.querySelectorAll(".options button").forEach(btn => {
    btn.addEventListener("click", () => answer(parseInt(btn.dataset.i, 10)));
  });
}

function answer(choice) {
  const q = questions[current];
  const buttons = quizArea.querySelectorAll(".options button");
  buttons.forEach((b, i) => {
    b.disabled = true;
    if (i === q.answer) b.classList.add("correct");
    else if (i === choice) b.classList.add("wrong");
  });
  const correct = choice === q.answer;
  if (correct) score++;
  else wrongQuestions.push(q);

  const fb = document.getElementById("feedback");
  fb.style.display = "block";
  fb.classList.add(correct ? "correct" : "wrong");
  fb.innerHTML = `<strong>${correct ? "Esatto!" : "Sbagliato."}</strong> ${q.explanation}
    <div style="margin-top:10px;"><button class="btn" id="nextBtn">${current + 1 === questions.length ? "Vedi risultato" : "Prossima →"}</button></div>`;
  document.getElementById("nextBtn").addEventListener("click", () => {
    current++;
    renderQuestion();
  });
}

function renderResults() {
  const pct = Math.round((score / questions.length) * 100);
  quizArea.innerHTML = `
    <div class="score-card">
      <div class="big">${score} / ${questions.length}</div>
      <p>Hai risposto correttamente al <strong>${pct}%</strong> delle domande.</p>
      <div class="actions">
        <button class="btn" id="restart">Nuovo quiz</button>
        ${wrongQuestions.length > 0 ? `<button class="btn ghost" id="redoWrong">Rifai le sbagliate (${wrongQuestions.length})</button>` : ""}
      </div>
    </div>
  `;
  document.getElementById("restart").addEventListener("click", () => startQuiz(false));
  const redoBtn = document.getElementById("redoWrong");
  if (redoBtn) redoBtn.addEventListener("click", () => startQuiz(true));
}

init();
