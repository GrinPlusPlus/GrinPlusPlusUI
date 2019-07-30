import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import { Redirect, withRouter } from 'react-router-dom';
import { ipcRenderer } from 'electron';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = theme => ({
    main: {
        width: 'auto',
        display: 'block', // Fix IE 11 issue.
        marginLeft: theme.spacing(3),
        marginRight: theme.spacing(3),
        [theme.breakpoints.up(400 + theme.spacing(6))]: {
            width: 400,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    paper: {
        marginTop: theme.spacing(18),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: `${theme.spacing(2)}px ${theme.spacing(3)}px ${theme.spacing(3)}px`,
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.primary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        marginTop: theme.spacing(3),
    },
    buttonProgress: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
});

function Login(props) {
    const { classes } = props;
    const [submitting, setSubmitting] = React.useState(false);
    const [loggedIn, setLoggedIn] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [password, setPassword] = React.useState("");

    function handleSubmit(event) {
        event.preventDefault();

        ipcRenderer.removeAllListeners('Login::Response');
        ipcRenderer.on('Login::Response', (event, status) => {
            if (status == 200) {
                sessionStorage["username"] = window.global.loginUser.toUpperCase();
                setLoggedIn(true);
            } else {
                setSubmitting(false);
                setError("Failed to login. Username and/or password is wrong.");
            }
        });

        ipcRenderer.send('Login', window.global.loginUser, password);
        setSubmitting(true);
        setError(null);
    }

    if (loggedIn === true) {
        return (<Redirect to='/wallet' />);
    }

    function changePassword(e) {
        setPassword(e.target.value);
    }

    function displayError() {
        if (error != null) {
            return (
                <Typography variant="caption" color='error'>
                    <b>
                        {error}
                    </b>
                </Typography>
            );
        } else {
            return "";
        }
    }

    return (
        <React.Fragment>
            <main className={classes.main}>
                <CssBaseline />
                <Paper className={classes.paper}>
                    <Avatar src="https://avatars0.githubusercontent.com/u/45742329?s=400&u=57afc7119c701f3aeb526d6992376bee7aa60dd6&v=4" className={classes.avatar} />
                    {displayError()}
                    {submitting && <CircularProgress size={24} className={classes.buttonProgress} />}
                    <form className={classes.form} onSubmit={handleSubmit}>
                        <FormControl margin="normal" required fullWidth>
                            <InputLabel htmlFor="password">Password</InputLabel>
                            <Input name="password" type="password" id="password" value={password} onChange={changePassword} autoFocus />
                        </FormControl>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            disabled={submitting || password.length == 0}
                            className={classes.submit}
                        >
                            Sign in
                        </Button>
                    </form>
                </Paper>
            </main>
        </React.Fragment>
    );
}

Login.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Login);
