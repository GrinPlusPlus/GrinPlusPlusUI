import React from 'react';
import PropTypes from 'prop-types';
import {
    IconButton, Grid, Divider, TableCell, TableRow, Tooltip, Typography,
    DialogContent, DialogContentText, DialogActions, Button
} from '@material-ui/core';
import { MuiThemeProvider, createMuiTheme, withStyles } from '@material-ui/core/styles'
import RefreshIcon from '@material-ui/icons/Refresh';
import CancelIcon from '@material-ui/icons/Cancel';
import ReceiveIcon from '@material-ui/icons/CallReceived';
import SendIcon from "@material-ui/icons/CallMade";
import green from '@material-ui/core/colors/green';
import TxInfo from './TxInfo';
import GrinDialog from '../../../components/GrinDialog';
import CustomTable from '../../../components/CustomTable';
import GrinUtil from '../../../util/GrinUtil';
import { Collapse, Pre } from "@blueprintjs/core";

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
    },
    borderStyle: {
        borderTopWidth: 1,
        borderBottomWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderStyle: 'solid'
    }
};

function Transactions(props) {
    const { classes, transactions, lastConfirmedHeight, showCanceled, repostTx, cancelTx } = props;
    const [txId, setTxId] = React.useState(-1);
    const [cancelTxId, setCancelTxId] = React.useState(-1);

    const customTheme = createMuiTheme({
        palette: {
            primary: green
        },
        typography: {
            useNextVariants: true,
        }
    });

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
                    <SendIcon color='secondary' />
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
        } else if (status == "Sending (Unconfirmed)") {
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
                    <IconButton style={{ padding: '3px', marginLeft: '2px', marginRight: '5px' }} onClick={function () { setCancelTxId(txnId) }}>
                        <CancelIcon color='error' />
                    </IconButton>
                </Tooltip>
            );
        }
    }

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
        } else if (status == "Canceled" || status == "Sending (Unconfirmed)" || status == "Coinbase") {
            return false;
        } else {
            return true;
        }
    }

    function onClickRow(row) {
        if (canCancel(row.status)) {
            return;
        }

        if (txId == row.id) {
            setTxId(-1);
        } else {
            setTxId(row.id);
        }
    }

    function buildRow(row, index) {
        var creation_date_time = new Date(0);
        creation_date_time.setUTCSeconds((row.creation_date_time));

        var style = { };
        if (!canCancel(row.status)) {
            style = { cursor: 'pointer' };
        }

        return (
            <React.Fragment>
                <TableRow
                    hover
                    onClick={event => onClickRow(row)}
                    role='hover'
                    tabIndex={-1}
                    style={style}
                    key={row.id}
                >
                    <TableCell className={classes.borderStyle} component="th" scope="row" padding="none">
                        <Typography variant='body1' style={{ fontSize: '13px' }}>
                            {getActionIcon(row.id, row.status)}
                            {row.status}
                        </Typography>
                    </TableCell>
                    <TableCell className={classes.borderStyle} component="th" scope="row" padding="none">
                        <Typography variant='body1' style={{ fontSize: '13px' }}>
                            {GrinUtil.FormatDateTime(creation_date_time)}
                        </Typography>
                    </TableCell>
                    <TableCell className={classes.borderStyle} component="th" scope="row" padding="none" style={{ maxWidth: '350px' }}>
                        <Typography variant='body1' noWrap style={{ fontSize: '13px' }}>
                            {row.address}
                        </Typography>
                    </TableCell>
                    <TableCell className={classes.borderStyle} component="th" scope="row" padding="none">
                        <Typography variant='body1' align="right" style={{ fontSize: '13px' }}>
                            {GrinUtil.FormatAmount(row.amount)}
                        </Typography>
                    </TableCell>
                </TableRow>
                <TableCell padding={'none'} colSpan={4}>
                    <Collapse isOpen={txId == row.id}>
                        <Pre style={{width: '90%', marginLeft: '20px'}}>
                            <TxInfo transactionId={txId} show={txId == row.id} />
                        </Pre>
                    </Collapse>
                </TableCell>
            </React.Fragment>
        );
    }

    function handleCancel(txId) {
        cancelTx(txId);
        setCancelTxId(-1);
    }

    return (
        <React.Fragment>
            <GrinDialog
                open={cancelTxId >= 0}
                title="Cancel Confirmation"
            >
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to cancel the transaction?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { handleCancel(cancelTxId); }} color="primary">
                        Yes
                    </Button>
                    <Button onClick={() => { setCancelTxId(-1); }} color="primary" autoFocus>
                        No
                    </Button>
                </DialogActions>
            </GrinDialog>
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
