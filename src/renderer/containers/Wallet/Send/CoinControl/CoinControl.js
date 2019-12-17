import React from "react";
import PropTypes from 'prop-types';
import { Checkbox, Typography, TableCell, TableRow } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import CustomTable from '../../../../components/CustomTable';
import GrinUtil from "../../../../util/GrinUtil";

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    gray: {
        opacity: .5
    }
});

function CoinControl(props) {
    const { classes, inputs, selected, onSelectInput } = props;

    if (inputs == null) {
        return "";
    }

    const columns = [
        { id: 'checkbox', numeric: false, disablePadding: true, label: 'Spend' },
        { id: 'block_height', numeric: false, disablePadding: true, label: 'Block Height' },
        { id: 'commitment', numeric: false, disablePadding: true, label: 'Commitment' },
        { id: 'label', numeric: false, disablePadding: true, label: 'Label' },
        { id: 'amount', numeric: true, disablePadding: false, label: 'Amount' },
    ];

    function buildRow(row, index) {
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
                    <Typography variant='body1' display='inline' style={{ fontSize: '13px' }}>
                        {row.block_height}
                    </Typography>
                </TableCell>
                <TableCell component="th" scope="row" padding="none">
                    <Typography variant='body1' display='inline' style={{ fontSize: '13px' }}>
                        {row.commitment.substr(0, 10) + "..." + row.commitment.substr(56)}
                    </Typography>
                </TableCell>
                <TableCell component="th" scope="row" padding="none">
                    <Typography variant='body1' style={{ fontSize: '13px' }}>
                        {row.label}
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
            <br />
            <CustomTable
                columns={columns}
                items={inputs}
                buildRow={buildRow}
                dense={true}
            />
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
