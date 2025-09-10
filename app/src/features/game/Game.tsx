import React from "react";
import { useAppDispatch } from "../../app/hooks"
import Card from "../cards/Card"
import { selectCardsInDeck, selectGlobalPollution, selectPlayerStats, selectYourCards } from "./selectors"
import { selectPlayers, selectYourPlayerId } from "../players/playersSlice";
import { takeCard } from "./gameSlice";
import Player from "../players/Player";
import { useAppSelector } from "../../app/hooks"
import "../../css-components/Page.css"
import "./Game.css";
import type { Card as CardType } from "../cards/cardsSlice";

interface GameProps {}

const Game: React.FC<GameProps> = () => {
  const dispatch = useAppDispatch()
  const cardsInDeck = useAppSelector(selectCardsInDeck)
  const yourCards = useAppSelector(selectYourCards)
  const yourPlayerId = useAppSelector(selectYourPlayerId)
  const yourStats = useAppSelector(state => selectPlayerStats(state, yourPlayerId))
  const players = useAppSelector(selectPlayers)
  const globalPollution = useAppSelector(selectGlobalPollution)

  const onCardClick = (card: CardType) => {
    dispatch(takeCard({ playerId: yourPlayerId, card }))
  }

  const onEndTurnClick = () => {
    // TODO
  }

  return (
    <div className="game-page Page">
      <div className="game-left">
        <div className="game-players">
          {players.map(player => (
            <Player key={player.id} player={player} />
          ))}
        </div>
        <div className="game-deck game-your-hand">
          {yourCards.map(card => (
            <Card key={card.id} card={card} status="yours" />
          ))}
        </div>
        <div className="game-deck">
          {cardsInDeck.map(card => (
            <Card key={card.id} card={card} onClick={onCardClick} status={yourStats.balance >= card.cost ? "available": "not-available"} />
          ))}
        </div>
      </div>
      <div className="game-right">
        <div className="game-stats">
          <div className="game-stat game-global-pollution">Pollution Globale: {globalPollution}</div>
          <div className="game-stat game-your-balance">Votre Argent: {yourStats.balance}</div>
          <div className="game-stat game-your-score">Votre Score: {yourStats.score}</div>
        </div>
        <div className="game-end-turn" onClick={onEndTurnClick}>
          <button>Fin du tour</button>
        </div>
      </div>
    </div>
  );
};

export default Game;
