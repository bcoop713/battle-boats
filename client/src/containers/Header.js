// @flow
import React from 'react';
import ReactDOM from 'react-dom';
import HeaderComp from '../components/Header.js';
import type { State } from '../reducers.js';
import { connect } from 'react-redux';

const mapStateToProps = (state: State) => {
  console.log('state', state);
  return state.player;
};
const mapDispatchToProps = dispatch => {
  return {};
};
const Header = connect(mapStateToProps, mapDispatchToProps)(HeaderComp);

export default Header;
