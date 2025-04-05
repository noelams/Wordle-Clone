import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDeleteLeft } from "@fortawesome/free-solid-svg-icons";

export default function Keyboard({
  onLetterClick,
  onEnterClick,
  onBackspaceClick,
  keyColors,
}) {
  const rows = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Z", "X", "C", "V", "B", "N", "M"],
  ];
  return (
    <div className="keyboard-container">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="keyboard-row">
          {row.map((letter) => (
            <button
              key={letter}
              className={`letter ${keyColors[letter] || ""}`}
              onClick={() => onLetterClick(letter)}
            >
              {letter}
            </button>
          ))}
        </div>
      ))}
      <div className="keyboard-row">
        <button className="letter" onClick={onEnterClick}>
          Enter
        </button>
        <button className="letter" onClick={onBackspaceClick}>
          Backspace
        </button>
      </div>
    </div>
  );
}
