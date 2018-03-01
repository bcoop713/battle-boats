import React from 'react';
import ReactDOM from 'react-dom';
import HeaderComp from '../components/Header.js';
import { connect } from 'react-redux';

const mapStateToProps = ({ player, instructions }) => {
  return { player, instructions };
};
const Header = connect(mapStateToProps)(HeaderComp);

export default Header;
