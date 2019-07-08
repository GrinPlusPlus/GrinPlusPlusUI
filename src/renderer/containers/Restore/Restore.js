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
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import { Redirect, withRouter } from 'react-router-dom';
import { ipcRenderer } from 'electron';
import SideMenu from "../../components/SideMenu";
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';

const styles = theme => ({
    main: {
        width: 'auto',
        display: 'block', // Fix IE 11 issue.
        marginLeft: theme.spacing.unit * 3,
        marginRight: theme.spacing.unit * 3,
        [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
            width: 500,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    paper: {
        marginTop: theme.spacing.unit * 10,
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

function Restore(props) {
    const { classes } = props;
    const [registered, setRegistered] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");
    const [failure, setFailure] = React.useState(false);
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");
    const [walletWords, setWalletWords] = React.useState("");

    function handleSubmit(event) {
        event.preventDefault();
        const data = new FormData(event.target);
        const response = ipcRenderer.sendSync('RestoreFromSeed', username, password, walletWords);

        var status_code = 0;
        if (response != null) {
            status_code = response.status_code;
        }

        if (status_code == 200) {
            sessionStorage["username"] = username.toUpperCase();
            setUsername(username);
            setRegistered(true);
            return;
        } else if (status_code == 400) {
            setErrorMessage("Invalid wallet words entered. Please make sure all words are correct, and are separated by a single space.");
            setFailure(true);
        } else {
            setErrorMessage("Failed to create user account. Account may already exist.");
            setFailure(true);
        }
    }

    if (registered === true) {
        ipcRenderer.send('UpdateWallet', true);
        return (<Redirect to='/wallet' />);
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

    function changeWalletWords(e) {
        setWalletWords(e.target.value);
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
                            {errorMessage}
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
                            margin="normal"
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
                            margin="normal"
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
                            margin="normal"
                            fullWidth
                        />
                        <br />
                        <br />
                        <Typography color="textSecondary">Wallet Words:</Typography>
                        <TextValidator
                            onChange={changeWalletWords}
                            name="walletWords"
                            multiline={true}
                            rows="3"
                            validators={['required']}
                            errorMessages={['this field is required']}
                            value={walletWords}
                            margin="normal"
                            fullWidth
                        />
                        <Button type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}>
                            Restore Account
                        </Button>
                    </ValidatorForm>
                </Paper>
            </main>
        </React.Fragment>
    );
}

Restore.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Restore);
