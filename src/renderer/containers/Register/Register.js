import React from 'react';
import PropTypes from 'prop-types';
import { Avatar, Button, Paper, CircularProgress, Typography } from '@material-ui/core';
import withStyles from '@material-ui/core/styles/withStyles';
import { Redirect, withRouter } from 'react-router-dom';
import { ipcRenderer } from 'electron';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import WalletWords from "./WalletWords";
import log from 'electron-log';

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
        marginTop: theme.spacing(20),
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
    warning: {
        display: 'inline',
        backgroundColor: 'red',
        color: 'white',
        padding: '4px 8px',
        borderRadius: '4px',
        fontWeight: 700,
        fontSize: '13px',
        marginRight: '4px',
    },
    buttonProgress: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
});

function Register(props) {
    const { classes } = props;
    const [registered, setRegistered] = React.useState(false);
    const [walletSeed, setWalletSeed] = React.useState(null);
    const [showWalletSeed, setShowWalletSeed] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");
    const [submitting, setSubmitting] = React.useState(false);

    function handleSubmit(event) {
        event.preventDefault();

        ipcRenderer.removeAllListeners('CreateWallet::Response');
        ipcRenderer.on('CreateWallet::Response', (event, response) => {
            setSubmitting(false);
            if (response != null && response["status_code"] == 200) {
                log.silly(response);
                sessionStorage["username"] = username.toUpperCase();
                setWalletSeed(response.wallet_seed);
                setShowWalletSeed(true);
            } else {
                setError("Failed to create user account. Account may already exist.");
            }
        });

        ipcRenderer.send('CreateWallet', username, password);
        setSubmitting(true);
        setError(null);
    }

    if (registered === true) {
        return (<Redirect to='/wallet' />);
    }

    function handleWalletSeedClose() {
        setRegistered(true);
    }

    function changeUsername(e) {
        setUsername(e.target.value);
    }

    function changePassword(e) {
        setPassword(e.target.value);
    }

    function changeConfirmPassword(e) {
        setConfirmPassword(e.target.value);
    }

    ValidatorForm.addValidationRule('isPasswordMatch', (value) => {
        if (value !== password) {
            return false;
        }
        return true;
    });

    function displayError() {
        if (error != null) {
            return (
                <Typography variant="caption" color='error'>
                    {error}
                </Typography>
            );
        } else {
            return "";
        }
    }

    return (
        <React.Fragment>
            <main className={classes.main}>
                <WalletWords showModal={showWalletSeed} onClose={handleWalletSeedClose} walletSeed={walletSeed} />
                <Paper className={classes.paper}>
                    <Avatar src="https://avatars0.githubusercontent.com/u/45742329?s=400&u=57afc7119c701f3aeb526d6992376bee7aa60dd6&v=4" className={classes.avatar} />

                    {displayError()}
                    {submitting && <CircularProgress size={24} className={classes.buttonProgress} />}
                    <ValidatorForm
                        className={classes.form}
                        onSubmit={handleSubmit}
                    >
                        <TextValidator
                            label="Username"
                            onChange={changeUsername}
                            name="username"
                            validators={['required']}
                            errorMessages={['this field is required']}
                            value={username}
                            autoFocus
                            fullWidth
                        />
                        <TextValidator
                            label="Password"
                            onChange={changePassword}
                            name="password"
                            type="password"
                            validators={['required']}
                            errorMessages={['this field is required']}
                            value={password}
                            fullWidth
                        />
                        <br />
                        <TextValidator
                            label="Repeat password"
                            onChange={changeConfirmPassword}
                            name="repeatPassword"
                            type="password"
                            validators={['isPasswordMatch', 'required']}
                            errorMessages={['password mismatch', 'this field is required']}
                            value={confirmPassword}
                            fullWidth
                        />
                        <br />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={submitting}
                            color="primary"
                            className={classes.submit}
                        >
                            Create Account
                        </Button>
                    </ValidatorForm>
                </Paper>
            </main>
        </React.Fragment>
    );
}


Register.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Register);
