import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import {
    Radio, RadioGroup, FormLabel, FormControl, FormControlLabel, TextField, Typography
} from '@material-ui/core';
import Wordlist from './bip39_english.js';

const styles = theme => ({
    main: {
        width: 'auto',
        display: 'block', // Fix IE 11 issue.
        marginLeft: theme.spacing(3),
        marginRight: theme.spacing(3),
        [theme.breakpoints.up(400 + theme.spacing(6))]: {
            width: 400,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    paper: {
        marginTop: theme.spacing(20),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: `${theme.spacing(2)}px ${theme.spacing(3)}px ${theme.spacing(3)}px`,
    },
    walletWord: {
        borderRadius: 3,
        background: '#ddd',
        padding: '4px',
        margin: '4px',
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
    invalidWord: {
        borderRadius: 3,
        background: '#ddd',
        padding: '4px',
        margin: '4px',
        border: '1px solid red'
    },
    errorTextField: {
        '& .MuiInput-underline:after': {
            borderBottomColor: 'red',
        }
    },
    blackLabel: {
        '& .MuiFormControlLabel-label': {
            color: '#000000'
        }
    }
});

const ErrorTextField = withStyles({
    root: {
        '& .MuiInput-underline:after': {
            borderBottomColor: 'red',
        },
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                borderColor: 'red',
            },
            '&:hover fieldset': {
                borderColor: 'red',
            },
            '&.Mui-focused fieldset': {
                borderColor: 'red',
            },
        },
    },
})(TextField);

function WalletWords(props) {
    const { classes, updateParent, error } = props;
    const [numWords, setNumWords] = React.useState(24);
    const [words, setWords] = React.useState(new Map());
    const [validWords, setValidWords] = React.useState(new Set());

    function validate(validatedSet, numberOfWords) {
        var wordlist = [];
        for (var i = 0; i < numberOfWords; i++) {
            if (!validatedSet.has(i)) {
                updateParent("");
                return;
            }

            const word = words.get(i);
            if (word == null) {
                updateParent("");
                return;
            }

            wordlist.push(word);
        }

        updateParent(wordlist.join(" "));
    }

    function changeWord(e, index) {
        var newWords = words;
        newWords.set(index, e.target.value);
        setWords(newWords);

        if (Wordlist.isWord(e.target.value)) {
            if (!validWords.has(index)) {
                const newValidWords = new Set(validWords);
                newValidWords.add(index);
                setValidWords(newValidWords);
                validate(newValidWords, numWords);
            }
        } else {
            if (validWords.has(index)) {
                const newValidWords = new Set(validWords);
                newValidWords.delete(index);
                setValidWords(newValidWords);
                updateParent("");
            }
        }
    }

    function getWalletSeedWordsDisplay() {
        var display = [];

        let numRows = Math.ceil(numWords / 6);
        for (var j = 0; j < numRows; j++) {
            var numColumns = 6;
            if (j == (numRows - 1) && numWords % 6 != 0) {
                numColumns = numWords % 6;
            }

            for (var i = 0; i < numColumns; i++) {
                const index = (j * 6) + i;

                const top = '' + (j * 60) + 'px';
                const left = '' + ((i * 115) - 18) + 'px';

                var divClassName = classes.walletWord;
                var textFieldClassName = "";
                if (!validWords.has(index)) {
                    divClassName = classes.invalidWord;
                    textFieldClassName = classes.errorTextField;
                }

                var value = "";
                if (words.has(index)) {
                    value = words.get(index);
                }

                display.push(
                    <div key={index} className={divClassName} style={{ position: 'absolute', top: top, left: left, width: '100px' }}>
                        <div style={{ position: 'absolute', top: '-3px', left: '1px', margin: '0px', padding: '0px' }}>
                            {(index + 1) + "."}
                        </div>
                        <TextField onChange={e => changeWord(e, index)} className={textFieldClassName} defaultValue={value} fullWidth />
                    </div>
                );
            }
        }

        return display;
    }

    function updateNumWords(e) {
        setNumWords(e.target.value);
        validate(validWords, e.target.value);
    }

    function displayError() {
        if (error != null) {
            return (
                <Typography variant="caption" color='error'>
                    {error}
                </Typography>
            );
        } else {
            return "";
        }
    }

    return (
        <div style={{ width: '100%' }}>
            <center>
                <Typography variant="h4" color='primary'>
                    Wallet Seed
                </Typography>
                <br />
                <FormControl component="fieldset">
                    <FormLabel component="legend">Number of Words</FormLabel>
                    <RadioGroup
                        row
                        aria-label="position"
                        name="position"
                        onChange={updateNumWords}
                        style={{ color: '#000000' }}
                        className={classes.blackLabel}
                    >
                        <FormControlLabel
                            value={12}
                            checked={numWords == 12}
                            control={<Radio color="primary" />}
                            label="12"
                            className={classes.blackLabel}
                            labelPlacement="end"
                        />
                        <FormControlLabel
                            value={15}
                            checked={numWords == 15}
                            control={<Radio color="primary" />}
                            label="15"
                            labelPlacement="end"
                        />
                        <FormControlLabel
                            value={18}
                            checked={numWords == 18}
                            control={<Radio color="primary" />}
                            label="18"
                            labelPlacement="end"
                        />
                        <FormControlLabel
                            value={21}
                            checked={numWords == 21}
                            control={<Radio color="primary" />}
                            label="21"
                            labelPlacement="end"
                        />
                        <FormControlLabel
                            value={24}
                            checked={numWords == 24}
                            control={<Radio color="primary" />}
                            label="24"
                            labelPlacement="end"
                        />
                    </RadioGroup>
                </FormControl>
            </center>
            {displayError(error)}
            <div style={{ position: 'relative', width: '100%', marginLeft: '0px' }}>
                <b>
                    {getWalletSeedWordsDisplay()}
                </b>
            </div>
            <br />
        </div>
    );
}

WalletWords.propTypes = {
    classes: PropTypes.object.isRequired,
    updateParent: PropTypes.func.isRequired,
    error: PropTypes.string
};

export default withStyles(styles)(WalletWords);
