import { createSelector } from 'reselect'
import { RootState } from './store'
import { findCards } from '../deck'
import { findPlayerById, PlayerId } from './gameSlice'

export const selectPlayerBoards = createSelector(
    [(state: RootState) => state.game],
    (gameState) => {
        return gameState.players.map(player => ({
            playerId: player.id,
            board: findCards(player.board)
        }))
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
