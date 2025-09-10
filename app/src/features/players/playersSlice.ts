import { createAppSlice } from "../../app/createAppSlice"

export type PlayerId = number

export interface Player {
  id: PlayerId
  isYou: boolean
  name: string
}

export interface PlayersSliceState {
  players: Array<Player>
}

const initialState: PlayersSliceState = {
  players: [
    {
      id: 1,
      isYou: true,
      name: "Pays 1",
    },
    {
      id: 2,
      isYou: false,
      name: "Pays 2",
    },
    {
      id: 3,
      isYou: false,
      name: "Pays 3",
    },
    {
      id: 4,
      isYou: false,
      name: "Pays 4",
    },
  ],
}

export const playersSlice = createAppSlice({
  name: "players",
  initialState,
  reducers: create => ({
    // startPlaying: create.reducer(
    //   (state) => {
    //     state.status = "playing"
    //   },
    // ),
  }),
  selectors: {
    selectYourPlayerId: state => state.players.find(player => player.isYou)!.id,
    selectPlayers: state => state.players,
    selectPlayerById: (state, playerId: PlayerId) => state.players.find(player => player.id === playerId),
  },
})

// export const { startPlaying } = playersSlice.actions
export const { selectYourPlayerId, selectPlayers, selectPlayerById } = playersSlice.selectors