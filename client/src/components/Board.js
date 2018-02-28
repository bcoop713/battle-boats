import React from 'react';
import Styles from '../styles.scss';
import { map, any, equals, flatten } from 'ramda';

function Cell(onMouseUp, onMouseDown, x, y, boatCoords) {
  const coord = { x, y };
  const containsShip = any(boat => {
    const match = equals(boat, coord);
    return match;
  }, flatten(boatCoords))
    ? Styles['has-ship']
    : '';
  const styles = [Styles.cell, containsShip].join(' ');
  return (
    <div
      onMouseUp={() => onMouseUp(coord)}
      onMouseDown={() => onMouseDown(coord)}
      key={x * 10 + y}
      className={styles}
    />
  );
}

function Row(row) {
  return <div className={Styles.row}>{row}</div>;
}

function MyBoard({ onMouseDown, onMouseUp, boatCoords }) {
  const xAxis = [1, 2, 3, 4, 5, 6, 7, 8];
  const yAxis = [1, 2, 3, 4, 5, 6, 7, 8];
  const matrix = map(
    y => map(x => Cell(onMouseUp, onMouseDown, x, y, boatCoords), xAxis),
    yAxis
  );

  const grid = map(Row, matrix);
  return <div className={Styles.board}>{grid}</div>;
}

export default MyBoard;
