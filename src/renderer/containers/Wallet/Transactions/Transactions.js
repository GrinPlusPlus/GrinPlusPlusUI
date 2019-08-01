import React from 'react';
import PropTypes from 'prop-types';
import { IconButton, Grid, Divider, TableCell, TableRow, Tooltip, Typography } from '@material-ui/core';
import { MuiThemeProvider, createMuiTheme, withStyles } from '@material-ui/core/styles'
import RefreshIcon from '@material-ui/icons/Refresh';
import CancelIcon from '@material-ui/icons/Cancel';
import ReceiveIcon from '@material-ui/icons/CallReceived';
import SendIcon from "@material-ui/icons/CallMade";
import green from '@material-ui/core/colors/green';
import TxInfoModal from '../../../components/Modals/TxInfoModal';
import CustomTable from '../../../components/CustomTable';
import GrinUtil from '../../../util/GrinUtil';

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
    const [showTxInfo, setShowTxInfo] = React.useState(false);
    const [txId, setTxId] = React.useState(-1);

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
            if ((txn.confirmed_height + 9) > lastConfirmedHeight) {
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
        if (status.length >= 4 && status.substr(0, 4) == "Sent") {
            return (
                <IconButton style={{ padding: '3px', marginLeft: '2px', marginRight: '5px' }} disabled>
                    <SendIcon color='primary' />
                </IconButton>
            );
        } else if ((status.length >= 8 && status.substr(0, 8) == "Received") || status == "Coinbase") {
            return (
                <MuiThemeProvider theme={customTheme}>
                    <IconButton style={{ padding: '3px', marginLeft: '2px', marginRight: '5px' }} disabled>
                        <ReceiveIcon color='primary' />
                    </IconButton>
                </MuiThemeProvider>
            );
        } else if (status == "Canceled") {
            return (
                <IconButton style={{ padding: '3px', marginLeft: '2px', marginRight: '5px' }} disabled>
                    <CancelIcon />
                </IconButton>
            );
        } else if (status == "Sending (Finalized)") {
            return (
                <Tooltip title="Repost" aria-label="Repost Transaction">
                    <IconButton style={{ padding: '3px', marginLeft: '2px', marginRight: '5px' }} onClick={function () { repostTx(txnId) }}>
                        <RefreshIcon />
                    </IconButton>
                </Tooltip>
            );
        } else {
            return (
                <Tooltip title="Cancel" aria-label="Cancel Transaction">
                    <IconButton style={{ padding: '3px', marginLeft: '2px', marginRight: '5px' }} onClick={function () { cancelTx(txnId) }}>
                        <CancelIcon color='error' />
                    </IconButton>
                </Tooltip>
            );
        }
    }

    /*if (transactions != null) {
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
                                <Grid container spacing={2}>
                                    <Grid item xs={4}>
                                        <Typography variant='h6' className={classes.status}>
                                            <TxInfoModal transactionId={txn.id} />
                                            {getStatus(txn, lastConfirmedHeight)}
                                        </Typography>
                                        <Typography variant='body1' className={classes.creationDateTime}>{creation_date_time.toLocaleString()}</Typography>
                                    </Grid>
                                    <Grid item xs={4}>
                                        {txn.slate_message != null ? txn.slate_message : ''}
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Typography variant='h6' className={classes.amount} align="right">
                                            {FormatAmount(txn.amount_credited - txn.amount_debited)}
                                            {getActionIcon(txn.id, txn.type)}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Divider variant="fullWidth" />
                            </React.Fragment>
                        );
                    })
            );
        }
    }*/


    const columns = [
        { id: 'status', numeric: false, disablePadding: false, label: 'Status' },
        { id: 'creation_date_time', numeric: false, disablePadding: false, label: 'Date/Time' },
        { id: 'address', numeric: false, disablePadding: false, label: 'Address' },
        { id: 'amount', numeric: true, disablePadding: false, label: 'Amount' },
    ];

    var rows = [];
    if (transactions != null) {
        var txns = JSON.parse(transactions);
        if (txns != null) {
            for (var i = 0; i < txns.length; i++) {
                const txn = txns[i];
                if (txn.type == "Canceled" && showCanceled == false) {
                    continue;
                }

                var row = new Object();
                row.id = txn.id;
                row.creation_date_time = txn.creation_date_time;
                row.status = getStatus(txn, lastConfirmedHeight);
                row.address = txn.address;
                row.amount = txn.amount_credited - txn.amount_debited;
                rows.push(row);
            }
        }
    }

    function canCancel(status) {
        if (status.length >= 4 && status.substr(0, 4) == "Sent") {
            return false;
        } else if (status.length >= 8 && status.substr(0, 8) == "Received") {
            return false;
        } else if (status == "Canceled" || status == "Sending (Finalized)" || status == "Coinbase") {
            return false;
        } else {
            return true;
        }
    }

    function onClickRow(row) {
        if (canCancel(row.status)) {
            return;
        }

        setTxId(row.id);
        setShowTxInfo(true);
    }

    function buildRow(row, index) {
        var creation_date_time = new Date(0);
        creation_date_time.setUTCSeconds((row.creation_date_time));

        var style = {};
        if (!canCancel(row.status)) {
            style = { cursor: 'pointer' };
        }

        return (
            <TableRow
                hover
                onClick={event => onClickRow(row)}
                role='hover'
                tabIndex={-1}
                style={style}
                key={row.id}
            >
                <TableCell component="th" scope="row" padding="none">
                    <Typography variant='body1' style={{ fontSize: '13px' }}>
                        {getActionIcon(row.id, row.status)}
                        {row.status}
                    </Typography>
                </TableCell>
                <TableCell component="th" scope="row" padding="none">
                    <Typography variant='body1' style={{ fontSize: '13px' }}>
                        {GrinUtil.FormatDateTime(creation_date_time)}
                    </Typography>
                </TableCell>
                <TableCell component="th" scope="row" padding="none" style={{ maxWidth: '350px' }}>
                    <Typography variant='body1' noWrap style={{ fontSize: '13px' }}>
                        {row.address}
                    </Typography>
                </TableCell>
                <TableCell component="th" scope="row" padding="none">
                    <Typography variant='body1' align="right" style={{ fontSize: '13px' }}>
                        {GrinUtil.FormatAmount(row.amount)}
                    </Typography>
                </TableCell>
            </TableRow>
        );
    }

    return (
        <React.Fragment>
            <TxInfoModal
                showModal={showTxInfo}
                transactionId={txId}
                closeDialog={() => { setShowTxInfo(false); }}
            />
            <CustomTable
                columns={columns}
                items={rows}
                buildRow={buildRow}
                dense={true}
                orderBy='creation_date_time'
                order='desc'
            />
        </React.Fragment>
    );
}

Transactions.propTypes = {
    classes: PropTypes.object.isRequired,
    transactions: PropTypes.string,
    lastConfirmedHeight: PropTypes.number.isRequired,
    showCanceled: PropTypes.bool.isRequired,
    repostTx: PropTypes.func.isRequired,
    cancelTx: PropTypes.func.isRequired,
};

export default withStyles(styles)(Transactions);
