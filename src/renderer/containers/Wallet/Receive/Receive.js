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
import RefreshIcon from '@material-ui/icons/Refresh';
import { render } from "react-dom";

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

class Receive extends React.Component {
    constructor() {
        super();

        this.state = {
            selectedFile: "",
            ipAddress: "",
            proxyAddress: "",
            grinboxAddress: "",
            torAddress: "",
            message: "",
            listenerPort: 0
        }

        this.closeModal = this.closeModal.bind(this);
        this.handleReceive = this.handleReceive.bind(this);
        this.handleSelectFile = this.handleSelectFile.bind(this);
        this.onIPResponse = this.onIPResponse.bind(this);
        this.onProxyResponse = this.onProxyResponse.bind(this);
    }

    onIPResponse(event, ipAddress, listenerPort) {
        if (ipAddress != null) {
            this.setState({
                ipAddress: ipAddress,
                listenerPort: listenerPort
            });
        }
    }

    onProxyResponse(event, proxyAddress) {
        if (proxyAddress != null) {
            this.setState({
                proxyAddress: proxyAddress
            });
        }
    }

    componentDidMount() {
        ipcRenderer.removeAllListeners('LookupProxy::Response');
        ipcRenderer.on('LookupProxy::Response', this.onProxyResponse);
        ipcRenderer.send('LookupProxy');

        ipcRenderer.removeAllListeners('LookupIP::Response');
        ipcRenderer.on('LookupIp::Response', this.onIPResponse);
        ipcRenderer.send('LookupIP');

        setTimeout(() => {
            const grinboxAddress = ipcRenderer.sendSync('Grinbox::GetAddress');
            const torAddress = ipcRenderer.sendSync('Tor::GetAddress');
            this.setState({
                grinboxAddress: grinboxAddress === null ? "" : grinboxAddress,
                torAddress: torAddress === null ? "" : torAddress
            });
        }, 25);
    }
    
    closeModal() {
        /*setHttpAddress("");
        setSelectedFile("");
        setMessage("");*/
        this.props.showWallet();
    }

    handleReceive(event) {
        event.preventDefault();
        ipcRenderer.removeAllListeners('SlateOpened');
        ipcRenderer.on('SlateOpened', (event, fileName, data) => {
            if (data !== null) {
                try {
                    var outFile = fileName + '.response';

                    ipcRenderer.removeAllListeners('File::Receive::Response');
                    ipcRenderer.on('File::Receive::Response', (event, result) => {
                        console.log("File::Receive::Response");
                        if (result.success) {
                            ipcRenderer.send('Snackbar::Relay', "SUCCESS", "Response saved to: " + outFile);
                            this.closeModal();
                        } else {
                            // TODO: What if already received?
                            ipcRenderer.send('Snackbar::Relay', "ERROR", JSON.stringify(result.data));
                        }
                    });
                    ipcRenderer.send('File::Receive', JSON.parse(data), outFile, this.state.message);
                } catch (e) {
                    console.log(e.message);
                    ipcRenderer.send('Snackbar::Relay', "ERROR", "Unknown error occurred!");
                }
            }
        });

        ipcRenderer.send('OpenSlateFile', this.state.selectedFile);
    }

    handleSelectFile(_event) {
        ipcRenderer.removeAllListeners('ReceiveFileSelected');
        ipcRenderer.on('ReceiveFileSelected', (event, file) => {
            if (file !== null) {
                this.setState({
                    selectedFile: file
                });
            } else {
                this.setState({
                    selectedFile: ""
                });
            }
        });

        ipcRenderer.send('ChooseInputFile');
    }

    render() {
        const { classes } = this.props;

        function getGrinboxAddress(component) {
            if (component.state.grinboxAddress.length == 0) {
                return (
                    <Typography variant='body1' display='inline' color='error'>
                        <b>ERROR CONNECTING</b>
                    </Typography>
                );
            } else {
                return (
                    <Typography variant='body1' display='inline' color='secondary'>
                        <b>{component.state.grinboxAddress}</b>
                        <IconButton onClick={() => { clipboard.writeText(component.state.grinboxAddress) }} style={{ padding: '5px' }}>
                            <CopyIcon fontSize='small' color='secondary' />
                        </IconButton>
                    </Typography>
                );
            }
        }

        function getGrinboxDisplay(component) {
            return (
                <React.Fragment>
                    <Typography variant='body1' display='inline' color='secondary' style={{ marginRight: '10px' }}>
                        <b className={classes.unselectable}>GRINBOX:</b>
                    </Typography>
                    {getGrinboxAddress(component)}
                </React.Fragment>
            );
        }

        function getTorAddress(component) {
            if (component.state.torAddress.length == 0) {
                return (
                    <Typography variant='body1' display='inline' color='error'>
                        <b>ERROR CONNECTING</b>
                    </Typography>
                );
            } else {
                return (
                    <Typography variant='body1' display='inline' color='secondary'>
                        <b>{component.state.torAddress}</b>
                        <IconButton onClick={() => { clipboard.writeText(component.state.torAddress) }} style={{ padding: '5px' }}>
                            <CopyIcon fontSize='small' color='secondary' />
                        </IconButton>
                    </Typography>
                );
            }
        }

        function getTorDisplay(component) {
            return (
                <React.Fragment>
                    <Typography variant='body1' display='inline' color='secondary' style={{ marginRight: '10px' }}>
                        <b className={classes.unselectable}>TOR:</b>
                    </Typography>
                    {getTorAddress(component)}
                </React.Fragment>
            );
        }

        function getAddressDisplay(component) {
            const torEnabled = ipcRenderer.sendSync('Settings::IsTorEnabled');
            const grinboxEnabled = ipcRenderer.sendSync('Settings::IsGrinboxEnabled');
            if (!torEnabled && !grinboxEnabled) {
                return "";
            }

            return (
                <React.Fragment>
                    <br /><Divider variant="fullWidth" /><br />

                    {torEnabled ? getTorDisplay(component) : ""}
                    {grinboxEnabled ? getGrinboxDisplay(component) : ""}
                </React.Fragment>
            );
        }

        function getUrlDisplay(component) {
            if (component.state.proxyAddress != null && component.state.proxyAddress.length > 0) {
                return (
                    <React.Fragment>
                        <p style={{ fontSize: '15px', color: 'red' }}>
                            <b>
                                localtunnel addresses are ephemeral, and a new one is generated each time you open Grin++.<br />
                                After requesting funds via https, you must stay logged in until those funds are received.
                            </b>
                        </p>
                        <Typography variant='body1' color='secondary'>
                            <b>{component.state.proxyAddress}</b>

                            <IconButton onClick={() => { clipboard.writeText(component.state.proxyAddress)}} style={{ padding: '5px' }}>
                                <CopyIcon fontSize='small' color='secondary' />
                            </IconButton>
                        </Typography>
                    </React.Fragment>
                );
            } else  if (component.state.ipAddress != null && component.state.ipAddress.length > 0) {
                return (
                    <React.Fragment>
                        <p style={{ fontSize: '15px', color: 'red' }}>
                            <b>
                                Advanced users only! You must configure port forwarding on port {component.state.listenerPort} for this to work.<br />
                                After requesting funds via http, you must leave Grin++ logged in until those funds are recevied.
                            </b>
                        </p>
                        <Typography variant='body1' color='secondary'>
                            <b>{component.state.ipAddress}</b>

                            <IconButton onClick={() => { clipboard.writeText(component.state.ipAddress)}} style={{ padding: '5px' }}>
                                <CopyIcon fontSize='small' color='secondary' />
                            </IconButton>
                        </Typography>
                    </React.Fragment>
                );
            } else {
                return (
                    <p style={{ fontSize: '15px', color: 'red' }}>
                        <b>FAILED TO RETRIEVE ADDRESS</b>
                        <IconButton onClick={() => { ipcRenderer.send('LookupProxy') }}>
                            <RefreshIcon fontSize='small' color='secondary' />
                        </IconButton>
                    </p>
                );
            }
        }

        return (
            <React.Fragment>
                <form className={classes.form} onSubmit={this.handleReceive}>
                    <center>
                        {/* ReceiveHTTP */}
                        {getUrlDisplay(this)}
                        {getAddressDisplay(this)}

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
                                    value={this.state.selectedFile}
                                    placeholder='Transaction File'
                                />
                            </FormControl>
                            <IconButton color='secondary' onClick={this.handleSelectFile} className={classes.fileChooserButton}>
                                <OpenIcon />
                            </IconButton>
                        </div>
                        <div>
                            <FormControl margin="dense" fullWidth>
                                <CustomTextField name="message" type="text" id="message" value={this.state.message} onChange={(e) => { this.setState({message: e.target.value}); }} placeholder='Message' />
                            </FormControl>
                        </div>
                        <br />
                    </center>
                    <Typography align='right'>
                        <Button type="submit" style={{ marginLeft: '10px' }} disabled={ this.state.selectedFile.length == 0 } variant="contained" color="primary">
                            Receive <ReceiveIcon />
                        </Button>
                    </Typography>
                </form>
            </React.Fragment>
        );
    }
}

Receive.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Receive);
