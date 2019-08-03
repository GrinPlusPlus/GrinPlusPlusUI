import React from "react";
import PropTypes from "prop-types";
import { ipcRenderer, clipboard } from 'electron';
import {
    Button, DialogContent, Grid, IconButton, Typography, Tooltip, Divider
} from '@material-ui/core';
import { MuiThemeProvider, createMuiTheme, withStyles } from '@material-ui/core/styles'
import blue from '@material-ui/core/colors/blue';
import InfoIcon from "@material-ui/icons/Info";
import GrinUtil from "../../../util/GrinUtil.js";
import CopyIcon from '@material-ui/icons/FileCopy';
import GrinDialog from '../../GrinDialog';

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

class TxInfoModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            transactionInfo: null
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.transactionId != this.props.transactionId || nextProps.showModal != this.props.showModal) {
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
        const { showModal, closeDialog } = this.props;

        if (!showModal) {
            return "";
        }

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
                outputs
                    .map(function (output) {
                        return (
                            <React.Fragment key={output.commitment}>
                                <Tooltip title="Commitment" aria-label={output.commitment}>
                                    <React.Fragment>
                                        <b>Commitment:</b> {output.commitment.substring(0, 12) + "..." + output.commitment.substring(54)}
                                        <IconButton onClick={() => { clipboard.writeText(output.commitment) }} style={{ padding: '5px' }}>
                                            <CopyIcon fontSize='small' color='primary' />
                                        </IconButton>
                                    </React.Fragment>
                                </Tooltip>
                                <br />

                                {getField("Keychain Path", output.keychain_path)}
                                {getField("Amount", GrinUtil.FormatAmount(output.amount))}
                                {getField("Status", output.status)}
                                {getField("MMR Index", output.mmr_index)}
                                {getField("Block Height", output.block_height)}
                                <Divider variant="fullWidth" />
                            </React.Fragment>
                        );
                    })
            );
        }

        function getInfo(transactionInfo) {
            if (transactionInfo === null) {
                return "";
            }

            return (
                <React.Fragment>
                    <Typography
                        variant='body1'
                        align='left'
                    >
                        {getField("ID", transactionInfo.id)}
                        {getField("UUID", transactionInfo.slate_id)}
                        {getField("Address", transactionInfo.address)}
                        {getField("Message", transactionInfo.slate_message)}
                        {getField("Credited", GrinUtil.FormatAmount(transactionInfo.amount_credited))}
                        {getField("Debited", GrinUtil.FormatAmount(transactionInfo.amount_debited))}
                        {getField("Confirmed Height", transactionInfo.confirmed_height)}
                        {getField("Confirmed DateTime", transactionInfo.confirmation_date_time)}

                        <br />
                        <b>Outputs:</b><br />
                    </Typography>

                    <Divider variant="fullWidth" />
                    {getOutputs(transactionInfo.outputs)}
                </React.Fragment>
            );
        }

        return (
            <React.Fragment>
                {/*<Tooltip title="Info" aria-label="Transaction Info">
                <IconButton onClick={showDialog} style={{ padding: '2px' }}>
                    <InfoIcon color='secondary' />
                </IconButton>
            </Tooltip>*/}

                <GrinDialog
                    open={showModal}
                    onClose={closeDialog}
                    fullWidth={true}
                    maxWidth='sm'
                    title="Transaction Info"
                >
                    <DialogContent>
                        {getInfo(this.state.transactionInfo)}
                        <br />
                        <Typography align='right'>
                            <Button variant="contained" color="primary" onClick={closeDialog}>
                                Close
                            </Button>
                        </Typography>
                    </DialogContent>
                </GrinDialog>
            </React.Fragment>
        );
    }
}

TxInfoModal.propTypes = {
    classes: PropTypes.object.isRequired,
    transactionId: PropTypes.number.isRequired,
    closeDialog: PropTypes.func.isRequired,
    showModal: PropTypes.bool.isRequired
};

export default withStyles(styles)(TxInfoModal);
