import React from "react";
import PropTypes from "prop-types";
import { ipcRenderer, clipboard } from 'electron';
import Button from "@material-ui/core/Button";
import DialogContent from "@material-ui/core/DialogContent";
import Grid from "@material-ui/core/Grid";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import IconButton from "@material-ui/core/IconButton";
import ReceiveIcon from "@material-ui/icons/CallReceived";
import OpenIcon from '@material-ui/icons/FolderOpen';
import CopyIcon from '@material-ui/icons/FileCopy';
import Snackbar from '@material-ui/core/Snackbar';
import Typography from '@material-ui/core/Typography';
import { withStyles } from "@material-ui/core/styles";
import CustomSnackbarContent from "../../CustomSnackbarContent";
import CustomTextField from "../../CustomTextField";
import GrinDialog from '../../GrinDialog';

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
        setTimeout(() => {
            const url = ipcRenderer.sendSync('LookupURL'); // TODO: This should only be attempted once. Need to make ReceiveModal a React.Component
            if (url != null) {
                setHttpAddress(url);
            }

            const grinboxAddress = ipcRenderer.sendSync('Grinbox::GetAddress');
            if (grinboxAddress != null) {
                setGrinboxAddress(grinboxAddress);
            }
        }, 200);
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
                            ipcRenderer.send('SaveToFile', (fileName + '.response'), JSON.stringify(result.slate));
                            ipcRenderer.send('Snackbar::Relay', "SUCCESS", "Saving response slate to: " + fileName + ".response");
                            closeModal();
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
            <Grid container spacing={2} fullWidth>
                <Grid item xs={11}>
                    <FormControl
                        margin="dense"
                        required
                        fullWidth
                    >
                        <CustomTextField
                            name="receiveFile"
                            type="text"
                            id="receiveFile"
                            value={selectedFile}
                            placeholder='Transaction File'
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={1}>
                    <IconButton color='secondary' onClick={handleSelectFile} className={classes.fileChooserButton}>
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

    function getWarning() {
        if (method != "http") {
            return "";
        }
        return (
            <center style={{fontSize: '13px', color: 'red'}}>
                <b>
                    Ngrok addresses are ephemeral, and a new one is generated each time you open Grin++.<br/>
                    After requesting funds via https, you must stay logged in until those funds are received.
                </b>
            </center>
        )
    }

    function getHTTPDisplay() {
        if (method != "http" && method != "grinbox") {
            return "";
        }
        
        return (
            <React.Fragment>
                <p>
                    <b>{method == 'http' ? httpAddress : grinboxAddress}</b> 

                    <IconButton onClick={handleCopy} style={{ padding: '5px' }}>
                        <CopyIcon fontSize='small' color='primary' />
                    </IconButton>
                </p>
                {getWarning()}
            </React.Fragment>
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

            <GrinDialog
                open={true}
                onClose={closeModal}
                size="md"
                fullWidth={true}
                title='Receive Grin'
            >
                <DialogContent>
                    <form className={classes.form} onSubmit={handleReceive}>
                        <center>
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
                                    label="https"
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
                        </center>
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
            </GrinDialog>
        </React.Fragment>
    );
}

ReceiveModal.propTypes = {
    classes: PropTypes.object.isRequired,
    showModal: PropTypes.bool,
    onClose: PropTypes.function
};

export default withStyles(styles)(ReceiveModal);
