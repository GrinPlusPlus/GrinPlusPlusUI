import React, { Component } from "react";
import { ipcRenderer } from "electron";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { grey, yellow, black } from "@material-ui/core/colors";
import Routes from "./Routes";
import StatusBar from './components/StatusBar';
import Snackbar from '@material-ui/core/Snackbar';
import CustomSnackbarContent from "./components/CustomSnackbarContent";
import log from 'electron-log';
const unhandled = require('electron-unhandled');

unhandled({
    logger: log.error,
    showDialog: false
});

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
    palette: {
        secondary: {
            main: '#ffffff',
            contrastText: '#ffffff',
        },
        primary: {
            main: '#000000',
            dark: '#111111',
            contrastText: '#ffffff',
        },
        text: {
            primary: '#ffffff',
            secondary: '#aaaaaa',
        }
    },
    typography: {
        useNextVariants: true,
        // Use the system font instead of the default Roboto font.
        fontFamily: [
            "Lato",
            "sans-serif"
        ].join(","),
        color: '#ffffff',
        initial: {
            color: '#ffffff'
        }
    },
    Input: {
        color: '#000000'
    },
    overrides: {
        MuiDialog: {
            paper: {
                backgroundColor: '#444444',
                border: '#FFEB3B 2px solid'
            }
        },
        MuiInput: {
            root: {
                color: '#000000'
            }
        },
        MuiTypography: {
            root: {
                color: '#ffffff'
            }
        },
        MuiMenu: {
            paper: {
                backgroundColor: '#000000',
                border: '#333333 2px solid'
            }
        },
        MuiListItem: {
            button: {
                '&:hover': {
                    color: '#ffffff',
                    backgroundColor: '#555555'
                }
            }
        }
    }
});


export default class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isDarkMode: true,
            snackbarMessage: "",
            snackbarStatus: "success",
        };

        ipcRenderer.on('Grinbox::Status', (event, status, message) => {
            if (status == "SUCCESS") {
                this.setState({
                    snackbarStatus: "success",
                    snackbarMessage: message
                });
            } else if (status == "ERROR") {
                this.setState({
                    snackbarStatus: "error",
                    snackbarMessage: message
                });
            }
        });

        ipcRenderer.on('Snackbar::Status', (event, status, message) => {
            if (status == "SUCCESS") {
                this.setState({
                    snackbarStatus: "success",
                    snackbarMessage: message
                });
            } else if (status == "ERROR") {
                this.setState({
                    snackbarStatus: "error",
                    snackbarMessage: message
                });
            }
        })

        this.handleSnackbarClose = this.handleSnackbarClose.bind(this);
    }

    getBackgroundColor() {
        if (this.state.isDarkMode) {
            return '#444444';
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

    handleSnackbarClose(event) {
        this.setState({
            snackbarStatus: "success",
            snackbarMessage: "",
        });
    }

    render() {
        return (
            <React.Fragment>
                <style>{'body { background-color: ' + this.getBackgroundColor() + '; }'}</style>
                <MuiThemeProvider theme={this.getTheme()}>
                    <Routes {...this.state} style={{ width: '100%' }} />
                    <Snackbar
                        autoHideDuration={4000}
                        open={this.state.snackbarMessage.length > 0}
                        onClose={this.handleSnackbarClose}
                    >
                        <CustomSnackbarContent
                            onClose={this.handleSnackbarClose}
                            variant={this.state.snackbarStatus}
                            message={this.state.snackbarMessage}
                        />
                    </Snackbar>
                    <StatusBar {...this.state} dark_mode={this.state.isDarkMode} />
                </MuiThemeProvider>
            </React.Fragment>
        );
    }
}
