import React from "react";
import "../style.css";
import Keyboard from "./Keyboard";
import WordleGrid from "./WordleGrid";
import { useState } from "react";
import { Toggle } from "./Toggle";

export default function Gameboard() {
  const [isDark, setIsDark] = useState(false);
  return (
    <div className="gameboard" data-theme={isDark ? "dark" : "light"}>
      <Toggle isChecked={isDark} handleChange={() => setIsDark(!isDark)} />
      <WordleGrid />
      <Keyboard />
    </div>
  );
}
