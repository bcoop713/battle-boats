import React from 'react';
import MyBoard from '../containers/MyBoard.js';
import EnemyBoard from '../containers/EnemyBoard.js';
import Styles from '../styles.scss';
console.log(Styles);

function PlayField() {
  return (
    <div className="container">
      <div id="playgfield-container" className="columns">
        <div className="column">
          <h4 className={Styles['board-title']}>Your Board</h4>
          <MyBoard />
        </div>
        <div className="column">
          <h4 className={Styles['board-title']}>Enemy Board</h4>
          <EnemyBoard />
        </div>
      </div>
    </div>
  );
}

export default PlayField;
