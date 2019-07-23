import React from 'react';
import PropTypes from 'prop-types';
//import { fade, makeStyles, withStyles } from '@material-ui/core/styles';

import { lighten, makeStyles } from '@material-ui/core/styles';
import { TableCell, TableHead, TableRow, TableSortLabel } from '@material-ui/core';

function CustomTableHeader(props) {
    const { columns, order, orderBy, onRequestSort } = props;
    const createSortHandler = property => event => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {columns.map(column => (
                    <TableCell
                        key={column.id}
                        align={column.numeric ? 'right' : 'left'}
                        padding={column.disablePadding ? 'none' : 'default'}
                        sortDirection={orderBy === column.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === column.id}
                            direction={order}
                            onClick={createSortHandler(column.id)}
                        >
                            {column.label}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

CustomTableHeader.propTypes = {
    columns: PropTypes.array.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    order: PropTypes.string.isRequired,
    orderBy: PropTypes.string.isRequired
};

/*const CustomTableHeader = (props) => {
    const classes = useStylesReddit();
    return <TextField InputProps={{ classes, disableUnderline: true }} {...props} />;
}*/

export default CustomTableHeader;
