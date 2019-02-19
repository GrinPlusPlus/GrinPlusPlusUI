import React from 'react';
import Button from '@material-ui/core/Button';
import ImageAvatar from './ImageAvatar';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from "@material-ui/core/styles";

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

function UserMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);

  function handleClick(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  return (
    <div>
      <Button
        aria-owns={anchorEl ? 'user-menu' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <ImageAvatar />
      </Button>
      <Menu id="user-menu" anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>My account</MenuItem>
        <MenuItem onClick={handleClose}>Logout</MenuItem>
      </Menu>
    </div>
  );
}

export default withStyles(styles)(UserMenu);