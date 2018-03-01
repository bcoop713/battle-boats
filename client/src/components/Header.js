import React from 'react';

function Header({ player, instructions, restart }) {
  return (
    <section className="hero is-primary">
      <div className="hero-body">
        <div className="container">
          <h1 className="title">Battle Boats</h1>
          <h2 className="subtitle">Welcome Player {player.number}</h2>
          <p>{instructions}</p>
          <button className="button is-info" onClick={restart}>
            New Game
          </button>
        </div>
      </div>
    </section>
  );
}

export default Header;
