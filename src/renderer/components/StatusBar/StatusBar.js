import React from "react";
import PropTypes from "prop-types";
import { ipcRenderer } from 'electron';
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import StatusIcon from "@material-ui/icons/Lens";
import { red, orange } from "@material-ui/core/colors";
import {
    MuiThemeProvider, createMuiTheme, Typography, Grid, IconButton
} from "@material-ui/core";

const styles = theme => ({
    root: {
        flexGrow: 1
    },
    appBar: {
        top: 'auto',
        height: 30,
        bottom: 0,
    },
    Grid: {
        marginTop: '-26px',
        height: '28px'
    },
    status: {
        marginLeft: '-15px',
        marginTop: '-14px',
    },
    statusText: {
        paddingLeft: '4px',
    },
    connections: {
        paddingLeft: '8px'
    },
    chainHeight: {
        paddingLeft: '12px'
    }
});

class StatusBar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            status: "",
            inbound: 0,
            outbound: 0,
            headerHeight: 0,
            blockHeight: 0,
            networkHeight: 0,
            downloaded: 0,
            totalSize: 0,
            processed: 0
        };
        this.updateStatus = this.updateStatus.bind(this);
    }

    updateStatus(event, status, inbound, outbound, headerHeight, blockHeight, networkHeight, downloaded, totalSize, processed) {
        global.FULLY_SYNCED = (status == 'FULLY_SYNCED');
        global.BLOCK_HEIGHT = blockHeight;

        this.setState({
            status: status,
            inbound: inbound,
            outbound: outbound,
            headerHeight: headerHeight,
            blockHeight: blockHeight,
            networkHeight: networkHeight,
            downloaded: downloaded,
            totalSize: totalSize,
            processed: processed
        });
    }

    componentDidMount() {
        ipcRenderer.removeAllListeners("NODE_STATUS");
        ipcRenderer.on("NODE_STATUS", this.updateStatus);
    }

    render() {
        const { classes, dark_mode } = this.props;

        const statusTheme = createMuiTheme({
            palette: {
                primary: {
                    main: '#069076',
                },
                secondary: orange,
                error: red,
            },
            typography: {
                useNextVariants: true,
            }
        });

        const darkStatusTheme = createMuiTheme({
            palette: {
                primary: {
                    main: '#069076',
                },
                secondary: orange,
                error: red,
                text: {
                    primary: '#ffffff',
                    secondary: '#ffffff'
                }
            },
            typography: {
                useNextVariants: true,
            }
        });

        function getColor(status) {
            if (status.startsWith("SYNCING") || status.endsWith("TXHASHSET")) {
                return "secondary";
            } else if (status == "FULLY_SYNCED") {
                return "primary";
            }

            return "error";
        }

        function getPercentage(numerator, denominator) {
            if (denominator <= 0) {
                return 0;
            } else {
                return Math.round(100 * (numerator / denominator));
            }
        }

        function getStatusText(state) {
            const status = state.status;

            if (status == "FULLY_SYNCED") {
                return "Running";
            } else if (status == "SYNCING_HEADERS") {
                return "Syncing Headers (" + getPercentage(state.headerHeight, state.networkHeight) + "%)";
            } else if (status == "SYNCING_BLOCKS") {
                return "Syncing Blocks (" + getPercentage(state.blockHeight, state.headerHeight) + "%)";
            } else if (status == "DOWNLOADING_TXHASHSET") {
                return "Downloading State (" + getPercentage(state.downloaded, state.totalSize) + "%)";
            } else if (status == "PROCESSING_TXHASHSET") {
                return "Validating State (" + state.processed + "%)";
            } else {
                return "Not Connected";
            }
        }

        return (
            <div className={classes.root}>
                <AppBar position="fixed" color="primary" className={classes.appBar}>
                    <Toolbar>
                        <MuiThemeProvider theme={dark_mode ? darkStatusTheme : statusTheme}>
                            <Grid container spacing={0} className={classes.Grid}>
                                <Grid item xs={3}>
                                    <IconButton disabled className={classes.status}>
                                        <StatusIcon color={getColor(this.state.status)} />
                                        <Typography display='inline' noWrap color="textPrimary" className={classes.statusText}><b>Status: </b></Typography>
                                        <Typography display='inline' noWrap color={getColor(this.state.status)} className={classes.statusText}><b>{getStatusText(this.state)}</b></Typography>
                                    </IconButton>
                                </Grid>
                                <Grid item xs={6}>
                                    <center>
                                        <Typography display='inline' noWrap className={classes.chainHeight}><b>Headers: {this.state.headerHeight}</b></Typography>
                                        <Typography display='inline' noWrap className={classes.chainHeight}><b>Blocks: {this.state.blockHeight}</b></Typography>
                                        <Typography display='inline' noWrap className={classes.chainHeight}><b>Network: {this.state.networkHeight}</b></Typography>
                                    </center>
                                </Grid>
                                <Grid item xs={3}>
                                    <div style={{ textAlign: 'right' }}>
                                        <Typography display='inline' noWrap className={classes.connections}><b>Inbound: {this.state.inbound}</b></Typography>
                                        <Typography display='inline' noWrap className={classes.connections}><b>Outbound: {this.state.outbound}</b></Typography>
                                    </div>
                                </Grid>
                            </Grid>
                        </MuiThemeProvider>
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}

StatusBar.propTypes = {
    classes: PropTypes.object.isRequired,
    dark_mode: PropTypes.bool,
};

export default withStyles(styles)(StatusBar);
