// @flow
import React from 'react';
import Board from './Board.js';

function PlayField() {
  return (
    <div className="container">
      <div id="board-container" className="columns">
        <div className="column">
          <Board />
        </div>
        <div className="column">
          <Board />
        </div>
      </div>
    </div>
  );
}

export default PlayField;
