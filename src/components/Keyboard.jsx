import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDeleteLeft } from "@fortawesome/free-solid-svg-icons";

export default function Keyboard() {
  return (
    <div className="keyboard-container">
      <div className="keyboard-row">
        <button className="letter">Q</button>
        <button className="letter">W</button>
        <button className="letter">E</button>
        <button className="letter">R</button>
        <button className="letter">T</button>
        <button className="letter">Y</button>
        <button className="letter">U</button>
        <button className="letter">I</button>
        <button className="letter">O</button>
        <button className="letter">P</button>
      </div>

      <div className="keyboard-row">
        <button className="letter">A</button>
        <button className="letter">S</button>
        <button className="letter">D</button>
        <button className="letter">F</button>
        <button className="letter">G</button>
        <button className="letter">H</button>
        <button className="letter">J</button>
        <button className="letter">K</button>
        <button className="letter">L</button>
      </div>
      <div className="keyboard-row">
        <button className="letter">ENTER</button>
        <button className="letter">Z</button>
        <button className="letter">X</button>
        <button className="letter">C</button>
        <button className="letter">V</button>
        <button className="letter">B</button>
        <button className="letter">N</button>
        <button className="letter">M</button>
        <button className="letter">
          <FontAwesomeIcon icon={faDeleteLeft} />
        </button>
      </div>
    </div>
  );
}
