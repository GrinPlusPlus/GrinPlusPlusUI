import React from "react";
import PropTypes from "prop-types";
import { Link, withRouter } from 'react-router-dom';
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";

const styles = {
  root: {
    flexGrow: 1
  },
  appBar: {
    top: 'auto',
    height: 30,
    bottom: 0,
  }
};

function StatusBar(props) {
  const { classes } = props;

  return (
    <div className={classes.root}>
      <AppBar position="fixed" color="primary" className={classes.appBar}>
        <Toolbar>
        </Toolbar>
      </AppBar>
    </div>
  );
}

StatusBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(StatusBar));
