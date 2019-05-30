import React from "react";
import PropTypes from "prop-types";
import { ipcRenderer, clipboard } from 'electron';
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import IconButton from "@material-ui/core/IconButton";
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import ReceiveIcon from "@material-ui/icons/CallReceived";
import OpenIcon from '@material-ui/icons/FolderOpen';
import CopyIcon from '@material-ui/icons/FileCopy';
import Snackbar from '@material-ui/core/Snackbar';
import Typography from '@material-ui/core/Typography';
import { withStyles } from "@material-ui/core/styles";
import CustomSnackbarContent from "../../CustomSnackbarContent";

const styles = theme => ({
    fab: {
        margin: theme.spacing.unit
    },
    fileChooserButton: {
        marginTop: theme.spacing.unit,
        marginLeft: -theme.spacing.unit
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing.unit,
    },
    extendedIcon: {
        marginRight: theme.spacing.unit
    }
});

function ReceiveModal(props) {
    const { classes, onClose } = props;
    var { showModal } = props;
    const [method, setMethod] = React.useState("file");
    const [selectedFile, setSelectedFile] = React.useState("");
    const [errorMessage, setErrorMessage] = React.useState("");
    const [httpAddress, setHttpAddress] = React.useState("");
    const [grinboxAddress, setGrinboxAddress] = React.useState("");

    if (httpAddress.length === 0) {
        const ipAddress = ipcRenderer.sendSync('LookupIP');
        if (ipAddress != null) {
            setHttpAddress("http://" + ipAddress + ":3415");
        }

        const grinboxAddress = ipcRenderer.sendSync('Grinbox::GetAddress');
        if (grinboxAddress != null) {
            setGrinboxAddress(grinboxAddress);
        }
    }
    
    function closeModal() {
        showModal = false;
        onClose();
        setHttpAddress("");
        setSelectedFile("");
        setErrorMessage("");
        setMethod('file');
    }

    function handleReceive(_event) {
        if (method == "file") {
            ipcRenderer.removeAllListeners('SlateOpened');
            ipcRenderer.on('SlateOpened', (event, fileName, data) => {
                if (data !== null) {
                    var result = ipcRenderer.sendSync('Receive', data);
                    if (result !== null) {
                        if (result.status_code == 200) {
                            closeModal();
                            ipcRenderer.send('SaveToFile', (fileName + '.response'), JSON.stringify(result.slate));
                        } else {
                            setErrorMessage("Unknown error occurred!");
                        }
                    } else {
                        setErrorMessage("Unknown error occurred!");
                    }
                }
            });

            ipcRenderer.send('OpenSlateFile', selectedFile);
        } else if (method == "http" || method == "grinbox") {
            closeModal();
        }
    }

    function handleMethodChange(event) {
        setMethod(event.target.value);
    }

    function handleSelectFile(_event) {
        ipcRenderer.removeAllListeners('ReceiveFileSelected');
        ipcRenderer.on('ReceiveFileSelected', (event, file) => {
            if (file !== null) {
                setSelectedFile(file);
            } else {
                setSelectedFile("");
            }
        });

        ipcRenderer.send('ReceiveFile');
    }

    function handleSnackbarClose(event, reason) {
        setErrorMessage("");
    }

    if (showModal !== true) {
        return null;
    }

    function getFileDisplay() {
        if (method != "file") {
            return "";
        }

        return (
            <Grid container spacing={8} fullWidth>
                <Grid item xs={11}>
                    <FormControl
                        margin="dense"
                        required
                        fullWidth
                    >
                        <InputLabel htmlFor="receiveFile">Transaction File</InputLabel>
                        <Input
                            name="receiveFile"
                            type="text"
                            id="receiveFile"
                            value={selectedFile}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={1}>
                    <IconButton onClick={handleSelectFile} className={classes.fileChooserButton}>
                        <OpenIcon />
                    </IconButton>
                </Grid>
            </Grid>
        );
    }

    function handleCopy() {
        if (method == "http") {
            clipboard.writeText(httpAddress);
        } else if (method == "grinbox") {
            clipboard.writeText(grinboxAddress);
        }
    }

    function getHTTPDisplay() {
        if (method != "http" && method != "grinbox") {
            return "";
        }
        
        return (
            <p>
                Send To:
                <b>{method == 'http' ? httpAddress : grinboxAddress}</b>
                <IconButton onClick={handleCopy} style={{ padding: '5px' }}>
                    <CopyIcon fontSize='small' />
                </IconButton>
            </p>
        );
    }

    return (
        <React.Fragment>
            <Snackbar
                autoHideDuration={4000}
                open={errorMessage.length > 0}
                onClose={handleSnackbarClose}
            >
                <CustomSnackbarContent
                    onClose={handleSnackbarClose}
                    variant="error"
                    message={errorMessage}
                />
            </Snackbar>

            <Dialog
                open={true}
                onClose={closeModal}
                size="md"
                fullWidth={true}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title" disableTypography>
                    <Typography
                        variant='h4'
                        align='center'
                    >
                        Receive Grin
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <form className={classes.form} onSubmit={handleReceive}>
                        <FormControl component="fieldset" required>
                            <RadioGroup
                                aria-label="Method"
                                name="method"
                                value={method}
                                onChange={handleMethodChange}
                                row
                            >
                                <FormControlLabel
                                    value="file"
                                    control={<Radio />}
                                    label="File"
                                    labelPlacement="end"
                                />
                                <FormControlLabel
                                    value="http"
                                    control={<Radio />}
                                    label="http"
                                    labelPlacement="end"
                                />
                                <FormControlLabel
                                    value="grinbox"
                                    control={<Radio />}
                                    label="Grinbox"
                                    labelPlacement="end"
                                />
                            </RadioGroup>
                        </FormControl>

                        <br />

                        {/* ReceiveFile */}
                        {getFileDisplay()}

                        {/* ReceiveHTTP */}
                        {getHTTPDisplay()}

                        <br />
                        <Typography align='right'>
                            <Button onClick={closeModal} variant="contained" color="primary">
                                Cancel
                            </Button>
                            <Button type="submit" style={{ marginLeft: '10px' }} variant="contained" color="primary">
                                Receive <ReceiveIcon />
                            </Button>
                        </Typography>
                    </form>
                </DialogContent>
            </Dialog>
        </React.Fragment>
    );
}

ReceiveModal.propTypes = {
    classes: PropTypes.object.isRequired,
    showModal: PropTypes.bool,
    onClose: PropTypes.function
};

export default withStyles(styles)(ReceiveModal);
