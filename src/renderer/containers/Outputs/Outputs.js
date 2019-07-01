import React from "react";
import PropTypes from 'prop-types';
import { Button, Divider, Grid, Tooltip, Typography, IconButton } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import SideMenu from '../../components/SideMenu';
import { ipcRenderer, clipboard } from 'electron';
import RefreshIcon from '@material-ui/icons/Refresh';
import CopyIcon from '@material-ui/icons/FileCopy';
import log from 'electron-log';
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

class Outputs extends React.Component {

    constructor() {
        super();
        this.state = {
            outputs: [],
            showSpent: false,
            showCanceled: false
        };

        this.onOutputsResponse = this.onOutputsResponse.bind(this);
        this.updateOutputs = this.updateOutputs.bind(this);
    }

    onOutputsResponse(event, statusCode, newOutputs) {
        if (statusCode == 200) {
            this.setState({
                outputs: newOutputs
            });
        } else {
            log.error("GetOutputs::Response returned result " + statusCode);
        }
    }

    componentDidMount() {
        ipcRenderer.removeAllListeners('GetOutputs::Response');
        ipcRenderer.on('GetOutputs::Response', this.onOutputsResponse);

        ipcRenderer.send('GetOutputs', this.state.showSpent, this.state.showCanceled);
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.showSpent != prevState.showSpent || this.state.showCanceled != prevState.showCanceled) {
            ipcRenderer.send('GetOutputs', this.state.showSpent, this.state.showCanceled);
        }
    }

    updateOutputs() {
        ipcRenderer.send('GetOutputs', this.state.showSpent, this.state.showCanceled);
    }

    render() {
        const { classes } = this.props;

        var outputRows = this.state.outputs.map(function (output) {
            // TODO: Need info dialog to show transaction_id, mmr_index, and block_height (all optional). Also should show keychain_path.
            return (
                <React.Fragment key={output.commitment}>
                    <Grid container spacing={0}>
                        <Grid item xs={7}>
                            <Tooltip title="Commitment" aria-label={output.commitment}>
                                <Typography variant='body1'>
                                    {output.commitment.substring(0, 20) + "..." + output.commitment.substring(46)}
                                    <IconButton onClick={() => { clipboard.writeText(output.commitment) }} style={{ padding: '5px' }}>
                                        <CopyIcon fontSize='small' />
                                    </IconButton>
                                </Typography>
                            </Tooltip>
                        </Grid>
                        <Grid item xs={3}>
                            <Typography variant='body1' align="right">
                                {GrinUtil.FormatAmount(output.amount)}
                            </Typography>
                        </Grid>
                        <Grid item xs={2}>
                            <Typography variant='body1' align="right">
                                {output.status}
                            </Typography>
                        </Grid>
                    </Grid>
                    <Divider variant="fullWidth" />
                </React.Fragment>
            );
        })

        return (
            <React.Fragment>
                <SideMenu pageName='Outputs' />
                <br />
                <Grid container spacing={8} style={{ maxHeight: 'calc(100vh - 120px)', overflow: 'auto' }} className={classes.root}>
                    <Grid item xs={2} />
                    <Grid item xs={4} style={{ paddingBottom: '0px' }}>
                        <Typography variant='h5'>Outputs
                            <Button onClick={(event) => { this.setState({ showCanceled: !this.state.showCanceled }); }} style={{ marginBottom: '7px' }}>
                                ({this.state.showCanceled ? 'Hide' : 'Show'} Canceled)
                            </Button>
                            <Button onClick={(event) => { this.setState({ showSpent: !this.state.showSpent }); }} style={{ marginBottom: '7px' }}>
                                ({this.state.showSpent ? 'Hide' : 'Show'} Spent)
                            </Button>
                        </Typography>
                    </Grid>
                    <Grid item xs={4} style={{ paddingBottom: '0px' }}>
                        <div align='right'>
                            <br />
                            <Button onClick={this.updateOutputs} >
                                <RefreshIcon /> Refresh
                            </Button>
                        </div>
                    </Grid>
                    <Grid item xs={2}>
                    </Grid>
                    <Grid item xs={2} />
                    <Grid item xs={8} style={{ paddingTop: '0px' }}>
                        <Divider variant="fullWidth" />
                        {outputRows}
                    </Grid>
                    <Grid item xs={2}>
                    </Grid>
                </Grid>
            </React.Fragment>
        );
    }
}

Outputs.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Outputs);
