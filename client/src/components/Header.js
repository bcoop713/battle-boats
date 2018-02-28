import React from 'react';

function Header({ player, boatsWaiting }) {
  return (
    <section className="hero is-primary">
      <div className="hero-body">
        <div className="container">
          <h1 className="title">Battle Boats</h1>
          <h2 className="subtitle">Welcome Player {player.number}</h2>
          <p>
            Place all your boats to start playing: {boatsWaiting} Boats
            Remaining
          </p>
        </div>
      </div>
    </section>
  );
}

export default Header;
