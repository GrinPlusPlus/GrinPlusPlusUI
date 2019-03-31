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
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import { Redirect, withRouter } from 'react-router-dom';
import { ipcRenderer } from 'electron';
import ButtonAppNav from "../ButtonAppNav";

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
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");

    function handleSubmit(event) {
        const statusCode = ipcRenderer.sendSync('Login', username, password);
        if (statusCode == 200) {
            sessionStorage["username"] = username.toUpperCase();
            setLoggedIn(true);
        } else {
            setFailure(true);
        }
    }

    if (loggedIn === true) {
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
                    <DialogTitle id="alert-dialog-title" fullWidth alignItems="center">
                        <Typography color="error" variant="h4">
                            {"ERROR"}
                        </Typography>
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            <Typography variant="h6">
                                Failed to login. Username and/or password is wrong.
                            </Typography>
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
                    <form className={classes.form} onSubmit={handleSubmit}>
                        <FormControl margin="normal" required fullWidth>
                            <InputLabel htmlFor="username">Username</InputLabel>
                            <Input id="username" name="username" onChange={changeUsername} autoFocus />
                        </FormControl>
                        <FormControl margin="normal" required fullWidth>
                            <InputLabel htmlFor="password">Password</InputLabel>
                            <Input name="password" type="password" id="password" onChange={changePassword} />
                        </FormControl>
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
        </React.Fragment>
    );
}

Login.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Login);
