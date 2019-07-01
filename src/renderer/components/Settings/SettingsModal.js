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

    function handleClickOpen() {
        setOpen(true);
    }

    function handleClose() {
        setOpen(false);
    }

    function scanForOutputs() {
        ipcRenderer.send("UpdateWallet", true);
    }

    function resyncBlockchain() {
        ipcRenderer.send("ResyncBlockchain");
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
            <GrinDialog
                open={open}
                onClose={handleClose}
                title="Settings"
                maxWidth="xs"
                fullWidth
            >
                <DialogContent>
                    <center>
                        <Button onClick={scanForOutputs} variant="contained" color="secondary">
                            Scan for outputs
                        </Button>
                        <br /> <br />

                        <Button onClick={resyncBlockchain} variant="contained" color="secondary">
                            Resync Blockchain
                        </Button>
                    </center>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} variant="contained" color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleClose} variant="contained" color="primary">
                        OK
                    </Button>
                </DialogActions>
            </GrinDialog>
        </React.Fragment>
    );
}

SettingsModal.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SettingsModal);
