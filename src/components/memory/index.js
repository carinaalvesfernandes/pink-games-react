import React, { useState, useEffect } from "react";
import "./index.css";
import StatusBar from "../StatusBar";
import MemoryCard from "./MemoryCard";
import * as utils from "../../utils"; // * betyder ALLT
import ResultModal from "../ResultModal";

const colors = [
  "pink",
  "red",
  "orange",
  "yellow",
  "green",
  "teal",
  "blue",
  "purple",
];

function generateCards() {
  const cards = [];
  for (let i = 0; i < colors.length; i++) {
    cards.push({
      key: i * 2,
      color: colors[i],
      isFlipped: false,
    });
    cards.push({
      key: i * 2 + 1,
      color: colors[i],
      isFlipped: false,
    });
  }
  cards.sort(() => Math.random() - 0.5); // shuffle algoritm
  return cards;
}

/* 
Returns a new array of cards where the specified card (cardToFlip)
will have a different value of its isFlipped: true changes to false and false to true.
*/

function flipCard(cards, cardToFlip) {
  return cards.map((card) => {
    if (card.key === cardToFlip.key) {
      return { ...card, isFlipped: !card.isFlipped };
    }
    return card;
  });
}

/*
const intervallID = setInterval(() => console.log(Date.now()), 1000); //1000 ms is how often should this function run
clearinterval(intervallID); // rensar intervallen men behöver ett ID
*/

function Memory() {
  /*utils
    .fetchLeaderboard("memory")
    .then((leaderboard) => console.log(leaderboard));*/

  const [game, setGame] = useState({
    cards: generateCards(),
    fristCard: undefined,
    secondCard: undefined,
  });

  const [startTime, SetstartTime] = useState(0); // state variable
  const [elapsedTime, SetElapsedTime] = useState(0);
  const [win, SetWin] = useState(false);
  const [showModal, setShowModal] = useState(false);

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
        SetElapsedTime(Date.now() - startTime);
      }, 1000);
      return () => clearInterval(intervalID); // this is for cleaning up
    }
  }, [startTime, win]);

  useEffect(() => {
    if (win) {
      setShowModal(true);
    }
  }, [win]);

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
    // If the card is already flipped there is nothing we need to do (write an if-statement with a return; inside)
    if (card.isFlipped) return console.log("The card is already flipped");

    setGame(({ cards, firstCard, secondCard }) => {
      let newCard = flipCard(cards, card);
      // change newCard to newCards

      // 1. If both firstCard and secondCard from the previous state are undefined =>
      // we should flip the clicked card and set it as the firstCard
      if (!firstCard) {
        // the same as firstCard === "undefiend

        return { cards: newCard, firstCard: card }; // eftersom secondcard är undefiend behöver vi inte returna den
      }
      // 2. Else, if firstCard is defined, but secondCard isn't =>
      // we should flip the clicked card, keep the firstCard as is, but set the secondCard =>
      else if (!secondCard) {
        // the same as (firstCard && !secondCard)

        let isAllCardFlipped = newCard.every((card) => card.isFlipped);
        if (isAllCardFlipped) {
          SetWin(true);
          console.log("You are the best!");
        }

        return { cards: newCard, firstCard, secondCard: card };
      }
      // 3. Else, if the previous two clicked cards have the same color =>
      // we should flip the clicked card, set the new firstCard and remove secondCard from the state
      else if (firstCard.color === secondCard.color) {
        secondCard = undefined;
        return { cards: newCard, firstCard: card, secondCard };
      }
      // 4. Else, if the previous two clicked cards have different colors =>
      // we should flip the clicked card and flip back firstCard and secondCard,
      // we should also set the new firstCard and remove secondCard from the state
      else {
        let newCard2 = flipCard(newCard, firstCard); // vi flippar både firstcard och secondcard till deck newCard2
        newCard2 = flipCard(newCard2, secondCard);

        return { cards: newCard2, firstCard: card };
        // firstCard tilldelas den tredje klickade kortet eftersom first och second inte var en match
      }
    });

    SetstartTime((oldStartTime) =>
      oldStartTime === 0 ? Date.now() : oldStartTime
    );
  }

  function onRestart() {
    setGame({
      cards: generateCards(),
      fristCard: undefined,
      secondCard: undefined,
    });
    SetstartTime(0);
    SetElapsedTime(0);
    SetWin(false);
  }

  function fetchLeaderboard() {
    return utils
      .fetchLeaderboard("memory", [["timeMs", "asc"]])
      .then((leaderboard) =>
        leaderboard.map(
          (score, i) => `${i + 1}. ${score.name}: ${score.timeMs}ms`
        )
      ); // this is a promise
  }

  function saveScore(name, timeMs) {
    utils.saveScore("memory", { name, timeMs }); // skapar en obecjt med namn och timeMs, genväg istället för att skriva name:name,timeMs:timeMs
  }

  // I return är html kod, men om du vill lägga till javascript kod måste det vara inne i {}

  return (
    <div className="game-container">
      <StatusBar
        status={`Time: ${elapsedTime} ms`}
        onRestart={onRestart}
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
        header={"Congratulations, you won!"}
        body={"Your time was " + elapsedTime + "ms"}
        fetchLeaderboard={fetchLeaderboard}
        saveScore={(name) => saveScore(name, elapsedTime)}
      ></ResultModal>
    </div>
  );
}

export default Memory;
