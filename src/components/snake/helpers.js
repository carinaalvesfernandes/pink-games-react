// not a componet thats why not big letter, its a helper functions file
import * as utils from "../../utils";

export const width = 20;
export const height = 12;

export function generateGame() {
  const snake = {
    head: {
      x: width / 2, // tar mitten av grid
      y: height / 2,
    },
    tail: [
      {
        x: width / 2 - 1,
        y: height / 2,
      },
    ],
    dir: "right",
  };

  return {
    snake: snake,
    food: generateFood(snake),
    commands: [],
  };
}

export function generateFood(snake) {
  // put the food on a place where the snake is not
  let food = { ...snake.head };

  while (
    isEqual(food, snake.head) ||
    snake.tail.some((cell) => isEqual(food, cell))
  ) {
    food = {
      x: random(width),
      y: random(height),
    };
  }
  return food;
}

export function isEqual(p1, p2) {
  return p1.x === p2.x && p1.y === p2.y;
}

function random(max) {
  return Math.floor(Math.random() * max);
}

export function tick(game) {
  const { snake, food, commands, isOver } = game; // tror att det är samma som const snake = game.snake;

  let newCommands = [...commands];

  /**
   * kollar ifall arrayen innehåller mer än 0 elements.
   * och  ifall första index i array newCommands är mottsatt till snake.dir eller ifall det är samma innehåll tas (index/elementet)den  bort ifrån arrayen.
   */
  while (
    newCommands.length > 0 &&
    (isOpposite(newCommands[0], snake.dir) || newCommands[0] === snake.dir)
  ) {
    newCommands = newCommands.slice(1);
  }

  // ifall allt stämmer  tilldelas newDir samma innehåll som arrayen newCommands första index, sedan tas den bort ifån arrayen
  let newDir = snake.dir;
  if (newCommands.length > 0) {
    newDir = newCommands[0];
    newCommands = newCommands.slice(1);
  }

  let newHead;
  switch (newDir) {
    case "right":
      newHead = { x: snake.head.x + 1, y: snake.head.y };
      break;
    case "down":
      newHead = { x: snake.head.x, y: snake.head.y + 1 };
      break;
    case "left":
      newHead = { x: snake.head.x - 1, y: snake.head.y };
      break;
    case "up":
      newHead = { x: snake.head.x, y: snake.head.y - 1 };
      break;
  }

  const newTail = generateNewTail(snake, food, newHead);
  const newSnake = {
    ...snake,
    head: newHead,
    tail: newTail,
    dir: newDir,
  };

  // oldsnake is in the old posistion
  // the newSnake is the new Snake posistion that's why whe send the newSnake.

  // när snake äter man blir cellen där maten var den nya huvudet
  //kan skrivas direkt till return statement istället
  /*let newFood = food;
  if (isEqual(food, newHead)) newFood = generateFood(newSnake);*/

  return {
    ...game,
    isOver: isGameOver(game),
    snake: newSnake,
    food: isEqual(newHead, food) ? generateFood(newSnake) : food,
    commands: newCommands,
  };
}

function generateNewTail(oldSnake, oldFood, newHead) {
  // Create a variable newTail (an array). Its first cell should be the old snake's head
  // and the rest of the cells should be the old snake's tail. Use concat() function
  // to add (append) a whole array to another array.

  let newTail = [oldSnake.head];
  // concat does not mutate the obj but returns the result so it must saved in a variable
  newTail = newTail.concat(oldSnake.tail);
  //*... spred*/
  //lättare sätt att skriva samma kod:
  newTail = [oldSnake.head, ...oldSnake.tail];

  if (!isEqual(newHead, oldFood)) {
    // does mutate
    newTail.pop();
  }
  return newTail;
}

function isOpposite(dir1, dir2) {
  return (
    (dir1 === "left" && dir2 === "right") ||
    (dir1 === "right" && dir2 === "left") ||
    (dir1 === "up" && dir2 === "down") ||
    (dir1 === "down" && dir2 === "up")
  );
}

export function isGameOver(game) {
  const snake = game.snake;
  return (
    isOutOfBounds(snake.head) ||
    snake.tail.some((cell) => isEqual(cell, snake.head))
  );
}

function isOutOfBounds(cell) {
  return cell.x < 0 || cell.x >= width || cell.y < 0 || cell.y >= height;
}

export const getScore = (game) => game.snake.tail.length - 1;

export function fetchLeaderboard() {
  return utils
    .fetchLeaderboard("snake", [
      ["score", "desc"],
      ["timeMs", "asc"],
    ])
    .then((leaderboard) =>
      leaderboard.map(
        (score, i) =>
          `${i + 1}. ${score.name}: ${score.score}, ${utils.prettifyTime(
            score.timeMs
          )}`
      )
    ); // this is a promise
}

export function saveScore(name, score, timeMs) {
  return utils.saveScore("snake", { name, score, timeMs }); // skapar en obecjt med namn och timeMs, genväg istället för att skriva name:name,timeMs:timeMs
}

export const initialIntervalMs = 400;

// Ökar takten med 10% på spelet efter varje tredje måltid
export function getIntervalMs(tailLength) {
  return initialIntervalMs * Math.pow(0.8, Math.floor((tailLength - 1) / 3));
}

// Generates a new gamestate depending on the previous game state
/*export function tick(oldGame) {
  const oldSnake = oldGame.snake;
  const oldFood = oldGame.food;

  const newHead = generateNewHead(oldSnake);
  const newTail = generateNewTail(oldSnake, oldFood, newHead);
  const newSnake = {
    ...oldSnake,
    head: newHead,
    tail: newTail,
  };

  // oldsnake is in the old posistion
  // the newSnake is the new Snake posistion that's why whe send the newSnake.

  let newFood = oldFood;
  // när snake äter man blir cellen där maten var den nya huvudet
  if (isEqual(oldFood, newHead)) newFood = generateFood(newSnake);

  return {
    snake: newSnake,
    food: newFood,
  };
}*/

/*function generateNewHead(oldSnake) {
  let newHead;
  switch (oldSnake.dir) {
    case "right":
      newHead = { x: oldSnake.head.x + 1, y: oldSnake.head.y };
      break;
    case "down":
      // newHead = ???
      newHead = { x: oldSnake.head.x, y: oldSnake.head.y + 1 };
      break;
    case "left":
      // newHead = ???
      newHead = { x: oldSnake.head.x - 1, y: oldSnake.head.y };
      break;
    case "up":
      // newHead = ???
      newHead = { x: oldSnake.head.x, y: oldSnake.head.y - 1 };
      break;
  }
  return newHead;
}*/
