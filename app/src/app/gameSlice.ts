import { createAppSlice } from './createAppSlice'
import type { Card, CardId } from '../deck'
import { DECK, findCards } from '../deck'
import { Strategy } from '../ia'

const INITIAL_BALANCE = 10

const DRAW_CARDS_PER_TURN = 2

const INITIAL_HAND = DECK.map((c) => c.id).slice(0, 6)

const INITIAL_DECK = DECK.map((c) => c.id).slice(6)

const AI_STRATEGIES: Array<Strategy> = ['greedy', 'eco', 'reactive', 'balanced'] as const

export const YOUR_PLAYER_ID = 1

export const NUMBER_OF_PLAYERS = 4

export type PlayerId = number

type LifecycleStatus = "init" | "playing" | "over"

export interface Player {
    id: PlayerId
    name: string
    board: Array<CardId>
    hand: Array<CardId>
    deck: Array<CardId>
    balance: number
    strategy?: Strategy // only for AI players
}

export interface PlayersSliceState {
    players: Array<Player>
    status: LifecycleStatus
    turnOfPlayerId: PlayerId
}

const _createAiPlayers = (count: number): Array<Player> => {
    const players: Array<Player> = []
    const startId = YOUR_PLAYER_ID + 1
    for (let i = startId; i <= count + 1; i++) {
        players.push({
            id: i,
            name: `Pays ${i}`,
            board: [],
            hand: INITIAL_HAND,
            deck: INITIAL_DECK,
            balance: INITIAL_BALANCE,
            strategy: AI_STRATEGIES[(i - startId) % AI_STRATEGIES.length],
        })
    }
    return players
}

const _findPlayerById = (state: PlayersSliceState, playerId: PlayerId) => {
    const player = state.players.find((player) => player.id === playerId)
    if (!player) {
        throw new Error(`Player with id ${playerId} not found`)
    }
    return player
}

const initialState: PlayersSliceState = {
    players: [
        {
            id: YOUR_PLAYER_ID,
            name: 'Pays 1',
            board: [],
            hand: INITIAL_HAND,
            deck: INITIAL_DECK,
            balance: INITIAL_BALANCE,
        },
        ..._createAiPlayers(NUMBER_OF_PLAYERS - 1),
    ],
    status: "init",
    turnOfPlayerId: YOUR_PLAYER_ID,
}

export const gameSlice = createAppSlice({
    name: 'game',
    initialState,
    reducers: (create) => ({
        takeCard: create.reducer(
            (
                state,
                action: { payload: { playerId: PlayerId; card: Card } }
            ) => {
                const player = _findPlayerById(state, action.payload.playerId)
                player.hand = player.hand.filter(
                    (cardId) => cardId !== action.payload.card.id
                )
                player.board.push(action.payload.card.id)
                player.balance -= action.payload.card.cost
            }
        ),
        endTurn: create.reducer(
            (
                state,
            ) => {
                // Move to next player
                state.turnOfPlayerId = (state.turnOfPlayerId % NUMBER_OF_PLAYERS) + 1

                // Give income and draw cards
                const player = _findPlayerById(state, state.turnOfPlayerId)
                const boardCards = findCards(player.board)
                player.balance += boardCards.reduce(
                    (sum, card) => sum + card.income,
                    0
                )
                player.deck.sort(() => Math.random() - 0.5) // Shuffle the deck
                for (let i = 0; i < DRAW_CARDS_PER_TURN; i++) {
                    const cardId = player.deck.shift()
                    if (cardId !== undefined) {
                        player.hand.push(cardId)
                    }
                }
                state.status = "over"
            }
        ),
        startPlaying: create.reducer(
          (state) => {
            state.status = "playing"
          },
        ),
    }),
    selectors: {
        selectPlayers: (state) => state.players,
        selectPlayerById: (state, playerId: PlayerId) =>
            _findPlayerById(state, playerId),
        selectStatus: state => state.status,
        selectTurnOfPlayerId: state => state.turnOfPlayerId,
    },
})

export const { takeCard, startPlaying, endTurn } = gameSlice.actions
export const { selectPlayers, selectPlayerById, selectStatus, selectTurnOfPlayerId } = gameSlice.selectors
