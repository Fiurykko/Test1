# English Practice

Sito personale per esercitare l'inglese ~10 minuti al giorno: **flashcard di vocaboli**, **quiz a scelta multipla**, **schede di grammatica**. Interfaccia in italiano, contenuti in inglese, livelli da A1 a B2.

Tutto il codice è HTML + CSS + JavaScript vanilla, senza build. I contenuti sono in semplici file JSON nella cartella `data/`.

## Avvio in locale

I file JSON vengono caricati con `fetch()`, quindi serve un piccolo server HTTP (non basta aprire il file `index.html` direttamente). Dalla cartella del progetto:

```bash
python3 -m http.server 8000
```

Poi apri http://localhost:8000 nel browser.

In alternativa puoi pubblicare il sito gratis con **GitHub Pages**: nelle impostazioni del repository, sezione *Pages*, scegli il branch e la cartella `/` (root).

## Aggiornamento settimanale

Tutto il contenuto è in `data/`. Per aggiungere materiale ogni settimana, basta modificare i file JSON e ricaricare la pagina.

### Aggiungere vocaboli — `data/vocabulary.json`

Aggiungi un oggetto in fondo all'array (ricordati la virgola!):

```json
{ "en": "to gather", "it": "raccogliere, riunire", "example": "We gathered around the fire.", "level": "B1", "week": 2 }
```

Campi:
- `en`: parola/espressione in inglese
- `it`: traduzione in italiano
- `example`: una frase di esempio in inglese
- `level`: `A1`, `A2`, `B1` o `B2`
- `week`: numero della settimana in cui l'hai aggiunta (utile per ricordare quando l'hai studiata)

### Aggiungere domande di quiz — `data/quiz.json`

```json
{
  "question": "She has worked here ___ five years.",
  "options": ["since", "for", "from", "ago"],
  "answer": 1,
  "explanation": "Con una durata si usa 'for'; 'since' richiede un punto preciso nel tempo.",
  "level": "B1",
  "week": 2
}
```

Attenzione: `answer` è l'**indice** della risposta giusta dentro `options`, partendo da **0**. Nell'esempio sopra, "for" è la seconda opzione → indice `1`.

### Aggiungere schede di grammatica — `data/grammar.json`

```json
{
  "id": "future-going-to",
  "title": "Future con 'going to'",
  "level": "A2",
  "content_html": "<p>Si usa per intenzioni o piani decisi prima di parlare...</p>",
  "examples": ["I'm going to study tonight.", "It's going to rain."]
}
```

L'`id` deve essere unico (lettere minuscole e trattini). In `content_html` puoi usare HTML semplice: `<p>`, `<h3>`, `<strong>`, `<ul>`, `<li>`, `<em>`.

## Struttura dei file

```
index.html              homepage
flashcards.html         flashcard vocaboli
quiz.html               quiz a scelta multipla
grammar.html            schede di grammatica
css/style.css           stile unico
js/common.js            caricamento JSON, filtri, localStorage
js/flashcards.js        logica flashcard
js/quiz.js              logica quiz
js/grammar.js           logica schede grammatica
data/vocabulary.json    vocaboli
data/quiz.json          domande quiz
data/grammar.json       schede grammatica
```

## Progressi salvati

Le parole che marchi come "Sapevo" o "Da ripassare" sono salvate nel `localStorage` del browser. Restano disponibili al prossimo accesso, ma sono legate al singolo browser/dispositivo.
