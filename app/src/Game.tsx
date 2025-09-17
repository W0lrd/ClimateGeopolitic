import React, { useEffect, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "./app/hooks"
import Card from "./Card"
import { selectPlayers, endTurn, selectTurnOfPlayerId, YOUR_PLAYER_ID, selectPlayerById, selectGlobalPollution, selectRound, selectPlayerHovered } from "./app/gameSlice";
import { takeCard } from "./app/gameSlice";
import Player from "./Player";
import { shallowEqual } from "react-redux";
import "./css-components/Page.css"
import "./Game.css";
import type { Card as CardType } from "./deck";
import { useBuyCardsAI } from "./ia";
import GameBoard from "./GameBoard";
import { selectPlayerHand, selectPlayerBoard } from "./app/selectors";

const TURN_TIME_MS = 600

interface GameProps {}

const Game: React.FC<GameProps> = () => {
  const dispatch = useAppDispatch()
  const playerHovered = useAppSelector(selectPlayerHovered)
  const yourHand = useAppSelector(state => selectPlayerHand(state, YOUR_PLAYER_ID))
  const board = useAppSelector(state => selectPlayerBoard(state, playerHovered !== null ? playerHovered.id : YOUR_PLAYER_ID))
  const turnOfPlayerId = useAppSelector(selectTurnOfPlayerId)
  const players = useAppSelector(selectPlayers, shallowEqual)
  const globalPollution = useAppSelector(selectGlobalPollution)
  const round = useAppSelector(selectRound)
  const currentPlayer = useAppSelector(state => selectPlayerById(state, turnOfPlayerId))
  const you = useAppSelector(state => selectPlayerById(state, YOUR_PLAYER_ID))
  const cardToTake = useBuyCardsAI(currentPlayer);

  const onCardClick = useCallback(
    (card: CardType) => {
      dispatch(takeCard({ playerId: YOUR_PLAYER_ID, card }));
    },
    [dispatch]
  );

  const onEndTurnClick = useCallback(() => {
    dispatch(endTurn());
  }, [dispatch]);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null
    if (turnOfPlayerId !== YOUR_PLAYER_ID) {
      if (cardToTake) {
        // bought a card, wait a bit before ending turn
        timer = setTimeout(() => {
          dispatch(takeCard({ playerId: turnOfPlayerId, card: cardToTake }))
        }, TURN_TIME_MS / 2)
      } else {
        timer = setTimeout(() => {
          dispatch(endTurn())
        }, TURN_TIME_MS)
      }
    }
    return () => {if (timer) {clearTimeout(timer)}}
  })

  return (
    <div className="game-page Page">
      {turnOfPlayerId !== YOUR_PLAYER_ID && (
        <div className="game-overlay">
            <div className="game-overlay-text">
              C'est le tour de {players.find(p => p.id === turnOfPlayerId)?.name}
            </div>
        </div>
      )}
      <div className="game-left">
        <div className="game-players-board">
          <div className="game-players">
            {players.map(player => (
              <Player key={player.id} player={player} />
            ))}
          </div>
          <GameBoard cards={board} />
        </div>
        <div className="game-hand">
          <div className="game-hand-inner">
            {
              playerHovered && playerHovered.id !== YOUR_PLAYER_ID && <div className="game-hand-overlay"></div>
            }
            {yourHand.map(card => (
              <Card key={card.id} card={card} onClick={onCardClick} status={currentPlayer.balance >= card.cost ? "available": "not-available"} />
            ))}
          </div>
        </div>
      </div>
      <div className="game-right">
        <div className="game-stats">
          <div className="game-stat game-global-pollution">Pollution Globale: {globalPollution}</div>
          <div className="game-stat game-your-balance">Votre Argent: {you.balance}</div>
          <div className="game-stat game-your-score">Votre Score: {you.score}</div>
        </div>
        <div className="game-end-turn" onClick={onEndTurnClick}>
          <button>Fin du tour {round}</button>
        </div>
      </div>
    </div>
  );
};

export default Game
