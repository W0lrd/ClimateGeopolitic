import React from "react";
import "./GameOver.css";
import "./css-components/Page.css"
import { useAppSelector } from "./app/hooks";
import { computeIncome, computePollutionIncome, computeScoreIncome, selectGlobalPollution, selectPlayers, YOUR_PLAYER_ID } from "./app/gameSlice";

interface GameOverProps {}

const GameOver: React.FC<GameOverProps> = () => {
    const globalPollution = useAppSelector(selectGlobalPollution)
    const players = useAppSelector(selectPlayers)

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

            <p>Revenu par tour : {computeIncome(players[i])}</p>
            <p>Score par tour : {computeScoreIncome(players[i])}</p>
            <p>Pollution par tour : {computePollutionIncome(players[i])}</p>

            <p className="gameover-player-total">
              Score total : {player.score}
            </p>
            <p className="gameover-player-total">
              Pollution totale : {player.pollution}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameOver;
