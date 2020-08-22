import * as utils from "../../utils";

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

export function generateCards() {
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
export function calculateNewGame(
  { cards, firstCard, secondCard },
  card,
  onGameWon
) {
  // If the card is already flipped there is nothing we need to do (write an if-statement with a return; inside)
  if (card.isFlipped) return { cards, firstCard, secondCard };

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
      onGameWon();
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
}

export function fetchLeaderboard() {
  return utils
    .fetchLeaderboard("memory", [["timeMs", "asc"]])
    .then((leaderboard) =>
      leaderboard.map(
        (score, i) => `${i + 1}. ${score.name}: ${score.timeMs}ms`
      )
    ); // this is a promise
}

export function saveScore(name, timeMs) {
  return utils.saveScore("memory", { name, timeMs }); // skapar en obecjt med namn och timeMs, genväg istället för att skriva name:name,timeMs:timeMs
}
