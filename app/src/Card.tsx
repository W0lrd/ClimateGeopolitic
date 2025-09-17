import React from "react";
import type { Card as CardType } from "./deck"
import "./Card.css";
import IncomeIcon from "./icons/data/IconVector-A_Money.svg?react";
import ScoreIcon from "./icons/data/IconVector-B_Score.svg?react";
import PollutionIcon from "./icons/data/IconVector-C_Pollution.svg?react";

export type CardStatus = "board" | "available" | "not-available"

const getPlusMinusSign = (value: number) => {
  if (value > 0) return '+'
  else if (value < 0) return ''
  else return '±' // +-
}

interface CardProps {
  card: CardType
  status: CardStatus
  onClick?: (card: CardType) => void
}

const Card: React.FC<CardProps> = ({ card, status, onClick }) => {
  return (
    <div className="card-container">
      <div className={`card-box ${status}`} onClick={() => onClick && status === 'available' ? onClick(card): null}>
        <div className="card-front">
          <div className="card-name">{card.name}</div>
          <div className="card-icon"><card.icon /></div>
        </div>
        <div className="card-stats">
          <div className="card-top">
            <div className="card-cost">{card.cost}</div>
          </div>
          <div className="card-bottom">
            <div className="card-stat money">
              <span>{getPlusMinusSign(card.income)}{card.income}</span>
              <IncomeIcon />
            </div>
            <div className="card-stat score">
              <span>{getPlusMinusSign(card.score)}{card.score}</span>
              <ScoreIcon />
            </div>
            <div className="card-stat pollution">
              <span>{getPlusMinusSign(card.pollution)}{card.pollution}</span>
              <PollutionIcon />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
