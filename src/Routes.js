import React from 'react'
import { Route, HashRouter as Router, Switch, Redirect } from 'react-router-dom'
import PropTypes from "prop-types";
import ScrollToTop from './util/ScrollTop'
import Login from './containers/Login';
import Main from './containers/Main';
import Transactions from './containers/Transactions';
import Wallet from './containers/Wallet';

export default (props) => (
    <Router>
    <ScrollToTop>
      <Switch>
          <Route exact path='/' component={ Main } />
          <Route exact path='/login' component={ Login } />
          <Route exact path='/Transactions' component={ Transactions } />
          <Route exact path='/wallet' component={ Wallet } />
          {/* <Route path="/"
          render={props => 
              user ? (
                  <React.Fragment>
                    <Route exact path='/' component={ Main } />
                    
                  </React.Fragment>
              ) : (
                  <Redirect to="login" />
              )
          } /> */}
      </Switch>
    </ScrollToTop>
  </Router>
  )

// Routes.PropTypes = {
//     user: PropTypes.object,
// }

// export default Routes;