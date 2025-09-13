import React from "react";
import { useAppDispatch } from "./app/hooks"
import {
  startPlaying,
} from "./features/lifecycle/lifecycleSlice"
import "../../css-components/Page.css"
import "./Welcome.css";

interface WelcomeProps {}

const Welcome: React.FC<WelcomeProps> = () => {
  const dispatch = useAppDispatch()
  return (
    <div className="welcome-page Page">
      <div className="welcome-container">
        <h1 className="welcome-title">Introduction à la géopolitique du climat</h1>
        <p className="welcome-text">
          Bienvenu, explication des règles, blabla bla blabla bla blabla bla blabla bla
          blabla bla blabla bla blabla bla blabla bla blabla bla blabla bla blabla bla
          blabla bla blabla bla blabla bla blabla bla blabla bla blabla bla blabla bla
          blabla bla blabla bla blabla bla blabla bla blabla bla blabla bla blabla bla
          blabla bla blabla bla blabla bla blabla bla blabla bla blabla bla blabla bla.
        </p>
        <button className="welcome-button" onClick={() => dispatch(startPlaying())}>
          DÉMARRER
        </button>
      </div>
    </div>
  );
};

export default Welcome;
