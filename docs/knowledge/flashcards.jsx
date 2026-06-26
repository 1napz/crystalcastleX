import { useState } from "react";

const defaultDecks = [
  {
    id: 1,
    name: "JavaScript Basics",
    emoji: "⚡",
    cards: [
      { q: "What is a closure?", a: "A function that retains access to its outer scope even after the outer function has returned." },
      { q: "What does `typeof null` return?", a: '"object" — a known quirk in JavaScript due to legacy reasons.' },
      { q: "What is event delegation?", a: "Attaching a single event listener to a parent element to handle events from its children." },
      { q: "What is the difference between `==` and `===`?", a: "`==` does type coercion before comparing. `===` compares value AND type strictly." },
      { q: "What is a Promise?", a: "An object representing the eventual completion or failure of an asynchronous operation." },
    ],
  },
  {
    id: 2,
    name: "World Capitals",
    emoji: "🌍",
    cards: [
      { q: "Capital of Japan", a: "Tokyo" },
      { q: "Capital of Brazil", a: "Brasília" },
      { q: "Capital of Australia", a: "Canberra" },
      { q: "Capital of Canada", a: "Ottawa" },
      { q: "Capital of Egypt", a: "Cairo" },
    ],
  },
  {
    id: 3,
    name: "Human Biology",
    emoji: "🧬",
    cards: [
      { q: "What is the powerhouse of the cell?", a: "The mitochondria — it produces ATP through cellular respiration." },
      { q: "How many bones are in the adult human body?", a: "206 bones." },
      { q: "What does DNA stand for?", a: "Deoxyribonucleic Acid." },
      { q: "What is the largest organ in the body?", a: "The skin." },
      { q: "How many chambers does the human heart have?", a: "4 chambers: right atrium, right ventricle, left atrium, left ventricle." },
    ],
  },
];

/**
 * Create a new array with the elements of the input array in randomized order.
 * @param {Array} arr - The array whose elements will be randomized.
 * @returns {Array} A new array containing the same elements as `arr` in random order.
 */
function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

/**
 * Flashcard study app component that manages decks, study sessions, and a UI for creating decks and cards.
 *
 * Renders a three-view interface ("home", "study", "add") that lets users:
 * - browse and start decks (shuffling cards for study),
 * - run interactive study sessions with card flipping, marking items as known or to review, and retrying missed cards,
 * - create new decks and add question/answer cards to existing decks.
 *
 * @returns {JSX.Element} The React element for the flashcard application UI.
 */
export default function FlashcardApp() {
  const [decks, setDecks] = useState(defaultDecks);
  const [activeDeck, setActiveDeck] = useState(null);
  const [cards, setCards] = useState([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState([]);
  const [unknown, setUnknown] = useState([]);
  const [done, setDone] = useState(false);
  const [view, setView] = useState("home"); // home | study | add
  const [newDeckName, setNewDeckName] = useState("");
  const [newQ, setNewQ] = useState("");
  const [newA, setNewA] = useState("");
  const [selectedDeckForAdd, setSelectedDeckForAdd] = useState(null);
  const [animDir, setAnimDir] = useState(null);

  const startDeck = (deck) => {
    setActiveDeck(deck);
    setCards(shuffle(deck.cards));
    setIndex(0);
    setFlipped(false);
    setKnown([]);
    setUnknown([]);
    setDone(false);
    setView("study");
  };

  const handleMark = (correct) => {
    setAnimDir(correct ? "right" : "left");
    setTimeout(() => {
      const current = cards[index];
      if (correct) setKnown((k) => [...k, current]);
      else setUnknown((u) => [...u, current]);
      const next = index + 1;
      if (next >= cards.length) {
        setDone(true);
      } else {
        setIndex(next);
        setFlipped(false);
      }
      setAnimDir(null);
    }, 350);
  };

  const retryUnknown = () => {
    setCards(shuffle(unknown));
    setIndex(0);
    setFlipped(false);
    setKnown([]);
    setUnknown([]);
    setDone(false);
  };

  const addCard = () => {
    if (!newQ.trim() || !newA.trim() || !selectedDeckForAdd) return;
    setDecks((prev) =>
      prev.map((d) =>
        d.id === selectedDeckForAdd
          ? { ...d, cards: [...d.cards, { q: newQ.trim(), a: newA.trim() }] }
          : d
      )
    );
    setNewQ("");
    setNewA("");
  };

  const addDeck = () => {
    if (!newDeckName.trim()) return;
    const newDeck = {
      id: Date.now(),
      name: newDeckName.trim(),
      emoji: "📚",
      cards: [],
    };
    setDecks((prev) => [...prev, newDeck]);
    setNewDeckName("");
    setSelectedDeckForAdd(newDeck.id);
  };

  return (
    <div style={styles.root}>
      <style>{css}</style>

      {/* Header */}
      <header style={styles.header}>
        <div style={styles.logo} onClick={() => setView("home")}>
          <span style={styles.logoMark}>◈</span>
          <span style={styles.logoText}>RECALL</span>
        </div>
        <nav style={styles.nav}>
          <button style={{ ...styles.navBtn, ...(view === "home" ? styles.navActive : {}) }} onClick={() => setView("home")}>Decks</button>
          <button style={{ ...styles.navBtn, ...(view === "add" ? styles.navActive : {}) }} onClick={() => setView("add")}>+ Add Cards</button>
        </nav>
      </header>

      {/* HOME */}
      {view === "home" && (
        <main style={styles.main}>
          <div style={styles.heroText}>
            <h1 style={styles.h1}>Your Study Decks</h1>
            <p style={styles.sub}>Pick a deck and start drilling.</p>
          </div>
          <div style={styles.deckGrid}>
            {decks.map((deck, i) => (
              <div key={deck.id} className="deck-card" style={{ ...styles.deckCard, animationDelay: `${i * 0.08}s` }} onClick={() => startDeck(deck)}>
                <div style={styles.deckEmoji}>{deck.emoji}</div>
                <div style={styles.deckName}>{deck.name}</div>
                <div style={styles.deckCount}>{deck.cards.length} cards</div>
                <div style={styles.deckArrow}>→</div>
              </div>
            ))}
          </div>
        </main>
      )}

      {/* STUDY */}
      {view === "study" && activeDeck && (
        <main style={styles.main}>
          {!done ? (
            <>
              <div style={styles.studyHeader}>
                <button style={styles.backBtn} onClick={() => setView("home")}>← Back</button>
                <span style={styles.deckTitle}>{activeDeck.emoji} {activeDeck.name}</span>
                <span style={styles.progress}>{index + 1} / {cards.length}</span>
              </div>

              <div style={styles.progressBar}>
                <div style={{ ...styles.progressFill, width: `${((index) / cards.length) * 100}%` }} />
              </div>

              {/* Card */}
              <div style={styles.cardScene} onClick={() => setFlipped(!flipped)}>
                <div className={`flashcard ${flipped ? "flipped" : ""} ${animDir === "right" ? "slide-right" : animDir === "left" ? "slide-left" : ""}`} style={styles.flashcard}>
                  <div style={styles.cardFront}>
                    <div style={styles.cardLabel}>QUESTION</div>
                    <div style={styles.cardText}>{cards[index]?.q}</div>
                    <div style={styles.tapHint}>tap to reveal ↓</div>
                  </div>
                  <div style={styles.cardBack}>
                    <div style={styles.cardLabel}>ANSWER</div>
                    <div style={styles.cardText}>{cards[index]?.a}</div>
                  </div>
                </div>
              </div>

              {flipped && (
                <div style={styles.actions} className="fade-in">
                  <button className="btn-no" style={styles.btnNo} onClick={() => handleMark(false)}>✗ Still Learning</button>
                  <button className="btn-yes" style={styles.btnYes} onClick={() => handleMark(true)}>✓ Got It</button>
                </div>
              )}

              <div style={styles.scoreRow}>
                <span style={styles.scoreGreen}>✓ {known.length}</span>
                <span style={styles.scoreRed}>✗ {unknown.length}</span>
              </div>
            </>
          ) : (
            <div style={styles.doneScreen} className="fade-in">
              <div style={styles.doneEmoji}>🎉</div>
              <h2 style={styles.doneTitle}>Session Complete</h2>
              <div style={styles.doneStats}>
                <div style={styles.statBox}>
                  <div style={styles.statNum}>{known.length}</div>
                  <div style={styles.statLabel}>Known</div>
                </div>
                <div style={styles.statBox}>
                  <div style={{ ...styles.statNum, color: "#e05c5c" }}>{unknown.length}</div>
                  <div style={styles.statLabel}>To Review</div>
                </div>
              </div>
              <div style={styles.doneActions}>
                {unknown.length > 0 && (
                  <button style={styles.retryBtn} onClick={retryUnknown}>Retry Missed ({unknown.length})</button>
                )}
                <button style={styles.homeBtn} onClick={() => setView("home")}>Back to Decks</button>
              </div>
            </div>
          )}
        </main>
      )}

      {/* ADD CARDS */}
      {view === "add" && (
        <main style={styles.main}>
          <h1 style={styles.h1}>Add Cards</h1>

          <div style={styles.addSection}>
            <h3 style={styles.sectionTitle}>Create New Deck</h3>
            <div style={styles.inputRow}>
              <input style={styles.input} placeholder="Deck name..." value={newDeckName} onChange={(e) => setNewDeckName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addDeck()} />
              <button style={styles.addBtn} onClick={addDeck}>Create</button>
            </div>
          </div>

          <div style={styles.addSection}>
            <h3 style={styles.sectionTitle}>Add Card to Deck</h3>
            <select style={styles.select} value={selectedDeckForAdd || ""} onChange={(e) => setSelectedDeckForAdd(Number(e.target.value))}>
              <option value="">Select a deck...</option>
              {decks.map((d) => <option key={d.id} value={d.id}>{d.emoji} {d.name}</option>)}
            </select>
            <input style={{ ...styles.input, marginTop: 12 }} placeholder="Question..." value={newQ} onChange={(e) => setNewQ(e.target.value)} />
            <textarea style={styles.textarea} placeholder="Answer..." value={newA} onChange={(e) => setNewA(e.target.value)} />
            <button style={styles.addBtn} onClick={addCard}>Add Card</button>
          </div>
        </main>
      )}
    </div>
  );
}

const styles = {
  root: { minHeight: "100vh", background: "#0e0e13", color: "#f0ede6", fontFamily: "'Georgia', serif", display: "flex", flexDirection: "column" },
  header: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 40px", borderBottom: "1px solid #1e1e2a" },
  logo: { display: "flex", alignItems: "center", gap: 10, cursor: "pointer" },
  logoMark: { fontSize: 22, color: "#c8a96e" },
  logoText: { fontSize: 18, fontFamily: "'Georgia', serif", letterSpacing: 6, color: "#f0ede6", fontWeight: "bold" },
  nav: { display: "flex", gap: 8 },
  navBtn: { background: "none", border: "1px solid #2a2a38", color: "#999", padding: "8px 20px", borderRadius: 6, cursor: "pointer", fontFamily: "inherit", fontSize: 13, letterSpacing: 1, transition: "all 0.2s" },
  navActive: { borderColor: "#c8a96e", color: "#c8a96e" },
  main: { flex: 1, padding: "48px 40px", maxWidth: 900, margin: "0 auto", width: "100%" },
  heroText: { marginBottom: 40 },
  h1: { fontSize: 36, fontWeight: "normal", letterSpacing: 2, marginBottom: 8, color: "#f0ede6" },
  sub: { color: "#666", fontSize: 15, letterSpacing: 1 },
  deckGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 20 },
  deckCard: { background: "#13131c", border: "1px solid #1e1e2a", borderRadius: 12, padding: "28px 24px", cursor: "pointer", position: "relative", transition: "all 0.25s", animation: "fadeUp 0.5s ease both" },
  deckEmoji: { fontSize: 32, marginBottom: 14 },
  deckName: { fontSize: 18, fontWeight: "bold", marginBottom: 6, letterSpacing: 0.5 },
  deckCount: { color: "#666", fontSize: 13, letterSpacing: 1 },
  deckArrow: { position: "absolute", right: 20, top: "50%", transform: "translateY(-50%)", fontSize: 20, color: "#c8a96e", opacity: 0, transition: "opacity 0.2s" },
  studyHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 },
  backBtn: { background: "none", border: "none", color: "#666", cursor: "pointer", fontFamily: "inherit", fontSize: 14, letterSpacing: 1 },
  deckTitle: { fontSize: 16, letterSpacing: 1, color: "#c8a96e" },
  progress: { color: "#666", fontSize: 14, letterSpacing: 1 },
  progressBar: { height: 3, background: "#1e1e2a", borderRadius: 2, marginBottom: 40, overflow: "hidden" },
  progressFill: { height: "100%", background: "#c8a96e", borderRadius: 2, transition: "width 0.4s ease" },
  cardScene: { perspective: 1200, marginBottom: 32, cursor: "pointer" },
  flashcard: { width: "100%", minHeight: 280, position: "relative", transformStyle: "preserve-3d", transition: "transform 0.55s cubic-bezier(0.23, 1, 0.32, 1)" },
  cardFront: { position: "absolute", inset: 0, backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", background: "#13131c", border: "1px solid #2a2a38", borderRadius: 16, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40, textAlign: "center" },
  cardBack: { position: "absolute", inset: 0, backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", transform: "rotateY(180deg)", background: "#1a1a10", border: "1px solid #c8a96e33", borderRadius: 16, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40, textAlign: "center" },
  cardLabel: { fontSize: 10, letterSpacing: 4, color: "#c8a96e", marginBottom: 20, opacity: 0.7 },
  cardText: { fontSize: 22, lineHeight: 1.6, color: "#f0ede6" },
  tapHint: { position: "absolute", bottom: 20, fontSize: 11, color: "#444", letterSpacing: 2 },
  actions: { display: "flex", gap: 16, justifyContent: "center", marginBottom: 24 },
  btnNo: { padding: "14px 36px", borderRadius: 8, border: "1px solid #e05c5c44", background: "#1a1010", color: "#e05c5c", cursor: "pointer", fontFamily: "inherit", fontSize: 15, letterSpacing: 1, transition: "all 0.2s" },
  btnYes: { padding: "14px 36px", borderRadius: 8, border: "1px solid #5ccc7044", background: "#0f1a10", color: "#5ccc70", cursor: "pointer", fontFamily: "inherit", fontSize: 15, letterSpacing: 1, transition: "all 0.2s" },
  scoreRow: { display: "flex", justifyContent: "center", gap: 32, fontSize: 14, letterSpacing: 1 },
  scoreGreen: { color: "#5ccc70" },
  scoreRed: { color: "#e05c5c" },
  doneScreen: { textAlign: "center", paddingTop: 40 },
  doneEmoji: { fontSize: 64, marginBottom: 20 },
  doneTitle: { fontSize: 32, fontWeight: "normal", letterSpacing: 3, marginBottom: 40 },
  doneStats: { display: "flex", gap: 32, justifyContent: "center", marginBottom: 48 },
  statBox: { background: "#13131c", border: "1px solid #1e1e2a", borderRadius: 12, padding: "24px 40px" },
  statNum: { fontSize: 48, color: "#5ccc70", marginBottom: 8 },
  statLabel: { color: "#666", fontSize: 13, letterSpacing: 2 },
  doneActions: { display: "flex", gap: 16, justifyContent: "center" },
  retryBtn: { padding: "14px 32px", background: "#c8a96e", color: "#0e0e13", border: "none", borderRadius: 8, cursor: "pointer", fontFamily: "inherit", fontSize: 15, letterSpacing: 1, fontWeight: "bold" },
  homeBtn: { padding: "14px 32px", background: "none", color: "#999", border: "1px solid #2a2a38", borderRadius: 8, cursor: "pointer", fontFamily: "inherit", fontSize: 15, letterSpacing: 1 },
  addSection: { background: "#13131c", border: "1px solid #1e1e2a", borderRadius: 12, padding: 28, marginBottom: 24 },
  sectionTitle: { fontSize: 14, letterSpacing: 3, color: "#c8a96e", marginBottom: 16, fontWeight: "normal" },
  inputRow: { display: "flex", gap: 12 },
  input: { flex: 1, background: "#0e0e13", border: "1px solid #2a2a38", borderRadius: 8, padding: "12px 16px", color: "#f0ede6", fontFamily: "inherit", fontSize: 15, outline: "none" },
  textarea: { width: "100%", background: "#0e0e13", border: "1px solid #2a2a38", borderRadius: 8, padding: "12px 16px", color: "#f0ede6", fontFamily: "inherit", fontSize: 15, outline: "none", resize: "vertical", minHeight: 90, marginTop: 12, boxSizing: "border-box" },
  select: { width: "100%", background: "#0e0e13", border: "1px solid #2a2a38", borderRadius: 8, padding: "12px 16px", color: "#f0ede6", fontFamily: "inherit", fontSize: 15, outline: "none" },
  addBtn: { marginTop: 12, padding: "12px 28px", background: "#c8a96e", color: "#0e0e13", border: "none", borderRadius: 8, cursor: "pointer", fontFamily: "inherit", fontSize: 14, letterSpacing: 1, fontWeight: "bold" },
};

const css = `
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .fade-in { animation: fadeUp 0.4s ease both; }
  .deck-card:hover { border-color: #c8a96e44 !important; transform: translateY(-3px); }
  .deck-card:hover > div:last-child { opacity: 1 !important; }
  .flashcard.flipped { transform: rotateY(180deg); }
  .flashcard.slide-right { animation: slideRight 0.35s ease forwards; }
  .flashcard.slide-left { animation: slideLeft 0.35s ease forwards; }
  @keyframes slideRight { to { transform: translateX(120%) rotateZ(10deg); opacity: 0; } }
  @keyframes slideLeft { to { transform: translateX(-120%) rotateZ(-10deg); opacity: 0; } }
  .btn-no:hover { background: #2a1010 !important; }
  .btn-yes:hover { background: #0f2a12 !important; }
`;
