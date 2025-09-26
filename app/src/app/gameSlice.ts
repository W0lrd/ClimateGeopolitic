import { createAppSlice } from './createAppSlice';
import type { Card, CardId } from '../deck';
import { DECK, findCards } from '../deck';
import { Strategy } from '../ia';
import {
    INITIAL_BALANCE,
    DRAW_CARDS_PER_TURN,
    MAX_GLOBAL_POLLUTION,
    INITIAL_HAND_SPECS,
} from './settings';


const AI_STRATEGIES: Array<Strategy> = [
    'greedy',
    'eco',
    'reactive',
    'balanced',
] as const

export const YOUR_PLAYER_ID = 1
export const NUMBER_OF_PLAYERS = 4

export type PlayerId = number

type LifecycleStatus = 'init' | 'playing' | 'stats' | 'over'

interface LoadingStatus {
    backgroundGeneratedCount: number,
    status: 'idle' | 'loading' | 'loaded'
}

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
    loadingStatus: LoadingStatus
    turnOfPlayerId: PlayerId
    round: number
    playerHoveredId: PlayerId | null // to track which player is hovered in the UI
}

const _createPlayer = (id: PlayerId, strategy?: Strategy): Player => {
    let deck = DECK.slice(0)
    const hand = deck.reduce<Array<Card>>((hand, card) => {
        if (
            INITIAL_HAND_SPECS[card.name] !== undefined &&
                INITIAL_HAND_SPECS[card.name] > hand.filter(c => c.name === card.name).length
        ) {
            hand.push(card)
        }
        return hand
    }, [])
    deck = deck.filter(card => !hand.includes(card))
    deck.sort(() => Math.random() - 0.5) // shuffle
    for (let i = 0; i < (INITIAL_HAND_SPECS['RANDOM'] || 0); i++) {
        hand.push(deck.shift()!)
    }
    
    return {
        id,
        name: `Pays ${id}`,
        board: [],
        hand: hand.map(card => card.id),
        deck: deck.map(card => card.id),
        balance: INITIAL_BALANCE,
        score: 0, // Initialize score
        pollution: 0, // Initialize pollution
        strategy,
    }

}

const _createAiPlayers = (count: number): Array<Player> => {
    const players: Array<Player> = []
    const startId = YOUR_PLAYER_ID + 1
    for (let i = startId; i <= count + 1; i++) {
        players.push(_createPlayer(i, AI_STRATEGIES[(i - startId) % AI_STRATEGIES.length]))
    }
    return players
}

export const findPlayerById = (state: PlayersSliceState, playerId: PlayerId) => {
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
        _createPlayer(YOUR_PLAYER_ID),
        ..._createAiPlayers(NUMBER_OF_PLAYERS - 1),
    ],
    status: 'init',
    loadingStatus: {
        status: 'idle',
        backgroundGeneratedCount: 0
    },
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
                const player = findPlayerById(state, action.payload.playerId)
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
            state.playerHoveredId = state.turnOfPlayerId

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
                            player.hand.unshift(cardId)
                        }
                    }
                })

                if (
                    _computeGlobalPollution(state.players) >=
                    MAX_GLOBAL_POLLUTION
                ) {
                    state.status = 'stats'
                }
            }
        }),
        startPlaying: create.reducer((state) => {
            state.status = 'playing'
        }),
        setPlayerHoveredId: create.reducer((state, action: { payload: PlayerId | null }) => {
            state.playerHoveredId = action.payload
        }),
        setLoadingStarted: create.reducer((state) => {
            state.loadingStatus.status = 'loading'
            state.loadingStatus.backgroundGeneratedCount = 0
        }),
        setBackgroundGenerated: create.reducer((state) => {
            state.loadingStatus.backgroundGeneratedCount += 1
            if (state.loadingStatus.backgroundGeneratedCount >= state.players.length) {
                state.loadingStatus.status = 'loaded'
            }
        }),
        closeStats: create.reducer((state) => {
            state.status = 'over'
        }),
        showStats: create.reducer((state) => {
            state.status = 'stats'
        }),
    }),
    selectors: {
        selectPlayers: (state) => state.players,
        selectPlayerById: (state, playerId: PlayerId) =>
            findPlayerById(state, playerId),
        selectStatus: (state) => state.status,
        selectLoadingStatus: (state) => state.loadingStatus.status,
        selectTurnOfPlayerId: (state) => state.turnOfPlayerId,
        selectRound: (state) => state.round,
        selectGlobalPollution: (state) =>
            _computeGlobalPollution(state.players),
        selectPlayerHovered: (state) => state.playerHoveredId ? findPlayerById(state, state.playerHoveredId!): null
    },
})

export const { takeCard, startPlaying, endTurn, setPlayerHoveredId, setBackgroundGenerated, setLoadingStarted, closeStats, showStats } = gameSlice.actions
export const {
    selectPlayers,
    selectPlayerById,
    selectStatus,
    selectLoadingStatus,
    selectTurnOfPlayerId,
    selectGlobalPollution,
    selectRound,
    selectPlayerHovered,
} = gameSlice.selectors
