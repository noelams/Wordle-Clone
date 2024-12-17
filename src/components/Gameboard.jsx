import React, { useEffect, useState } from "react";
import "../style.css";
import Keyboard from "./Keyboard";
import WordleGrid from "./WordleGrid";
import { Toggle } from "./Toggle";

export default function Gameboard() {
  const initialGrid = Array(6)
    .fill(null)
    .map(() => Array(5).fill(""));
  const initialFeedback = Array(6)
    .fill(null)
    .map(() => Array(5).fill(""));

  const [grid, setGrid] = useState(initialGrid);
  const [feedback, setFeedback] = useState(initialFeedback);
  const [keyColors, setKeyColors] = useState({});
  const [currentPosition, setCurrentPosition] = useState({ row: 0, col: 0 });
  const [targetWord, setTargetWord] = useState("");
  const [isDark, setIsDark] = useState(false);

  const isValidWord = async (word) => {
    try {
      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
      );

      return response.ok; // Return true if the response is OK, false otherwise
    } catch (error) {
      return false; // Handle any errors gracefully
    }
  };

  useEffect(() => {
    fetchRandomWord();
  }, []);

  const fetchRandomWord = async () => {
    try {
      const response = await fetch(
        "https://random-word-api.herokuapp.com/word?length=5"
      );
      const data = await response.json();
      const finalData = data.toString();
      setTargetWord(finalData.toUpperCase());
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const handleKeydown = (e) => {
      const key = e.key.toUpperCase();
      if (key >= "A" && key <= "Z") {
        handleLetterInput(key);
      } else if (key === "ENTER") {
        handleEnter();
      } else if (key === "BACKSPACE") {
        handleBackspace();
      }
    };

    window.addEventListener("keydown", handleKeydown);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [currentPosition, grid]);

  const handleEnter = async () => {
    if (currentPosition.col === 5) {
      const currentWord = grid[currentPosition.row].join("");
      console.log(currentWord);

      if (await isValidWord(currentWord)) {
        if (currentWord === targetWord) {
          alert("Congratulations! You guessed the word correctly!");
        }

        const newFeedback = [...feedback];
        newFeedback[currentPosition.row] = generateFeedback(
          currentWord,
          targetWord
        );
        setFeedback(newFeedback);

        // updateKeyColors(currentWord, feedbackRow);

        setCurrentPosition({ row: currentPosition.row + 1, col: 0 });

        if (currentPosition.row === 5) {
          alert("Game over! You ran out of tries!");
          console.log("target word is ", targetWord);
        }
      } else {
        alert("Please enter a valid word!");
      }
    }
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

  // const updateKeyColors = (word, feedbackRow) => {
  //   const newKeyColors = { ...keyColors };

  //   word.split("").forEach((letter, index) => {
  //     const color = feedbackRow[index];

  //     // Update the key color only if the new color is "green" or the current color is not "green"
  //     if (
  //       color === "green" ||
  //       (color === "yellow" && newKeyColors[letter] !== "green")
  //     ) {
  //       newKeyColors[letter] = color;
  //     } else if (!newKeyColors[letter]) {
  //       newKeyColors[letter] = "gray";
  //     }
  //   });

  //   setKeyColors(newKeyColors);
  // };

  return (
    <div className="gameboard" data-theme={isDark ? "dark" : "light"}>
      <Toggle isChecked={isDark} handleChange={() => setIsDark(!isDark)} />
      <WordleGrid grid={grid} feedback={feedback} />
      <Keyboard
        onLetterClick={handleLetterInput}
        onEnterClick={handleEnter}
        onBackspaceClick={handleBackspace}
        // keyColors={keyColors}
      />
    </div>
  );
}
