import React from "react";
import PropTypes from 'prop-types';
import { Checkbox, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import GrinUtil from "../../../../util/GrinUtil";

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
    { id: 'checkbox', numeric: false, disablePadding: false, label: 'Spend' },
    { id: 'block_height', numeric: false, disablePadding: false, label: 'Block Height' },
    { id: 'commitment', numeric: false, disablePadding: false, label: 'Commitment' },
    { id: 'amount', numeric: true, disablePadding: false, label: 'Amount' },
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
    rowCount: PropTypes.number.isRequired,
};

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
    },
    gray: {
        opacity: .5
    }
});

function CoinControl(props) {
    const { classes, inputs, selected, onSelectInput } = props;
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('block_height');

    function handleRequestSort(event, property) {
        const isDesc = orderBy === property && order === 'desc';
        setOrder(isDesc ? 'asc' : 'desc');
        setOrderBy(property);
    }

    if (inputs == null) {
        return "";
    }

    return (
        <React.Fragment>
            <br />
            <div>
                <Table
                    className={classes.table}
                    aria-labelledby="tableTitle"
                    size={'small'}
                >
                    <EnhancedTableHead
                        order={order}
                        orderBy={orderBy}
                        onRequestSort={handleRequestSort}
                        rowCount={inputs.length}
                    />
                    <TableBody>
                        {stableSort(inputs, getSorting(order, orderBy))
                            .map((row, index) => {
                                const labelId = `enhanced-table-checkbox-${index}`;
                                var className = "";
                                if (!selected.includes(row.commitment)) {
                                    className = classes.gray;
                                }

                                return (
                                    <TableRow
                                        hover
                                        className={className}
                                        onClick={event => onSelectInput(row.commitment)}
                                        role='hover'
                                        tabIndex={-1}
                                        style={{ cursor: 'pointer' }}
                                        key={row.commitment}
                                    >
                                        <TableCell component="th" id={labelId} scope="row" padding="none">
                                            <Checkbox checked={selected.includes(row.commitment)} />
                                        </TableCell>
                                        <TableCell component="th" scope="row" padding="none">
                                            <Typography variant='body1' display='inline'>
                                                {row.block_height}
                                            </Typography>
                                        </TableCell>
                                        <TableCell component="th" scope="row" padding="none">
                                            <Typography variant='body1' display='inline'>
                                                {row.commitment.substr(0, 10) + "..." + row.commitment.substr(56)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell component="th" scope="row" padding="none">
                                            <Typography variant='body1' align="right">
                                                {GrinUtil.FormatAmount(row.amount)}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                    </TableBody>
                </Table>
            </div>
        </React.Fragment>
    );
}

CoinControl.propTypes = {
    classes: PropTypes.object.isRequired,
    inputs: PropTypes.array.isRequired,
    selected: PropTypes.array.isRequired,
    onSelectInput: PropTypes.func.isRequired
};

export default withStyles(styles)(CoinControl);
