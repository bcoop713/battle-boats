import React from "react";
import ReactDOM from "react-dom";
import MyBoardComp from "../components/Board.js";
import { connect } from "react-redux";
import actions from "../actions.js";

const mapStateToProps = state => {
  return state;
};

const mapDispatchToProps = dispatch => {
  return {
    onMouseUp: coord => {
      dispatch(actions.BoatPlacementEnd(coord));
    },
    onMouseDown: coord => {
      dispatch(actions.BoatPlacementStart(coord));
    }
  };
};

const MyBoard = connect(mapStateToProps, mapDispatchToProps)(MyBoardComp);

export default MyBoard;
