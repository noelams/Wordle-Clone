import React from "react";

export default function WordleGrid({ grid, feedback }) {
  return (
    <div className="grid-container">
      {grid.map((row, rowIndex) => (
        <div key={`row-${rowIndex}`} className="grid-row">
          {row.map((letter, colIndex) => (
            <div
              key={`cell-${rowIndex}-${colIndex}`}
              className={`grid-cell ${feedback[rowIndex][colIndex]}`}
            >
              {letter}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
