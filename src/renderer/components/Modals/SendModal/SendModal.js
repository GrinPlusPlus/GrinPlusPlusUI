import React from "react";
import PropTypes from "prop-types";
import { ipcRenderer } from 'electron';
import {
    Button, Dialog, DialogContent, DialogTitle, Grid, Radio, RadioGroup,
    FormControl, FormControlLabel, Input, InputLabel, Snackbar, Typography
} from '@material-ui/core';
import SendIcon from "@material-ui/icons/Send";
import { withStyles } from "@material-ui/core/styles";
import CustomSnackbarContent from "../../CustomSnackbarContent";
import GrinUtil from "../../../util/GrinUtil";
import SendFile from "./SendFile";
import SendHttp from "./SendHttp";
import SendGrinbox from "./SendGrinbox";

const styles = theme => ({
    fab: {
        margin: theme.spacing.unit
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
    const [fee, setFee] = React.useState("");

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
            const original = JSON.stringify(result.slate);
            const compressed = GrinUtil.Compress(original);
            console.log("Original: " + original);
            console.log("Base64: " + compressed);
            console.log("Decompressed: " + GrinUtil.Decompress(compressed));

            if (method == "file") {
                ipcRenderer.send('SaveToFile', selectedFile, JSON.stringify(result.slate));
            }

            closeWindow();
        } else if (result.status_code == 409) {
            setErrorMessage("Insufficient Funds Available!");
        } else {
            setErrorMessage("Failed to send! Error Code: " + result.status_code);
        }
    }

    function handleMethodChange(event) {
        setMethod(event.target.value);
    }

    function handleAmountChange(event) {
        if (event.target.value.length > 0) {
            const result = ipcRenderer.sendSync('EstimateFee', event.target.value * Math.pow(10, 9));
            if (result.status_code == 200) {
                const calculatedAmount = (result.fee / Math.pow(10, 9));
                setFee("" + calculatedAmount.toFixed(9));
            } else {
                setFee("");
                setErrorMessage("Error ocurred! Insufficient funds?");
            }
        } else {
            setFee("");
        }
    }

    function handleSnackbarClose(event, reason) {
        setErrorMessage("");
    }

    function shouldEnableSubmit() {
        if (fee.length == 0) {
            return false;
        } else if (method == "file") {
            return selectedFile.length > 0;
        } else if (method == "http") {
            return httpAddress.length > 0;
        } else if (method == "grinbox") {
            return grinboxAddress.length > 0;
        }

        return true;
    }

    if (showModal !== true) {
        return null;
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
                                <FormControlLabel value="text" control={<Radio />} label="Text" labelPlacement="end" />
                                <FormControlLabel value="file" control={<Radio />} label="File" labelPlacement="end" />
                                <FormControlLabel value="http" control={<Radio />} label="Http(s)" labelPlacement="end" />
                                <FormControlLabel value="grinbox" control={<Radio />} label="Grinbox" labelPlacement="end" />
                            </RadioGroup>
                        </FormControl>

                        <br />

                        <Grid container spacing={8}>
                            <Grid item xs={8}>
                                <FormControl margin="dense" required fullWidth>
                                    <InputLabel htmlFor="amount">Amount ツ</InputLabel>
                                    <Input name="amount" type="text" id="amount" onChange={handleAmountChange} autoFocus />
                                </FormControl>
                            </Grid>
                            <Grid item xs={4}>
                                <FormControl margin="dense" fullWidth>
                                    <InputLabel htmlFor="fee">Fee ツ</InputLabel>
                                    <Input name="fee" type="text" id="fee" value={fee} disabled />
                                </FormControl>
                            </Grid>
                        </Grid>

                        <SendFile selected={method == "file"} selectedFile={selectedFile} setSelectedFile={setSelectedFile} />
                        <SendHttp selected={method == "http"} httpAddress={httpAddress} setHttpAddress={setHttpAddress} />
                        <SendGrinbox selected={method == "grinbox"} grinboxAddress={grinboxAddress} setGrinboxAddress={setGrinboxAddress} />

                        <br />
                        <Typography align='right'>
                            <Button onClick={closeWindow} variant="contained" color="primary">
                                Cancel
                            </Button>
                            <Button type="submit" style={{ marginLeft: '10px' }} variant="contained" color="primary" disabled={!shouldEnableSubmit()} >
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
