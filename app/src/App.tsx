import React from "react"
import "./App.css"
import { useAppSelector } from "./app/hooks"
import { selectStatus } from "./features/lifecycle/lifecycleSlice"
import Welcome from "./features/lifecycle/Welcome"
import Game from "./features/game/Game"

export const App: React.FC = () => {
  const lifcycleStatus = useAppSelector(selectStatus)
  return (
    <div className="App">
      {/* {lifcycleStatus === 'init' && <Welcome />} */}
      {/* {lifcycleStatus === 'playing' && <Game />} */}
      <Game />
    </div>
  )
}