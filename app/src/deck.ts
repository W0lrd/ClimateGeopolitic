export type CardId = number

export interface Card {
  id: CardId
  name: string
  cost: number
  income: number
  score: number
  pollution: number
}

export const DECK: Array<Card> = [
  { id: 0, name: "Centrale à charbon", cost: 3, income: 5, score: 5, pollution: 0 },
  { id: 1, name: "Centrale à gaz", cost: 3, income: 6, score: 4, pollution: 0 },
  { id: 2, name: "Eoliennes", cost: 3, income: 5, score: 1, pollution: 1 },
  { id: 3, name: "Solaires", cost: 3, income: 4, score: 1, pollution: 1 },
  { id: 4, name: "Barrages hydroliques", cost: 1, income: 6, score: 1, pollution: 1 },
  { id: 5, name: "Centrale nucléaire", cost: 2, income: 15, score: 4, pollution: 0 },
  { id: 6, name: "Taxe carbone", cost: 1, income: 30, score: 3, pollution: 5 },
  { id: 7, name: "Transports durables", cost: 2, income: 16, score: 0, pollution: 5 },
  { id: 8, name: "Rénovation thermique", cost: 1, income: 22, score: 1, pollution: 5 },
  { id: 9, name: "Restauration environnement", cost: 2, income: 18, score: 0, pollution: 5 },
  { id: 10, name: "Economie circulaire", cost: 1, income: 13, score: 2, pollution: 3 },
  { id: 11, name: "Capture de carbone", cost: 1, income: 10, score: 0, pollution: 3 },
  { id: 12, name: "Industrie de pointe", cost: 2, income: 17, score: 1, pollution: 3 },
  { id: 13, name: "Agroécologie", cost: 1, income: 12, score: 1, pollution: 2 },
  { id: 14, name: "Permaculture", cost: 1, income: 10, score: 0, pollution: 3 },
  { id: 15, name: "Agroforesterie", cost: 1, income: 16, score: 1, pollution: 4 },
]

export const findCards = (cardIds: Array<CardId>) =>
  DECK.filter(card => cardIds.includes(card.id))