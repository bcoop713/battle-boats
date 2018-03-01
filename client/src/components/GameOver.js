import React from 'react';

function GameOver({ victory, restart }) {
  console.log(victory);
  return victory.matchWith({
    Just: ({ value }) => renderModal(value, restart),
    Nothing: () => ''
  });
}

function renderModal(victory, restart) {
  const notificationClass = victory
    ? 'notification is-success'
    : 'notification is-warning';
  const text = victory ? 'You Win!' : 'You Came in Second!';
  return (
    <div className="modal is-active">
      <div className="modal-background" />
      <div className="modal-content">
        <div className={notificationClass}>
          <h3 className="title">End of Match</h3>
          <p className="subtitle">{text}</p>
          <button className="button is-info" onClick={restart}>
            New Game
          </button>
        </div>
      </div>
    </div>
  );
}

export default GameOver;
