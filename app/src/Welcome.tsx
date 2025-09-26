import React from "react";
import { useAppDispatch } from "./app/hooks"
import "./css-components/Page.css"
import "./Welcome.css";
import { startPlaying } from "./app/gameSlice";
import { MAX_GLOBAL_POLLUTION } from "./app/settings";
import Card from "./Card";
import { DECK } from "./deck";
import IncomeIcon from "./icons/data_v2/IconVector-V2_A-Money.svg?react";
import ScoreIcon from "./icons/data_v2/IconVector-V2_B-Score.svg?react";
import PollutionIcon from "./icons/data_v2/IconVector-V2_C-Pollution.svg?react";
import Background from "./Background";

interface WelcomeProps {}

const Welcome: React.FC<WelcomeProps> = () => {
  const dispatch = useAppDispatch()
  return (
    <div className="welcome-page Page">
      <div className="welcome-container">
        <div className="welcome-title">
          <Background pollutionRate={0.9} />
          <h1>Introduction<br/>à la géopolitique<br/>du climat</h1>
          <button className="welcome-button" onClick={() => dispatch(startPlaying())}>
            Démarrer
          </button>
          <div className="welcome-title-scroll-hint">
            Faites défiler pour en savoir plus &#x2193;
          </div>
        </div>
        <div className="welcome-instructions">
          <p className="welcome-text">
Bienvenue dans ce petit jeu pédagogique sur la géopolitique du climat. Dans celui-ci, vous incarnez les dirigeant·e·s d'un pays qui font des choix dans son industrialisation.
Le jeu se déroule en une série de tours lors desquelles vous aurez le choix entre plusieurs cartes comme celle-ci :
          </p>

          <Card card={DECK[0]} status="available" />

          <p className="welcome-text">
          Chacune a 4 caractéristiques : D'un côté son coût, correspondant à l'argent nécessaire pour pouvoir
          la jouer (en haut à gauche). De l'autre, ce qu'elle rapportera à tous les tours suivants : 
          </p>

          <p className="welcome-text">
          un revenu {<IncomeIcon />},
          une valeur de score {<ScoreIcon />} 
          et une valeur de pollution {<PollutionIcon />}.
          </p>

          <p className="welcome-text">
          Au début de chaque tour, vous gagnerez donc de l'argent en fonction de votre revenu et votre score
          augmentera pour chaque carte qui vous en rapporte. Vous piocherez également 2 nouvelles cartes qui
          s'ajouteront à vos options de jeu. Enfin, la pollution globale augmentera d'une valeur égale à la
          somme de la pollution de TOUS les pays.
          </p>

          <p className="welcome-text">
          Lorsque la pollution atteint {MAX_GLOBAL_POLLUTION}, la partie s'arrête. S'affichera alors un tableau des scores, exposant toutes les données de chaque pays.
          Lequel aura "gagné" ? Ce sera à vous de le déterminer...
          </p>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
