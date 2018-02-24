// @flow;
import React from 'react';
import ReactDOM from 'react-dom';
import Styles from './styles.scss';

function Board(props) {
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

ReactDOM.render(
  <div id="root">
    <Board />
    <Board />
  </div>,
  document.getElementById('app')
);
