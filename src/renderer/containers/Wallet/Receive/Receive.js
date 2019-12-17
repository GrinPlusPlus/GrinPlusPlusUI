import React from "react";
import PropTypes from "prop-types";
import { ipcRenderer, clipboard } from 'electron';
import {
    Button, Divider, Grid, Radio, RadioGroup,
    FormControl, FormControlLabel, IconButton, Typography
} from "@material-ui/core";
import ReceiveIcon from "@material-ui/icons/CallReceived";
import OpenIcon from '@material-ui/icons/FolderOpen';
import CopyIcon from '@material-ui/icons/FileCopy';
import { withStyles } from "@material-ui/core/styles";
import CustomTextField from "../../../components/CustomTextField";

const styles = theme => ({
    fab: {
        margin: theme.spacing(1)
    },
    fileChooserButton: {
        marginTop: theme.spacing(1),
        marginLeft: theme.spacing(1),
        padding: '5px'
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1)
    },
    extendedIcon: {
        marginRight: theme.spacing(1)
    },
    outlineText: {
        textShadow: '-1px 0 red, 0 1px red, 1px 0 red, 0 -1px red'
        //-webkit-text-stroke-width: '1px',
        //-webkit-text-stroke-color: 'black'
    },
    unselectable: {
        userSelect: 'none'
    }
});

function Receive(props) {
    const { classes } = props;
    const [selectedFile, setSelectedFile] = React.useState("");
    const [httpAddress, setHttpAddress] = React.useState("");
    const [addressType, setAddressType] = React.useState("IP");
    const [grinboxAddress, setGrinboxAddress] = React.useState("");
    const [torAddress, setTorAddress] = React.useState("");
    const [message, setMessage] = React.useState("");

    if (httpAddress.length === 0) {
        setTimeout(() => {
            const http = ipcRenderer.sendSync('LookupURL');
            if (http.proxy != null && http.proxy.length > 0) {
                // TODO: Show expiration
                setHttpAddress(http.proxy);
                setAddressType("PROXY");
            } else {
                setHttpAddress("http://" + http.IP);
                setAddressType("IP");
            }

            const grinboxAddress = ipcRenderer.sendSync('Grinbox::GetAddress');
            if (grinboxAddress != null) {
                setGrinboxAddress(grinboxAddress);
            }

            const torAddress = ipcRenderer.sendSync('Tor::GetAddress');
            if (torAddress != null) {
                setTorAddress(torAddress);
            }
        }, 25);
    }
    
    function closeModal() {
        setHttpAddress("");
        setSelectedFile("");
        setMessage("");
    }

    function handleReceive(_event) {
        ipcRenderer.removeAllListeners('SlateOpened');
        ipcRenderer.on('SlateOpened', (event, fileName, data) => {
            if (data !== null) {
                try {
                    var outFile = fileName + '.response';
                    var result = ipcRenderer.sendSync('ReceiveFile', JSON.parse(data), outFile, message);
                    if (result.success) {
                        ipcRenderer.send('Snackbar::Relay', "SUCCESS", "Response saved to: " + outFile);
                        closeModal();
                    } else {
                        // TODO: What if already received?
                        ipcRenderer.send('Snackbar::Relay', "ERROR", JSON.stringify(result.data));
                    }
                } catch (e) {
                    ipcRenderer.send('Snackbar::Relay', "ERROR", "Unknown error occurred!");
                }
            }
        });

        ipcRenderer.send('OpenSlateFile', selectedFile);
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

        ipcRenderer.send('ChooseInputFile');
    }

    function getWarning() {
        if (addressType == "IP") {
            return (
                <b>
                    Advanced users only! You must configure port forwarding on port {global.listener_port} for this to work.<br />
                    After requesting funds via http, you must leave Grin++ logged in until those funds are recevied.
                </b>
            );
        } else if (addressType == "PROXY") {
            return (
                <b>
                    localtunnel addresses are ephemeral, and a new one is generated each time you open Grin++.<br />
                    After requesting funds via https, you must stay logged in until those funds are received.
                </b>
            );
        } else {
            return (
                <b>FAILED TO RETRIEVE ADDRESS</b>
            );
        }
    }

    function getGrinboxAddress() {
        if (grinboxAddress.length == 0) {
            return (
                <Typography variant='body1' display='inline' color='error'>
                    <b>ERROR CONNECTING</b>
                </Typography>
            );
        } else {
            return (
                <Typography variant='body1' display='inline' color='secondary'>
                    <b>{grinboxAddress}</b>
                    <IconButton onClick={() => { clipboard.writeText(grinboxAddress) }} style={{ padding: '5px' }}>
                        <CopyIcon fontSize='small' color='secondary' />
                    </IconButton>
                </Typography>
            );
        }
    }

    function getGrinboxDisplay() {
        return (
            <React.Fragment>
                <Typography variant='body1' display='inline' color='secondary' style={{ marginRight: '10px' }}>
                    <b className={classes.unselectable}>GRINBOX:</b>
                </Typography>
                {getGrinboxAddress()}
            </React.Fragment>
        );
    }

    function getTorAddress() {
        if (torAddress.length == 0) {
            return (
                <Typography variant='body1' display='inline' color='error'>
                    <b>ERROR CONNECTING</b>
                </Typography>
            );
        } else {
            return (
                <Typography variant='body1' display='inline' color='secondary'>
                    <b>{torAddress}</b>
                    <IconButton onClick={() => { clipboard.writeText(torAddress) }} style={{ padding: '5px' }}>
                        <CopyIcon fontSize='small' color='secondary' />
                    </IconButton>
                </Typography>
            );
        }
    }

    function getTorDisplay() {
        return (
            <React.Fragment>
                <Typography variant='body1' display='inline' color='secondary' style={{ marginRight: '10px' }}>
                    <b className={classes.unselectable}>TOR:</b>
                </Typography>
                {getTorAddress()}
            </React.Fragment>
        );
    }

    function getAddressDisplay() {
        const torEnabled = ipcRenderer.sendSync('Settings::IsTorEnabled');
        const grinboxEnabled = ipcRenderer.sendSync('Settings::IsGrinboxEnabled');
        if (!torEnabled && !grinboxEnabled) {
            return "";
        }

        return (
            <React.Fragment>
                <br /><Divider variant="fullWidth" /><br />

                {torEnabled ? getTorDisplay() : ""}
                {grinboxEnabled ? getGrinboxDisplay() : ""}
            </React.Fragment>
        );
    }

    return (
        <React.Fragment>
            <form className={classes.form} onSubmit={handleReceive}>
                <center>
                    {/* ReceiveHTTP */}
                    <p style={{ fontSize: '15px', color: 'red' }}>
                        {getWarning()}
                    </p>

                    <Typography variant='body1' color='secondary'>
                        <b>{httpAddress}</b>

                        <IconButton onClick={() => { clipboard.writeText(httpAddress)}} style={{ padding: '5px' }}>
                            <CopyIcon fontSize='small' color='secondary' />
                        </IconButton>
                    </Typography>

                    {getAddressDisplay()}

                    {/* ReceiveFile */}
                    <br /><br /><Divider variant="fullWidth" /><br />

                    <div>
                        <FormControl
                            margin="dense"
                            required
                            fullWidth
                            style={{ width: `calc(100% - 50px)` }}
                        >
                            <CustomTextField
                                name="receiveFile"
                                type="text"
                                id="receiveFile"
                                value={selectedFile}
                                placeholder='Transaction File'
                            />
                        </FormControl>
                        <IconButton color='secondary' onClick={handleSelectFile} className={classes.fileChooserButton}>
                            <OpenIcon />
                        </IconButton>
                    </div>
                    <div>
                        <FormControl margin="dense" fullWidth>
                            <CustomTextField name="message" type="text" id="message" value={message} onChange={(e) => { setMessage(e.target.value); }} placeholder='Message' />
                        </FormControl>
                    </div>
                    <br />
                </center>
                <Typography align='right'>
                    <Button type="submit" style={{ marginLeft: '10px' }} disabled={ selectedFile.length == 0 } variant="contained" color="primary">
                        Receive <ReceiveIcon />
                    </Button>
                </Typography>
            </form>
        </React.Fragment>
    );
}

Receive.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Receive);
