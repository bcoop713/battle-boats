import React from 'react';
import Styles from '../styles.scss';
import { addIndex, map, any, equals, flatten } from 'ramda';

function Cell(
  boatPlacementEnd,
  boatPlacementStart,
  sendAttack,
  hits,
  misses,
  x,
  y,
  boatCoords
) {
  const coord = { x, y };
  const containsShip = any(boat => {
    const match = equals(boat, coord);
    return match;
  }, flatten(boatCoords))
    ? Styles['has-ship']
    : '';
  const containsHit = any(hit => equals(hit, coord), hits)
    ? Styles['has-hit']
    : '';
  const containsMiss = any(miss => equals(miss, coord), misses)
    ? Styles['has-miss']
    : '';
  const styles = [Styles.cell, containsShip, containsHit, containsMiss].join(
    ' '
  );
  return (
    <div
      onMouseUp={() => boatPlacementEnd(coord)}
      onMouseDown={() => boatPlacementStart(coord)}
      onClick={() => sendAttack(coord)}
      key={x * 10 + y}
      className={styles}
    />
  );
}

function Row(row, index) {
  return (
    <div className={Styles.row} key={index}>
      {row}
    </div>
  );
}

function MyBoard({
  boatPlacementStart,
  boatPlacementEnd,
  sendAttack,
  hits,
  misses,
  boatCoords
}) {
  const xAxis = [1, 2, 3, 4, 5, 6, 7, 8];
  const yAxis = [1, 2, 3, 4, 5, 6, 7, 8];
  const matrix = map(
    y =>
      map(
        x =>
          Cell(
            boatPlacementEnd,
            boatPlacementStart,
            sendAttack,
            hits,
            misses,
            x,
            y,
            boatCoords
          ),
        xAxis
      ),
    yAxis
  );

  const grid = addIndex(map)(Row, matrix);
  const ordsToDivs = ord => <div key={ord}>{ord}</div>;
  const xAxisDisplay = map(ordsToDivs, [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H'
  ]);
  const yAxisDisplay = map(ordsToDivs, [
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8'
  ]);
  return (
    <div className={Styles['board-container']}>
      <div className={Styles['x-axis']}>{xAxisDisplay}</div>
      <div className={Styles['y-axis']}>{yAxisDisplay}</div>
      <div className={Styles.board}>{grid}</div>
    </div>
  );
}

export default MyBoard;
