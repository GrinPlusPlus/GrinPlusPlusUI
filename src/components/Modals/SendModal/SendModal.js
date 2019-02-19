import React from "react";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Fab from '@material-ui/core/Fab'
import IconButton from "@material-ui/core/IconButton";
import SendIcon from "@material-ui/icons/send";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  paper: {
    position: "absolute",
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
    outline: "none"
  },
  fab: {
    margin: theme.spacing.unit
  },
  extendedIcon: {
    marginRight: theme.spacing.unit
  }
});

function SendModal(props) {
  const { classes } = props;
  const [open, setOpen] = React.useState(false);

  function handleClickOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  return (
  <React.Fragment>
    <Fab
      variant="extended"
      className={classes.Fab}
      aria-label="Settings"
      onClick={handleClickOpen}
      color="primary"
    >
      <SendIcon className={classes.extendedIcon}/> Send Grin 
    </Fab>
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Send Grin</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To Send Grin, enter the mail to send to here.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Recipiants Email Address"
          type="email"
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <IconButton onClick={handleClose} color="primary">
          <SendIcon />
        </IconButton>
      </DialogActions>
    </Dialog>
  </React.Fragment>
  );
}

SendModal.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SendModal);
