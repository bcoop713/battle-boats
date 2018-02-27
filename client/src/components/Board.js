import React from "react";
import Styles from "../styles.scss";
import { map } from "ramda";

function Cell(onMouseUp, onMouseDown, x, y) {
  const coord = { x, y };
  return (
    <div
      onMouseUp={() => onMouseUp(coord)}
      onMouseDown={() => onMouseDown(coord)}
      key={x * 10 + y}
      className={Styles.cell}
    >
      Cell
    </div>
  );
}

function Row(row) {
  return <div className={Styles.row}>{row}</div>;
}

function MyBoard({ onMouseDown, onMouseUp }) {
  const xAxis = [1, 2, 3, 4, 5, 6, 7, 8];
  const yAxis = [1, 2, 3, 4, 5, 6, 7, 8];
  const matrix = map(
    y => map(x => Cell(onMouseUp, onMouseDown, x, y), xAxis),
    yAxis
  );

  const grid = map(Row, matrix);
  return <div className={Styles.board}>{grid}</div>;
}

export default MyBoard;
