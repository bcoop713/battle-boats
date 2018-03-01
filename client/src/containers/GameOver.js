import { connect } from 'react-redux';
import actions from '../actions.js';
import Maybe from 'folktale/maybe';
import GameOverComp from '../components/GameOver.js';

const mapStateToProps = ({ sentHits, receivedHits }) => {
  const victory = () => {
    if (sentHits.length >= 15) {
      return Maybe.Just(true);
    } else if (receivedHits.length >= 15) {
      return Maybe.Just(false);
    } else {
      return Maybe.Nothing();
    }
  };
  return { victory: victory() };
};

const mapDispatchToProps = dispatch => {
  return {
    restart: () => {
      dispatch(actions.SendRestart());
    }
  };
};

const GameOver = connect(mapStateToProps, mapDispatchToProps)(GameOverComp);

export default GameOver;
