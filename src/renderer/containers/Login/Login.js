import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import BackArrowIcon from '@material-ui/icons/ArrowBack';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import { Redirect, withRouter } from 'react-router-dom';
import {ipcRenderer} from 'electron';
import ButtonAppNav from "../ButtonAppNav";
import StatusBar from '../StatusBar';

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
    marginTop: theme.spacing.unit * 18,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.primary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing.unit,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },
});

function Login(props) {
  const { classes } = props;
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [failure, setFailure] = React.useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.target);
    const statusCode = ipcRenderer.sendSync('Login', data.get('username'), data.get('password'));
    if (statusCode == 200) {
      sessionStorage["username"] = data.get('username').toUpperCase();
      setLoggedIn(true);
    } else {
      setFailure(true);
    }
  }

  if (loggedIn === true) {
    return (<Redirect to='/home'/>);
  }

  function handleErrorClose(event) {
    event.preventDefault();
    setFailure(false);
  }

  return (
    <React.Fragment>
      <ButtonAppNav noMenu includeBack />
      <main className={classes.main}>
        <CssBaseline />

        {/* Error Dialog */}
        <Dialog
          open={failure}
          onClose={handleErrorClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"ERROR"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Failed to login. Username and/or password is wrong.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleErrorClose} color="primary" autoFocus>
              Try Again
            </Button>
          </DialogActions>
        </Dialog>

        <Paper className={classes.paper}>
          <Avatar src="https://avatars0.githubusercontent.com/u/45742329?s=400&u=57afc7119c701f3aeb526d6992376bee7aa60dd6&v=4" className={classes.avatar} />
          <form className={classes.form} onSubmit={handleSubmit}>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="username">Username</InputLabel>
              <Input id="username" name="username" autoComplete="username" autoFocus />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="password">Password</InputLabel>
              <Input name="password" type="password" id="password" autoComplete="current-password" />
            </FormControl>
            {/*
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              >
              Sign in
            </Button>
          </form>
        </Paper>
      </main>
      <StatusBar/>
    </React.Fragment>
  );
}

Login.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Login);
