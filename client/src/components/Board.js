// @flow
import React from 'react';
import Styles from '../styles.scss';

function Board() {
  const cell = (
    <div className={Styles.cell} data-cy="cell">
      Cell
    </div>
  );
  const row = <div className={Styles.row}>{Array(8).fill(cell)}</div>;
  const grid = Array(8).fill(row);
  return (
    <div className={Styles.board} data-cy="board">
      {grid}
    </div>
  );
}

export default Board;
