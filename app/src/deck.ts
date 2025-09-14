export type CardId = number

export interface Card {
  id: CardId
  name: string
  cost: number
  income: number
  score: number
  pollution: number
}

let nextCardId = 1

const _createCards = (name: string, count: number, cost: number, income: number, score: number, pollution: number): Array<Card> => 
  Array(count).fill(null).map(() => ({
    id: nextCardId++,
    name,
    cost,
    income,
    score,
    pollution
  }))

export const DECK: Array<Card> = [
  // name, count, cost, income, score, pollution
  ..._createCards("Centrale à charbon", 3, 5, 5, 0, 5),
  ..._createCards("Centrale à gaz", 3, 6, 4, 0, 4),
  ..._createCards("Eoliennes", 3, 5, 1, 1, 0),
  ..._createCards("Solaires", 3, 4, 1, 1, 0),
  ..._createCards("Barrages hydroliques", 1, 6, 1, 1, 0),
  ..._createCards("Centrale nucléaire", 2, 15, 4, 0, 1),
  ..._createCards("Taxe carbone", 1, 30, 3, 5, -2),
  ..._createCards("Transports durables", 2, 16, 0, 5, -1),
  ..._createCards("Rénovation thermique", 1, 22, 1, 5, -2),
  ..._createCards("Restauration environnement", 2, 18, 0, 5, -2),
  ..._createCards("Economie circulaire", 1, 13, 2, 3, 0),
  ..._createCards("Capture de carbone", 1, 10, 0, 3, -1),
  ..._createCards("Industrie de pointe", 2, 17, 1, 3, 2),
  ..._createCards("Agroécologie", 1, 12, 1, 2, 0),
  ..._createCards("Permaculture", 1, 10, 0, 3, 0),
  ..._createCards("Agroforesterie", 1, 16, 1, 4, 0),
]

export const findCards = (cardIds: Array<CardId>) =>
  DECK.filter(card => cardIds.includes(card.id))