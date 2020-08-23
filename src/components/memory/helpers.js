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
      isMatched: false,
    });
    cards.push({
      key: i * 2 + 1,
      color: colors[i],
      isFlipped: false,
      isMatched: false,
    });
  }
  cards.sort(() => Math.random() - 0.5); // shuffle algoritm
  return cards;
}

/* 
  Returns a new array of cards where the specified card (keysToFlip)
  will have a different value of its isFlipped: true changes to false and false to true.
  keysToFlip = cardsToFlipp
  */

export function flipCards(cards, keysToFlip) {
  return cards.map((card) => {
    return {
      ...card,
      isFlipped: keysToFlip.includes(card.key)
        ? !card.isFlipped
        : card.isFlipped,
    };
  });
}

export function lockCards(cards, keysToLock) {
  return cards.map((card) => {
    return {
      ...card,
      isMatched: keysToLock.includes(card.key) ? true : card.isMatched,
    };
  });
}

export function calculateNewGame(
  { cards, firstCard },
  clickedCard,
  onGameWon,
  setWrongPair
) {
  // If the card is already flipped there is nothing we need to do (write an if-statement with a return; inside)
  if (clickedCard.isFlipped) return { cards, firstCard };

  let newCards = flipCards(cards, [clickedCard.key]);

  // 1. If both firstCard from the previous state are undefined =>
  // we should flip the clicked card and set it as the firstCard
  if (!firstCard) {
    // the same as firstCard === "undefiend

    return { cards: newCards, firstCard: clickedCard };
  }

  // 2. Else, if firstCard is defined, but secondCard isn't =>
  // we should flip the clicked card, keep the firstCard as is, but set the secondCard =>
  else {
    if (firstCard.color !== clickedCard.color) {
      setWrongPair([firstCard, clickedCard]);
    } else {
      newCards = lockCards(newCards, [clickedCard.key, firstCard.key]);
    }
    if (newCards.every((card) => card.isMatched)) {
      onGameWon();
    }
    return {
      cards: newCards,
    };
  }
}

export function fetchLeaderboard() {
  return utils
    .fetchLeaderboard("memory", [["timeMs", "asc"]])
    .then((leaderboard) =>
      leaderboard.map(
        (score, i) =>
          `${i + 1}. ${score.name}: ${utils.prettifyTime(score.timeMs)}`
      )
    ); // this is a promise
}

export function saveScore(name, timeMs) {
  return utils.saveScore("memory", { name, timeMs }); // skapar en obecjt med namn och timeMs, genväg istället för att skriva name:name,timeMs:timeMs
}
