import React from "react";

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
              onClick={(e) => {
                onLetterClick(letter);
                e.preventDefault();
                e.currentTarget.blur(); //stops the button from focusing when clicked with the mouse
              }}
            >
              {letter}
            </button>
          ))}
        </div>
      ))}
      <div className="keyboard-row">
        <button
          className="letter"
          onClick={(e) => {
            onEnterClick();
            document.activeElement.blur();
            e.preventDefault();
            e.currentTarget.blur();
          }}
        >
          Enter
        </button>
        <button
          className="letter"
          onClick={(e) => {
            onBackspaceClick();
            e.preventDefault();
            e.currentTarget.blur();
          }}
        >
          Backspace
        </button>
      </div>
    </div>
  );
}
