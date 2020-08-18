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
  cards.sort(() => Math.random() - 0.5);
  return cards;
}

function Memory() {
  const [cards, setCards] = useState(generateCards());

  // useState generar två element i en array, därför skapar vi en array med två index, cards och setCards
  /* useState takes a parameter for the initial value of the state. 
  It will only be used the first time the component renders. 
  useState returns an array of two things: cards is the current value of the state variable, at the time of the rendering; 
  setCards is a function to use for updating cards.*/

  function onCardClicked(clickedCard) {
    setCards((oldCards) => {
      return oldCards.map((card) => {
        if (card.key === clickedCard.key)
          return { ...card, isFlipped: !card.isFlipped };
        // this {...card} kopierar card objectet men ändrar isFlipped till omvänd value, t.ex. om true blir den false om false blir den true.
        return card;
      });
    });
  }

  function onRestart() {
    setCards(generateCards());
  }

  // I return är html kod, men om du vill lägga till javascript kod måste det vara inne i {}

  return (
    <div className="game-container">
      <StatusBar status="Time: 0s" onRestart={onRestart}></StatusBar>
      <div className="memory-grid">
        {cards.map((card) => (
          <MemoryCard
            key={card.key}
            color={card.color}
            isFlipped={card.isFlipped}
            onClick={() => onCardClicked(card)}
          />
          // eftersom den inte har något innehåll i elementet går det att skriva såhär som en shortcut
        ))}
      </div>
    </div>
  );
}

export default Memory;
