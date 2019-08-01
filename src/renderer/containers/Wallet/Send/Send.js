import React from "react";
import PropTypes from "prop-types";
import { ipcRenderer } from 'electron';
import {
    Button, Grid, Radio, RadioGroup, FormControl, FormControlLabel
} from '@material-ui/core';
import SendIcon from "@material-ui/icons/Send";
import { withStyles } from "@material-ui/core/styles";
import CustomTextField from '../../../components/CustomTextField';
import GrinUtil from "../../../util/GrinUtil";
import SendFile from "./SendFile";
import SendHttp from "./SendHttp";
import SendGrinbox from "./SendGrinbox";
import CoinControl from './CoinControl';
import log from 'electron-log';

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
    constructor() {
        super();

        this.state = {
            amount: '',
            method: 'file',
            selectedFile: '',
            httpAddress: '',
            grinboxAddress: '',
            strategy: 'ALL',
            fee: '',
            outputs: null,
            inputs: []
        };

        this.clear = this.clear.bind(this);
        this.handleSend = this.handleSend.bind(this);
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
            httpAddress: '',
            grinboxAddress: '',
            selectedFile: '',
            inputs: [],
            message: ''
        });
    }

    handleSend(event) {
        event.preventDefault();
        const data = new FormData(event.target);
        const amountInNanoGrins = data.get('amount') * Math.pow(10, 9);

        var result = null;
        if (this.state.method == "file") {
            result = ipcRenderer.sendSync('Send', amountInNanoGrins, this.state.strategy, this.state.inputs, this.state.selectedFile, this.state.message);
        } else if (this.state.method == "http") {
            log.info("Sending to " + this.state.httpAddress);
            result = ipcRenderer.sendSync('SendToHTTP', this.state.httpAddress, amountInNanoGrins, this.state.strategy, this.state.inputs, this.state.message);
            log.info("Sent via http(s). Result: " + JSON.stringify(result));
        } else if (this.state.method == "grinbox") {
            log.info("Sending to " + this.state.grinboxAddress);
            result = ipcRenderer.sendSync('Grinbox::Send', this.state.grinboxAddress, amountInNanoGrins, this.state.strategy, this.state.inputs, this.state.message);
            log.info("Sent via grinbox. Result: " + JSON.stringify(result));
            this.clear();
            return;
        }
        
        if (result.status_code == 200) {
            if (this.state.method == "file") {
                const original = JSON.stringify(result.slate);
                const compressed = GrinUtil.Compress(original);
                log.info("Original: " + original);
                log.info("Base64: " + compressed);
                log.info("Decompressed: " + GrinUtil.Decompress(compressed));
                ipcRenderer.send('SaveToFile', this.state.selectedFile, JSON.stringify(result.slate));
            }

            ipcRenderer.send('Snackbar::Relay', "SUCCESS", "Transaction sent successfully.");
            this.clear();
        } else if (result.status_code == 409) {
            ipcRenderer.send('Snackbar::Relay', "ERROR", "Insufficient Funds Available!");
        } else {
            ipcRenderer.send('Snackbar::Relay', "ERROR", "Failed to send! Error Code: " + result.status_code);
        }
    }

    handleMethodChange(event) {
        this.setState({
            method: event.target.value
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

                ipcRenderer.send('Snackbar::Relay', "ERROR", "Insufficient Funds Available!");
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
        } else if (this.state.method == "file") {
            return this.state.selectedFile.length > 0;
        } else if (this.state.method == "http") {
            return this.state.httpAddress.length > 0;
        } else if (this.state.method == "grinbox") {
            return this.state.grinboxAddress.length > 0;
        }

        return true;
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

        return (
            <React.Fragment>
                <form className={classes.form} onSubmit={this.handleSend}>
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
                                <FormControlLabel value="http" control={<Radio />} label="Http(s)" labelPlacement="end" />
                                <FormControlLabel value="grinbox" control={<Radio />} label="Grinbox" labelPlacement="end" />
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
                    <SendHttp selected={this.state.method == "http"} httpAddress={this.state.httpAddress} setHttpAddress={(value) => { this.setState({ httpAddress: value }) }} />
                    <SendGrinbox selected={this.state.method == "grinbox"} grinboxAddress={this.state.grinboxAddress} setGrinboxAddress={(value) => { this.setState({ grinboxAddress: value }) }} />
                    <br />


                    {/* Coin Selection */}
                    <Grid container spacing={0}>
                        <Grid item xs={8}>
                            <FormControl component="fieldset" required>
                                <RadioGroup
                                    aria-label="Coin Selection Strategy"
                                    name="strategy"
                                    value={this.state.strategy}
                                    onChange={this.handleStrategyChange}
                                    row
                                >
                                    <FormControlLabel value="ALL" control={<Radio />} label="Default" labelPlacement="end" />
                                    <FormControlLabel value="CUSTOM" control={<Radio />} label="Custom" labelPlacement="end" />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                        <Grid item xs={4} style={{ textAlign: 'right' }}>
                            <Button type="submit" style={{ marginLeft: '10px' }} variant="contained" color="primary" disabled={!this.shouldEnableSubmit()} >
                                Send <SendIcon />
                            </Button>
                        </Grid>
                    </Grid>

                    {getInputs(this)}
                </form>
            </React.Fragment>
        );
    }
}

Send.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Send);
