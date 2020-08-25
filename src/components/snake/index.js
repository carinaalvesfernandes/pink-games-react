import React, { useState, useEffect } from "react";
import "./index.css";
import * as helpers from "./helpers.js";
import StatusBar from "../StatusBar";
import ResultModal from "../ResultModal";
import TouchController from "./TouchController";
import * as utils from "../../utils";

function Snake() {
  const [game, setGame] = useState(helpers.generateGame());
  const [gameOver, setGameOver] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [scoreCanBeSaved, setScoreCanBeSaved] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);

  // om jag har svårt med useEffect skriv ner den tabellen om hur useEffect fungerar
  useEffect(() => {
    if (gameOver) return; // om spelaren att förlorat så utförs inte Interval

    const intervallID = setInterval(
      () =>
        setGame((oldGame) => {
          const newGame = helpers.tick(oldGame);
          if (helpers.isGameOver(newGame)) {
            setGameOver(true);
            setScoreCanBeSaved(true);
            setShowModal(true);
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

  useEffect(() => {
    if (!gameOver) {
      const intervalId = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 100);
      return () => clearInterval(intervalId);
    }
  }, [gameOver, startTime]);

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

  function setDir(dir) {
    setGame((oldGame) => {
      return {
        ...oldGame,
        snake: {
          ...oldGame.snake,
          dir,
        },
      };
    });
  }

  function onRestart() {
    setGame(helpers.generateGame());
    setGameOver(false);
    setScoreCanBeSaved(false);
    setElapsedTime(0);
    setStartTime(Date.now());
  }

  const cells = [];
  for (let y = 0; y < helpers.height; y++) {
    for (let x = 0; x < helpers.width; x++) {
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
      <StatusBar
        status1={`Score: ${helpers.getScore(game)}`}
        status2={`Time: ${utils.prettifyTime(elapsedTime)}`}
        onRestart={onRestart}
        onShowLeaderboard={() => setShowModal(true)}
      ></StatusBar>
      <div className="snake-grid">{cells}</div>
      <TouchController onChangeDir={setDir} />
      <ResultModal
        show={showModal}
        handleClose={() => setShowModal(false)} // varför behöver jag skriva så och inte setShowModel(false)?  det är för att vi har en onclick function. functionen retunerar inget och därför behövs det skriva så(jag tror)
        header={gameOver ? "Game Over" : "Leaderboard"}
        body={gameOver ? `Your score was ${helpers.getScore(game)}.` : ""}
        fetchLeaderboard={helpers.fetchLeaderboard}
        saveScore={(name) =>
          helpers
            .saveScore(name, helpers.getScore(game), elapsedTime)
            .then(() => setScoreCanBeSaved(false))
        } // i en then ska det alltid vara en function
        scoreCanBeSaved={scoreCanBeSaved}
      ></ResultModal>
    </div>
  );
}

export default Snake;
