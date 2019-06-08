import React from "react";
import PropTypes from "prop-types";
import ContactSupportIcon from "@material-ui/icons/ContactSupport";
import {
    Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton,
    FormControl, Input, InputLabel, TextField, Typography
} from '@material-ui/core';
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

function SupportModal(props) {
    const { classes } = props;
    const [open, setOpen] = React.useState(false);
    const [submitting, setSubmitting] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState('');
    const [successMessage, setSuccessMessage] = React.useState('');
    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [description, setDescription] = React.useState('');

    function closeWindow() {
        setOpen(false);
        setSubmitting(false);
        setErrorMessage('');
        setSuccessMessage('');
        setName('');
        setEmail('');
        setDescription('');
    }

    function submitRequest() {
        setSubmitting(true);

        ipcRenderer.removeAllListeners('Support::RequestSubmitted');
        ipcRenderer.on('Support::RequestSubmitted', (event, status) => {
            if (status.success == true) {
                setSuccessMessage("Issue submitted. Thanks for your feedback.");
                setTimeout(closeWindow, 1500);
            } else {
                setErrorMessage(status.errorMessage);
                setSubmitting(false);
            }
        });

        ipcRenderer.send('Support::SubmitRequest', name, email, description);
        setTimeout(function () {
            setErrorMessage("Failed to submit: Operation timed out.");
            setSubmitting(false);
        }, 1500);
    }

    function getMessageDisplay() {
        if (errorMessage.length > 0) {
            return (
                <Typography color="error">{errorMessage}</Typography>
            );
        } else if (successMessage.length > 0) {
            return (
                <Typography color="primary">{successMessage}</Typography>
            );
        }
    }

    return (
        <React.Fragment>
            <IconButton
                variant="round"
                aria-label="Support"
                onClick={() => { setOpen(true); }}
            >
                <ContactSupportIcon color="secondary" />
            </IconButton>
            <Dialog
                open={open}
                onClose={closeWindow}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">Report an Issue</DialogTitle>
                <DialogContent>
                    { getMessageDisplay() }
                    <FormControl
                        margin="dense"
                        fullWidth
                    >
                        <InputLabel htmlFor="name">Name</InputLabel>
                        <Input
                            name="name"
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => { setName(e.target.value) }}
                        />
                    </FormControl>
                    <FormControl
                        margin="dense"
                        required
                        fullWidth
                    >
                        <InputLabel htmlFor="email">Email</InputLabel>
                        <Input
                            name="email"
                            type="text"
                            id="email"
                            value={email}
                            onChange={(e) => { setEmail(e.target.value) }}
                        />
                    </FormControl>
                    <FormControl
                        margin="dense"
                        required
                        fullWidth
                    >
                        <TextField
                            margin="normal"
                            variant="outlined"
                            placeholder="Please enter a description of your problem."
                            rows={4}
                            fullWidth
                            multiline={true}
                            onChange={(e) => { setDescription(e.currentTarget.value) }}
                        />
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeWindow} variant="contained" color="primary">
                        Cancel
                    </Button>
                    <Button onClick={submitRequest} disabled={submitting} variant="contained" color="primary">
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}

SupportModal.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SupportModal);
