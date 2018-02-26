import React from 'react';
import ReactDOM from 'react-dom';
import HeaderComp from '../components/Header.js';
import { connect } from 'react-redux';

const mapStateToProps = state => {
  return state.player;
};
const Header = connect(mapStateToProps)(HeaderComp);

export default Header;
