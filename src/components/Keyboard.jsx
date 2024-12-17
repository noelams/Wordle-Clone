import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDeleteLeft } from "@fortawesome/free-solid-svg-icons";

export default function Keyboard({
  onLetterClick,
  onEnterClick,
  onBackspaceClick,
}) {
  const rows = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Z", "X", "C", "V", "B", "N", "M"],
  ];
  return (
    <div className="keyboard-container">
      <div className="keyboard-row">
        {"QWERTYUIOP".split("").map((letter) => (
          <button
            key={letter}
            className="letter top"
            onClick={() => onLetterClick(letter)}
          >
            {letter}
          </button>
        ))}
      </div>

      <div className="keyboard-row">
        {"ASDFGHJKL".split("").map((letter) => (
          <button
            key={letter}
            className="letter"
            onClick={() => onLetterClick(letter)}
          >
            {letter}
          </button>
        ))}
      </div>

      <div className="keyboard-row">
        <button className="letter" onClick={onEnterClick}>
          ENTER
        </button>
        {"ZXCVBNM".split("").map((letter) => (
          <button
            key={letter}
            className="letter"
            onClick={() => onLetterClick(letter)}
          >
            {letter}
          </button>
        ))}
        <button className="letter" onClick={onBackspaceClick}>
          <FontAwesomeIcon icon={faDeleteLeft} />
        </button>
      </div>
    </div>
  );
}
