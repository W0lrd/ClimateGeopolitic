import { findCards, type CardId } from "./deck"
import { selectPlayerById, selectPlayers } from "./app/gameSlice"
import { createSelector } from 'reselect'

export interface PlayerStats {
    balance: number
    income: number
    score: number
    pollution: number
}

export const selectPlayerBoard = createSelector(
    selectPlayerById,
    (player) => findCards(player.board)
)

export const selectPlayerHand = createSelector(
    selectPlayerById,
    (player) => findCards(player.hand)
)

export const selectPlayerStats = createSelector(
    selectPlayerById,
    selectPlayerBoard,
    (player, cards) => {
        return cards.reduce((stats, card) => {
            stats.income += card.income
            stats.score += card.score
            stats.pollution += card.pollution
            return stats
        }
        , { balance: player.balance, income: 0, score: 0, pollution: 0 } as PlayerStats)
    }
)

export const selectGlobalPollution = createSelector(
    selectPlayers,
    (players) => {
        const allTakenCards: Array<CardId> = players.flatMap(player => player.board)
        const takenCards = findCards(allTakenCards)
        return takenCards.reduce((total, card) => total + card.pollution, 0)
    }
)