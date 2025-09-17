import { createSelector } from 'reselect'
import { RootState } from './store'
import { findCards } from '../deck'
import { findPlayerById, PlayerId } from './gameSlice'

export const selectPlayerBoard = createSelector(
    [
        (_: RootState, playerId: PlayerId) => playerId,
        (state: RootState) => state.game,
    ],
    (playerId, gameState) => {
        return findCards(findPlayerById(gameState, playerId).board)
    }
)

export const selectPlayerHand = createSelector(
    [
        (_: RootState, playerId: PlayerId) => playerId,
        (state: RootState) => state.game,
    ],
    (playerId, gameState) => {
        return findCards(findPlayerById(gameState, playerId).hand)
    }
)
