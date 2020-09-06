import React, { useState, useEffect } from "react";
import MsCell from "./MsCell";
import ModeSwitch from "./ModeSwitch";
import StatusBar from "../StatusBar";
import ResultModal from "../ResultModal";
import "./index.css";
import * as helpers from "./helpers.js";
import * as utils from "../../utils";

function Minesweeper() {
  const [grid, setGrid] = useState(helpers.generateGrid());
  const [win, setWin] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [isMarkMode, setIsMarkMode] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [scoreCanBeSaved, setScoreCanBeSaved] = useState(false);

  //const [minesLeft, setMinesLeft] = useState(helpers.mines);

  const cells = [];

  useEffect(() => {
    if (win) {
      setScoreCanBeSaved(true);
      setShowModal(true);
    } else if (gameOver) {
      setScoreCanBeSaved(false);
      setShowModal(true);
    }
  }, [win, gameOver]);

  useEffect(() => {
    if (startTime !== 0 && !win && !gameOver) {
      const intervalID = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 1000);

      return () => clearInterval(intervalID); // this is for cleaning up
    }
  }, [startTime, win, gameOver]);

  for (let y = 0; y < helpers.height; y++) {
    for (let x = 0; x < helpers.width; x++) {
      cells.push(
        <MsCell
          {...grid[y * helpers.width + x]}
          minesAround={helpers.calculateMinesAround(grid, x, y)}
          key={`${y} ${x}`}
          onClick={() =>
            isMarkMode ? onCellRightClick(x, y) : onCellClick(x, y)
          }
          onRightClick={() => onCellRightClick(x, y)}
        ></MsCell>
      );
    }
  }

  function onCellClick(x, y) {
    if (win || gameOver) return;

    //startTime === 0 ? setStartTime(Date.now()) : startTime;
    setStartTime((oldStartTime) =>
      oldStartTime === 0 ? Date.now() : oldStartTime
    );

    setGrid((oldGrid) => {
      let newGrid = helpers.openCells(oldGrid, x, y);
      if (oldGrid[y * helpers.width + x].isMine) {
        setGameOver(true);
        newGrid = helpers.openAllMines(newGrid);
        console.log("game Over");
      } else if (helpers.isWin(newGrid)) {
        setWin(true);
        console.log("YOU ARE A WINNER");
      }
      return newGrid;
    });
  }

  function onCellRightClick(x, y) {
    startTime === 0 ? setStartTime(Date.now()) : startTime;
    if (win || gameOver) return;

    setGrid((oldGrid) => {
      let newGrid = helpers.markCell(oldGrid, x, y);
      if (helpers.isWin(newGrid)) {
        setWin(true);
        console.log("YOU ARE A WINNER");
      }
      return newGrid;
    });
  }

  function onRestart() {
    setGrid(helpers.generateGrid());
    setWin(false);
    setGameOver(false);
    setStartTime(0);
    setElapsedTime(0);
    setScoreCanBeSaved(false);
  }

  return (
    <div className="game-container">
      <StatusBar
        status1={`Time: ${utils.prettifyTime(elapsedTime)}`}
        status2={`Mines left: ${
          helpers.mines - helpers.calculateMarkedCells(grid)
        }`}
        onRestart={() => onRestart()}
        onShowLeaderboard={() => setShowModal(true)}
      ></StatusBar>
      <div className="ms-grid">{cells}</div>
      <ModeSwitch
        isMarkMode={isMarkMode}
        onChange={() => setIsMarkMode(!isMarkMode)} // ändrar från true till false och vis versa
      />

      <ResultModal
        show={showModal}
        handleClose={() => setShowModal(false)} // varför behöver jag skriva så och inte setShowModel(false)?  det är för att vi har en onclick function. functionen retunerar inget och därför behövs det skriva så(jag tror)
        header={
          win
            ? "Congratulations, you won!"
            : gameOver
            ? "Game Over"
            : "Leaderboard"
        }
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

export default Minesweeper;
