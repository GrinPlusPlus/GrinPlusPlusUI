import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Typography from "@material-ui/core/Typography";
import ImageAvatar from './ImageAvatar';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from "@material-ui/core/styles";
import { Redirect } from 'react-router-dom';
import {ipcRenderer} from 'electron';

const styles = {
    root: {
      flexGrow: 1
    },
    grow: {
      flexGrow: 1
    },
    menuButton: {
      marginLeft: -12,
      marginRight: 20
    }
  };

function UserMenu(props) {
  const {classes} = props;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [loggedOut, setLoggedOut] = React.useState(false);

  function handleClick(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  function logout() {
    ipcRenderer.send('Logout');
    setLoggedOut(true);
    setAnchorEl(null);
  }

  if (loggedOut === true) {
    return (<Redirect to='/'/>);
  }

  return (
      <Button
          color="inherit"
          disabled
      >
          <Typography color='textPrimary' display='inline'><b>{sessionStorage.getItem("username")}</b></Typography>
          <ImageAvatar />
      </Button>
  );
}

export default withStyles(styles)(UserMenu);
