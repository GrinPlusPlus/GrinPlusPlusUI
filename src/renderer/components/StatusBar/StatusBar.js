import React from "react";
import PropTypes from "prop-types";
import { ipcRenderer } from 'electron';
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import StatusIcon from "@material-ui/icons/lens";
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
        marginTop: '-14px'
    },
    statusText: {
        paddingLeft: '4px'
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
        };
        this.updateStatus = this.updateStatus.bind(this);
    }

    updateStatus(event, status, inbound, outbound, headerHeight, blockHeight, networkHeight) {
        this.setState({
            status: status,
            inbound: inbound,
            outbound: outbound,
            headerHeight: headerHeight,
            blockHeight: blockHeight,
            networkHeight: networkHeight
        });
    }

    componentDidMount() {
        ipcRenderer.removeAllListeners("NODE_STATUS");
        ipcRenderer.on("NODE_STATUS", this.updateStatus);
    }

    render() {
        const { classes } = this.props;

        const statusTheme = createMuiTheme({
            palette: {
                primary: {
                    main: '#069076',
                },
                secondary: orange,
                error: red
            },
            typography: {
                useNextVariants: true,
            }
        });

        function getColor(status) {
            if (status.startsWith("SYNCING")) {
                return "secondary";
            } else if (status == "FULLY_SYNCED") {
                return "primary";
            }

            return "error";
        }

        function getStatusText(status) {
            if (status == "FULLY_SYNCED") {
                return "Running";
            } else if (status == "SYNCING_HEADERS") {
                return "Syncing Headers";
            } else if (status == "SYNCING_BLOCKS") {
                return "Syncing Blocks";
            } else if (status.startsWith("SYNCING")) {
                return "Syncing State";
            } else {
                return "Not Connected";
            }
        }

        return (
            <div className={classes.root}>
                <AppBar position="fixed" color="primary" className={classes.appBar}>
                    <Toolbar>
                        <MuiThemeProvider theme={statusTheme}>
                            <Grid container spacing={0} className={classes.Grid}>
                                <Grid item xs={4}>
                                    <IconButton disabled className={classes.status}>
                                        <StatusIcon color={getColor(this.state.status)} />
                                        <Typography inline className={classes.statusText}><b>STATUS: </b></Typography>
                                        <Typography inline color={getColor(this.state.status)} className={classes.statusText}><b>{getStatusText(this.state.status)}</b></Typography>
                                    </IconButton>
                                </Grid>
                                <Grid item xs={4}>
                                    <center>
                                        <Typography inline className={classes.chainHeight}><b>Headers: {this.state.headerHeight}</b></Typography>
                                        <Typography inline className={classes.chainHeight}><b>Blocks: {this.state.blockHeight}</b></Typography>
                                        <Typography inline className={classes.chainHeight}><b>Network: {this.state.networkHeight}</b></Typography>
                                    </center>
                                </Grid>
                                <Grid item xs={4}>
                                    <div style={{ textAlign: 'right' }}>
                                        <Typography inline className={classes.connections}><b>Inbound: {this.state.inbound}</b></Typography>
                                        <Typography inline className={classes.connections}><b>Outbound: {this.state.outbound}</b></Typography>
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
};

export default withStyles(styles)(StatusBar);
