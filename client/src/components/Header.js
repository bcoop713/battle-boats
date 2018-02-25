import React from 'react';

function Header({ number }) {
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
