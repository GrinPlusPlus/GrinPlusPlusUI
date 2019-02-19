import React, {Component} from 'react';
import PropTypes from "prop-types";
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { blue, indigo } from '@material-ui/core/colors';
import Routes from './Routes';

const theme = createMuiTheme({
  palette: {
    secondary: {
      main: blue[900]
    },
    primary: {
      main: indigo[700]
    }
  },
  typography: {
    useNextVariants: true,
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      '"Lato"',
      'sans-serif'
    ].join(',')
  }
});


export default class App extends Component {
  render() {
    const user = null;
    console.log(user);
    return (
      <React.Fragment>
        <MuiThemeProvider theme={theme}>
          <Routes />
        </MuiThemeProvider>
      </React.Fragment>
    ); 
  }
}

App.propTypes = {
  user: PropTypes.object,
}
