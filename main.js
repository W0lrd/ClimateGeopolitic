// --------------------
// Card Definition
// --------------------
class Card {
  constructor(name, cost, income, score, pollution) {
    this.name = name;
    this.cost = cost;
    this.income = income;
    this.score = score;
    this.pollution = pollution;
  }

  toString() {
    return `${this.name} (Cost:${this.cost}, Income:${this.income}, Score:${this.score}, Pollution:${this.pollution})`;
  }
}

// --------------------
// Player Definition
// --------------------
class Player {
  constructor(name, isHuman = false, strategy = "balanced") {
    this.name = name;
    this.isHuman = isHuman;
    this.strategy = strategy;
    this.money = Math.floor(Math.random() * (16 - 12 + 1)) + 12; // 12–16
    this.score = 0;
    this.pollution = 0;
    this.hand = [];
    this.deck = [];
  }

  buyCard(card) {
    if (this.money >= card.cost) {
      this.money -= card.cost;
      return true;
    }
    return false;
  }

  applyIncome() {
    let income = 0, score = 0, pollution = 0;
    for (const c of this.hand) {
      income += c.income;
      score += c.score;
      pollution += c.pollution;
    }
    this.money += income;
    this.score += score;
    this.pollution += pollution;
    return pollution;
  }
}

// --------------------
// Game Setup
// --------------------
const cardsData = [
  ["Centrale à charbon", 3, 5, 5, 0, 5],
  ["Centrale à gaz", 3, 6, 4, 0, 4],
  ["Eoliennes", 3, 5, 1, 1, 0],
  ["Solaires", 3, 4, 1, 1, 0],
  ["Barrages hydroliques", 1, 6, 1, 1, 0],
  ["Centrale nucléaire", 2, 15, 4, 0, 1],
  ["Taxe carbone", 1, 30, 3, 5, -2],
  ["Transports durables", 2, 16, 0, 5, -1],
  ["Rénovation thermique", 1, 22, 1, 5, -2],
  ["Restauration environnement", 2, 18, 0, 5, -2],
  ["Economie circulaire", 1, 13, 2, 3, 0],
  ["Capture de carbone", 1, 10, 0, 3, -1],
  ["Industrie de pointe", 2, 17, 1, 3, 2],
  ["Agroécologie", 1, 12, 1, 2, 0],
  ["Permaculture", 1, 10, 0, 3, 0],
  ["Agroforesterie", 1, 16, 1, 4, 0],
];

const baseDeck = [];
for (const [name, count, cost, income, score, pollution] of cardsData) {
  for (let i = 0; i < count; i++) {
    baseDeck.push(new Card(name, cost, income, score, pollution));
  }
}

// --------------------
// Starting Hand
// --------------------
function startingHand() {
  const hand = [];
  const predefined = [
    "Centrale à charbon", "Centrale à charbon",
    "Centrale à gaz", "Centrale à gaz",
    "Eoliennes", "Eoliennes",
    "Solaires", "Solaires"
  ];
  for (const name of predefined) {
    for (const c of baseDeck) {
      if (c.name === name) {
        hand.push(new Card(c.name, c.cost, c.income, c.score, c.pollution));
        break;
      }
    }
  }
  return hand;
}

// --------------------
// AI Buying Strategy
// --------------------
function aiChooseCards(ai, globalPollution, playerPollution) {
  while (true) {
    const affordable = ai.hand.filter(c => c.cost <= ai.money);
    if (affordable.length === 0) break;

    if (ai.strategy === "greedy") {
      affordable.sort((a, b) => b.income - a.income);
    } else if (ai.strategy === "eco") {
      affordable.sort((a, b) => a.pollution - b.pollution);
    } else if (ai.strategy === "reactive") {
      if (playerPollution > globalPollution / 2) {
        affordable.sort((a, b) => a.pollution - b.pollution);
      } else {
        affordable.sort((a, b) => b.income - a.income);
      }
    } else { // balanced
      affordable.sort(() => Math.random() - 0.5);
    }

    const chosen = affordable[0];
    if (ai.buyCard(chosen)) {
      console.log(`[DEBUG] ${ai.name} bought ${chosen.toString()}`);
      ai.hand = ai.hand.filter(c => c !== chosen);
    } else {
      break;
    }
  }
}

// --------------------
// Main Game Loop
// --------------------
function playGame() {
  let globalPollution = 0;

  // Init players
  const human = new Player("You", true);
  const ai1 = new Player("AI Greedy", false, "greedy");
  const ai2 = new Player("AI Eco", false, "eco");
  const ai3 = new Player("AI Reactive", false, "reactive");
  const players = [human, ai1, ai2, ai3];

  // Assign starting hands + decks
  for (const p of players) {
    p.hand = startingHand();
    p.deck = [...baseDeck];
    shuffleArray(p.deck);
  }

  let turn = 1;
  while (globalPollution < 250) {
    console.log(`\n--- Turn ${turn} ---`);

    for (const p of players) {
      // Draw 2 new cards each turn
      const draw = sample(p.deck, Math.min(2, p.deck.length));
      for (const c of draw) {
        p.hand.push(c);
        p.deck = p.deck.filter(x => x !== c);
      }

      console.log(`[DEBUG] ${p.name} hand: ${p.hand.map(c => c.name).join(", ")}`);

      if (p.isHuman) {
        console.log(`Your money: ${p.money}`);
        console.log("Your hand:");
        p.hand.forEach((c, i) => {
          console.log(`  ${i + 1}. ${c.toString()}`);
        });
        // TODO: Replace with readline/prompt for interactivity
        // For now, simulate "end turn"
      } else {
        aiChooseCards(p, globalPollution, human.pollution);
      }
    }

    // Apply incomes & pollution
    for (const p of players) {
      globalPollution += p.applyIncome();
    }

    console.log("Global pollution:", globalPollution);
    turn++;
  }

  console.log("\n--- Game Over ---");
  for (const p of players) {
    console.log(`${p.name}: Score ${p.score}, Money ${p.money}, Pollution ${p.pollution}`);
  }
}

// --------------------
// Helper Functions
// --------------------
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function sample(arr, n) {
  const copy = [...arr];
  shuffleArray(copy);
  return copy.slice(0, n);
}

// Run game
playGame();
