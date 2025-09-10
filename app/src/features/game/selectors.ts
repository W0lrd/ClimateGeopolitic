import { RootState } from "../../app/store"
import { selectCards, type CardId } from "../cards/cardsSlice"
import { selectPlayerById, selectYourPlayerId } from "../players/playersSlice"
import { selectHands, selectPlayerHand } from "./gameSlice"
import { createSelector } from 'reselect'

export interface PlayerStats {
    balance: number
    income: number
    score: number
    pollution: number
}

export const selectCardsInDeck = createSelector(
    selectCards,
    selectHands,
    (cards, hands) => {
        const allTakenCards: Array<CardId> = hands.flatMap(hand => hand.cards)
        return cards.filter(card => {
            return !allTakenCards.includes(card.id)
        })
    }
)

export const selectPlayerCards = createSelector(
    (_: RootState, playerId: number) => playerId,
    selectCards,
    selectHands,
    (playerId, cards, hands) => {
        const playerHand = hands.find(hand => hand.playerId === playerId)
        if (!playerHand) return []
        return cards.filter(card => playerHand.cards.includes(card.id))
    }
)

export const selectYourCards = createSelector(
    (state: RootState) => selectYourPlayerId(state),
    selectCards,
    selectHands,
    (yourPlayerId, cards, hands) => {
        const yourHand = hands.find(hand => hand.playerId === yourPlayerId)
        if (!yourHand) return []
        return cards.filter(card => yourHand.cards.includes(card.id))
    }
)

export const selectPlayerStats = createSelector(
    selectPlayerHand,
    selectPlayerCards,
    (hand, cards) => {
        if (!hand) {
            throw new Error("Player not found")
        }
        return cards.reduce((stats, card) => {
            stats.income += card.income
            stats.score += card.score
            stats.pollution += card.pollution
            return stats
        }
        , { balance: hand.balance, income: 0, score: 0, pollution: 0 } as PlayerStats)
    }
)

export const selectGlobalPollution = createSelector(
    selectCards,
    selectHands,
    (cards, hands) => {
        const allTakenCards: Array<CardId> = hands.flatMap(hand => hand.cards)
        const takenCards = cards.filter(card => allTakenCards.includes(card.id))
        return takenCards.reduce((total, card) => total + card.pollution, 0)
    }
)