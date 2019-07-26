import React from "react";
import PropTypes from 'prop-types';
import { Button, CircularProgress, Fab, Grid, Paper, Popper, Grow, ClickAwayListener, Menu, MenuList, MenuItem } from '@material-ui/core/';
import { Redirect, withRouter } from 'react-router-dom';
import withStyles from '@material-ui/core/styles/withStyles';
import ImageAvatar from '../../components/UserMenu/ImageAvatar';
import AddIcon from '@material-ui/icons/PersonAdd';
import Avatar from '@material-ui/core/Avatar';
import { ipcRenderer } from "electron";
const path = require('path');

const styles = theme => ({
    main: {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
    },
    userSelection: {
        width: '100%',
        height: '100%',
        maxHeight: '100%',
        overflow: 'auto'
    },
    inner: {
        position: 'fixed',
        top: '50%',
        left: '50%',
        width: '80%',
        transform: 'translate(-50%, -50%)',
    },
    submit: {
        marginTop: theme.spacing(3),
    },
    popover: {
        pointerEvents: 'none',
    },
    paper: {
        padding: theme.spacing(1),
        backgroundColor: '#000000'
    },
});

class Main extends React.Component {
    constructor() {
        super();

        this.state = {
            login: false,
            create: false,
            restore: false,
            users: null,
            openMenu: null
        };

        this.handlePopoverOpen = this.handlePopoverOpen.bind(this);
        this.handlePopoverClose = this.handlePopoverClose.bind(this);
        this.loginClicked = this.loginClicked.bind(this);
        this.createClicked = this.createClicked.bind(this);
        this.restoreClicked = this.restoreClicked.bind(this);
    }

    componentDidMount() {
        ipcRenderer.removeAllListeners("GetAccounts::Response");
        ipcRenderer.on("GetAccounts::Response", (event, statusCode, allUsers) => {
            if (statusCode == 200 && allUsers != null) {
                this.setState({
                    users: allUsers
                });
            } else if (statusCode == 404) {
                setTimeout(ipcRenderer.send("GetAccounts"), 50);
            }
        });

        ipcRenderer.send("GetAccounts");
    }

    handlePopoverOpen(event) {
        this.setState({
            openMenu: event.currentTarget
        });
    }

    handlePopoverClose(event) {
        this.setState({
            openMenu: null
        });
    }
    

    loginClicked(user) {
        window.global.loginUser = user;
        this.setState({
            login: true
        });
    }

    createClicked(event) {
        this.setState({
            create: true
        });
    }

    restoreClicked(event) {
        this.setState({
            restore: true
        });
    }

    render() {
        const { classes, dark_mode } = this.props;

        if (this.state.login === true) {
            return (<Redirect to='/login' />);
        }

        if (this.state.create === true) {
            return (<Redirect to='/register' />);
        }

        if (this.state.restore === true) {
            return (<Redirect to='/restore' />);
        }

        function getAccountsDisplay(component) {
            if (component.state.users === null) {
                return (
                    <CircularProgress size={24} />
                );
            }

            return (
                <Grid container
                    spacing={2}
                    alignItems="center"
                    justify="center"
                    style={{ width: '100%', padding: '10px' }}
                >
                    <ClickAwayListener onClickAway={component.handlePopoverClose}>
                        <Grid item id='addNew' xs={3}>
                            <Button
                                fullWidth
                                ref={component.anchorRef}
                                variant="contained"
                                color="primary"
                                style={{ margin: '5px', height: '120px', padding: '10px' }}
                                onClick={component.handlePopoverOpen}
                            >
                                <center>
                                    <AddIcon fontSize='large' style={{ paddingTop: '7px', paddingBottom: '13px' }} />
                                    <br />
                                    <b>Add</b>
                                </center>
                            </Button>

                            <Menu open={component.state.openMenu != null} anchorEl={component.state.openMenu} color='secondary'>
                                <MenuItem onClick={component.createClicked}>CreateNewWallet</MenuItem>
                                <MenuItem onClick={component.restoreClicked}>Restore Wallet</MenuItem>
                            </Menu>
                        </Grid>
                    </ClickAwayListener>
                    {
                        component.state.users.map((user, index) => (
                            <Grid item key={index} xs={3}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    onClick={() => { component.loginClicked(user) }}
                                    style={{ margin: '5px', height: '120px', padding: '10px' }}
                                >
                                    <center>
                                        <Avatar src="https://avatars0.githubusercontent.com/u/45742329?s=400&u=57afc7119c701f3aeb526d6992376bee7aa60dd6&v=4" />
                                        <br />{/* TODO: Ship this icon to avoid github call*/}
                                        <b>{user}</b>
                                    </center>
                                </Button>
                            </Grid>
                        ))
                    }
                </Grid>
            );
        }

        return (
            <React.Fragment>
                <div className={classes.userSelection}>
                    <center>
                        <div className={classes.inner}>
                            <img src={path.join(__dirname, './static/img/GrinBanner.png')} style={{ width: '450px' }} />
                            <br /><br /><br />

                            <div style={{ width: '80%' }}>
                                {getAccountsDisplay(this)}
                            </div>
                        </div>
                    </center>
                </div>               
                
            </React.Fragment>
        );
    }
}

Main.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Main);
