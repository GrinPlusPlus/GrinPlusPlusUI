import React from "react";
import PropTypes from "prop-types";
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
    }
});

function StatusBar(props) {
    const { classes, status, inbound, outbound } = props;

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

    function getColor() {
        if (status.startsWith("SYNCING")) {
            return "secondary";
        } else if (status == "FULLY_SYNCED") {
            return "primary";
        }

        return "error";
    }

    function getStatusText() {
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
                            <Grid item xs={8}>
                                <IconButton disabled className={classes.status}>
                                    <StatusIcon color={getColor()} />
                                    <Typography inline className={classes.statusText}><b>STATUS: </b></Typography>
                                    <Typography inline color={getColor()} className={classes.statusText}><b>{getStatusText()}</b></Typography>
                                </IconButton>
                            </Grid>
                            <Grid item xs={4}>
                                <div style={{ textAlign: 'right' }}>
                                    <Typography inline className={classes.connections}><b>Inbound: {inbound}</b></Typography>
                                    <Typography inline className={classes.connections}><b>Outbound: {outbound}</b></Typography>
                                </div>
                            </Grid>
                        </Grid>
                    </MuiThemeProvider>
                </Toolbar>
            </AppBar>
        </div>
    );
}

StatusBar.propTypes = {
    classes: PropTypes.object.isRequired,
    status: PropTypes.string.isRequired,
    inbound: PropTypes.number.isRequired,
    outbound: PropTypes.number.isRequired,
};

export default withStyles(styles)(StatusBar);
