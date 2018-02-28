import React from 'react';
import ReactDOM from 'react-dom';
import EnemyBoardComp from '../components/Board.js';
import { connect } from 'react-redux';
import actions from '../actions.js';

const mapStateToProps = ({ sentHits, sentMisses }) => {
  const boatCoords = [];
  return { hits: sentHits, misses: sentMisses, boatCoords };
};

const mapDispatchToProps = dispatch => {
  return {
    boatPlacementEnd: coord => {},
    boatPlacementStart: coord => {},
    sendAttack: coord => {
      dispatch(actions.SendAttack(coord));
    }
  };
};

const MyBoard = connect(mapStateToProps, mapDispatchToProps)(EnemyBoardComp);

export default MyBoard;
