import React from "react";
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import { ipcRenderer } from 'electron';
import Typography from '@material-ui/core/Typography';
import WalletIcon from '@material-ui/icons/AccountBalanceWallet';
import SendIcon from "@material-ui/icons/CallMade";
import ReceiveIcon from '@material-ui/icons/CallReceived';
import FinalizeIcon from '@material-ui/icons/CallMerge';
import RefreshIcon from '@material-ui/icons/Refresh';
import Transactions from './Transactions';
import GrinUtil from "../../util/GrinUtil.js";
import Send from './Send';
import Receive from './Receive';
import Finalize from './Finalize';

const styles = theme => ({
    fullWidth: {
        width: `calc(100% - 10px)`,
        margin: '5px'
    },
    fullWidthSelected: {
        width: `calc(100% - 10px)`,
        margin: '5px',
        backgroundColor: 'white',
        color: 'black',
        '&:hover': {
            background: 'white',
            color: 'black',
        }
    },
    root: {
        flexGrow: 1,
    },
    actionIcon: {
        padding: theme.spacing(2),
        textAlign: 'center'
    },
    send: {
        padding: theme.spacing(1),
        textAlign: 'left',
    },
    receive: {
        padding: theme.spacing(1),
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
            summaryAmounts: summaryAmounts,
            buttonsDisabled: true,
            selectedView: 'WALLET'
        };

        this.onWalletSummaryResponse = this.onWalletSummaryResponse.bind(this);
        this.updateWallet = this.updateWallet.bind(this);
        this.onWalletUpdated = this.onWalletUpdated.bind(this);
        this.onCanceled = this.onCanceled.bind(this);
        this.onReposted = this.onReposted.bind(this);
        this.showWallet = this.showWallet.bind(this);
        this.showSend = this.showSend.bind(this);
        this.showReceive = this.showReceive.bind(this);
        this.showHideCanceled = this.showHideCanceled.bind(this);
        this.showFinalize = this.showFinalize.bind(this);
        this.updateButtonState = this.updateButtonState.bind(this);

        this.updateButtonInterval = null;
        this.updateWalletInterval = null;
    }

    updateButtonState() {
        if (global.FULLY_SYNCED != true) {
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

        this.updateButtonInterval = setInterval(this.updateButtonState, 500);
        this.updateWalletInterval = setInterval(this.updateWallet, 15000);
    }

    componentWillUnmount() {
        clearInterval(this.updateButtonInterval);
        this.updateButtonInterval = null;

        clearInterval(this.updateWalletInterval);
        this.updateWalletInterval = null;
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

    showWallet(event) {
        this.setState({
            selectedView: 'WALLET'
        });
    }

    showSend(event) {
        this.setState({
            selectedView: 'SEND'
        });
    }

    showReceive(event) {
        this.setState({
            selectedView: 'RECEIVE'
        });
    }

    showFinalize(event) {
        this.setState({
            selectedView: 'FINALIZE'
        });
    }

    showHideCanceled(event) {
        const newValue = !this.state.showCanceled;
        this.setState({
            showCanceled: newValue
        });

        ipcRenderer.send('WalletSummary', newValue);
    }
    
    render() {
        const { classes } = this.props;

        var total = GrinUtil.FormatAmount(this.state.summaryAmounts.total);
        var amount_awaiting_confirmation = GrinUtil.FormatAmount(this.state.summaryAmounts.awaiting_confirmation);
        var amount_immature = GrinUtil.FormatAmount(this.state.summaryAmounts.immature);
        var amount_locked = GrinUtil.FormatAmount(this.state.summaryAmounts.locked);
        var amount_currently_spendable = GrinUtil.FormatAmount(this.state.summaryAmounts.currently_spendable);

        function showSelectedView(component) {
            if (component.state.selectedView == 'SEND') {
                return (
                    <Send showWallet={component.showWallet} />
                );
            } else if (component.state.selectedView == 'RECEIVE') {
                return (
                    <Receive showWallet={component.showWallet} />
                );
            } else if (component.state.selectedView == 'FINALIZE') {
                return (
                    <Finalize showWallet={component.showWallet} />
                )
            } else {
                return (
                    <div>
                        <Grid container spacing={0}>
                            <Grid item xs={8}>
                                <Typography variant="h5">
                                    <b>Transactions</b>
                                    <Button onClick={component.showHideCanceled} style={{ marginBottom: '7px' }}>
                                        ({component.state.showCanceled ? 'Hide' : 'Show'} Canceled)
                                    </Button>
                                </Typography>
                            </Grid>
                            <Grid item xs={4} style={{ textAlign: 'right' }}>
                                <Button onClick={() => { ipcRenderer.send('UpdateWallet', false) }}>
                                    <RefreshIcon /> Refresh
                                </Button>
                            </Grid>
                        </Grid>

                        <Divider variant="fullWidth" />
                        <Transactions
                            transactions={component.state.transactions}
                            lastConfirmedHeight={component.state.lastConfirmedHeight}
                            showCanceled={component.state.showCanceled}
                            repostTx={(txnId) => { ipcRenderer.send('Repost', txnId) }}
                            cancelTx={(txnId) => { ipcRenderer.send('Cancel', txnId) }}
                        />
                    </div>
                );
            }
        }

        return (
            <div style={{ height: '100%', overflow: 'auto' }}>
                <Grid container spacing={0} style={{ marginTop: '1px', marginBottom: '0px' }} className={classes.root}>

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
                    <Grid item xs={2}>
                        <Button
                            variant="outlined"
                            className={this.state.selectedView == "WALLET" ? classes.fullWidthSelected : classes.fullWidth }
                            aria-label="Wallet"
                            onClick={this.showWallet}
                            fullWidth
                        >
                            <WalletIcon className={classes.extendedIcon} /> Wallet
                        </Button>
                    </Grid>
                    <Grid item xs={2}>
                        <Button
                            variant="outlined"
                            className={this.state.selectedView == "SEND" ? classes.fullWidthSelected : classes.fullWidth }
                            aria-label="Send"
                            onClick={this.showSend}
                            disabled={this.state.buttonsDisabled}
                            fullWidth
                        >
                            <SendIcon className={classes.extendedIcon} /> Send
                        </Button>
                    </Grid>
                    <Grid item xs={2}>
                        <Button
                            variant="outlined"
                            className={this.state.selectedView == "RECEIVE" ? classes.fullWidthSelected : classes.fullWidth }
                            aria-label="Receive"
                            onClick={this.showReceive}
                            disabled={this.state.buttonsDisabled}
                            fullWidth
                        >
                            <ReceiveIcon className={classes.extendedIcon} /> Receive
                        </Button>
                    </Grid>
                    <Grid item xs={2}>
                        <Button
                            variant="outlined"
                            className={this.state.selectedView == "FINALIZE" ? classes.fullWidthSelected : classes.fullWidth }
                            aria-label="Finalize"
                            onClick={this.showFinalize}
                            disabled={this.state.buttonsDisabled}
                            fullWidth
                        >
                            <FinalizeIcon className={classes.extendedIcon} /> Finalize
                        </Button>
                    </Grid>
                    <Grid item xs={2} />

                    <Grid item xs={2} />
                    <Grid item xs={8}>
                        {showSelectedView(this)}
                    </Grid>
                    <Grid item xs={2} />
                </Grid>
            </div>
        );
    }
}

Wallet.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Wallet);
