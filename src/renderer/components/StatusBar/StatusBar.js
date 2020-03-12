import React from "react";
import PropTypes from "prop-types";
import { ipcRenderer } from 'electron';
import { withStyles } from "@material-ui/core/styles";
import StatusIcon from "@material-ui/icons/Lens";
import OutgoingIcon from "@material-ui/icons/ArrowUpward";
import IncomingIcon from "@material-ui/icons/ArrowDownward";
import { red, yellow } from "@material-ui/core/colors";
import {
    AppBar, Avatar, MuiThemeProvider, createMuiTheme, Toolbar, Typography, Grid, IconButton
} from "@material-ui/core";
const path = require('path');

const styles = theme => ({
    root: {
        flexGrow: 1
    },
    appBar: {
        top: 'auto',
        height: 30,
        bottom: 0,
        padding: '3px 10px'
    },
    Grid: {
        height: '24px'
    },
    statusText: {
        display: 'inline-block',
        paddingLeft: '4px'
    },
    connections: {
        display: 'inline-block',
        paddingLeft: '8px',
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
        this.getCenterText = this.getCenterText.bind(this);
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

    getCenterText() {
        return "H: " + this.state.headerHeight + " B: " + this.state.blockHeight + " N: " + this.state.networkHeight;
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
                secondary: yellow,
                error: red,
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
                const result = Math.round(100 * (numerator / denominator));
                return result < 100 ? result : 99;
            }
        }

        function getBlockPercentage(blockHeight, headerHeight) {
            if (headerHeight < 2880 || blockHeight < 2880) {
                return getPercentage(blockHeight, headerHeight);
            }

            if (headerHeight - blockHeight > 2880) {
                return 0;
            }

            var remaining = getPercentage(headerHeight - blockHeight, 2880);
            if (remaining <= 0) {
                remaining = 1;
            }

            return 100 - remaining;
        }

        function getStatusText(state) {
            const status = state.status;

            if (status == "FULLY_SYNCED") {
                return "Running";
            } else if (status == "SYNCING_HEADERS") {
                return "1/4 Syncing Headers (" + getPercentage(state.headerHeight, state.networkHeight) + "%)";
            } else if (status == "SYNCING_BLOCKS") {
                return "4/4 Syncing Blocks (" + getBlockPercentage(state.blockHeight, state.headerHeight) + "%)";
            } else if (status == "DOWNLOADING_TXHASHSET") {
                return "2/4 Downloading State (" + getPercentage(state.downloaded, state.totalSize) + "%)";
            } else if (status == "PROCESSING_TXHASHSET") {
                return "3/4 Validating State (" + state.processed + "%)";
            } else {
                return "Not Connected";
            }
        }

        return (
            <AppBar position="fixed" color="primary" className={classes.appBar}>
                <MuiThemeProvider theme={statusTheme}>
                    <Grid container spacing={0} className={classes.Grid}>
                        <Grid item xs={4} style={{ height: '24px', margin: '0px' }}>
                            <StatusIcon color={getColor(this.state.status)} />
                            <Typography noWrap style={{color: 'white'}} className={classes.statusText}><b>Status: </b></Typography>
                            <Typography noWrap color={getColor(this.state.status)} display='inline' className={classes.statusText}><b>{getStatusText(this.state)}</b></Typography>
                        </Grid>
                        <Grid item xs={4} style={{ height: '24px', textAlign: 'center' }}>
                            <Typography display='inline' noWrap className={classes.chainHeight}>
                                <b>{ this.getCenterText() }</b>
                            </Typography>
                        </Grid>
                        <Grid item xs={4} style={{ height: '24px', textAlign: 'right', verticalAlign: 'middle' }}>
                            <Typography noWrap className={classes.connections}><b>{this.state.outbound} </b></Typography><OutgoingIcon color='primary' style={{ display: 'inline-block' }} />
                            <Typography noWrap className={classes.connections}><b>{this.state.inbound} </b></Typography><IncomingIcon color='error' style={{ display: 'inline-block' }} />
                            <img src={path.join(__dirname, './static/img/canary.png')} className={classes.connections} style={{ width: '24px', height: '24px' }} />
                        </Grid>
                    </Grid>
                    </MuiThemeProvider>
            </AppBar>
        );
    }
}

StatusBar.propTypes = {
    classes: PropTypes.object.isRequired,
    dark_mode: PropTypes.bool,
};

export default withStyles(styles)(StatusBar);
