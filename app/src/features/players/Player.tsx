import React from "react";
import "./Player.css";
import type { Player as PlayerType } from "./playersSlice";
import { useAppSelector } from "../../app/hooks";
import { selectPlayerStats } from "../game/selectors";

interface PlayerProps {
  player: PlayerType
}


const Player: React.FC<PlayerProps> = ({ player }) => {
    const playerStats = useAppSelector((state) => selectPlayerStats(state, player.id));
    return (
        <div className="player-box">
            <div className="player-name">{player.name}</div>
            <div className="player-stats">
                <div>Revenu: {playerStats.income}</div>
                <div>Score: {playerStats.score}</div>
                <div>Pollution: {playerStats.pollution}</div>
            </div>
        </div>
    );
}


export default Player;