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
import Outputs from './containers/Outputs';
import Advanced from './containers/Advanced';
import SideMenu from './components/SideMenu';

const PropsRoute = ({ component: Component, ...props }) => (
    <Route
        {...props}
        render={renderProps => (
            <React.Fragment>
                <SideMenu {...props} />
                <div style={{ maxHeight: 'calc(100vh - 103px)', height: 'calc(100vh - 103px)', backgroundImage: `url(./static/img/bkg.png)` }}>
                    <Component {...renderProps} {...props} />
                </div>
            </React.Fragment>
        )}
    />
);

function Routes(props) {
    const isDarkMode = props.isDarkMode;

    return (
        <Router>
            <ScrollToTop>
                <Switch>
                    <PropsRoute exact path='/' open={true} noMenu component={Main} />
                    <PropsRoute exact path='/login' noMenu includeBack component={ Login } />
                    <PropsRoute exact path='/register' noMenu includeBack component={ Register } />
                    <PropsRoute exact path='/restore' noMenu includeBack component={ Restore } />
                    <PropsRoute exact path='/wallet' pageName='Wallet' component={Wallet} />
                    <PropsRoute exact path='/peers' pageName='Peers' component={Peers} />
                    <PropsRoute exact path='/outputs' pageName='Outputs' component={Outputs} />
                    <PropsRoute exact path='/advanced' pageName='Advanced' component={Advanced} />
                </Switch>
            </ScrollToTop>
        </Router>
    );
}

Routes.propTypes = {
    dark_mode: PropTypes.bool,
}

export default(Routes);
