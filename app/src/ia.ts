import { useAppSelector } from './app/hooks'
import { Player, YOUR_PLAYER_ID } from './app/gameSlice'
import { Card, findCards } from './deck'
import { selectGlobalPollution } from './selectors'

export type Strategy = 'greedy' | 'eco' | 'reactive' | 'balanced'

const _affordableCards = (player: Player) => {
    const cardsInHand = findCards(player.hand)
    return cardsInHand.filter((card) => card.cost <= player.balance)
}

export const useBuyCardsAI = (
    player: Player,
): Card | null => {
    const globalPollution = useAppSelector(selectGlobalPollution)
    if (player.id === YOUR_PLAYER_ID) {
        return null
    }
    
    const affordableCards = _affordableCards(player)
    if (player.strategy === 'greedy') {
        affordableCards.sort((a, b) => b.income - a.income)
    } else if (player.strategy === 'eco') {
        affordableCards.sort((a, b) => a.pollution - b.pollution)
    } else if (player.strategy === 'reactive') {
        const playerBoard = findCards(player.board)
        const playerPollution = playerBoard.reduce((total, card) => total + card.pollution, 0)
        if (playerPollution > globalPollution / 2) {
            affordableCards.sort((a, b) => a.pollution - b.pollution)
        } else {
            affordableCards.sort((a, b) => b.income - a.income)
        }
    } else if (player.strategy === 'balanced') {
        affordableCards.sort(() => Math.random() - 0.5)
    } else {
        throw new Error(`Unknown strategy: ${player.strategy}`)
    }
    return affordableCards.length > 0 ? affordableCards[0] : null
}
