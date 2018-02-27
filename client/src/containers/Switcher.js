import { connect } from 'react-redux';
import SwitcherComp from '../components/Switcher.js';

const mapStateToProps = state => {
  return { loading: state.loading };
};

const Switcher = connect(mapStateToProps)(SwitcherComp);

export default Switcher;
