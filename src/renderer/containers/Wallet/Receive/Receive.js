import React from "react";
import PropTypes from "prop-types";
import { ipcRenderer, clipboard, shell } from 'electron';
import {
    Button, Divider, Link, FormControl, IconButton, Typography
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
            torAddress: "",
            message: "",
        }

        this.closeModal = this.closeModal.bind(this);
        this.handleReceive = this.handleReceive.bind(this);
        this.handleSelectFile = this.handleSelectFile.bind(this);
    }

    componentDidMount() {
        setTimeout(() => {
            const torAddress = ipcRenderer.sendSync('Tor::GetAddress');
            this.setState({
                torAddress: torAddress === null ? "" : torAddress
            });
        }, 25);
        
        ipcRenderer.removeAllListeners('Tor::Retry::Response');
        ipcRenderer.on('Tor::Retry::Response', (event, result) => {
            if (result.success) {
                if (result.data.status == 'SUCCESS') {
                    this.setState({
                        torAddress: result.data.tor_address
                    });
                }
            }
        });
    }
    
    closeModal() {
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

        function getTorAddress(torAddress) {
            if (torAddress == null || torAddress.length == 0) {
                return (
                    <React.Fragment>
                    <p style={{ fontSize: '16px', color: 'red' }}>
                            <b>ERROR: Failed to connect to TOR</b>
                            <IconButton onClick={() => { ipcRenderer.send('Tor::Retry') }}>
                                <RefreshIcon fontSize='small' color='secondary' />
                            </IconButton>
                            <br />
                        </p>
                        <Typography variant='body1' display='inline' color='secondary'>
                            Help: <b><Link color='secondary' style={{cursor: 'pointer'}} onClick={() => { shell.openExternal('https://grinplusplus.github.io/support'); }}>https://grinplusplus.github.io/support</Link></b>
                        </Typography>
                    </React.Fragment>
                );
            } else {
                return (
                    <React.Fragment>
                        <br /><br />
                        <Typography variant='body1' display='inline' color='secondary' style={{ marginRight: '10px' }}>
                            <b className={classes.unselectable}>TOR:</b>
                        </Typography>
                        <Typography variant='body1' display='inline' color='secondary'>
                            <b>{torAddress}</b>
                            <IconButton onClick={() => { clipboard.writeText(torAddress) }} style={{ padding: '5px' }}>
                                <CopyIcon fontSize='small' color='secondary' />
                            </IconButton>
                        </Typography>
                    </React.Fragment>
                );
            }
        }

        function getUrlDisplay(torAddress) {
            if (torAddress == null || torAddress.length == 0) {
                return "";
                /*return (
                    <p style={{ fontSize: '15px', color: 'red' }}>
                        <b>ERROR: Failed to connect to TOR</b>
                        <IconButton onClick={() => { ipcRenderer.send('RetryTor') }}>
                            <RefreshIcon fontSize='small' color='secondary' />
                        </IconButton>
                    </p>
                );*/
            } else {
                const url = "http://" + torAddress + ".grinplusplus.com";
                return (
                    <Typography variant='body1' color='secondary'>
                        <br /><br />
                        <b>{url}</b>

                        <IconButton onClick={() => { clipboard.writeText(url)}} style={{ padding: '5px' }}>
                            <CopyIcon fontSize='small' color='secondary' />
                        </IconButton>
                    </Typography>
                );
            }
        }

        return (
            <React.Fragment>
                <form className={classes.form} onSubmit={this.handleReceive}>
                    <center>
                        {/* ReceiveHTTP */}
                        {getUrlDisplay(this.state.torAddress)}

                        {/* TOR */}
                        {getTorAddress(this.state.torAddress)}

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
