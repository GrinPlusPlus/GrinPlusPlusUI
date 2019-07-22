import React from "react";
import PropTypes from "prop-types";
import SettingsIcon from "@material-ui/icons/Settings";
import {
    FormControlLabel, Switch, Checkbox, Button,
    Dialog, DialogActions, DialogContent, IconButton,
    Paper, Typography, Grid
} from '@material-ui/core';
import { withStyles } from "@material-ui/core/styles";
import { ipcRenderer } from 'electron';
import electron from 'electron';
import GrinDialog from '../GrinDialog';

const styles = theme => ({
    paper: {
        position: "absolute",
        width: theme.spacing.unit * 50,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing.unit * 4,
        outline: "none"
    },
    fab: {
        margin: theme.spacing.unit
    },
    extendedIcon: {
        marginRight: theme.spacing.unit
    }
});

function SettingsModal(props) {
    const { classes } = props;
    const [open, setOpen] = React.useState(false);
    const [loaded, setLoaded] = React.useState(false);
    const [enhanced, setEnhanced] = React.useState(false);
    const [savedSettings, setSavedSettings] = React.useState(null);
    const [settings, setSettings] = React.useState(null);

    function handleClickOpen() {
        setOpen(true);

        if (!loaded) {
            const loadedSettings = ipcRenderer.sendSync('Settings::Get');
            setSavedSettings(JSON.parse(JSON.stringify(loadedSettings)));
            setSettings(JSON.parse(JSON.stringify(loadedSettings)));
            setLoaded(true);
            setEnhanced(isEnhancedDB(loadedSettings));
        } else {
            setEnhanced(isEnhancedDB(savedSettings));
        }
    }

    function handleClose() {
        setSettings(JSON.parse(JSON.stringify(savedSettings)));
        setOpen(false);
    }

    function handleSave() {
        if (JSON.stringify(settings) != JSON.stringify(savedSettings)) {
            electron.remote.dialog.showMessageBox({
                title: "Restart required",
                message: "Settings will be applied the next time you run Grin++."
            });

            ipcRenderer.send('Settings::Save', settings);
            setSavedSettings(JSON.parse(JSON.stringify(settings)));
        }

        setOpen(false);
    }

    function scanForOutputs() {
        ipcRenderer.send("UpdateWallet", true);
    }

    function resyncBlockchain() {
        ipcRenderer.send("ResyncBlockchain");
    }

    function isEnhancedDB(newSettings) {
        console.log(newSettings);
        if (newSettings == null || newSettings.WALLET == null || newSettings.WALLET.DATABASE == null) {
            return false;
        }

        return newSettings.WALLET.DATABASE == "SQLITE";
    }

    function handleChangeEnhanced(event) {
        var database = (event.target.checked ? 'SQLITE' : 'ROCKSDB');

        var newSettings = settings;
        if (newSettings == null) {
            return;
        }

        if (newSettings.WALLET == null) {
            newSettings.WALLET = { DATABASE: database };
        } else {
            newSettings.WALLET.DATABASE = database;
        }
        setSettings(newSettings);
        setEnhanced(isEnhancedDB(newSettings));
    };

    return (
        <React.Fragment>
            <IconButton
                variant="round"
                aria-label="Settings"
                onClick={handleClickOpen}
            >
                <SettingsIcon color="secondary" />
            </IconButton>
            <GrinDialog
                open={open}
                onClose={handleClose}
                title="Settings"
                maxWidth="sm"
                fullWidth
            >
                <DialogContent>
                    <center>
                        <Grid container justify='center' spacing={2}>
                            <Grid item xs={6}>
                                <Paper style={{ height: '100%', backgroundColor: 'rgba(150, 150, 150, .4)' }}>
                                    <center>
                                        <Typography variant='h6'>
                                            Wallet
                                        </Typography>
                                    </center>
                                    <br />

                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={enhanced}
                                                onChange={handleChangeEnhanced}
                                                value="enhanced"
                                                color='secondary'
                                                disabled={true}
                                            />
                                        }
                                        label="Use Enhanced Database"
                                    />
                                </Paper>
                            </Grid>
                            <Grid item xs={6}>
                                <Paper style={{ height: '100%', backgroundColor: 'rgba(150, 150, 150, .4)' }}>
                                    <center>
                                        <Typography variant='h6'>
                                            Other
                                        </Typography>
                                    </center>
                                    <br />

                                    <Button onClick={scanForOutputs} variant="contained" color="secondary">
                                        Scan for outputs
                                    </Button>
                                    <br /> <br />

                                    <Button onClick={resyncBlockchain} variant="contained" color="secondary">
                                        Resync Blockchain
                                    </Button>
                                    <br /><br />
                                </Paper>
                            </Grid>
                        </Grid>
                    </center>
                </DialogContent>
                <center>
                    <Button onClick={handleClose} variant="contained" style={{ margin: '6px' }} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSave} variant="contained" style={{ margin: '6px' }} color="primary">
                        Save
                    </Button>
                </center>
            </GrinDialog>
        </React.Fragment>
    );
}

SettingsModal.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SettingsModal);
