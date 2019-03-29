import React from "react";
import PropTypes from "prop-types";
import {ipcRenderer} from 'electron';
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Divider from '@material-ui/core/Divider';
import ErrorIcon from '@material-ui/icons/Error';
import Grid from "@material-ui/core/Grid";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Fab from '@material-ui/core/Fab'
import IconButton from "@material-ui/core/IconButton";
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import SendIcon from "@material-ui/icons/CallMade";
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import Typography from '@material-ui/core/Typography';
import { withStyles } from "@material-ui/core/styles";
import CustomSnackbarContent from "../../CustomSnackbarContent";

const styles = theme => ({
  fab: {
    margin: theme.spacing.unit
  },
  fileChooserButton: {
    marginTop: theme.spacing.unit,
    marginLeft: -theme.spacing.unit
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing.unit,
  },
  extendedIcon: {
    marginRight: theme.spacing.unit
  }
});

function SendModal(props) {
  const { classes, onClose } = props;
  var { showModal } = props;
  const [open, setOpen] = React.useState(true);
  const [method, setMethod] = React.useState("file");
  const [selectedFile, setSelectedFile] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");

  function handleClickOpen() {
    //setOpen(true);
  }

  function handleClose() {
    onClose();
    showModal = false;
    //setOpen(false);
    setSelectedFile("");
    setErrorMessage("");
  }

  function handleSend(event) {
    event.preventDefault();
    const data = new FormData(event.target);
    // TODO: Validate amount is a double
    const amountInNanoGrins = data.get('amount') * Math.pow(10, 9);

    const result = ipcRenderer.sendSync('Send', amountInNanoGrins);
    if (result.status_code == 200) {
      ipcRenderer.send('SaveToFile', selectedFile, JSON.stringify(result.slate));

      showModal = false;
      onClose();
      //setOpen(false);
      setSelectedFile("");
      setErrorMessage("");
    } else if (result.status_code == 409) {
      setErrorMessage("Insufficient Funds Available!");
    } else {
      setErrorMessage("Failed to send!");
    }
  }

  function handleMethodChange(event) {
    setMethod(event.target.value);
  }

  function handleSelectFile(event) {
    ipcRenderer.removeAllListeners('DestinationSelected');
    ipcRenderer.on('DestinationSelected', (event, file) => {
      if (file !== null) {
        setSelectedFile(file);
      }
    });

    ipcRenderer.send('SendFile');
  }

  function handleSnackbarClose(event, reason) {
    setErrorMessage("");
  }

  if (showModal !== true) {
    return null;
  }

  return (
  <React.Fragment>

    <Snackbar
      autoHideDuration={4000}
      open={ errorMessage.length > 0 }
      onClose={handleSnackbarClose}
    >
      <CustomSnackbarContent
        onClose={handleSnackbarClose}
        variant="error"
        message={errorMessage}
      />
    </Snackbar>

    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title" disableTypography>
        <Typography
          variant='h4'
          align='center'
        >
          Send Grin
        </Typography>
      </DialogTitle>
      <DialogContent>
        <form className={classes.form} onSubmit={handleSend}>
          <FormControl component="fieldset" required>
            <RadioGroup
              aria-label="Method"
              name="method"
              value={method}
              onChange={handleMethodChange}
              row
            >
              <FormControlLabel
                value="file"
                control={<Radio/>}
                label="File"
                labelPlacement="end"
              />
              <FormControlLabel
                value="http"
                control={<Radio/>}
                label="http(s)"
                labelPlacement="end"
                disabled
              />
              <FormControlLabel
                value="wormhole"
                control={<Radio/>}
                label="Wormhole"
                labelPlacement="end"
                disabled
              />
              <FormControlLabel
                value="grinbox"
                control={<Radio/>}
                label="Grinbox"
                labelPlacement="end"
                disabled
              />
            </RadioGroup>
          </FormControl>

          <br/>

          <FormControl margin="dense" required fullWidth>
            <InputLabel htmlFor="amount">Amount ツ</InputLabel>
            <Input name="amount" type="text" id="amount" autoFocus />
          </FormControl>

          <Grid container spacing={8}>
            <Grid item xs={11}>
              <FormControl
                margin="dense"
                required
                fullWidth
              >
                <InputLabel htmlFor="destinationFile">Destination File</InputLabel>
                <Input
                  name="destinationFile"
                  type="text"
                  id="destinationFile"
                  value={selectedFile}
                />
              </FormControl>
            </Grid>
            <Grid item xs={1}>
              <IconButton onClick={handleSelectFile} className={classes.fileChooserButton}>
                <SaveAltIcon/>
              </IconButton>
            </Grid>
          </Grid>

          <br/><br/>
          <Typography align='right'>
            <Button onClick={handleClose}>
              Cancel
            </Button>
            <IconButton type="submit">
              <SendIcon />
            </IconButton>
          </Typography>
        </form>
      </DialogContent>
    </Dialog>
  </React.Fragment>
  );
}

SendModal.propTypes = {
  classes: PropTypes.object.isRequired,
  showModal: PropTypes.bool,
  onClose: PropTypes.function
};

export default withStyles(styles)(SendModal);
