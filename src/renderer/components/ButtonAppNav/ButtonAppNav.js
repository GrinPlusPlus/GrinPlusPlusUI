import React from "react";
import PropTypes from "prop-types";
import { Link, Redirect, withRouter } from 'react-router-dom';
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import SettingsModal from "../../components/Settings";
import SupportModal from "../../components/Modals/SupportModal";
import UserMenu from "../../components/UserMenu";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import BackArrowIcon from '@material-ui/icons/ArrowBack';

const styles = theme => ({
  root: {
    flexGrow: 1,
    width: '100%',
  },
  grow: {
    flexGrow: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  },
});

function ButtonAppNav(props) {
  const { classes, pageName, noMenu, includeBack, onClickMenu } = props;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [goBack, setGoBack] = React.useState(false);

  function handleClick(event) {
    //setAnchorEl(event.currentTarget);
      onClickMenu();
  }

  function handleClose() {
    setAnchorEl(null);
  }

  function handleGoBack(event) {
    event.preventDefault();
    setGoBack(true);
  }

  if (goBack === true) {
    return (<Redirect to='/'/>);
  }

  var menu = (
    <React.Fragment>
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
        <Typography variant="h6" color="inherit" className={classes.grow}>
            {!!pageName ? pageName : ''}
        </Typography>
    </React.Fragment>
  );

  function showMenu() {
    if (!!noMenu ? true : false) {
      return "";
    } else {
      return menu;
    }
  }

  function showUserMenu() {
    if (!!noMenu ? true : false) {
      return "";
    } else {
      return <UserMenu />;
    }
  }

  function showTopRightButtons() {
    if (!!noMenu ? true : false) {
      return (
        <React.Fragment>
            <Typography className={classes.grow}></Typography>
            <SettingsModal />
            <SupportModal />
        </React.Fragment>
      );
    } else {
        return (
            <React.Fragment>
                <SettingsModal />
                <SupportModal />
            </React.Fragment>
        );
    }
  }

  function showBack() {
    if (!!includeBack ? true : false) {
      return (
        <IconButton color="secondary" aria-label="Go back" onClick={handleGoBack}>
          <BackArrowIcon/>
        </IconButton>
      );
    } else {
      return "";
    }
  }

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          {showBack()}
          {showMenu()}
          {showUserMenu()}
          {showTopRightButtons()}
        </Toolbar>
      </AppBar>
    </div>
  );
}

ButtonAppNav.propTypes = {
    classes: PropTypes.object.isRequired,
    pageName: PropTypes.string,
    noMenu: PropTypes.bool,
    includeBack: PropTypes.bool,
    onClickMenu: PropTypes.func
};

export default withRouter(withStyles(styles)(ButtonAppNav));
