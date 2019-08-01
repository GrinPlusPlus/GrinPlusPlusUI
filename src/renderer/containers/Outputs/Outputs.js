import React from "react";
import PropTypes from 'prop-types';
import {
    Button, Divider, Grid, Tooltip, Typography,
    IconButton, TableCell, TableRow, Toolbar
} from '@material-ui/core';
import { withStyles, lighten, makeStyles } from '@material-ui/core/styles';
import { ipcRenderer, clipboard } from 'electron';
import RefreshIcon from '@material-ui/icons/Refresh';
import CopyIcon from '@material-ui/icons/FileCopy';
import log from 'electron-log';
import GrinUtil from "../../util/GrinUtil.js";
import CustomTable from '../../components/CustomTable';

const useToolbarStyles = makeStyles(theme => ({
    root: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(1),
    },
    highlight:
        theme.palette.type === 'light'
            ? {
                color: theme.palette.secondary.main,
                backgroundColor: lighten(theme.palette.secondary.light, 0.85),
            }
            : {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.secondary.dark,
            },
    spacer: {
        flex: '1 1 100%',
    },
    actions: {
        color: theme.palette.text.secondary,
    },
    title: {
        flex: '0 0 auto',
    },
}));

const styles = theme => ({
    root: {
        flexGrow: 1,
    }
});

class Outputs extends React.Component {
    constructor() {
        super();
        this.state = {
            outputs: [],
            showSpent: false,
            showCanceled: false,
            order: 'asc',
            orderBy: 'commitment'
        };

        this.onOutputsResponse = this.onOutputsResponse.bind(this);
        this.updateOutputs = this.updateOutputs.bind(this);
        this.handleRequestSort = this.handleRequestSort.bind(this);
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
    
    handleRequestSort(event, property) {
        const isDesc = this.state.orderBy === property && this.state.order === 'desc';

        this.setState({
            order: isDesc ? 'asc' : 'desc',
            orderBy: property
        });
    }

    render() {
        const { classes } = this.props;

        const columns = [
            { id: 'commitment', numeric: false, disablePadding: true, label: 'Commitment' },
            { id: 'message', numeric: false, disablePadding: false, label: 'Message' },
            { id: 'amount', numeric: false, disablePadding: false, label: 'Amount' },
            { id: 'status', numeric: true, disablePadding: false, label: 'Status' },
        ];

        const EnhancedTableToolbar = props => {
            const classes = useToolbarStyles();

            return (
                <Toolbar className={classes.root}>
                    <div className={classes.title}>
                        <Typography variant="h5" display='inline' id="tableTitle">
                            Outputs
                            <Button onClick={(event) => { this.setState({ showCanceled: !this.state.showCanceled }); }} style={{ marginBottom: '7px' }}>
                                ({this.state.showCanceled ? 'Hide' : 'Show'} Canceled)
                            </Button>
                            <Button onClick={(event) => { this.setState({ showSpent: !this.state.showSpent }); }} style={{ marginBottom: '7px' }}>
                                ({this.state.showSpent ? 'Hide' : 'Show'} Spent)
                            </Button>
                        </Typography>
                        <Button onClick={this.updateOutputs} >
                            <RefreshIcon /> Refresh
                        </Button>
                    </div>
                </Toolbar>
            );
        };

        function handleClick(commitment) {
            // TODO: Show output info dialog
        }

        function buildRow(output, index) {
            return (
                <TableRow
                    hover
                    onClick={event => handleClick(output.commitment)}
                    role='hover'
                    tabIndex={-1}
                    key={output.commitment}
                >
                    <TableCell scope="row" padding="none">
                        {output.commitment.substring(0, 20) + "..." + output.commitment.substring(46)}
                        <IconButton onClick={() => { clipboard.writeText(output.commitment) }} style={{ padding: '5px' }}>
                            <CopyIcon fontSize='small' />
                        </IconButton>
                    </TableCell>
                    <TableCell>{output.message != null ? output.message : ""}</TableCell>
                    <TableCell>{GrinUtil.FormatAmount(output.amount)}</TableCell>
                    <TableCell align="right">{output.status}</TableCell>
                </TableRow>
            );
        }

        return (
            <div style={{ height: '100%', overflow: 'auto' }}>
                <br />
                <Grid container spacing={0} className={classes.root}>
                    <Grid item xs={2} />
                    <Grid item xs={8}>
                        <EnhancedTableToolbar />
                        <CustomTable
                            columns={columns}
                            items={this.state.outputs}
                            buildRow={buildRow}
                            dense={true}
                        />
                    </Grid>
                    <Grid item xs={2} />
                </Grid>
            </div>
        );
    }
}

Outputs.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Outputs);
