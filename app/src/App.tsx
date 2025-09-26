import React from "react"
import "./App.css"
import { useAppSelector } from "./app/hooks"
import { selectStatus } from "./app/gameSlice"
import Welcome from "./Welcome"
import Game from "./Game"
import GameOver from "./GameOver"
import GameLoader from "./GameLoader"

export const App: React.FC = () => {
  const lifcycleStatus = useAppSelector(selectStatus)
  console.log("App render with status", lifcycleStatus)
  return (
    <div className="App">
      {lifcycleStatus === 'init' ? <Welcome />: null}
      {lifcycleStatus === 'playing' || lifcycleStatus === 'over' || lifcycleStatus === 'stats' ? <GameLoader><Game /></GameLoader>: null}
      {lifcycleStatus === 'stats' ? <GameOver />: null}
    </div>
  )
}