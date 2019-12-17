import React from "react";
import PropTypes from "prop-types";
import { ipcRenderer, clipboard } from 'electron';
import {
    Grid, IconButton, Typography, Tooltip, Divider
} from '@material-ui/core';
import { createMuiTheme, withStyles } from '@material-ui/core/styles'
import blue from '@material-ui/core/colors/blue';
import GrinUtil from "../../../../util/GrinUtil.js";
import CopyIcon from '@material-ui/icons/FileCopy';

const styles = theme => ({
    fab: {
        margin: theme.spacing(1)
    },
    extendedIcon: {
        marginRight: theme.spacing(1)
    }
});

const blueTheme = createMuiTheme({
    palette: {
        primary: blue
    },
    typography: {
        useNextVariants: true,
    }
});

class TxInfo extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            transactionInfo: null
        };
    }

    componentDidMount() {
        if (this.props.transactionId != -1) {
            ipcRenderer.removeAllListeners('TransactionInfo::Response');
            ipcRenderer.on('TransactionInfo::Response', (event, txInfo) => {
                if (txInfo.status_code == 200) {
                    this.setState({
                        transactionInfo: txInfo
                    });
                }
            });

            ipcRenderer.send("TransactionInfo::Get", this.props.transactionId);
        } else {
            this.setState({
                transactionInfo: null
            });
        }

        return true;
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.transactionId != this.props.transactionId || nextProps.show != this.props.show) {
            if (nextProps.showModal) {
                ipcRenderer.removeAllListeners('TransactionInfo::Response');
                ipcRenderer.on('TransactionInfo::Response', (event, txInfo) => {
                    if (txInfo.status_code == 200) {
                        this.setState({
                            transactionInfo: txInfo
                        });
                    }
                });

                ipcRenderer.send("TransactionInfo::Get", nextProps.transactionId);
            } else {
                this.setState({
                    transactionInfo: null
                });
            }
            return true;
        } else if (nextState.transactionInfo != this.state.transactionInfo) {
            return true;
        }

        return false;
    }

    render() {
        function getField(label, value) {
            if (value == null) {
                return "";
            } else {
                return (
                    <React.Fragment>
                        <b>{label}:</b> {value}<br />
                    </React.Fragment>
                );
            }
        }

        function getOutputs(outputs) {
            if (outputs == null) {
                return null;
            }

            return (
                <Grid container
                    spacing={0}
                    style={{ width: '100%', padding: '10px' }}
                >
                    {
                        outputs.map(function (output) {
                            return (
                                <Grid item key={output.commitment} xs={6} style={{backgroundColor:'black', padding: '10px'}}>
                                    <Tooltip title="Commitment" aria-label={output.commitment}>
                                        <React.Fragment>
                                            <b>Commitment:</b> {output.commitment.substring(0, 12) + "..." + output.commitment.substring(54)}
                                            <IconButton onClick={() => { clipboard.writeText(output.commitment) }} style={{ padding: '3px' }}>
                                                <CopyIcon fontSize='small' color='secondary' />
                                            </IconButton>
                                        </React.Fragment>
                                    </Tooltip>
                                    <br />

                                    {getField("Keychain Path", output.keychain_path)}
                                    {getField("Amount", GrinUtil.FormatAmount(output.amount))}
                                    {getField("Status", output.status)}
                                    {getField("MMR Index", output.mmr_index)}
                                    {getField("Block Height", output.block_height)}
                                </Grid>
                            );
                        })
                    } 
                </Grid>
            );
        }

        function getInfo(transactionInfo) {
            return (
                <React.Fragment>
                    {getField("ID", transactionInfo.id)}
                    {getField("UUID", transactionInfo.slate_id)}
                    {getField("Address", transactionInfo.address)}
                    {getField("Message", transactionInfo.slate_message)}
                    {getField("Credited", GrinUtil.FormatAmount(transactionInfo.amount_credited))}
                    {getField("Debited", GrinUtil.FormatAmount(transactionInfo.amount_debited))}
                    {getField("Confirmed Height", transactionInfo.confirmed_height)}
                    {getField("Confirmed DateTime", transactionInfo.confirmation_date_time)}
                    <br />
                    <b>Outputs:</b>
                    {getOutputs(transactionInfo.outputs)}
                </React.Fragment>
            );
        }

        if (this.state.transactionInfo != null) {
            return getInfo(this.state.transactionInfo);
        } else {
            return "LOADING...";
        }
    }
}

TxInfo.propTypes = {
    classes: PropTypes.object.isRequired,
    transactionId: PropTypes.number.isRequired,
    show: PropTypes.bool.isRequired
};

export default withStyles(styles)(TxInfo);
