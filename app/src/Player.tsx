import React, { useState } from "react";
import "./Player.css";
import { YOUR_PLAYER_ID, type Player as PlayerType } from "./app/gameSlice";
import { useAppSelector } from "./app/hooks";
import { selectPlayerBoard, selectPlayerStats } from "./selectors";
import GameBoard from "./GameBoard";

interface PlayerProps {
  player: PlayerType
}

const Player: React.FC<PlayerProps> = ({ player }) => {
    const playerStats = useAppSelector((state) => selectPlayerStats(state, player.id))
    const playerBoard = useAppSelector(state => selectPlayerBoard(state, player.id))
    const [isMouseOver, setIsMouseOver] = useState(false)

    const onMouseOver = () => {
        setIsMouseOver(true)
    }

    const onMouseOut = () => {
        setIsMouseOver(false)
    }

    return (
        <div className="player-box" onMouseOver={onMouseOver} onMouseOut={onMouseOut}>
            <div className="player-name">{player.name}{player.id !== YOUR_PLAYER_ID ? ` (${player.strategy})`: ` (you)`}</div>
            <div className="player-stats">
                <div>Revenu: {playerStats.income}</div>
                <div>Score: {playerStats.score}</div>
                <div>Pollution: {playerStats.pollution}</div>
            </div>
            {isMouseOver && player.id !== YOUR_PLAYER_ID && (
                <div className="player-details">
                    <GameBoard cards={playerBoard} status="opponent" />
                </div>
            )}
        </div>
    );
}


export default Player;