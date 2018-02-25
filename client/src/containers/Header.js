import React from 'react';
import ReactDOM from 'react-dom';
import HeaderComp from '../components/Header.js';
import { connect } from 'react-redux';

const mapStateToProps = state => {
  console.log('state', state);
  return state.player;
};
const mapDispatchToProps = dispatch => {
  return {};
};
const Header = connect(mapStateToProps, mapDispatchToProps)(HeaderComp);

export default Header;
