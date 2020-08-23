import React, { useState, useEffect, useRef } from "react";
import "./index.css";
import StatusBar from "../StatusBar";
import MemoryCard from "./MemoryCard";
import * as utils from "../../utils"; // * betyder ALLT
import ResultModal from "../ResultModal";
import * as helpers from "./helpers.js";

/*
const intervallID = setInterval(() => console.log(Date.now()), 1000); //1000 ms is how often should this function run
clearinterval(intervallID); // rensar intervallen men behöver ett ID
*/

function Memory() {
  /*utils
    .fetchLeaderboard("memory")
    .then((leaderboard) => console.log(leaderboard));*/

  const [game, setGame] = useState({
    cards: helpers.generateCards(),
    fristCard: undefined,
    secondCard: undefined,
  });

  const [startTime, setstartTime] = useState(0); // state variable
  const [elapsedTime, setElapsedTime] = useState(0);
  const [win, setWin] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [wrongPair, setWrongPair] = useState(null);
  const timeoutIds = useRef([]); // typ some useState men componeten renderas inte när den uppdataeras.
  const [scoreCanBeSaved, setScoreCanBeSaved] = useState(false);

  // useState (<effect function>,<dependency array> -optional)
  // <dependency array>:
  //* undefiend : effect function will run after every render.
  // * []: effect will run only on the firt render
  // * [value1,value2]: effect will run when any of the values change
  //effect function returns a cleanup function(-optional)
  //that runs next time the effect functions is run or
  // when the component unmounts (disappers from the DOM)

  useEffect(() => {
    //This timer start when the startTime is NOT 0 AND win is false
    if (startTime !== 0 && !win) {
      const intervalID = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 1000);
      return () => clearInterval(intervalID); // this is for cleaning up
    }
  }, [startTime, win]);

  useEffect(() => {
    if (win) {
      setShowModal(true);
      setScoreCanBeSaved(true);
    }
  }, [win]);

  useEffect(() => {
    if (!wrongPair) return;
    const timeoutId = setTimeout(() => {
      setGame((oldGame) => {
        return {
          ...oldGame,
          cards: helpers.flipCards(
            oldGame.cards,
            wrongPair.map((card) => card.key)
          ),
        };
      });
    }, 1000);
    timeoutIds.current = timeoutIds.current.concat(timeoutId);
  }, [wrongPair]);

  useEffect(() => {
    return () => {
      timeoutIds.current.forEach((id) => clearTimeout(id));
    };
  }, []);

  // this only happens on the first  render

  // useState generar två element i en array, därför skapar vi en array med två index, cards och setCards
  /* useState takes a parameter for the initial value of the state. 
  It will only be used the first time the component renders. 
  useState returns an array of two things: cards is the current value of the state variable, at the time of the rendering; 
  setCards is a function to use for updating cards.*/

  /*(OLD)function onCardClicked(clickedCard) {
    // oldCards är den current state in cards.
    setCards((oldCards) => {
      return oldCards.map((card) => {
        if (card.key === clickedCard.key)
          return { ...card, isFlipped: !card.isFlipped };
        // this {...card} kopierar card objectet men ändrar isFlipped till omvänd value, t.ex. om true blir den false om false blir den true.
        return card;
      });
    });
  }*/

  function onCardClick(card) {
    setGame((oldGame) =>
      helpers.calculateNewGame(oldGame, card, () => setWin(true), setWrongPair)
    );

    setstartTime((oldStartTime) =>
      oldStartTime === 0 ? Date.now() : oldStartTime
    );
  }

  function onRestart() {
    setGame({
      cards: helpers.generateCards(),
      fristCard: undefined,
      secondCard: undefined,
    });
    setstartTime(0);
    setElapsedTime(0);
    setWin(false);
    setScoreCanBeSaved(false);
  }

  // I return är html kod, men om du vill lägga till javascript kod måste det vara inne i {}

  return (
    <div className="game-container">
      <StatusBar
        status={`Time: ${utils.prettifyTime(elapsedTime)}`}
        onRestart={onRestart}
        onShowLeaderboard={() => setShowModal(true)}
      ></StatusBar>
      <div className="memory-grid">
        {game.cards.map((card) => (
          <MemoryCard
            key={card.key}
            color={card.color}
            isFlipped={card.isFlipped}
            onClick={() => onCardClick(card)}
          />
          // eftersom den inte har något innehåll i elementet går det att skriva såhär som en shortcut
        ))}
      </div>
      <ResultModal
        show={showModal}
        handleClose={() => setShowModal(false)} // varför behöver jag skriva så och inte setShowModel(false)?  det är för att vi har en onclick function. functionen retunerar inget och därför behövs det skriva så(jag tror)
        header={win ? "Congratulations, you won!" : "Leaderboard"}
        body={win ? `Your time was ${utils.prettifyTime(elapsedTime)}.` : ""}
        fetchLeaderboard={helpers.fetchLeaderboard}
        saveScore={(name) =>
          helpers
            .saveScore(name, elapsedTime)
            .then(() => setScoreCanBeSaved(false))
        } // i en then ska det alltid vara en function
        scoreCanBeSaved={scoreCanBeSaved}
      ></ResultModal>
    </div>
  );
}

export default Memory;
