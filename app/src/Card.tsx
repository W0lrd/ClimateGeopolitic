import React from "react";
import { getCardIcon, type Card as CardType } from "./deck"
import "./Card.css";
import IncomeIcon from "./icons/data_v2/IconVector-V2_A-Money.svg?react";
import ScoreIcon from "./icons/data_v2/IconVector-V2_B-Score.svg?react";
import PollutionIcon from "./icons/data_v2/IconVector-V2_C-Pollution.svg?react";

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
  const CardIcon = getCardIcon(card.name);
  const isInYourHand = status === 'available' || status === 'not-available'
  return (
    <div className="card-container" onClick={() => onClick && status === 'available' ? onClick(card): null}>
      <div className={`card-box ${status}`}>
        <div className="card-front">
            <div className="card-top">
            {isInYourHand &&
              <div className="card-cost">{card.cost}</div>
            }
            </div>
          <div className="card-name">{card.name}</div>
          <div className="card-icon"><CardIcon /></div>
        </div>
        <div className="card-stats">
          <div className="card-top">
            {isInYourHand &&
            <div className="card-cost">{card.cost}</div>
            }
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
