import { createAppSlice } from "../../app/createAppSlice"
import type { Card, CardId } from "../cards/cardsSlice"
import type { PlayerId } from "../players/playersSlice"

const INITIAL_BALANCE = 10

export interface Hand {
  playerId: PlayerId
  cards: Array<CardId>
  balance: number
}

export interface GameSliceState {
  hands: Array<Hand>
}

const initialState: GameSliceState = {
  hands: [
    { playerId: 1, cards: [], balance: INITIAL_BALANCE },
    { playerId: 2, cards: [], balance: INITIAL_BALANCE },
    { playerId: 3, cards: [], balance: INITIAL_BALANCE },
    { playerId: 4, cards: [], balance: INITIAL_BALANCE },
  ],
}

export const gameSlice = createAppSlice({
  name: "game",
  initialState,
  reducers: create => ({
    takeCard: create.reducer(
      (state, action: { payload: { playerId: PlayerId, card: Card } }) => {
        const hand = state.hands.find(hand => hand.playerId === action.payload.playerId)
        if (!hand) {
          return
        }
        hand.cards.push(action.payload.card.id)
        hand.balance -= action.payload.card.cost
      }
    ),
    // dealCard: create.reducer(
    // resetHands: create.reducer(
    //   (state) => {
    //     for (const playerId in state.hands) {
    //       state.hands[playerId as unknown as PlayerId] = []
    //     }
    //   }
    // ),
  }),
  selectors: {
    selectHands: state => state.hands,
    selectPlayerHand: (state, playerId: PlayerId) => state.hands.find(hand => hand.playerId === playerId),
  },
})

export const { takeCard } = gameSlice.actions
export const { selectHands, selectPlayerHand } = gameSlice.selectors
