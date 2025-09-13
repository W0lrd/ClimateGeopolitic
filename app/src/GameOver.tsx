import React from "react";
import "./GameOver.css";
import "./css-components/Page.css"
import { useAppSelector } from "./app/hooks";
import { selectGlobalPollution, selectPlayerStats } from "./selectors";
import { selectPlayers, YOUR_PLAYER_ID } from "./app/gameSlice";

interface GameOverProps {}

const GameOver: React.FC<GameOverProps> = () => {
    const globalPollution = useAppSelector(selectGlobalPollution)
    const players = useAppSelector(selectPlayers)
    const playersStats = useAppSelector((state) =>
        players.map((player) => selectPlayerStats(state, player.id))
    );

  return (
    <div className="gameover-page Page">
      <div className="gameover-title">FIN DE PARTIE</div>
      <div className="gameover-subtitle">POLLUTION GLOBALE : {globalPollution}</div>

      <div className="gameover-players">
        {players.map((player, i) => (
          <div key={player.id} className="gameover-player">
            <h2 className="gameover-player-name">
              {player.name}{" "}
              {player.id === YOUR_PLAYER_ID && (
                <span className="gameover-player-you">(vous)</span>
              )}
            </h2>

            <p>Revenu par tour : {playersStats[i].income}</p>
            <p>Score par tour : {playersStats[i].score}</p>
            <p>Pollution par tour : {playersStats[i].pollution}</p>

            {/* <p className="gameover-player-total">
              Score total : {player.totalScore}
            </p>
            <p className="gameover-player-total">
              Pollution totale : {player.totalPollution}
            </p> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameOver;
