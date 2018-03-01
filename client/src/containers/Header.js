import React from 'react';
import ReactDOM from 'react-dom';
import HeaderComp from '../components/Header.js';
import actions from '../actions.js';
import { connect } from 'react-redux';

const mapStateToProps = ({ player, instructions }) => {
  return { player, instructions };
};
const mapDispatchToProps = dispatch => {
  return {
    restart: () => {
      dispatch(actions.SendRestart());
    }
  };
};
const Header = connect(mapStateToProps, mapDispatchToProps)(HeaderComp);

export default Header;
