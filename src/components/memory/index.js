import React, { useState } from "react";
import "./index.css";
import StatusBar from "./StatusBar";
import MemoryCard from "./MemoryCard";

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

function Memory() {
  const [game, setGame] = useState({
    cards: generateCards(),
    fristCard: undefined,
    secondCard: undefined,
  });

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

      // 1. If both firstCard and secondCard from the previous state are undefined =>
      // we should flip the clicked card and set it as the firstCard
      if (!firstCard) {
        // the same as firstCard === "undefiend

        return { cards: newCard, firstCard: card };
      }
      // 2. Else, if firstCard is defined, but secondCard isn't =>
      // we should flip the clicked card, keep the firstCard as is, but set the secondCard =>
      else if (!secondCard) {
        // the same as (firstCard && !secondCard)

        return { cards: newCard, firstCard, secondCard: card };
      }
      // 3. Else, if the previous two clicked cards have the same color =>
      // we should flip the clicked card, set the new firstCard and remove secondCard from the state
      else if (firstCard.color === secondCard.color) {
        console.log("the same");
        secondCard = undefined;
        return { cards: newCard, firstCard: card, secondCard };
      }
      // 4. Else, if the previous two clicked cards have different colors =>
      // we should flip the clicked card and flip back firstCard and secondCard,
      // we should also set the new firstCard and remove secondCard from the state
      else {
        console.log("not the same");
        let newCard2 = flipCard(newCard, firstCard);
        newCard2 = flipCard(newCard2, secondCard);

        return { cards: newCard2, firstCard: card };
        // firstCard tilldelas den tredje klickade kortet eftersom first och second inte var en match
      }
    });
  }

  function onRestart() {
    setGame({
      cards: generateCards(),
      fristCard: undefined,
      secondCard: undefined,
    });
  }

  // I return är html kod, men om du vill lägga till javascript kod måste det vara inne i {}

  return (
    <div className="game-container">
      <StatusBar status="Time: 0s" onRestart={onRestart}></StatusBar>
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
    </div>
  );
}

export default Memory;
