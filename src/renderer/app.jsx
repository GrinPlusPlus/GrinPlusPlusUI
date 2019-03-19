import React, {Component} from 'react';
import PropTypes from "prop-types";
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { grey, yellow } from '@material-ui/core/colors';
import Routes from './Routes';

const theme = createMuiTheme({
  palette: {
    secondary: {
      main: grey[900]
    },
    primary: {
      main: yellow[500]
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
    return (
      <React.Fragment>
        <MuiThemeProvider theme={theme}>
          <Routes />
        </MuiThemeProvider>
      </React.Fragment>
    );
  }
}
