import React from "react";
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { Redirect, withRouter } from 'react-router-dom';
import withStyles from '@material-ui/core/styles/withStyles';
import ButtonAppNav from "../ButtonAppNav";
const path = require('path');

const styles = theme => ({
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },
});

function Start(props) {
    const { classes } = props;
    const { dark_mode } = props;
    const [login, setLogin] = React.useState(false);
    const [create, setCreate] = React.useState(false);
    const [restore, setRestore] = React.useState(false);

    function loginClicked(event) {
      event.preventDefault();
      setLogin(true);
    }

    function createClicked(event) {
      event.preventDefault();
      setCreate(true);
    }

    function restoreClicked(event) {
      event.preventDefault();
      setRestore(true);
    }

    if (login === true) {
      return (<Redirect to='/login'/>);
    }

    if (create === true) {
      return (<Redirect to='/register'/>);
    }

    if (restore === true) {
      return (<Redirect to='/restore'/>);
    }

    return (
      <React.Fragment>
        <ButtonAppNav noMenu />
        <main className={classes.main}>
          <CssBaseline />
          <Grid container
                spacing={0}
                direction="column"
                alignItems="center"
                justify="center"
                style={{ minHeight: '90vh' }}>
            <img src={path.join(__dirname, '../../../static/img/GrinBanner.png')}/>
            <br/><br/><br/>
            <Button type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                    onClick={loginClicked}
                    autoFocus>
                Open Wallet
            </Button>
            <Button onClick={createClicked}
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}>
                Create New Wallet
            </Button>
            <Button onClick={restoreClicked}
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}>
                Restore Wallet
            </Button>
          </Grid>
        </main>
      </React.Fragment>
    );
}

Start.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Start);
