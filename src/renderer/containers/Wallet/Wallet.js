import React from "react";
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Fab from '@material-ui/core/Fab'
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import SideMenu from '../../components/SideMenu';
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
import GrinUtil from "../../util/GrinUtil.js";

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

class Wallet extends React.Component {
    constructor() {
        super();

        var summaryAmounts = new Object();
        summaryAmounts.total = 0;
        summaryAmounts.awaiting_confirmation = 0;
        summaryAmounts.immature = 0;
        summaryAmounts.locked = 0;
        summaryAmounts.currently_spendable = 0;

        this.state = {
            transactions: null,
            lastConfirmedHeight: 0,
            showCanceled: false,
            showSendModal: false,
            showReceiveModal: false,
            summaryAmounts: summaryAmounts,
            buttonsDisabled: true
        };

        this.onWalletSummaryResponse = this.onWalletSummaryResponse.bind(this);
        this.updateWallet = this.updateWallet.bind(this);
        this.onWalletUpdated = this.onWalletUpdated.bind(this);
        this.onCanceled = this.onCanceled.bind(this);
        this.onReposted = this.onReposted.bind(this);
        this.showSend = this.showSend.bind(this);
        this.closeSend = this.closeSend.bind(this);
        this.showReceive = this.showReceive.bind(this);
        this.closeReceive = this.closeReceive.bind(this);
        this.showHideCanceled = this.showHideCanceled.bind(this);
        this.handleFinalize = this.handleFinalize.bind(this);
        this.updateButtonState = this.updateButtonState.bind(this);
    }

    updateButtonState() {
        if (global.FULLY_SYNCED != true || global.BLOCK_HEIGHT >= 262080) {
            if (this.state.buttonsDisabled == false) {
                this.setState({
                    buttonsDisabled: true
                });
            }
        } else if (this.state.buttonsDisabled == true) {
            this.setState({
                buttonsDisabled: false
            });
        }
    }

    componentDidMount() {
        ipcRenderer.removeAllListeners('WalletSummary::Response');
        ipcRenderer.on('WalletSummary::Response', this.onWalletSummaryResponse);

        ipcRenderer.removeAllListeners('Cancel::Response');
        ipcRenderer.on('Cancel::Response', this.onCanceled);

        ipcRenderer.removeAllListeners('Repost::Response');
        ipcRenderer.on('Repost::Response', this.onReposted);

        ipcRenderer.removeAllListeners('UpdateWallet::Response');
        ipcRenderer.on('UpdateWallet::Response', this.onWalletUpdated);

        ipcRenderer.send('WalletSummary', this.state.showCanceled);

        setInterval(this.updateButtonState, 1000);
    }

    onWalletSummaryResponse(event, statusCode, response) {
        if (statusCode == 200) {
            var summaryAmounts = new Object();
            summaryAmounts.total = response.total;
            summaryAmounts.awaiting_confirmation = response.amount_awaiting_confirmation;
            summaryAmounts.immature = response.amount_immature;
            summaryAmounts.locked = response.amount_locked;
            summaryAmounts.currently_spendable = response.amount_currently_spendable;

            this.setState({
                transactions: response.transactions,
                lastConfirmedHeight: response.last_confirmed_height,
                summaryAmounts: summaryAmounts
            });
        } else {
            log.error("WalletSummary::Response returned result " + statusCode);
        }
    }

    updateWallet() {
        ipcRenderer.send('UpdateWallet', this.state.showSpent, this.state.showCanceled);
    }

    onWalletUpdated(event, statusCode) {
        if (statusCode == 200) {
            ipcRenderer.send('WalletSummary', this.state.showCanceled);
        } else {
            // TODO: Show error?
        }
    }

    onCanceled(event, statusCode) {
        if (statusCode == 200) {
            ipcRenderer.send('WalletSummary', this.state.showCanceled);
        } else {
            // TODO: Show error?
        }
    }

    onReposted(event, statusCode) {
        if (statusCode == 200) {
            ipcRenderer.send('WalletSummary', this.state.showCanceled);
        } else {
            // TODO: Show error?
        }
    }

    showSend(event) {
        this.setState({
            showSendModal: true
        });
    }

    closeSend(event) {
        this.setState({
            showSendModal: false
        });
        this.updateWallet();
    }

    showReceive(event) {
        this.setState({
            showReceiveModal: true
        });
    }

    closeReceive(event) {
        this.setState({
            showReceiveModal: false
        });
        this.updateWallet();
    }

    showHideCanceled(event) {
        const newValue = !this.state.showCanceled;
        this.setState({
            showCanceled: newValue
        });

        ipcRenderer.send('WalletSummary', newValue);
    }

    handleFinalize(event) {
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

                            this.updateWallet();
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
    
    render() {
        const { classes } = this.props;

        //var result = ipcRenderer.sendSync('WalletSummary');
        var total = GrinUtil.FormatAmount(this.state.summaryAmounts.total);
        var amount_awaiting_confirmation = GrinUtil.FormatAmount(this.state.summaryAmounts.awaiting_confirmation);
        var amount_immature = GrinUtil.FormatAmount(this.state.summaryAmounts.immature);
        var amount_locked = GrinUtil.FormatAmount(this.state.summaryAmounts.locked);
        var amount_currently_spendable = GrinUtil.FormatAmount(this.state.summaryAmounts.currently_spendable);

        return (
            <React.Fragment>
                <SideMenu pageName='Wallet' />
                <Grid container spacing={2} style={{ marginTop: '1px', marginBottom: '0px', maxHeight: 'calc(100vh - 104px)', overflow: 'auto' }} className={classes.root}>

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

                    <Grid item xs={2} />
                    <Grid item xs={8}>
                        <Grid container spacing={2}>
                            <Grid item xs={4}>
                                <Fab
                                    variant="extended"
                                    className={classes.fullWidth}
                                    aria-label="Send"
                                    onClick={this.showSend}
                                    color="primary"
                                    disabled={this.state.buttonsDisabled}
                                    fullWidth
                                >
                                    <SendIcon className={classes.extendedIcon} /> Send
                            </Fab>
                                <SendModal showModal={this.state.showSendModal} onClose={this.closeSend} />
                            </Grid>
                            <Grid item xs={4}>
                                <Fab
                                    variant="extended"
                                    className={classes.fullWidth}
                                    aria-label="Receive"
                                    onClick={this.showReceive}
                                    color="primary"
                                    disabled={this.state.buttonsDisabled}
                                    fullWidth
                                >
                                    <ReceiveIcon className={classes.extendedIcon} /> Receive
                            </Fab>
                                <ReceiveModal showModal={this.state.showReceiveModal} onClose={this.closeReceive} />
                            </Grid>
                            <Grid item xs={4}>
                                <Fab
                                    variant="extended"
                                    className={classes.fullWidth}
                                    aria-label="Finalize"
                                    onClick={this.handleFinalize}
                                    color="primary"
                                    disabled={this.state.buttonsDisabled}
                                    fullWidth
                                >
                                    <FinalizeIcon className={classes.extendedIcon} /> Finalize
                                </Fab>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={2} />

                    <Grid item xs={2} />
                    <Grid item xs={6}>
                        <br />
                        <Typography variant="h5"><b>Transactions</b>
                            <Button onClick={this.showHideCanceled} style={{ marginBottom: '7px' }}>
                                ({this.state.showCanceled ? 'Hide' : 'Show'} Canceled)
                            </Button>
                        </Typography>
                    </Grid>

                    <Grid item xs={2}>
                        <div align='right'>
                            <br />
                            <Button onClick={() => { ipcRenderer.send('UpdateWallet', false) }}>
                                <RefreshIcon /> Refresh
                        </Button>
                        </div>
                    </Grid>
                    <Grid item xs={2}>
                    </Grid>

                    <Grid item xs={2} />
                    <Grid item xs={8}>
                        <Divider variant="fullWidth" />
                        <Transactions
                            transactions={this.state.transactions}
                            lastConfirmedHeight={this.state.last_confirmed_height}
                            showCanceled={this.state.showCanceled}
                            repostTx={(txnId) => { ipcRenderer.send('Repost', txnId) }}
                            cancelTx={(txnId) => { ipcRenderer.send('Cancel', txnId) }}
                        />
                    </Grid>
                    <Grid item xs={2}>
                    </Grid>
                </Grid>
            </React.Fragment>
        );
    }
}

Wallet.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Wallet);
