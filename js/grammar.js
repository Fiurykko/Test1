let allTopics = [];
const area = document.getElementById("grammarArea");

async function init() {
  try {
    allTopics = await loadJSON("data/grammar.json");
  } catch (e) {
    area.innerHTML = `<div class="empty-state">Impossibile caricare le schede. Avvia il sito tramite un server (vedi README).</div>`;
    return;
  }
  renderLevelFilter(document.getElementById("levelFilter"), renderList);
  renderList();
}

function renderList() {
  const level = getSelectedLevel();
  const topics = filterByLevel(allTopics, level);
  if (topics.length === 0) {
    area.innerHTML = `<div class="empty-state">Nessuna scheda per questo livello.</div>`;
    return;
  }
  area.innerHTML = `
    <div class="grammar-list">
      ${topics.map(t => `
        <button class="grammar-item" data-id="${t.id}">
          <span>${t.title}</span>
          <span class="level-badge">${t.level}</span>
        </button>
      `).join("")}
    </div>
  `;
  area.querySelectorAll(".grammar-item").forEach(btn => {
    btn.addEventListener("click", () => renderTopic(btn.dataset.id));
  });
}

function renderTopic(id) {
  const t = allTopics.find(x => x.id === id);
  if (!t) return;
  area.innerHTML = `
    <button class="btn ghost" id="backBtn">← Torna all'elenco</button>
    <div class="grammar-content" style="margin-top:16px;">
      <h3>${t.title} <span class="level-badge">${t.level}</span></h3>
      ${t.content_html}
      <div class="examples-box">
        <strong>Esempi:</strong>
        <ul>${t.examples.map(e => `<li>${e}</li>`).join("")}</ul>
      </div>
    </div>
  `;
  document.getElementById("backBtn").addEventListener("click", renderList);
}

init();
