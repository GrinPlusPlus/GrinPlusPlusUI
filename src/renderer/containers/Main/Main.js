import React from "react";
import PropTypes from 'prop-types';
import { Button, CssBaseline, Grid, Paper } from '@material-ui/core/';
import { Redirect, withRouter } from 'react-router-dom';
import withStyles from '@material-ui/core/styles/withStyles';
import SideMenu from "../../components/SideMenu";
import UserAvatar from "../../components/UserMenu/ImageAvatar";
import { ipcRenderer } from "electron";
const path = require('path');

const styles = theme => ({
  main: {
    width: 'auto',
    [theme.breakpoints.up(400)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },
});

class Main extends React.Component {
    constructor() {
        super();

        this.state = {
            login: false,
            create: false,
            restore: false,
            users: []
        };
    }

    componentDidMount() {
        ipcRenderer.removeAllListeners("GetAccounts::Response");
        ipcRenderer.on("GetAccounts::Response", (event, statusCode, allUsers) => {
            if (statusCode == 200) {
                this.setState({
                    users: allUsers
                });
            }
        })

        ipcRenderer.send("GetAccounts");
    }

    render() {
        const { classes, dark_mode } = this.props;

        function loginClicked(event) {
            event.preventDefault();
            this.setState({
                login: true
            });
        }

        function createClicked(event) {
            event.preventDefault();
            this.setState({
                create: true
            });
        }

        function restoreClicked(event) {
            event.preventDefault();
            this.setState({
                restore: true
            });
        }

        if (this.state.login === true) {
            return (<Redirect to='/login' />);
        }

        if (this.state.create === true) {
            return (<Redirect to='/register' />);
        }

        if (this.state.restore === true) {
            return (<Redirect to='/restore' />);
        }

        return (
            <React.Fragment>
                <SideMenu open={true} noMenu />
                <div className={classes.main}>
                    <Grid container
                        spacing={0}
                        direction="column"
                        alignItems="center"
                        justify="center"
                        style={{ minHeight: '90vh' }}>

                        <img src={path.join(__dirname, './static/img/GrinBanner.png')} style={{ width: '450px' }} />

                        <br /><br /><br />
                        <Button type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                            onClick={loginClicked.bind(this)}
                            autoFocus>
                            Open Wallet
                        </Button>
                        <Button onClick={createClicked.bind(this)}
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}>
                            Create New Wallet
                        </Button>
                        <Button onClick={restoreClicked.bind(this)}
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}>
                            Restore Wallet
                        </Button>
                    </Grid><br />
                </div>

                {/*<div style={{ overflow: 'auto', maxHeight: 'calc(100vh - 200px)' }}>
                    <Grid container
                        spacing={2}
                        alignItems="center"
                        justify="center"
                        style={{ width: '100%', padding: '10px' }}
                    >
                        {
                            this.state.users.map((user, index) => (
                                <Grid item id={index} xs={3}>
                                    <Paper fullWidth style={{ backgroundColor: '#000000' }}>
                                        <center><UserAvatar /></center><br />
                                        {user}
                                    </Paper>
                                </Grid>
                            ))
                        }
                    </Grid>
                </div>*/}
                
                
            </React.Fragment>
        );
    }
}

Main.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Main);
