import Charbon from './icons/cards_v2/IconVector-V2_01-Charbon.svg?react'
import Gaz from './icons/cards_v2/IconVector-V2_02-Gaz.svg?react'
import Eolienne from './icons/cards_v2/IconVector-V2_03-Eoliennes.svg?react'
import Solaire from './icons/cards_v2/IconVector-V2_04-Solaire.svg?react'
import Hydro from './icons/cards_v2/IconVector-V2_05-Hydro.svg?react'
import Nucleaire from './icons/cards_v2/IconVector-V2_06-Nucleaire.svg?react'
import Taxe from './icons/cards_v2/IconVector-V2_07-Taxe.svg?react'
import Transports from './icons/cards_v2/IconVector-V2_08-Transports.svg?react'
import Renovation from './icons/cards_v2/IconVector-V2_09-Renovation.svg?react'
import Restauration from './icons/cards_v2/IconVector-V2_10-Restauration.svg?react'
import Circulaire from './icons/cards_v2/IconVector-V2_11-Circulaire.svg?react'
import Capture from './icons/cards_v2/IconVector-V2_12-Capture.svg?react'
import Industrie from './icons/cards_v2/IconVector-V2_13-Industrie.svg?react'
import Agroecologie from './icons/cards_v2/IconVector-V2_14-Agroecologie.svg?react'
import Permaculture from './icons/cards_v2/IconVector-V2_15-Permaculture.svg?react'
import Agroforesterie from './icons/cards_v2/IconVector-V2_16-Agroforesterie.svg?react'

export type CardId = number

type IconType = React.FC<React.SVGProps<SVGSVGElement>>

export interface Card {
  id: CardId
  name: string
  cost: number
  income: number
  score: number
  pollution: number
}

let nextCardId = 1

const ICONS: Record<string, IconType> = {
  'Centrale à charbon': Charbon,
  'Centrale à gaz': Gaz,
  'Eoliennes': Eolienne,
  'Solaires': Solaire,
  'Barrages hydroliques': Hydro,
  'Centrale nucléaire': Nucleaire,
  'Taxe carbone': Taxe,
  'Transports durables': Transports,
  'Rénovation thermique': Renovation,
  'Restauration environnement': Restauration,
  'Economie circulaire': Circulaire,
  'Capture de carbone': Capture,
  'Industrie de pointe': Industrie,
  'Agroécologie': Agroecologie,
  'Permaculture': Permaculture,
  'Agroforesterie': Agroforesterie,
}

export const getCardIcon = (name: string): IconType => {
  const icon = ICONS[name]
  if (!icon) {
    throw new Error(`No icon found for card name: ${name}`)
  }
  return icon
}

const _createCards = (name: string, count: number, cost: number, income: number, score: number, pollution: number): Array<Card> => 
  Array(count).fill(null).map(() => ({
    id: nextCardId++,
    name,
    cost,
    income,
    score,
    pollution,
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
  cardIds.map(cardId => {
    const card = DECK.find(card => card.id === cardId)
    if (!card) {
      throw new Error(`Card with id ${cardId} not found`)
    }
    return card
  })