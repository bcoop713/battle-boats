import React from "react";
import MyBoard from "../containers/MyBoard.js";

function PlayField() {
  return (
    <div className="container">
      <div id="board-container" className="columns">
        <div className="column">
          <MyBoard />
        </div>
      </div>
    </div>
  );
}

export default PlayField;
