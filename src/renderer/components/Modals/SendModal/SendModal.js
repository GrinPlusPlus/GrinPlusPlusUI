import React from "react";
import PropTypes from "prop-types";
import { ipcRenderer } from 'electron';
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
import SendIcon from "@material-ui/icons/CallMade";
import SaveAltIcon from '@material-ui/icons/SaveAlt';
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

function SendModal(props) {
    const { classes, onClose } = props;
    var { showModal } = props;
    const [method, setMethod] = React.useState("file");
    const [selectedFile, setSelectedFile] = React.useState("");
    const [errorMessage, setErrorMessage] = React.useState("");
    const [httpAddress, setHttpAddress] = React.useState("");
    const [grinboxAddress, setGrinboxAddress] = React.useState("");

    function closeWindow() {
        showModal = false;
        onClose();
        setHttpAddress("");
        setGrinboxAddress("");
        setSelectedFile("");
        setErrorMessage("");
    }

    function handleSend(event) {
        event.preventDefault();
        const data = new FormData(event.target);
        // TODO: Validate amount is a double
        const amountInNanoGrins = data.get('amount') * Math.pow(10, 9);

        var result = null;
        if (method == "file") {
            result = ipcRenderer.sendSync('Send', amountInNanoGrins);
        } else if (method == "http") {
            console.log("Sending to " + httpAddress);
            result = ipcRenderer.sendSync('SendToHTTP', httpAddress, amountInNanoGrins);
        } else if (method == "grinbox") {
            result = ipcRenderer.sendSync('Grinbox::Send', grinboxAddress, amountInNanoGrins);
            closeWindow();
            return;
        }
        
        if (result.status_code == 200) {
            if (method == "file") {
                ipcRenderer.send('SaveToFile', selectedFile, JSON.stringify(result.slate));
            }

            closeWindow();
        } else if (result.status_code == 409) {
            setErrorMessage("Insufficient Funds Available!");
        } else {
            setErrorMessage("Failed to send!");
        }
    }

    function handleMethodChange(event) {
        setMethod(event.target.value);
    }

    function handleSelectFile(event) {
        ipcRenderer.removeAllListeners('DestinationSelected');
        ipcRenderer.on('DestinationSelected', (event, file) => {
            if (file !== null) {
                setSelectedFile(file);
            }
        });

        ipcRenderer.send('SendFile');
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
            <Grid container spacing={8}>
                <Grid item xs={11}>
                    <FormControl
                        margin="dense"
                        required
                        fullWidth
                    >
                        <InputLabel htmlFor="destinationFile">Destination File</InputLabel>
                        <Input
                            name="destinationFile"
                            type="text"
                            id="destinationFile"
                            value={selectedFile}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={1}>
                    <IconButton onClick={handleSelectFile} className={classes.fileChooserButton}>
                        <SaveAltIcon />
                    </IconButton>
                </Grid>
            </Grid>
        );
    }

    function getHTTPDisplay() {
        if (method != "http") {
            return "";
        }

        return (
            <React.Fragment>
                <FormControl
                    margin="dense"
                    required
                    fullWidth
                >
                    <InputLabel htmlFor="URL">Address (eg. http(s)://12.34.56.78:3415)</InputLabel>
                    <Input
                        name="URL"
                        type="text"
                        id="URL"
                        value={httpAddress}
                        onChange={(event) => { setHttpAddress(event.target.value) }}
                    />
                </FormControl>
                <br />
            </React.Fragment>
        );
    }

    function getGrinboxDisplay() {
        if (method != "grinbox") {
            return "";
        }

        return (
            <React.Fragment>
                <FormControl
                    margin="dense"
                    required
                    fullWidth
                >
                    <InputLabel htmlFor="Grinbox">Grinbox Address (eg. gVvGhkjfh279RDrVpdNRBTuGT14e3kvNfBLrBEHiV2DLb3HGZ3v5)</InputLabel>
                    <Input
                        name="Grinbox"
                        type="text"
                        id="Grinbox"
                        value={grinboxAddress}
                        onChange={(event) => { setGrinboxAddress(event.target.value) }}
                    />
                </FormControl>
                <br />
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

            <Dialog
                open={true}
                onClose={closeWindow}
                fullWidth={true}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title" disableTypography>
                    <Typography
                        variant='h4'
                        align='center'
                    >
                        Send Grin
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <form className={classes.form} onSubmit={handleSend}>
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
                                    label="http(s)"
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

                        <FormControl margin="dense" required fullWidth>
                            <InputLabel htmlFor="amount">Amount ツ</InputLabel>
                            <Input name="amount" type="text" id="amount" autoFocus />
                        </FormControl>

                        {/* SendFile */}
                        { getFileDisplay() }

                        {/* SendHTTP */}
                        {getHTTPDisplay()}

                        {/* SendGrinbox */}
                        {getGrinboxDisplay()}

                        <br />
                        <Typography align='right'>
                            <Button onClick={closeWindow} variant="contained" color="primary">
                                Cancel
                            </Button>
                            <Button type="submit" style={{ marginLeft: '10px' }} variant="contained" color="primary">
                                Send <SendIcon />
                            </Button>
                        </Typography>
                    </form>
                </DialogContent>
            </Dialog>
        </React.Fragment>
    );
}

SendModal.propTypes = {
    classes: PropTypes.object.isRequired,
    showModal: PropTypes.bool,
    onClose: PropTypes.function
};

export default withStyles(styles)(SendModal);
