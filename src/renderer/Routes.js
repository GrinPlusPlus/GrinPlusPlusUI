import React from 'react'
import { Route, HashRouter as Router, Switch, Redirect } from 'react-router-dom'
import PropTypes from "prop-types";
import ScrollToTop from './util/ScrollTop'
import Login from './containers/Login';
import Register from './containers/Register';
import Restore from './containers/Restore';
import Main from './containers/Main';
import Transactions from './containers/Transactions';
import Wallet from './containers/Wallet';


function Routes(properties) {
  return (
      <Router>
      <ScrollToTop>
        <Switch>
            <Route exact path='/' component={ Main } />
            <Route exact path='/login' component={ Login } />
            <Route exact path='/register' component={ Register } />
            <Route exact path='/restore' component={ Restore } />
            <Route exact path='/home' component={ Wallet } />
            <Route exact path='/transactions' component={ Transactions } />
            <Route exact path='/wallet' component={ Wallet } />
        </Switch>
      </ScrollToTop>
    </Router>
  );
}

Routes.propTypes = {
    user: PropTypes.object,
}

export default(Routes);
