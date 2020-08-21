import React, { useState, useEffect } from "react";
import "./index.css";
import * as helpers from "./helpers.js";

const width = 20;
const height = 12;

function Snake() {
  const [game, setGame] = useState(helpers.generateGame());
  const [gameOver, setGameOver] = useState(false);

  // om jag har svårt med useEffect skriv ner den tabellen om hur useEffect fungerar
  useEffect(() => {
    if (gameOver) return; // om spelaren att förlorat så utförs inte Interval

    const intervallID = setInterval(
      () =>
        setGame((oldGame) => {
          const newGame = helpers.tick(oldGame);
          if (helpers.isGameOver(newGame)) {
            setGameOver(true);
            console.log("try better next time");
            return oldGame;
          }

          return newGame;
        }),
      400
    );
    return () => clearInterval(intervallID);
  }, [gameOver]);

  useEffect(() => {
    console.log("now");
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  function handleKeyPress(event) {
    let newDir;
    switch (event.keyCode) {
      case 37:
      case 65:
        newDir = "left";
        break;
      case 38:
      case 87:
        newDir = "up";
        break;
      case 39:
      case 68:
        newDir = "right";
        break;
      case 40:
      case 83:
        newDir = "down";
        break;
    }

    if (newDir) {
      console.log(newDir);
      setGame((oldGame) => {
        return { ...oldGame, snake: { ...oldGame.snake, dir: newDir } };
      });
    }
  }

  const cells = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const cell = { x, y }; // när namen är samma som value går det att skriva så. Det är samma som {x:x ,y:y}
      let className = "";
      if (helpers.isEqual(cell, game.snake.head)) {
        className = " head";
      } else if (helpers.isEqual(cell, game.food)) {
        className = " food";
      } else if (
        game.snake.tail.some((tailCell) => helpers.isEqual(cell, tailCell))
      ) {
        className = " tail";
      }

      cells.push(
        <div key={x + " - " + y} className={"snake-cell" + className}></div>
      );
    }
  }

  return (
    <div className="game-container">
      <div className="snake-grid">{cells}</div>
    </div>
  );
}

export default Snake;
