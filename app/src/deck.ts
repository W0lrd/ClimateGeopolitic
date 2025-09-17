import Charbon from './icons/cards/IconVector-01_Charbon.svg?react'
import Gaz from './icons/cards/IconVector-02_Gaz.svg?react'
import Eolienne from './icons/cards/IconVector-03_Eolienne.svg?react'
import Solaire from './icons/cards/IconVector-04_Solaire.svg?react'
import Hydro from './icons/cards/IconVector-05_Hydro.svg?react'
import Nucleair from './icons/cards/IconVector-06_Nucleair.svg?react'
import Taxe from './icons/cards/IconVector-07_Taxe.svg?react'
import Transports from './icons/cards/IconVector-08_Transports.svg?react'
import Renovation from './icons/cards/IconVector-09_Renovation.svg?react'
import Restauration from './icons/cards/IconVector-10_Restauration.svg?react'
import Circulaire from './icons/cards/IconVector-11_Circulaire.svg?react'
import Capture from './icons/cards/IconVector-12_Capture.svg?react'
import Industrie from './icons/cards/IconVector-13_Industrie.svg?react'
import Agroecologie from './icons/cards/IconVector-14_Agroecologie.svg?react'
import Permaculture from './icons/cards/IconVector-15_Permaculture.svg?react'
import Agroforesterie from './icons/cards/IconVector-16_Agroforesterie.svg?react'

export type CardId = number

type IconType = React.FC<React.SVGProps<SVGSVGElement>>

export interface Card {
  id: CardId
  name: string
  cost: number
  income: number
  score: number
  pollution: number
  icon: IconType
}

let nextCardId = 1

const _createCards = (name: string, count: number, cost: number, income: number, score: number, pollution: number, icon: IconType): Array<Card> => 
  Array(count).fill(null).map(() => ({
    id: nextCardId++,
    name,
    cost,
    income,
    score,
    pollution,
    icon
  }))

export const DECK: Array<Card> = [
  // name, count, cost, income, score, pollution
  ..._createCards("Centrale à charbon", 3, 5, 5, 0, 5, Charbon),
  ..._createCards("Centrale à gaz", 3, 6, 4, 0, 4, Gaz),
  ..._createCards("Eoliennes", 3, 5, 1, 1, 0, Eolienne),
  ..._createCards("Solaires", 3, 4, 1, 1, 0, Solaire),
  ..._createCards("Barrages hydroliques", 1, 6, 1, 1, 0, Hydro),
  ..._createCards("Centrale nucléaire", 2, 15, 4, 0, 1, Nucleair),
  ..._createCards("Taxe carbone", 1, 30, 3, 5, -2, Taxe),
  ..._createCards("Transports durables", 2, 16, 0, 5, -1, Transports),
  ..._createCards("Rénovation thermique", 1, 22, 1, 5, -2, Renovation),
  ..._createCards("Restauration environnement", 2, 18, 0, 5, -2, Restauration),
  ..._createCards("Economie circulaire", 1, 13, 2, 3, 0, Circulaire),
  ..._createCards("Capture de carbone", 1, 10, 0, 3, -1, Capture),
  ..._createCards("Industrie de pointe", 2, 17, 1, 3, 2, Industrie),
  ..._createCards("Agroécologie", 1, 12, 1, 2, 0, Agroecologie),
  ..._createCards("Permaculture", 1, 10, 0, 3, 0, Permaculture),
  ..._createCards("Agroforesterie", 1, 16, 1, 4, 0, Agroforesterie),
]

export const findCards = (cardIds: Array<CardId>) =>
  DECK.filter(card => cardIds.includes(card.id))