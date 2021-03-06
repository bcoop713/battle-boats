import React from 'react';
import ReactDOM from 'react-dom';
import MyBoardComp from '../components/Board.js';
import { connect } from 'react-redux';
import actions from '../actions.js';

const mapStateToProps = ({ boatCoords, receivedHits, receivedMisses }) => {
  return { boatCoords, hits: receivedHits, misses: receivedMisses };
};

const mapDispatchToProps = dispatch => {
  return {
    boatPlacementEnd: coord => {
      dispatch(actions.BoatPlacementEnd(coord));
    },
    boatPlacementStart: coord => {
      dispatch(actions.BoatPlacementStart(coord));
    },
    sendAttack: coord => {}
  };
};

const MyBoard = connect(mapStateToProps, mapDispatchToProps)(MyBoardComp);

export default MyBoard;
