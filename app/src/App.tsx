import React from "react"
import "./App.css"
import { useAppSelector } from "./app/hooks"
import { selectStatus } from "./app/gameSlice"
import Welcome from "./Welcome"
import Game from "./Game"

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