import React from 'react';
import PlayField from './PlayField.js';
import Header from '../containers/Header.js';

const Splash = ({ loading }) => {
  if (loading) {
    return <h1>LOADING</h1>;
  } else {
    return (
      <div>
        <Header />
        <PlayField />
      </div>
    );
  }
};

export default Splash;
