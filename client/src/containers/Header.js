import React from 'react';
import ReactDOM from 'react-dom';
import HeaderComp from '../components/Header.js';
import { connect } from 'react-redux';

const mapStateToProps = ({ player, boatsWaiting }) => {
  return { player, boatsWaiting };
};
const Header = connect(mapStateToProps)(HeaderComp);

export default Header;
