import { createAppSlice } from "../../app/createAppSlice"

type LifecycleStatus = "init" | "playing" | "over"

export type LifecycleSliceState = {
  status: LifecycleStatus
}

const initialState: LifecycleSliceState = {
  status: "init",
}

export const lifecycleSlice = createAppSlice({
  name: "lifecycle",
  initialState,
  reducers: create => ({
    startPlaying: create.reducer(
      (state) => {
        state.status = "playing"
      },
    ),
  }),
  selectors: {
    selectStatus: state => state.status,
  },
})

export const { startPlaying } = lifecycleSlice.actions
export const { selectStatus } = lifecycleSlice.selectors