import React, { Component } from "react";
import { ipcRenderer } from "electron";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { grey, yellow, black } from "@material-ui/core/colors";
import Routes from "./Routes";
import StatusBar from './components/StatusBar';

const yellow_theme = createMuiTheme({
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
            "Lato",
            "sans-serif"
        ].join(",")
    },
    overrides: {
        MuiDialog: {
            paper: {
                backgroundColor: '#DDDDDD',
                border: '#FFEB3B 2px solid'
            }
        }
    }
});

const dark_theme = createMuiTheme({
    type: 'dark',
    palette: {
        secondary: {
            main: '#ffffff'
        },
        primary: {
            main: '#000000'
        }
    },
    typography: {
        useNextVariants: true,
        // Use the system font instead of the default Roboto font.
        fontFamily: [
            "Lato",
            "sans-serif"
        ].join(",")
    }
});


export default class App extends Component {
    constructor(props) {
        super(props);

        ipcRenderer.on('Grinbox::Status', (event, status, message) => {
            if (status == "SUCCESS") {
                console.log("SUCCESS: " + message); // TODO: Snackbar
            } else if (status == "ERROR") {
                console.log("ERROR: " + message); // TODO: Snackbar
            }
        });

        this.state = {
            isDarkMode: false,
        };
    }

    getBackgroundColor() {
        if (this.state.isDarkMode) {
            return '#333333';
        } else {
            return '#DDDDDD';
        }
    }

    getTheme() {
        if (this.state.isDarkMode) {
            return (dark_theme);
        } else {
            return (yellow_theme);
        }
    }

    render() {
        return (
            <React.Fragment>
                <style>{'body { background-color: ' + this.getBackgroundColor() + '; }'}</style>
                <MuiThemeProvider theme={this.getTheme()}>
                    <Routes {...this.state} />
                    <StatusBar {...this.state} />
                </MuiThemeProvider>
            </React.Fragment>
        );
    }
}
