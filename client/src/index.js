import React from 'react';
import ReactDOM from 'react-dom';

function Board(props) {
  return <div className="board">Board</div>;
}

ReactDOM.render(
  <div id="root">
    <Board />
    <Board />
  </div>,
  document.getElementById('app')
);
