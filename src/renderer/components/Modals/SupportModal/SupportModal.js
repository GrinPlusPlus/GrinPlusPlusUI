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
import GrinDialog from '../../GrinDialog';
import CustomTextField from '../../CustomTextField';

const styles = theme => ({
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
        }, 5000);
    }

    function getMessageDisplay() {
        if (errorMessage.length > 0) {
            return (
                <Typography color="error">{errorMessage}</Typography>
            );
        } else if (successMessage.length > 0) {
            return (
                <Typography color="secondary">{successMessage}</Typography>
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
            <GrinDialog
                open={open}
                onClose={closeWindow}
                title="Report an Issue"
            >
                <DialogContent>
                    { getMessageDisplay() }
                    <FormControl
                        margin="dense"
                        fullWidth
                    >
                        <CustomTextField
                            name="name"
                            type="text"
                            id="name"
                            value={name}
                            placeholder="Name"
                            onChange={(e) => { setName(e.target.value) }}
                        />
                    </FormControl>
                    <FormControl
                        margin="dense"
                        required
                        fullWidth
                    >
                        <CustomTextField
                            name="email"
                            type="text"
                            id="email"
                            value={email}
                            placeholder="Email"
                            onChange={(e) => { setEmail(e.target.value) }}
                        />
                    </FormControl>
                    <FormControl
                        margin="dense"
                        required
                        fullWidth
                    >
                        <CustomTextField
                            placeholder="Please enter a description of your problem."
                            rows={4}
                            fullWidth
                            multiline={true}
                            onChange={(e) => { setDescription(e.currentTarget.value) }}
                        />
                    </FormControl>
                </DialogContent>
                <DialogActions style={{ marginRight: '15px', marginBottom: '15px' }}>
                    <Button onClick={closeWindow} variant="contained" color="primary">
                        Cancel
                    </Button>
                    <Button onClick={submitRequest} disabled={submitting} variant="contained" color="primary">
                        Submit
                    </Button>
                </DialogActions>
            </GrinDialog>
        </React.Fragment>
    );
}

SupportModal.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SupportModal);
