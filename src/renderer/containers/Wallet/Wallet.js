import React from "react";
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Fab from '@material-ui/core/Fab'
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import ButtonAppNav from '../../components/ButtonAppNav';
import { ipcRenderer } from 'electron';
import Typography from '@material-ui/core/Typography';
import SendModal from '../../components/Modals/SendModal';
import ReceiveModal from '../../components/Modals/ReceiveModal';
import SendIcon from "@material-ui/icons/CallMade";
import ReceiveIcon from '@material-ui/icons/CallReceived';
import FinalizeIcon from '@material-ui/icons/CallMerge';
import RefreshIcon from '@material-ui/icons/Refresh';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import Transactions from '../../components/Transactions';

const styles = theme => ({
    fullWidth: {
        width: '100%',
    },
    root: {
        flexGrow: 1,
    },
    actionIcon: {
        padding: 2 * theme.spacing.unit,
        textAlign: 'center'
    },
    send: {
        padding: theme.spacing.unit,
        textAlign: 'left',
    },
    receive: {
        padding: theme.spacing.unit,
        textAlign: 'right',
    }
});

function Wallet(props) {
    const [showSendModal, setShowSendModal] = React.useState(false);
    const [showReceiveModal, setShowReceiveModal] = React.useState(false);
    const [showCanceled, setShowCanceled] = React.useState(false);
    const [refresh, setRefresh] = React.useState(false);

    function FormatAmount(amount) {
        var calculatedAmount = Math.abs(amount) / Math.pow(10, 9);
        var formatted = calculatedAmount.toFixed(9) + "ツ";
        if (amount < 0) {
            formatted = "-" + formatted;
        }

        return formatted;
    }

    function handleSend(event) {
        setShowSendModal(true);
    }

    function handleFinalize(event) {
        ipcRenderer.removeAllListeners('ReceiveFileSelected');
        ipcRenderer.on('ReceiveFileSelected', (event, fileName) => {
            if (fileName != null) {
                ipcRenderer.removeAllListeners('SlateOpened');
                ipcRenderer.on('SlateOpened', (event, fileOpened, data) => {
                    if (data !== null) {
                        var result = ipcRenderer.sendSync('Finalize', data);
                        if (result !== null && result.status_code == 200) {
                            ipcRenderer.send('SaveToFile', (fileName + '.finalized'), JSON.stringify(result.tx));
                            // TODO: PostTx?
                            setRefresh(!refresh);
                        } else {
                            // TODO: Handle this
                        }
                    }
                });

                ipcRenderer.send('OpenSlateFile', fileName);
            }
        });

        ipcRenderer.send('ReceiveFile');
    }

    function cancelTx(txnId) {
        ipcRenderer.sendSync('Cancel', txnId); // TODO: Handle result
        setRefresh(!refresh);
    }

    function repostTx(txnId) {
        ipcRenderer.sendSync('Repost', txnId); // TODO: Handle result
        setRefresh(!refresh);
    }

    function checkForOutputs(event) {
        ipcRenderer.send("UpdateWallet", false);
        setTimeout(function () { setRefresh(!refresh) }, 2000);
    }

    const { classes } = props;
    
    var result = ipcRenderer.sendSync('WalletSummary');
    var total = FormatAmount(result['total']);
    var amount_awaiting_confirmation = FormatAmount(result['amount_awaiting_confirmation']);
    var amount_immature = FormatAmount(result['amount_immature']);
    var amount_locked = FormatAmount(result['amount_locked']);
    var amount_currently_spendable = FormatAmount(result['amount_currently_spendable']);

    return (
        <React.Fragment>
            <ButtonAppNav pageName='Wallet' />
            <Grid container spacing={8} style={{ marginTop: '1px', marginBottom: '0px', maxHeight: 'calc(100vh - 104px)', overflow: 'auto' }} className={classes.root}>

                <Grid item xs={2} />
                <Grid item xs={4}>
                    <br />
                    <Typography variant="h6">Spendable</Typography>
                    <Typography variant="h4">{amount_currently_spendable}</Typography>
                </Grid>
                <Grid item xs={4}>
                    <br />
                    <Typography align="right" variant="subtitle2">
                        Total:  {total}<br />
                        Immature:  {amount_immature}<br />
                        Unconfirmed:  {amount_awaiting_confirmation}<br />
                        Locked:  {amount_locked}<br />
                    </Typography>
                </Grid>
                <Grid item xs={2} />

                <Grid item xs={3} />
                <Grid item xs={2}>
                    <Fab
                        variant="extended"
                        className={classes.fullWidth}
                        aria-label="Send"
                        onClick={handleSend}
                        color="primary"
                    >
                        <SendIcon className={classes.extendedIcon} /> Send
                    </Fab>
                    <SendModal showModal={showSendModal} onClose={(event) => { setShowSendModal(false) }} />
                </Grid>
                <Grid item xs={2}>
                    <Fab
                        variant="extended"
                        className={classes.fullWidth}
                        aria-label="Receive"
                        onClick={(event) => { setShowReceiveModal(true) }}
                        color="primary"
                    >
                        <ReceiveIcon className={classes.extendedIcon} /> Receive
                    </Fab>
                    <ReceiveModal showModal={showReceiveModal} onClose={(_event) => { setShowReceiveModal(false) }} />
                </Grid>
                <Grid item xs={2}>
                    <Fab
                        variant="extended"
                        className={classes.fullWidth}
                        aria-label="Finalize"
                        onClick={handleFinalize}
                        color="primary"
                    >
                        <FinalizeIcon className={classes.extendedIcon} /> Finalize
                    </Fab>
                </Grid>
                <Grid item xs={3} />

                <Grid item xs={2} />
                <Grid item xs={4}>
                    <br />
                    <Typography variant="h5" inline><b>Transactions</b></Typography>
                    <Button onClick={(event) => { setShowCanceled(!showCanceled) }} style={{ marginBottom: '7px' }}>
                        ({showCanceled ? 'Hide' : 'Show'} Canceled)
                    </Button>
                </Grid>

                <Grid item xs={4}>
                    <div align='right'>
                        <br />
                        <Button onClick={checkForOutputs}>
                            <RefreshIcon /> Refresh
                        </Button>
                    </div>
                </Grid>
                <Grid item xs={2}>
                </Grid>

                <Grid item xs={2} />
                <Grid item xs={8}>
                    <Divider variant="fullWidth" />
                    <Transactions transactions={result.transactions} lastConfirmedHeight={result.last_confirmed_height} showCanceled={showCanceled} repostTx={repostTx} cancelTx={cancelTx} />
                </Grid>
                <Grid item xs={2}>
                </Grid>
            </Grid>
        </React.Fragment>
    );
}

Wallet.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Wallet);
