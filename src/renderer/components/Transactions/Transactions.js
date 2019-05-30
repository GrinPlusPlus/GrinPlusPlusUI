import React from 'react';
import PropTypes from 'prop-types';
import { IconButton, Grid, Divider, Tooltip } from '@material-ui/core';
import { MuiThemeProvider, createMuiTheme, withStyles } from '@material-ui/core/styles'
import RefreshIcon from '@material-ui/icons/Refresh';
import CancelIcon from '@material-ui/icons/Cancel';
import ReceiveIcon from '@material-ui/icons/CallReceived';
import SendIcon from "@material-ui/icons/CallMade";
import green from '@material-ui/core/colors/green';
import TxInfoModal from '../Modals/TxInfoModal';

const styles = {
    root: {
        flexGrow: 1
    },
    status: {
        marginTop: '4px',
        marginBottom: '2px'
    },
    creationDateTime: {
        marginTop: '2px',
        marginBottom: '4px'
    },
    amount: {
        marginTop: '2px',
        marginBottom: '2px'
    }
};

function Transactions(props) {
    const { classes, transactions, lastConfirmedHeight, showCanceled, repostTx, cancelTx } = props;

    const customTheme = createMuiTheme({
        palette: {
            primary: green
        },
        typography: {
            useNextVariants: true,
        }
    });

    function FormatAmount(amount) {
        var calculatedAmount = Math.abs(amount) / Math.pow(10, 9);
        var formatted = calculatedAmount.toFixed(9) + "ツ";
        if (amount < 0) {
            formatted = "-" + formatted;
        }

        return formatted;
    }

    function getStatus(txn, lastConfirmedHeight) {
        const status = txn.type;
        if (status == "Sent" || status == "Received") {
            if ((txn.confirmed_height + 10) > lastConfirmedHeight) {
                return status + " (" + (lastConfirmedHeight - txn.confirmed_height + 1) + " Confirmations)";
            }

            return status;
        } else if (status == "Sending (Finalized)") {
            return "Sending (Unconfirmed)";
        } else {
            return status;
        }
    }

    function getActionIcon(txnId, status) {
        if (status == "Sent") {
            return (
                <IconButton disabled>
                    <SendIcon color='primary' />
                </IconButton>
            );
        } else if (status == "Received" || status == "Coinbase") {
            return (
                <MuiThemeProvider theme={customTheme}>
                    <IconButton disabled>
                        <ReceiveIcon color='primary' />
                    </IconButton>
                </MuiThemeProvider>
            );
        } else if (status == "Canceled") {
            return (
                <IconButton disabled>
                    <CancelIcon />
                </IconButton>
            );
        } else if (status == "Sending (Finalized)") {
            return (
                <Tooltip title="Repost" aria-label="Repost Transaction">
                    <IconButton onClick={function () { repostTx(txnId) }}>
                        <RefreshIcon />
                    </IconButton>
                </Tooltip>
            );
        } else {
            return (
                <Tooltip title="Cancel" aria-label="Cancel Transaction">
                    <IconButton onClick={function () { cancelTx(txnId) }}>
                        <CancelIcon color='error' />
                    </IconButton>
                </Tooltip>
            );
        }
    }

    if (transactions != null) {
        var txns = JSON.parse(transactions);
        if (txns != null) {
            return (
                txns
                    .sort(function (a, b) { return b.creation_date_time - a.creation_date_time })
                    .map(function (txn) {
                        if (txn.type == "Canceled" && showCanceled == false) {
                            return "";
                        }

                        var creation_date_time = new Date(0);
                        creation_date_time.setUTCSeconds((txn.creation_date_time));

                        return (
                            <React.Fragment key={txn.id}>
                                <Grid container spacing={8}>
                                    <Grid item xs={6}>
                                        <h4 className={classes.status}>
                                            <TxInfoModal transactionId={txn.id} />
                                            {getStatus(txn, lastConfirmedHeight)}
                                        </h4>
                                        <p className={classes.creationDateTime}>{creation_date_time.toLocaleString()}</p>
                                    </Grid>
                                    <Grid item xs={3}>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <h4 className={classes.amount} align="right">
                                            {FormatAmount(txn.amount_credited - txn.amount_debited)}
                                            {getActionIcon(txn.id, txn.type)}
                                        </h4>
                                    </Grid>
                                </Grid>
                                <Divider variant="fullWidth" />
                            </React.Fragment>
                        );
                    })
            );
        }
    }

    return "";
}

Transactions.propTypes = {
    classes: PropTypes.object.isRequired,
    transactions: PropTypes.string.isRequired,
    lastConfirmedHeight: PropTypes.number.isRequired,
    showCanceled: PropTypes.bool.isRequired,
    repostTx: PropTypes.func.isRequired,
    cancelTx: PropTypes.func.isRequired,
};

export default withStyles(styles)(Transactions);
