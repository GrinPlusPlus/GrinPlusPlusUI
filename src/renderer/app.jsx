import React, { Component } from "react";
import PropTypes from "prop-types";
import { ipcRenderer } from "electron";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { grey, yellow, black } from "@material-ui/core/colors";
import Routes from "./Routes";
import StatusBar from './containers/StatusBar';

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

        this.state = {
            isDarkMode: false,
            status: "",
            inbound: 0,
            outbound: 0,
            blockHeight: 0,
            networkHeight: 0,
        };
        this.updateStatus = this.updateStatus.bind(this);
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

    updateStatus(event, status, inbound, outbound, blockHeight, networkHeight) {
        this.setState({
            status: status,
            inbound: inbound,
            outbound: outbound,
            blockHeight: blockHeight,
            networkHeight: networkHeight
        });
    }

    componentDidMount() {
        ipcRenderer.removeAllListeners("NODE_STATUS");
        ipcRenderer.on("NODE_STATUS", this.updateStatus);
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
