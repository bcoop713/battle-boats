// @flow
import React from 'react';
import type { Player } from '../reducers.js';

function Header({ number }: Player) {
  return (
    <section className="hero is-primary">
      <div className="hero-body">
        <div className="container">
          <h1 className="title">Battle Boats</h1>
          <h2 className="subtitle">Welcome Player {number}</h2>
        </div>
      </div>
    </section>
  );
}

export default Header;
