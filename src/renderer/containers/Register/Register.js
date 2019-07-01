import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
import { Redirect, withRouter } from 'react-router-dom';
import { ipcRenderer } from 'electron';
import SideMenu from "../../components/SideMenu";
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import WalletWords from "./WalletWords"

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
        marginTop: theme.spacing.unit * 20,
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
});

function Register(props) {
    const { classes } = props;
    const [registered, setRegistered] = React.useState(false);
    const [walletSeed, setWalletSeed] = React.useState(null);
    const [showWalletSeed, setShowWalletSeed] = React.useState(false);
    const [failure, setFailure] = React.useState(false);
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");

    function handleSubmit(event) {
        event.preventDefault();
        const response = ipcRenderer.sendSync('CreateWallet', username, password);
        if (response != null && response["status_code"] == 200) {
            sessionStorage["username"] = username.toUpperCase();
            setWalletSeed(response["wallet_seed"]);
            setShowWalletSeed(true);
        } else {
            setFailure(true);
        }
    }

    if (registered === true) {
        return (<Redirect to='/wallet' />);
    }

    function handleWalletSeedClose() {
        setRegistered(true);
    }

    function handleErrorClose(event) {
        event.preventDefault();
        setFailure(false);
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

    return (
        <React.Fragment>
            <SideMenu noMenu includeBack />
            <main className={classes.main}>
                <CssBaseline />

                <WalletWords showModal={showWalletSeed} onClose={handleWalletSeedClose} walletSeed={walletSeed} />

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
                            Failed to create user account. Account may already exist.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleErrorClose} variant="contained" color="primary" autoFocus>
                            Try Again
                        </Button>
                    </DialogActions>
                </Dialog>

                <Paper className={classes.paper}>
                    <Avatar src="https://avatars0.githubusercontent.com/u/45742329?s=400&u=57afc7119c701f3aeb526d6992376bee7aa60dd6&v=4" className={classes.avatar} />

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
