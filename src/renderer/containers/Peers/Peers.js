import React from "react";
import PropTypes from 'prop-types';
import { Grid, Typography, TableCell, TableRow, Toolbar, IconButton } from '@material-ui/core';
import { lighten, makeStyles, withStyles } from '@material-ui/core/styles';
import {ipcRenderer} from 'electron';
import RefreshIcon from '@material-ui/icons/Refresh';
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
    },
});

function Peers(props) {
    const [refreshPeers, setRefreshPeers] = React.useState(false);

    const EnhancedTableToolbar = props => {
        const classes = useToolbarStyles();

        return (
            <Toolbar className={classes.root}>
                <div className={classes.title}>
                    <Typography variant="h5" id="tableTitle">
                        Connected Peers
                        <IconButton onClick={function () { setRefreshPeers(!refreshPeers) }}>
                            <RefreshIcon />
                        </IconButton>
                    </Typography>
                </div>
            </Toolbar>
        );
    };

    function handleClick(event, name) {
    }

    const { classes } = props;

    var peers = ipcRenderer.sendSync('GetConnectedPeers').peers;

    const columns = [
        { id: 'addr', numeric: false, disablePadding: false, label: 'Address' },
        { id: 'user_agent', numeric: false, disablePadding: false, label: 'User Agent' },
        { id: 'direction', numeric: true, disablePadding: false, label: 'Direction' },
    ];

    function buildRow(row, index) {
        return (
            <TableRow
                hover
                onClick={event => handleClick(event, row.name)}
                role='hover'
                tabIndex={-1}
                key={row.addr}
            >
                <TableCell padding="none">
                    {row.addr}
                </TableCell>
                <TableCell>{row.user_agent}</TableCell>
                <TableCell align="right">{row.direction}</TableCell>
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
                        items={peers}
                        buildRow={buildRow}
                        dense={true}
                    />
                </Grid>
                <Grid item xs={2} />
            </Grid>
            <br />
        </div>
    );
}

Peers.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Peers);
