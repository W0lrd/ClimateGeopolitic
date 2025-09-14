import { createAppSlice } from './createAppSlice'
import type { Card, CardId } from '../deck'
import { DECK, findCards } from '../deck'
import { Strategy } from '../ia'

const INITIAL_BALANCE = 10
const DRAW_CARDS_PER_TURN = 2
const MAX_GLOBAL_POLLUTION = 300
const SIZE_INITIAL_HAND = 8

DECK.sort(() => Math.random() - 0.5) // shuffle deck
const INITIAL_HAND = DECK.map((c) => c.id).slice(0, SIZE_INITIAL_HAND)
const INITIAL_DECK = DECK.map((c) => c.id).slice(SIZE_INITIAL_HAND)

const AI_STRATEGIES: Array<Strategy> = [
    'greedy',
    'eco',
    'reactive',
    'balanced',
] as const

export const YOUR_PLAYER_ID = 1
export const NUMBER_OF_PLAYERS = 4

export type PlayerId = number

type LifecycleStatus = 'init' | 'playing' | 'over'

export interface Player {
    id: PlayerId
    name: string
    board: Array<CardId>
    hand: Array<CardId>
    deck: Array<CardId>
    balance: number
    score: number // Added score
    pollution: number // Added pollution
    strategy?: Strategy // only for AI players
}

export interface PlayersSliceState {
    players: Array<Player>
    status: LifecycleStatus
    turnOfPlayerId: PlayerId
    round: number
    playerHoveredId: PlayerId | null // to track which player is hovered in the UI
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
            score: 0, // Initialize score
            pollution: 0, // Initialize pollution
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

const _computeGlobalPollution = (players: Array<Player>): number => {
    return players.reduce((total, player) => total + player.pollution, 0)
}

export const computeIncome = (player: Player): number => 
    findCards(player.board).reduce((sum, card) => sum + card.income, 0)

export const computeScoreIncome = (player: Player): number => 
    findCards(player.board).reduce((sum, card) => sum + card.score, 0)

export const computePollutionIncome = (player: Player): number => 
    findCards(player.board).reduce((sum, card) => sum + card.pollution, 0)

const initialState: PlayersSliceState = {
    players: [
        {
            id: YOUR_PLAYER_ID,
            name: 'Pays 1',
            board: [],
            hand: INITIAL_HAND,
            deck: INITIAL_DECK,
            balance: INITIAL_BALANCE,
            score: 0,
            pollution: 0,
        },
        ..._createAiPlayers(NUMBER_OF_PLAYERS - 1),
    ],
    status: 'init',
    turnOfPlayerId: YOUR_PLAYER_ID,
    round: 1,
    playerHoveredId: null,
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
        endTurn: create.reducer((state) => {
            // Move to next player
            state.turnOfPlayerId =
                (state.turnOfPlayerId % NUMBER_OF_PLAYERS) + 1

            // If we completed a round (all players played)
            // Do revenue, etc.
            if (state.turnOfPlayerId === 1) {
                state.round += 1

                state.players.forEach((player) => {
                    // Revenue, score and pollution from board cards
                    player.balance += computeIncome(player)
                    player.score += computeScoreIncome(player)
                    player.pollution += computePollutionIncome(player)

                    // Shuffle the deck and draw new cards in hand
                    player.deck.sort(() => Math.random() - 0.5)
                    for (let i = 0; i < DRAW_CARDS_PER_TURN; i++) {
                        const cardId = player.deck.shift()
                        if (cardId !== undefined) {
                            player.hand.push(cardId)
                        }
                    }
                })

                if (
                    _computeGlobalPollution(state.players) >=
                    MAX_GLOBAL_POLLUTION
                ) {
                    state.status = 'over'
                }
            }
        }),
        startPlaying: create.reducer((state) => {
            state.status = 'playing'
        }),
        setPlayerHoveredId: create.reducer((state, action: { payload: PlayerId | null }) => {
            state.playerHoveredId = action.payload
        }),
    }),
    selectors: {
        selectPlayers: (state) => state.players,
        selectPlayerById: (state, playerId: PlayerId) =>
            _findPlayerById(state, playerId),
        selectStatus: (state) => state.status,
        selectTurnOfPlayerId: (state) => state.turnOfPlayerId,
        selectRound: (state) => state.round,
        selectGlobalPollution: (state) =>
            _computeGlobalPollution(state.players),
        selectPlayerBoard: (state, playerId: PlayerId) =>
            findCards(_findPlayerById(state, playerId).board),
        selectPlayerHand: (state, playerId: PlayerId) =>
            findCards(_findPlayerById(state, playerId).hand),
        selectPlayerHovered: (state) => state.playerHoveredId ? _findPlayerById(state, state.playerHoveredId!): null
    },
})

export const { takeCard, startPlaying, endTurn, setPlayerHoveredId } = gameSlice.actions
export const {
    selectPlayers,
    selectPlayerById,
    selectStatus,
    selectTurnOfPlayerId,
    selectGlobalPollution,
    selectRound,
    selectPlayerBoard,
    selectPlayerHand,
    selectPlayerHovered,
} = gameSlice.selectors
