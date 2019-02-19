import React from "react";
import PropTypes from "prop-types";
import { Link, withRouter } from 'react-router-dom';
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import SettingsModal from "../../components/Settings";
import UserMenu from "../../components/UserMenu";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MenuOptions from '../../components/MenuOptions';

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

function ButtonAppNav(props) {
  const { classes } = props;
  const [anchorEl, setAnchorEl] = React.useState(null);

  function handleClick(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            aria-owns={anchorEl ? 'nav-menu' : undefined}
            className={classes.menuButton}
            color="inherit"
            aria-haspopup="true"
            onClick={handleClick}
            aria-label="Menu"
          >
            <MenuIcon />
          </IconButton>
          <Menu id="nav-menu" anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
            {MenuOptions.map((item, index) => (
              <MenuItem key={index} component={Link} to={{pathname: item.pathname}}>{item.label}</MenuItem>
            ))}
          </Menu>
          <Typography variant="h6" color="inherit" className={classes.grow}>
            Wallet
          </Typography>
          <Button color="inherit" component={Link} to="/login">Login</Button>
          <UserMenu />
        </Toolbar>
        <SettingsModal />
      </AppBar>
    </div>
  );
}

ButtonAppNav.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withRouter(withStyles(styles)(ButtonAppNav));
