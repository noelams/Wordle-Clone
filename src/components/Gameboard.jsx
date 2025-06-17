import React, { useEffect, useRef, useState } from "react";
import "../style.css";
import Keyboard from "./Keyboard";
import WordleGrid from "./WordleGrid";
import { Toggle } from "./Toggle";
import Toast from "./Toast";
import { OrbitProgress } from "react-loading-indicators";
import { BarChart } from "@mui/x-charts";

export default function Gameboard() {
  const initialGrid = Array(6)
    .fill(null)
    .map(() => Array(5).fill(""));
  const initialFeedback = Array(6)
    .fill(null)
    .map(() => Array(5).fill(""));

  const [grid, setGrid] = useState(initialGrid);
  const [feedback, setFeedback] = useState(initialFeedback);
  const [stats, setStats] = useState({
    gamesPlayed: 0,
    gamesWon: 0,
    winDistribution: [0, 0, 0, 0, 0, 0],
  });
  const [keyColors, setKeyColors] = useState({});
  const [currentPosition, setCurrentPosition] = useState({ row: 0, col: 0 });
  const [targetWord, setTargetWord] = useState("");
  const [isDark, setIsDark] = useState(false);
  const [Toasts, setToasts] = useState();
  const [checkingWord, setcheckingWord] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [IsGameLoaded, setIsGameLoaded] = useState(false);

  const checkingWordRef = useRef(false);

  useEffect(() => {
    checkingWordRef.current = checkingWord;
  }, [checkingWord]);

  const addToast = (message, type) => {
    const id = Date.now();
    const newToast = { id, message, type };
    setToasts(newToast);
  };

  const removeToast = () => {
    setToasts();
  };

  const isValidWord = async (word) => {
    try {
      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
      );

      return response.ok;
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchRandomWord();
    setIsGameLoaded(true);
    const savedStats = JSON.parse(localStorage.getItem("wordleStats"));
    if (savedStats) {
      setStats(savedStats);
    }
  }, []);

  useEffect(() => {
    if (!IsGameLoaded) return; // don't save on first render
    const gameState = {
      grid,
      feedback,
      currentPosition,
      targetWord,
      gameOver,
      keyColors,
    };
    localStorage.setItem("WordleGameState", JSON.stringify(gameState));
  }, [
    grid,
    feedback,
    currentPosition,
    targetWord,
    gameOver,
    keyColors,
    IsGameLoaded,
  ]);

  useEffect(() => {
    const savedState = localStorage.getItem("WordleGameState");
    if (savedState) {
      const {
        grid,
        feedback,
        currentPosition,
        targetWord,
        gameOver,
        keyColors,
      } = JSON.parse(savedState);
      setGrid(grid);
      setFeedback(feedback);
      setCurrentPosition(currentPosition);
      setTargetWord(targetWord);
      setGameOver(gameOver);
      setKeyColors(keyColors);
    } else {
      fetchRandomWord();
    }
    setIsGameLoaded(true);
  }, []);

  const fetchRandomWord = async () => {
    try {
      const response = await fetch(
        "https://random-word-api.vercel.app/api?words=1&length=5"
      );
      const data = await response.json();
      console.log(data);
      const finalData = data.toString();
      setTargetWord(finalData.toUpperCase());
    } catch (error) {
      console.error("error: ", error);
    }
  };

  const updateStats = (guessIndex, didWin) => {
    const updatedStats = JSON.parse(localStorage.getItem("wordleStats")) || {
      gamesPlayed: 0,
      gamesWon: 0,
      winDistribution: [0, 0, 0, 0, 0, 0],
    };

    updatedStats.gamesPlayed += 1;
    if (didWin) {
      updatedStats.gamesWon += 1;
      updatedStats.winDistribution[guessIndex] += 1;
    }

    localStorage.setItem("wordleStats", JSON.stringify(updatedStats));
    setStats(updatedStats); // <-- important
  };

  useEffect(() => {
    const handleKeydown = (e) => {
      if (!checkingWordRef.current || gameOver) {
        const key = e.key;
        if (/^[a-zA-Z]$/.test(key)) {
          handleLetterInput(key.toUpperCase());
        } else if (key === "Enter") {
          e.preventDefault();
          handleEnter();
          return 0;
        } else if (key === "Backspace") {
          e.preventDefault();
          handleBackspace();
          return 0;
        } else {
          return 0;
        }
      }
    };

    window.addEventListener("keydown", handleKeydown);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [currentPosition, grid]);

  const handleEnter = async () => {
    setcheckingWord(true);
    setTimeout(async () => {
      if (currentPosition.col === 5) {
        const currentWord = grid[currentPosition.row].join("");
        console.log(currentWord);

        if (await isValidWord(currentWord)) {
          if (currentWord === targetWord) {
            updateStats(currentPosition.row, true); // since the guess index is the index of the current row, we can directly save currentPosition.row as guessIndex
            addToast(
              "Congratulations! You guessed the word correctly!",
              "success"
            );
            setcheckingWord(true);
            setGameOver(true);
          }

          const newFeedback = [...feedback];
          const feedbackRow = generateFeedback(currentWord, targetWord);
          newFeedback[currentPosition.row] = feedbackRow;
          setFeedback(newFeedback);

          updateKeyColors(currentWord, feedbackRow);

          setCurrentPosition({ row: currentPosition.row + 1, col: 0 });

          if (currentPosition.row === 5 && currentWord !== targetWord) {
            updateStats(currentPosition.row, false);
            addToast(
              `Game over! You ran out of tries! The word was ${targetWord}.`,
              "game-over"
            );
            setcheckingWord(false);
            setGameOver(true);
          }
        } else {
          addToast(`${currentWord} is not a valid word`, "invalid");
          setcheckingWord(false);
        }
      } else if (!(gameOver && currentPosition.col === 5)) {
        addToast("Not enough letters", "invalid");
        setcheckingWord(false);
      }
      setcheckingWord(false);
    }, 500);
  };

  const handleBackspace = () => {
    if (currentPosition.col > 0) {
      const newGrid = [...grid];
      newGrid[currentPosition.row][currentPosition.col - 1] = "";
      setGrid(newGrid);
      setCurrentPosition({ ...currentPosition, col: currentPosition.col - 1 });
    }
  };

  const handleLetterInput = (letter) => {
    if (letter === "BACKSPACE" || letter === "ENTER") {
      return 0;
    }
    if (currentPosition.col < 5) {
      const newGrid = [...grid];
      newGrid[currentPosition.row][currentPosition.col] = letter;
      setCurrentPosition({
        row: currentPosition.row,
        col: currentPosition.col + 1,
      });
    }
  };

  const generateFeedback = (currentWord, targetWord) => {
    const feedbackRow = Array(5).fill("incorrect");
    const targetWordArray = targetWord.split("");
    const currentWordArray = currentWord.split("");

    currentWordArray.forEach((letter, index) => {
      if (letter === targetWordArray[index]) {
        feedbackRow[index] = "correct";
        targetWordArray[index] = null;
      }
    });

    currentWordArray.forEach((letter, index) => {
      if (
        feedbackRow[index] !== "correct" &&
        targetWordArray.includes(letter)
      ) {
        feedbackRow[index] = "wrong-position";
        targetWordArray[targetWordArray.indexOf(letter)] = null;
      }
    });

    return feedbackRow;
  };

  const updateKeyColors = (word, feedbackRow) => {
    const newKeyColors = { ...keyColors };

    word.split("").forEach((letter, index) => {
      const color = feedbackRow[index];

      // Update the key color only if the new color is "green" or the current color is not "green"
      if (
        color === "correct" ||
        (color === "wrong-position" && newKeyColors[letter] !== "correct")
      ) {
        newKeyColors[letter] = color;
      } else if (!newKeyColors[letter]) {
        newKeyColors[letter] = "incorrect";
      }
    });

    setKeyColors(newKeyColors);
  };

  const handleGameRestart = () => {
    setGrid(initialGrid);
    setFeedback(initialFeedback);
    setCurrentPosition({ row: 0, col: 0 });
    setTargetWord("");
    fetchRandomWord();
    setGameOver(false);
    setKeyColors({});
  };

  return (
    <div className="gameboard" data-theme={isDark ? "dark" : "light"}>
      {gameOver ? (
        <div id="gameOver-modal" className="modal" style={{ display: "block" }}>
          <div className="modal-content">
            <p>
              The word is <span className="target-word">{targetWord}</span>
            </p>
            <div className="stats-container">
              <p>Statistics</p>
              <div className="stats-content">
                <div>
                  <span className="stats-figures">{stats.gamesPlayed}</span>
                  <p> Played</p>
                </div>

                <div>
                  <span className="stats-figures">
                    {Math.floor((stats.gamesWon / stats.gamesPlayed) * 100)}
                  </span>
                  <p> Win %</p>
                </div>
              </div>
              <p>Guess Distribution</p>
              <BarChart
                xAxis={[
                  {
                    id: "guessIndexes",
                    data: ["1", "2", "3", "4", "5", "6"],
                    color: "#ffffff",
                  },
                ]}
                series={[
                  {
                    data: stats.winDistribution,
                    color: "#538D4E",
                  },
                ]}
                height={150}
                layout="horizontal"
              />
            </div>

            <button className="playAgain-btn" onClick={handleGameRestart}>
              Play Again
            </button>
          </div>
        </div>
      ) : null}
      <div className="toast-container">
        {Toasts ? (
          <Toast
            key={Toasts.id}
            message={Toasts.message}
            type={Toasts.type}
            onClose={removeToast}
          />
        ) : null}
      </div>
      <div style={{ marginTop: 1, minHeight: 80 }}>
        {checkingWord ? <OrbitProgress color="#32cd32" size="small" /> : null}
      </div>
      <Toggle isChecked={isDark} handleChange={() => setIsDark(!isDark)} />
      <WordleGrid grid={grid} feedback={feedback} />
      <Keyboard
        onLetterClick={handleLetterInput}
        onEnterClick={handleEnter}
        onBackspaceClick={handleBackspace}
        keyColors={keyColors}
        disabled={checkingWord || gameOver}
      />
    </div>
  );
}
