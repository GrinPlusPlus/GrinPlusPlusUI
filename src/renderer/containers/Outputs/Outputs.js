import React from "react";
import PropTypes from 'prop-types';
import {
    Button, Divider, Grid, Tooltip, Typography, IconButton,
    Table, TableBody, TableCell, TableHead, TableRow, TableSortLabel, Toolbar
} from '@material-ui/core';
import { withStyles, lighten, makeStyles } from '@material-ui/core/styles';
import { ipcRenderer, clipboard } from 'electron';
import RefreshIcon from '@material-ui/icons/Refresh';
import CopyIcon from '@material-ui/icons/FileCopy';
import log from 'electron-log';
import GrinUtil from "../../util/GrinUtil.js";

function desc(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function stableSort(array, cmp) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = cmp(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
    return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

const headRows = [
    { id: 'commitment', numeric: false, disablePadding: false, label: 'Commitment' },
    { id: 'amount', numeric: false, disablePadding: false, label: 'Amount' },
    { id: 'status', numeric: true, disablePadding: false, label: 'Status' },
];

function EnhancedTableHead(props) {
    const { order, orderBy, rowCount, onRequestSort } = props;
    const createSortHandler = property => event => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {headRows.map(row => (
                    <TableCell
                        key={row.id}
                        align={row.numeric ? 'right' : 'left'}
                        padding={row.disablePadding ? 'none' : 'default'}
                        sortDirection={orderBy === row.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === row.id}
                            direction={order}
                            onClick={createSortHandler(row.id)}
                        >
                            {row.label}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    onRequestSort: PropTypes.func.isRequired,
    order: PropTypes.string.isRequired,
    orderBy: PropTypes.string.isRequired,
};

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

        return (
            <React.Fragment>
                <br />
                <Grid container spacing={1} style={{ maxHeight: 'calc(100vh - 120px)', overflow: 'auto' }} className={classes.root}>
                    <Grid item xs={2} />
                    <Grid item xs={8}>
                        <EnhancedTableToolbar />
                        <div className={classes.tableWrapper}>
                            <Table
                                className={classes.table}
                                aria-labelledby="tableTitle"
                                size='medium'
                            >
                                <EnhancedTableHead
                                    order={this.state.order}
                                    orderBy={this.state.orderBy}
                                    onRequestSort={this.handleRequestSort}
                                    rowCount={this.state.outputs.length}
                                />
                                <TableBody>
                                    {stableSort(this.state.outputs, getSorting(this.state.order, this.state.orderBy))
                                        .map((output, index) => {
                                            const labelId = `enhanced-table-checkbox-${index}`;

                                            return (
                                                <TableRow
                                                    hover
                                                    onClick={event => handleClick(event, output.commitment)}
                                                    role='hover'
                                                    tabIndex={-1}
                                                    key={output.commitment}
                                                >
                                                    <TableCell component="th" id={labelId} scope="row" padding="none">
                                                        {output.commitment.substring(0, 20) + "..." + output.commitment.substring(46)}
                                                        <IconButton onClick={() => { clipboard.writeText(output.commitment) }} style={{ padding: '5px' }}>
                                                            <CopyIcon fontSize='small' />
                                                        </IconButton>
                                                    </TableCell>
                                                    <TableCell>{GrinUtil.FormatAmount(output.amount)}</TableCell>
                                                    <TableCell align="right">{output.status}</TableCell>
                                                </TableRow>
                                            );
                                        })}
                                </TableBody>
                            </Table>
                        </div>
                    </Grid>
                    <Grid item xs={2} />
                </Grid>
            </React.Fragment>
        );
    }
}

Outputs.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Outputs);
