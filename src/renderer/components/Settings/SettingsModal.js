import React from "react";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import SettingsIcon from "@material-ui/icons/Settings";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { withStyles } from "@material-ui/core/styles";
import { ipcRenderer } from 'electron';

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

    function handleClickOpen() {
        setOpen(true);
    }

    function handleClose() {
        setOpen(false);
    }

    function rescan() {
        ipcRenderer.send("UpdateWallet", true);
    }

    return (
        <React.Fragment>
            <IconButton
                variant="round"
                aria-label="Settings"
                onClick={handleClickOpen}
            >
                <SettingsIcon color="secondary" />
            </IconButton>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">Settings</DialogTitle>
                <DialogContent>

                    {/*<FormControlLabel
                        control={
                            <Switch
                                disabled
                                checked={false}
                                value="mainnet"
                                color="primary"
                            />
                        }
                        label="Mainnet"
                    />*/}

                    <Button onClick={rescan} variant="contained" color="secondary">
                        Rescan Blockchain
                    </Button>

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} variant="contained" color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleClose} variant="contained" color="primary">
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}

SettingsModal.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SettingsModal);
