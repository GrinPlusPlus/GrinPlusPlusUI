import React from "react";
import PropTypes from "prop-types";
import { Link, withRouter } from 'react-router-dom';
import { withStyles } from "@material-ui/core/styles";
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

const styles = {
  root: {
    flexGrow: 1
  }
};

function WalletTabs(props) {
  const { classes, pageName } = props;
  var [tabValue, setTabValue] = React.useState(0);

  function handleChange(event, value) {
    setTabValue(value);
  }

  return (
    <Paper className={classes.root}>
      <Tabs
        value={tabValue}
        onChange={handleChange}
        indicatorColor="primary"
        textColor="primary"
      >
        <Tab label="Send" />
        <Tab label="Receive" />
      </Tabs>
    </Paper>
  );
}

WalletTabs.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withRouter(withStyles(styles)(WalletTabs));
