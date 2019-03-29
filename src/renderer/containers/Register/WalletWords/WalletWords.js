import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import BackArrowIcon from '@material-ui/icons/ArrowBack';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Fab from '@material-ui/core/Fab';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import { Redirect, withRouter } from 'react-router-dom';
import {ipcRenderer} from 'electron';
import ButtonAppNav from "../../ButtonAppNav";
import StatusBar from '../../StatusBar';
import TextField from '@material-ui/core/TextField';

const styles = theme => ({
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing.unit * 20,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.primary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing.unit,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },
  walletWord: {
    borderRadius: 3,
    background: '#ddd',
    padding: '4px 8px',
    margin: '8px',
  },
  warning: {
    display: 'inline',
    backgroundColor: 'red',
    color: 'white',
    padding: '4px 8px',
    borderRadius: '4px',
    fontWeight: 700,
    fontSize: '13px',
    marginRight: '4px',
  },
});

function WalletWords(props) {
  const { classes, onClose, walletSeed } = props;
  var { showModal } = props;
  const [verify, setVerify] = React.useState(false);
  const [wordsToVerify, setWordsToVerify] = React.useState(new Array());
  const [verifiedWords, setVerifiedWords] = React.useState(new Array());

  function changeVerifiedWord(e, index) {
    var newVerifiedWords = verifiedWords;
    for (var i = 0; i < newVerifiedWords.length; i++) {
      if (newVerifiedWords[i].index == index) {
        newVerifiedWords[i].word = e.target.value;
        setVerifiedWords(newVerifiedWords);
        return;
      }
    }

    var newWord = new Object();
    newWord["index"] = index;
    newWord["word"] = e.target.value;
    newVerifiedWords.push(newWord);
    setVerifiedWords(newVerifiedWords);
  }

  function getWordDisplay(walletSeedWords, index) {
    if (verify) {
      for (var i = 0; i < wordsToVerify.length; i++) {
        if (wordsToVerify[i].index == index) {
          return (
            <Grid item xs={2} className={classes.walletWord} fullWidth>
              {(index + 1) + "."} <TextField onChange={e => changeVerifiedWord(e, index)} style={{ width: "80px" }} />
            </Grid>
          );
        }
      }
    }

    return (<Grid item xs={2} className={classes.walletWord} fullWidth>{(index + 1) + ". " + walletSeedWords[index]}</Grid>);
  }

  function getWalletSeedWordsDisplay() {
    if (walletSeed != null) {
      var display = [];
      const walletSeedWords = walletSeed.split(' ');

      let numRows = walletSeedWords.length / 6;
      for (var j = 0; j < numRows; j++) {
        let children = [];
        for (var i = 0; i < 6; i++) {
          const index = (j * 6) + i;
          children.push(getWordDisplay(walletSeedWords, index));
        }

        display.push(
          <Grid
            container
            direction="row"
            justify="space-between"
            wrap="nowrap"
          >
            {children}
          </Grid>
        );
      }

      return display;
    }

    return "";
  }

  function getDialogText() {
    if (verify == false) {
      return (
          <DialogContentText>
            <center>
              <span className={classes.warning}>Important</span>
              <b>The below words are needed if you ever need to restore your wallet.<br/>Please write them down and keep them in a safe place.</b>
            </center>
            <br/>
            <b>{getWalletSeedWordsDisplay()}</b>
          </DialogContentText>
      );
    } else {
      return (
          <DialogContentText>
            <center>
              <b>Please fill in the missing words to continue.</b>
            </center>
            <br/>
            <b>{getWalletSeedWordsDisplay()}</b>
          </DialogContentText>
      );
    }
  }

  function showVerify(e) {
    const walletSeedWords = walletSeed.split(' ');

    console.log(walletSeedWords);
    var newWordsToVerify = new Array();
    while (newWordsToVerify.length < 5) {
      const randomIndex = Math.floor(Math.random() * 24);
      var alreadyExists = false;
      for (var i = 0; i < newWordsToVerify.length; i++) {
        if (newWordsToVerify[i].index == randomIndex) {
          alreadyExists = true;
          break;
        }
      }

      if (!alreadyExists) {
        var wordToVerify = new Object();
        wordToVerify["index"] = randomIndex;
        wordToVerify["word"] = walletSeedWords[randomIndex];
        newWordsToVerify.push(wordToVerify);
      }
    }

    setWordsToVerify(newWordsToVerify);
    console.log(newWordsToVerify);

    setVerify(true);
  }

  function goBack(e) {
    setVerifiedWords(new Array());
    setWordsToVerify(new Array());
    setVerify(false);
  }

  function validateWords() {
    if (verify == false) {
      return;
    }

    for (var i = 0; i < wordsToVerify.length; i++) {
      var verified = false;
      for (var j = 0; j < verifiedWords.length; j++) {
        if (wordsToVerify[i].index == verifiedWords[j].index) {
          if (wordsToVerify[i].word == verifiedWords[j].word) {
            verified = true;
          }
          break;
        }
      }

      if (verified == false) {
        return;
      }
    }

    onClose();
    showModal = false;
  }

  function getButtonGrid() {
    if (verify == false) {
      return (
        <Grid
          container
          spacing={0}
          justify="space-between"
          alignItems="center"
        >
          <Grid item xs={4}/>
          <Grid item xs={4}>
            <Button onClick={showVerify} variant="contained" color="primary" fullWidth>
              <b>NEXT</b>
            </Button>
          </Grid>
          <Grid item xs={4}/>
        </Grid>
      );
    } else {
      return (
        <Grid
          container
          spacing={8}
          justify="space-between"
          alignItems="center"
        >
          <Grid item xs={2}/>
          <Grid item xs={4}>
            <Button onClick={goBack} variant="contained" color="primary" fullWidth>
              <b>BACK</b>
            </Button>
          </Grid>
          <Grid item xs={4}>
            <Button onClick={validateWords} variant="contained" color="primary" fullWidth>
              <b>FINISH</b>
            </Button>
          </Grid>
          <Grid item xs={2}/>
        </Grid>
      );
    }
  }

  if (showModal !== true) {
    return null;
  }

  return (
    <Dialog
      open={showModal}
      onClose={validateWords}
      aria-labelledby="form-dialog-title"
      maxWidth="md"
      fullWidth
    >
      <DialogTitle id="form-dialog-title"><Typography variant="h4"><center>Wallet Seed</center></Typography></DialogTitle>
      <DialogContent>{getDialogText()}</DialogContent>
      <DialogActions>{getButtonGrid()}<br/><br/><br/></DialogActions>
    </Dialog>
  );
}

WalletWords.propTypes = {
  classes: PropTypes.object.isRequired,
  showModal: PropTypes.bool,
  onClose: PropTypes.function,
  walletSeed: PropTypes.string
};

export default withStyles(styles)(WalletWords);
