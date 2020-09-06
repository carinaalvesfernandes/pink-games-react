import * as utils from "../../utils";

export const [width, height] = [10, 10];
export const mines = 15;

export function generateGrid() {
  const grid = [];
  for (let i = 0; i < height * width; i++) {
    grid.push({
      isMine: false,
      isOpen: false,
      isMarked: false,
    });
  }

  for (let i = 0; i < mines; i++) {
    let random = randomNum(); // istället för att hårkoda 100
    while (grid[random].isMine) {
      random = randomNum();
    }
    grid[random].isMine = true;
  }
  return grid;
}

const randomNum = () => Math.floor(Math.random() * (height * width));

export function calculateMinesAround(grid, x, y) {
  let numberOfMines = 0;
  numberOfMines += calculateMines(grid, x - 1, y - 1);
  numberOfMines += calculateMines(grid, x, y - 1);
  numberOfMines += calculateMines(grid, x + 1, y - 1);
  numberOfMines += calculateMines(grid, x + 1, y);
  numberOfMines += calculateMines(grid, x - 1, y);
  numberOfMines += calculateMines(grid, x - 1, y + 1);
  numberOfMines += calculateMines(grid, x, y + 1);
  numberOfMines += calculateMines(grid, x + 1, y + 1);
  return numberOfMines;
}

function calculateMines(grid, x, y) {
  if (x < 0 || y < 0 || x > width - 1 || y > height - 1) {
    return 0;
  }
  return grid[y * width + x].isMine ? 1 : 0;
}

export function calculateMarkedCells(grid) {
  return grid.filter((cell) => cell.isMarked).length;
}

/*export function openCell(oldGrid, x, y) {
  const newGrid = [];
  for (let i = 0; i < height * width; i++) {
    newGrid.push({
      ...oldGrid[i],
      isOpen: y * width + x === i ? true : oldGrid[i].isOpen,
      isMarked: y * width + x === i ? false : oldGrid[i].isMarked,
    });
  }

  return newGrid;
}*/

export function openCells(grid, x, y) {
  if (x < 0 || y < 0 || x >= width || y >= height) return grid;

  if (grid[y * width + x].isOpen) return grid;

  let newGrid = grid.map((cell, i) => {
    return i === y * width + x
      ? { ...cell, isOpen: true, isMarked: false }
      : cell;
  });

  if (!calculateMinesAround(newGrid, x, y)) {
    newGrid = openCells(newGrid, x - 1, y - 1); // recursion
    newGrid = openCells(newGrid, x, y - 1);
    newGrid = openCells(newGrid, x + 1, y - 1);
    newGrid = openCells(newGrid, x - 1, y);
    newGrid = openCells(newGrid, x + 1, y);
    newGrid = openCells(newGrid, x - 1, y + 1);
    newGrid = openCells(newGrid, x, y + 1);
    newGrid = openCells(newGrid, x + 1, y + 1);
  }

  return newGrid;
}

export function markCell(oldGrid, x, y) {
  if (oldGrid[y * width + x].isOpen) return oldGrid;

  const newGrid = [];
  for (let i = 0; i < height * width; i++) {
    newGrid.push({
      ...oldGrid[i],
      isMarked:
        y * width + x === i ? !oldGrid[i].isMarked : oldGrid[i].isMarked,
    });
  }

  return newGrid;
}

export function openAllMines(oldGrid, x, y) {
  const newGrid = [];
  for (let i = 0; i < height * width; i++) {
    newGrid.push({
      ...oldGrid[i],
      isOpen: oldGrid[i].isOpen || oldGrid[i].isMine, // if one of them is true
    });
  }
  return newGrid;
}

export function isWin(grid) {
  return grid.every(
    (cell) => (cell.isMine ? cell.isMarked && !cell.isOpen : cell.isOpen) // om cell är mine då måste den vara marked OCH stängd. Är det ingen mine så måste den öppen
  );
}

export function fetchLeaderboard() {
  return utils
    .fetchLeaderboard("minesweeper", [["timeMs", "asc"]])
    .then((leaderboard) =>
      leaderboard.map(
        (score, i) =>
          `${i + 1}. ${score.name}: ${utils.prettifyTime(score.timeMs)}`
      )
    ); // this is a promise
}

export function saveScore(name, timeMs) {
  return utils.saveScore("minesweeper", { name, timeMs }); // skapar en obecjt med namn och timeMs, genväg istället för att skriva name:name,timeMs:timeMs
}
