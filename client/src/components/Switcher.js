import React from 'react';
import PlayField from './PlayField.js';
import Header from '../containers/Header.js';
import ErrorModal from '../containers/ErrorModal.js';

const Splash = ({ loading }) => {
  if (loading) {
    return <h1>LOADING</h1>;
  } else {
    return (
      <div>
        <Header />
        <PlayField />
        <ErrorModal />
      </div>
    );
  }
};

export default Splash;
