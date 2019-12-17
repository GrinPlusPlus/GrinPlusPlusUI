import React from "react";
import PropTypes from "prop-types";
import { ipcRenderer } from 'electron';
import {
    Button, Grid, Radio, RadioGroup, Checkbox, FormControl, FormControlLabel,
    DialogContent, DialogContentText, DialogActions, CircularProgress
} from '@material-ui/core';
import SendIcon from "@material-ui/icons/Send";
import { withStyles } from "@material-ui/core/styles";
import CustomTextField from '../../../components/CustomTextField';
import SendFile from "./SendFile";
import SendHttp from "./SendHttp";
import SendGrinbox from "./SendGrinbox";
import CoinControl from './CoinControl';
import log from 'electron-log';
import SnackbarUtil from '../../../Util/SnackbarUtil.js';
import GrinDialog from '../../../components/GrinDialog';
//import GrinboxUtil from '../../../../main/Grinbox/GrinboxUtils.js';

const styles = theme => ({
    fab: {
        margin: theme.spacing(1)
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1)
    },
    extendedIcon: {
        marginRight: theme.spacing(1)
    }
});

class Send extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            amount: '',
            method: 'file',
            selectedFile: '',
            address: '',
            strategy: 'SMALLEST',
            fee: '',
            outputs: null,
            inputs: [],
            sending: false,
            useGrinJoin: false,
            confirmationDialog: false
        };

        this.clear = this.clear.bind(this);
        this.handleClickSend = this.handleClickSend.bind(this);
        this.handleSend = this.handleSend.bind(this);
        this.handleSendResult = this.handleSendResult.bind(this);
        this.handleMethodChange = this.handleMethodChange.bind(this);
        this.handleStrategyChange = this.handleStrategyChange.bind(this);
        this.handleAmountChange = this.handleAmountChange.bind(this);
        this.handleMessageChange = this.handleMessageChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.shouldEnableSubmit = this.shouldEnableSubmit.bind(this);
        this.onOutputsResponse = this.onOutputsResponse.bind(this);
        this.estimateFee = this.estimateFee.bind(this);
    }

    clear() {
        this.setState({
            amount: '',
            fee: '',
            address: '',
            selectedFile: '',
            inputs: [],
            message: '',
            useGrinJoin: false,
            sending: false,
            confirmationDialog: false
        });
    }

    handleClickSend(event) {
        event.preventDefault();

        this.setState({
            confirmationDialog: true
        });
    }

    handleSendResult(event, result) {
        if (result.success === true) {
            if (this.state.method == 'file') {
                SnackbarUtil.Success("Transaction saved at: " + this.state.selectedFile);
            } else {
                SnackbarUtil.Success("Transaction sent successfully.");
            }

            this.clear();
            this.props.showWallet();
        } else {
            this.setState({
                sending: false
            });
        }
    }

    handleSend() {
        const amountInNanoGrins = this.state.amount * Math.pow(10, 9);

        this.setState({
            confirmationDialog: false,
            sending: true
        });

        if (this.state.method == "file") {
            ipcRenderer.removeAllListeners('File::Send::Response');
            ipcRenderer.on('File::Send::Response', this.handleSendResult);

            ipcRenderer.send(
                'File::Send',
                amountInNanoGrins,
                this.state.strategy,
                this.state.inputs,
                this.state.selectedFile,
                this.state.message
            );
        } else if (this.state.method == "http") {
            ipcRenderer.removeAllListeners('HTTP::Send::Response');
            ipcRenderer.on('HTTP::Send::Response', this.handleSendResult);

            ipcRenderer.send(
                'HTTP::Send',
                this.state.address,
                amountInNanoGrins,
                this.state.strategy,
                this.state.inputs,
                this.state.message,
                this.state.useGrinJoin
            );
        } else if (this.state.method == 'tor') {
                ipcRenderer.removeAllListeners('TOR::Send::Response');
                ipcRenderer.on('TOR::Send::Response', this.handleSendResult);

                ipcRenderer.send(
                    'TOR::Send',
                    this.state.address,
                    amountInNanoGrins,
                    this.state.strategy,
                    this.state.inputs,
                    this.state.message,
                    this.state.useGrinJoin
                );
        } else if (this.state.method == "grinbox") {
            ipcRenderer.removeAllListeners('Grinbox::Send::Response');
            ipcRenderer.on('Grinbox::Send::Response', this.handleSendResult);

            ipcRenderer.send(
                'Grinbox::Send',
                this.state.address,
                amountInNanoGrins,
                this.state.strategy,
                this.state.inputs,
                this.state.message
            );
        }
    }

    handleMethodChange(event) {
        this.setState({
            method: event.target.value,
            address: ''
        });
    }

    onOutputsResponse(event, statusCode, newOutputs) {
        if (statusCode == 200) {
            var spendableOutputs = [];
            for (var i = 0; i < newOutputs.length; i++) {
                if (newOutputs[i].status == 'Spendable') {
                    spendableOutputs.push(newOutputs[i]);
                }
            }

            this.setState({
                outputs: spendableOutputs
            });
        } else {
            log.error("GetOutputs::Response returned result " + statusCode);
        }
    }

    estimateFee(amount, strategy, inputs) {
        if (amount.length > 0) {
            const result = ipcRenderer.sendSync('EstimateFee', amount * Math.pow(10, 9), strategy, inputs);
            if (result.status_code == 200) {
                const calculatedAmount = (result.fee / Math.pow(10, 9));

                var newInputs = [];
                for (var i = 0; i < result.inputs.length; i++) {
                    newInputs.push(result.inputs[i].commitment);
                }

                this.setState({
                    amount: amount,
                    strategy: strategy,
                    fee: '' + calculatedAmount.toFixed(9),
                    inputs: newInputs
                })
            } else {
                this.setState({
                    amount: amount,
                    strategy: strategy,
                    inputs: inputs,
                    fee: '',
                });

                SnackbarUtil.Error("Insufficient Funds Available!");
            }
        } else {
            this.setState({
                amount: amount,
                strategy: strategy,
                inputs: inputs,
                fee: ''
            });
        }
    }

    handleStrategyChange(event) {
        this.estimateFee(this.state.amount, event.target.value, this.state.inputs);
    }

    handleAmountChange(event) {
        this.estimateFee(event.target.value, this.state.strategy, this.state.inputs);
    }

    handleMessageChange(event) {
        this.setState({
            message: event.target.value
        });
    }

    handleInputChange(commitment) {
        var newInputs = null;
        if (this.state.inputs.includes(commitment)) {
            newInputs = this.state.inputs.filter(function (value, index, arr) {
                return value != commitment;
            });
        } else {
            newInputs = this.state.inputs;
            newInputs.push(commitment);
        }

        this.estimateFee(this.state.amount, 'CUSTOM', newInputs);
    }

    shouldEnableSubmit() {
        if (this.state.fee.length == 0) {
            return false;
        } else if (this.state.sending === true) {
            return false;
        } else if (this.state.method == "file") {
            return this.state.selectedFile.length > 0;
        }

        return this.state.address.length > 0;
    }

    componentDidMount() {
        ipcRenderer.removeAllListeners('GetOutputs::Response');
        ipcRenderer.on('GetOutputs::Response', this.onOutputsResponse);

        ipcRenderer.send('GetOutputs', false, false);
    }

    render() {
        const { classes } = this.props;

        function getInputs(component) {
            if (component.state.outputs == null) {
                return "";
            }

            return (
                <CoinControl inputs={component.state.outputs} selected={component.state.inputs} onSelectInput={component.handleInputChange} />
            );
        }

        function getGrinJoinCheckbox(component) {
            if (component.state.method != 'file' && component.state.method != 'grinbox') {
                return (
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={component.state.useGrinJoin}
                                onChange={() => {
                                    var updated = !component.state.useGrinJoin;
                                    component.setState({
                                        useGrinJoin: updated
                                    });
                                }}
                            />
                        }
                        label="Use GrinJoin"
                    />
                );
            }
        }

        function getSendButton(component) {
            if (component.state.sending) {
                return (
                    <Button type="submit" style={{ marginLeft: '10px' }} variant="contained" color="primary" disabled={true} >
                        Sending <CircularProgress size={24} className={classes.buttonProgress} />
                    </Button>
                );
            } else {
                return (
                    <Button type="submit" style={{ marginLeft: '10px' }} variant="contained" color="primary" disabled={!component.shouldEnableSubmit()} >
                        Send <SendIcon />
                    </Button>
                    
                );
            }
        }

        function getGrinboxOption() {
            if (!ipcRenderer.sendSync('Settings::IsGrinboxEnabled')) {
                return "";
            }

            return (
                <FormControlLabel value="grinbox" control={<Radio />} label="Grinbox" labelPlacement="end" />
            );
        }

        function getTorOption() {
            if (!ipcRenderer.sendSync('Settings::IsTorEnabled')) {
                return "";
            }

            return (
                <FormControlLabel value="tor" control={<Radio />} label="TOR" labelPlacement="end" />
            );
        }

        return (
            <React.Fragment>
                <GrinDialog
                    open={this.state.confirmationDialog}
                    title="Send Confirmation"
                >
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Are you sure you want to send?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleSend} color="primary">
                            Yes
                        </Button>
                        <Button onClick={() => { this.setState({ confirmationDialog: false }); }} color="primary" autoFocus>
                            No
                        </Button>
                    </DialogActions>
                </GrinDialog>

                <form className={classes.form} onSubmit={this.handleClickSend}>
                    <center>
                        <FormControl component="fieldset" required>
                            <RadioGroup
                                aria-label="Method"
                                name="method"
                                value={this.state.method}
                                onChange={this.handleMethodChange}
                                row
                            >
                                <FormControlLabel value="file" control={<Radio />} label="File" labelPlacement="end" />
                                {getTorOption()}
                                <FormControlLabel value="http" control={<Radio />} label="Http(s)" labelPlacement="end" />
                                {getGrinboxOption()}
                            </RadioGroup>
                        </FormControl>
                    </center>

                    <Grid container spacing={1}>
                        <Grid item xs={3}>
                            <FormControl margin="dense" required fullWidth>
                                <CustomTextField name="amount" type="text" id="amount" value={this.state.amount} onChange={this.handleAmountChange} placeholder='Amount ツ' autoFocus />
                            </FormControl>
                        </Grid>
                        <Grid item xs={2}>
                            <FormControl margin="dense" fullWidth>
                                <CustomTextField name="fee" type="text" id="fee" value={this.state.fee} placeholder='Fee ツ' disabled />
                            </FormControl>
                        </Grid>
                        <Grid item xs={7}>
                            <FormControl margin="dense" fullWidth>
                                <CustomTextField name="message" type="text" id="message" value={this.state.message} onChange={this.handleMessageChange} placeholder='Message' />
                            </FormControl>
                        </Grid>
                        {/* TODO: Include Donation button */}
                    </Grid>

                    <SendFile selected={this.state.method == "file"} selectedFile={this.state.selectedFile} setSelectedFile={(value) => { this.setState({ selectedFile: value }) }} />
                    <SendHttp selected={this.state.method != "file"} address={this.state.address} setAddress={(value) => { this.setState({ address: value }) }} />
                    <br />


                    {/* Coin Selection */}
                    <Grid container spacing={0}>
                        <Grid item xs={6}>
                            <FormControl component="fieldset" required>
                                <RadioGroup
                                    aria-label="Coin Selection Strategy"
                                    name="strategy"
                                    value={this.state.strategy}
                                    onChange={this.handleStrategyChange}
                                    row
                                >
                                    <FormControlLabel value="SMALLEST" control={<Radio />} label="Default" labelPlacement="end" />
                                    <FormControlLabel value="CUSTOM" control={<Radio />} label="Custom" labelPlacement="end" />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6} style={{ textAlign: 'right' }}>
                            { getGrinJoinCheckbox(this) }
                            { getSendButton(this) }
                        </Grid>
                    </Grid>

                    {getInputs(this)}
                </form>
            </React.Fragment>
        );
    }
}

Send.propTypes = {
    classes: PropTypes.object.isRequired,
    showWallet: PropTypes.func.isRequired
};

export default withStyles(styles)(Send);
