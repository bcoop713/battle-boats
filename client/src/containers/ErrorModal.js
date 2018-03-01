import { connect } from 'react-redux';
import actions from '../actions.js';
import ErrorModalComp from '../components/ErrorModal';

const mapStateToProps = ({ errors }) => {
  return { errors };
};

const mapDispatchToProps = dispatch => {
  return {
    close: () => {
      dispatch(actions.CloseError());
    }
  };
};

const ErrorModal = connect(mapStateToProps, mapDispatchToProps)(ErrorModalComp);

export default ErrorModal;
