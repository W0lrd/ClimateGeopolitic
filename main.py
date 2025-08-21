import random

# --------------------
# Card Definition
# --------------------
class Card:
    def __init__(self, name, cost, income, score, pollution):
        self.name = name
        self.cost = cost
        self.income = income
        self.score = score
        self.pollution = pollution

    def __repr__(self):
        return f"{self.name} (Cost:{self.cost}, Income:{self.income}, Score:{self.score}, Pollution:{self.pollution})"

# --------------------
# Player Definition
# --------------------
class Player:
    def __init__(self, name, is_human=False, strategy="balanced"):
        self.name = name
        self.is_human = is_human
        self.strategy = strategy
        self.money = random.randint(12, 16)
        self.score = 0
        self.pollution = 0
        self.income_money = 0
        self.income_score = 0
        self.income_pollution = 0
        self.hand = []  # Available cards to play
        self.deck = []  # Personal deck

    def buy_card(self, card):
        if self.money >= card.cost:
            self.money -= card.cost
            self.income_money += card.income
            self.income_score += card.score
            self.income_pollution += card.pollution
            return True
        return False

    def apply_income(self):
        self.money += self.income_money
        self.score += self.income_score
        self.pollution += self.income_pollution
        return self.income_pollution

# --------------------
# Game Setup
# --------------------
cards_data = [
    ("Centrale à charbon", 3, 5, 5, 0, 5),
    ("Centrale à gaz", 3, 6, 4, 0, 4),
    ("Eoliennes", 3, 5, 1, 1, 0),
    ("Solaires", 3, 4, 1, 1, 0),
    ("Barrages hydroliques", 1, 6, 1, 1, 0),
    ("Centrale nucléaire", 2, 15, 4, 0, 1),
    ("Taxe carbone", 1, 30, 3, 5, -2),
    ("Transports durables", 2, 16, 0, 5, -1),
    ("Rénovation thermique", 1, 22, 1, 5, -2),
    ("Restauration environnement", 2, 18, 0, 5, -2),
    ("Economie circulaire", 1, 13, 2, 3, 0),
    ("Capture de carbone", 1, 10, 0, 3, -1),
    ("Industrie de pointe", 2, 17, 1, 3, 2),
    ("Agroécologie", 1, 12, 1, 2, 0),
    ("Permaculture", 1, 10, 0, 3, 0),
    ("Agroforesterie", 1, 16, 1, 4, 0),
]

# Create a base deck
base_deck = []
for name, count, cost, income, score, pollution in cards_data:
    for _ in range(count):
        base_deck.append(Card(name, cost, income, score, pollution))

# --------------------
# Starting Hand
# --------------------
def starting_hand():
    hand = []
    predefined = ["Centrale à charbon", "Centrale à charbon",
                  "Centrale à gaz", "Centrale à gaz",
                  "Eoliennes", "Eoliennes",
                  "Solaires", "Solaires"]
    for name in predefined:
        for c in base_deck:
            if c.name == name:
                hand.append(Card(c.name, c.cost, c.income, c.score, c.pollution))
                break
    return hand

# --------------------
# AI Buying Strategy
# --------------------
def ai_choose_cards(ai, global_pollution, player_pollution):
    while True:
        affordable = [c for c in ai.hand if c.cost <= ai.money]
        if not affordable:
            break

        if ai.strategy == "greedy":
            affordable.sort(key=lambda c: c.income, reverse=True)
        elif ai.strategy == "eco":
            affordable.sort(key=lambda c: c.pollution)
        elif ai.strategy == "reactive":
            if player_pollution > global_pollution / 3:
                affordable.sort(key=lambda c: c.pollution)
            else:
                affordable.sort(key=lambda c: c.income, reverse=True)
        else:  # balanced
            random.shuffle(affordable)

        chosen = affordable[0]
        if ai.buy_card(chosen):
            print(f"[DEBUG] {ai.name} bought {chosen}")
            ai.hand.remove(chosen)
        else:
            break

# --------------------
# Main Game Loop
# --------------------
def play_game():
    global_pollution = 0

    # Init players
    human = Player("You", is_human=True)
    ai1 = Player("AI Greedy", strategy="greedy")
    ai2 = Player("AI Eco", strategy="eco")
    ai3 = Player("AI Reactive", strategy="reactive")
    players = [human, ai1, ai2, ai3]

    # Assign starting hands + personal decks
    for p in players:
        p.hand = starting_hand()
        p.deck = base_deck[:]
        random.shuffle(p.deck)

    turn = 1
    while global_pollution < 300:
        print(f"\n--- Turn {turn} ---")

        for p in players:
            # Draw 2 new cards each turn
            draw = random.sample(p.deck, min(2, len(p.deck)))
            for c in draw:
                p.hand.append(c)
                p.deck.remove(c)

#            print(f"[DEBUG] {p.name} hand: {[c.name for c in p.hand]}")

            if p.is_human:
                print(f"Your money: {p.money}")
                print("Your hand:")
                for i, c in enumerate(p.hand):
                    print(f"  {i+1}. {c}")
                while True:
                    choice = input("Choose a card number to buy (Enter to end turn): ")
                    if not choice:
                        break
                    if choice.isdigit():
                        idx = int(choice) - 1
                        if 0 <= idx < len(p.hand):
                            chosen = p.hand[idx]
                            if p.buy_card(chosen):
                                print(f"You bought {chosen}")
                                p.hand.remove(chosen)
                            else:
                                print("Not enough money!")
            else:
                ai_choose_cards(p, global_pollution, human.pollution)

        # Apply incomes & pollution
        for p in players:
            global_pollution += p.apply_income()
            print(f"{p.name}: Money {p.money}, Income {p.income_money}, Score {p.score}, Pollution {p.income_pollution}")
        global_pollution -= 10

        print("Global pollution:", global_pollution)
        turn += 1

    print("\n--- Game Over ---")
    for p in players:
        print(f"{p.name}: Money {p.money}, Income {p.income_money}, Total Score {p.score}, Total Pollution {p.pollution}")

if __name__ == "__main__":
    play_game()
