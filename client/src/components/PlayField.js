import React from 'react';
import MyBoard from '../containers/MyBoard.js';
import EnemyBoard from '../containers/EnemyBoard.js';

function PlayField() {
  return (
    <div className="container">
      <div id="playgfield-container" className="columns">
        <div className="column">
          <MyBoard />
        </div>
        <div className="column">
          <EnemyBoard />
        </div>
      </div>
    </div>
  );
}

export default PlayField;
