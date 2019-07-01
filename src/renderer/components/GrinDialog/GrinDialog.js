import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Button, IconButton, Dialog, DialogTitle } from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';
import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';
import WarningIcon from '@material-ui/icons/Warning';
import { MuiThemeProvider, createMuiTheme, withStyles } from "@material-ui/core/styles";

const dark_theme = createMuiTheme({
    palette: {
        secondary: {
            main: '#ffffff',
            contrastText: '#000000',
        },
        primary: {
            main: '#666666',
            contrastText: '#ffffff',
        },
        text: {
            primary: '#ffffff',
            secondary: '#aaaaaa',
        },
        action: {
            disabled: '#888888'
        }
    },
    typography: {
        useNextVariants: true,
        // Use the system font instead of the default Roboto font.
        fontFamily: [
            "Lato",
            "sans-serif"
        ].join(","),
        color: '#ffffff',
        initial: {
            color: '#000000'
        }
    },
    overrides: {
        MuiDialog: {
            paper: {
                backgroundColor: '#000000',//'#444444',
                border: '#ffffff 2px solid'
            }
        },
        MuiInput: {
            root: {
                color: '#ffffff'
            }
        },
        MuiButton: {
            root: {
                '&:disabled': {
                    backgroundColor: '#555555'
                }
            }
        }
    }
});

class GrinDialog extends React.Component {
    render() {
        return (
            <MuiThemeProvider theme={dark_theme}>
                <Dialog {...this.props}>
                    <DialogTitle id="form-dialog-title">
                        <center>
                            {this.props.title}
                        </center>
                    </DialogTitle>
                    {this.props.children}
                </Dialog>
            </MuiThemeProvider>
        );
    }
}

GrinDialog.propTypes = {
  title: PropTypes.string.isRequired,
};

export default GrinDialog;
