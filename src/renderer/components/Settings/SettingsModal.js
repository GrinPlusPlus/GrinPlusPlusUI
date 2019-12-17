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
        width: theme.spacing(50),
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing(4),
        outline: "none"
    },
    fab: {
        margin: theme.spacing(1)
    },
    extendedIcon: {
        marginRight: theme.spacing(1)
    }
});

function SettingsModal(props) {
    const { classes } = props;
    const [open, setOpen] = React.useState(false);
    const [loaded, setLoaded] = React.useState(false);
    const [grinboxEnabled, setGrinboxEnabled] = React.useState(false);
    const [torEnabled, setTorEnabled] = React.useState(true);
    const [savedSettings, setSavedSettings] = React.useState(null);
    const [settings, setSettings] = React.useState(null);

    function handleClickOpen() {
        setOpen(true);

        if (!loaded) {
            const loadedSettings = ipcRenderer.sendSync('Settings::Get');
            setSavedSettings(JSON.parse(JSON.stringify(loadedSettings)));
            setSettings(JSON.parse(JSON.stringify(loadedSettings)));
            setGrinboxEnabled(isGrinboxEnabled(JSON.parse(JSON.stringify(loadedSettings))));
            setTorEnabled(isTorEnabled(JSON.parse(JSON.stringify(loadedSettings))));
            setLoaded(true);
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

    function isGrinboxEnabled(newSettings) {
        console.log(JSON.stringify(newSettings));
        if (newSettings == null || newSettings.WALLET == null) {
            return false;
        }

        return newSettings.WALLET.ENABLE_GRINBOX == true;
    }

    function isTorEnabled(newSettings) {
        console.log(JSON.stringify(newSettings));
        if (newSettings == null || newSettings.TOR == null) {
            return true;
        }

        return newSettings.TOR.ENABLE_TOR !== false;
    }

    function handleChangeEnableTOR(event) {
        var newSettings = settings;
        if (newSettings == null) {
            return;
        }

        if (newSettings.TOR == null) {
            newSettings.TOR = { ENABLE_TOR: event.target.checked };
        } else {
            newSettings.TOR.ENABLE_TOR = event.target.checked;
        }
        setSettings(newSettings);
        setTorEnabled(event.target.checked);
    };

    function handleChangeEnableGrinbox(event) {
        var newSettings = settings;
        if (newSettings == null) {
            return;
        }

        if (newSettings.WALLET == null) {
            newSettings.WALLET = { ENABLE_GRINBOX: event.target.checked };
        } else {
            newSettings.WALLET.ENABLE_GRINBOX = event.target.checked;
        }
        setSettings(newSettings);
        setGrinboxEnabled(event.target.checked);
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
                                                checked={torEnabled}
                                                onChange={handleChangeEnableTOR}
                                                value="tor"
                                                color='secondary'
                                            />
                                        }
                                        label="Enable TOR"
                                    />

                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={grinboxEnabled}
                                                onChange={handleChangeEnableGrinbox}
                                                value="grinbox"
                                                color='secondary'
                                            />
                                        }
                                        label="Enable Grinbox"
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
