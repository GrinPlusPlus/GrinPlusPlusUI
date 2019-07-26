import React from 'react';
import PropTypes from 'prop-types';
import { Avatar, Button, Paper, Typography, Grid } from '@material-ui/core';
import withStyles from '@material-ui/core/styles/withStyles';
import { Redirect, withRouter } from 'react-router-dom';
import { ipcRenderer } from 'electron';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import WalletWords from './WalletWords';

const styles = theme => ({
    main: {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '90%'
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.primary.main,
    },
    paper: {
        marginTop: theme.spacing(10),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: `${theme.spacing(2)}px ${theme.spacing(3)}px ${theme.spacing(3)}px`,
        height: '350px'
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        marginTop: theme.spacing(3),
    },
});

class Restore extends React.Component {
    constructor() {
        super();

        this.state = {
            registered: false,
            errorMessage: "",
            username: "",
            password: "",
            confirmPassword: "",
            walletWords: "",
            users: []
        };

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        ipcRenderer.removeAllListeners("GetAccounts::Response");
        ipcRenderer.on("GetAccounts::Response", (event, statusCode, allUsers) => {
            if (statusCode == 200 && allUsers != null) {
                this.setState({
                    users: allUsers
                });
            }
        });

        ipcRenderer.send("GetAccounts");
    }

    handleSubmit(event) {
        event.preventDefault();
        const response = ipcRenderer.sendSync('RestoreFromSeed', this.state.username, this.state.password, this.state.walletWords);

        var status_code = 0;
        if (response != null) {
            status_code = response.status_code;
        }

        if (status_code == 200) {
            sessionStorage["username"] = this.state.username.toUpperCase();
            this.setState({
                registered: true
            });
            return;
        } else if (status_code == 400) {
            // TODO: Send message to WalletWords component
            this.setState({
                errorMessage: "Invalid wallet words entered. Please make sure all words are correct and in order."
            });
        } else {
            this.setState({
                errorMessage: "Failed to create user account. Account may already exist."
            });
        }
    }

    render() {
        const { classes } = this.props;

        const validated = this.state.walletWords.length > 0
            && this.state.username.length > 0
            && !this.state.users.includes(this.state.username.toLowerCase())
            && this.state.password.length > 0
            && this.state.password == this.state.confirmPassword;

        if (this.state.registered === true) {
            ipcRenderer.send('UpdateWallet', true); // TODO: Show restore progress window?
            return (<Redirect to='/wallet' />);
        }

        ValidatorForm.addValidationRule('isPasswordMatch', (value) => {
            if (value !== this.state.password) {
                return false;
            }

            return true;
        });

        ValidatorForm.addValidationRule('userExists', (value) => {
            if (this.state.users.includes(value.toLowerCase())) {
                return false;
            }

            return true;
        });

        function displayError(error) {
            if (error.length > 0) {
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
                    <div style={{ width: '100%' }}>
                        <center>
                            <Grid container spacing={1} style={{ width: '1074px' }}>
                                <Grid item xs={4}>
                                    <Paper className={classes.paper}>
                                        <Avatar src="https://avatars0.githubusercontent.com/u/45742329?s=400&u=57afc7119c701f3aeb526d6992376bee7aa60dd6&v=4" className={classes.avatar} />
                                        <ValidatorForm
                                            className={classes.form}
                                            onSubmit={this.handleSubmit}
                                        >
                                            <TextValidator
                                                label="Username"
                                                onChange={e => { this.setState({ username: e.target.value }) }}
                                                name="username"
                                                validators={['userExists', 'required']}
                                                errorMessages={['user already exists', 'this field is required']}
                                                value={this.state.username}
                                                margin="normal"
                                                autoFocus
                                                fullWidth
                                            />
                                            <TextValidator
                                                label="Password"
                                                onChange={e => { this.setState({ password: e.target.value }) }}
                                                name="password"
                                                type="password"
                                                validators={['required']}
                                                errorMessages={['this field is required']}
                                                value={this.state.password}
                                                margin="normal"
                                                fullWidth
                                            />
                                            <br />
                                            <TextValidator
                                                label="Repeat password"
                                                onChange={e => { this.setState({ confirmPassword: e.target.value }) }}
                                                name="repeatPassword"
                                                type="password"
                                                validators={['isPasswordMatch', 'required']}
                                                errorMessages={['password mismatch', 'this field is required']}
                                                value={this.state.confirmPassword}
                                                margin="normal"
                                                fullWidth
                                            />
                                            <br />
                                            <Button type="submit"
                                                fullWidth
                                                variant="contained"
                                                color="primary"
                                                className={classes.submit}
                                                disabled={!validated}
                                            >
                                                Restore Account
                                            </Button>
                                        </ValidatorForm>
                                    </Paper>
                                </Grid>
                                <Grid item xs={8}>
                                    <Paper className={classes.paper}>
                                        <WalletWords error={this.state.errorMessage} updateParent={(words) => { this.setState({ walletWords: words }) }} />
                                    </Paper>
                                </Grid>
                            </Grid>
                        </center>
                    </div>
                </main>
            </React.Fragment>
        );
    }
}

Restore.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Restore);
