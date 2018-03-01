import React from 'react';
import PlayField from './PlayField.js';
import Header from '../containers/Header.js';
import ErrorModal from '../containers/ErrorModal.js';
import GameOver from '../containers/GameOver.js';

const Splash = ({ loading }) => {
  if (loading) {
    return '';
  } else {
    return (
      <div>
        <Header />
        <PlayField />
        <ErrorModal />
        <GameOver />
      </div>
    );
  }
};

export default Splash;
