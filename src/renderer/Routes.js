import React from 'react'
import { Route, HashRouter as Router, Switch, Redirect } from 'react-router-dom'
import PropTypes from "prop-types";
import ScrollToTop from './util/ScrollTop'
import Login from './containers/Login';
import Register from './containers/Register';
import Restore from './containers/Restore';
import Main from './containers/Main';
import Wallet from './containers/Wallet';
import Peers from './containers/Peers';
import Advanced from './containers/Advanced';


function Routes(props) {
  const isDarkMode = props.isDarkMode;
  return (
    <Router>
      <ScrollToTop>
        <Switch>
            <Route exact path='/' render={(props) => <Main dark_mode={isDarkMode} />} />
            <Route exact path='/login' component={ Login } />
            <Route exact path='/register' component={ Register } />
            <Route exact path='/restore' component={ Restore } />
            <Route exact path='/wallet' component={Wallet} />
            <Route exact path='/peers' component={Peers} />
            <Route exact path='/advanced' component={Advanced} />
        </Switch>
      </ScrollToTop>
    </Router>
  );
}

Routes.propTypes = {
    dark_mode: PropTypes.bool,
}

export default(Routes);
