import React from "react";
import PropTypes from "prop-types";
import { ipcRenderer } from 'electron';
import {
    Button, FormControl, FormControlLabel, Checkbox, IconButton, Typography
} from "@material-ui/core";
import FinalizeIcon from "@material-ui/icons/CallMerge";
import OpenIcon from '@material-ui/icons/FolderOpen';
import { withStyles } from "@material-ui/core/styles";
import CustomTextField from "../../../components/CustomTextField";

const styles = theme => ({
    fab: {
        margin: theme.spacing(1)
    },
    fileChooserButton: {
        marginTop: theme.spacing(1),
        marginLeft: theme.spacing(1),
        padding: '5px'
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1)
    },
    extendedIcon: {
        marginRight: theme.spacing(1)
    }
});

function Finalize(props) {
    const { classes, showWallet } = props;
    const [selectedFile, setSelectedFile] = React.useState("");
    const [useGrinJoin, setUseGrinJoin] = React.useState(false);

    function handleFinalize(e) {
        e.preventDefault();

        ipcRenderer.removeAllListeners('SlateOpened');
        ipcRenderer.on('SlateOpened', (event, fileOpened, data) => {
            if (data !== null) {
                ipcRenderer.removeAllListeners('File::Finalize::Response');
                ipcRenderer.on('File::Finalize::Response', (event, result) => {
                    if (result.success === true) {
                        ipcRenderer.send('Snackbar::Relay', "SUCCESS", "Finalize slate saved to: " + fileOpened + ".finalized");
                        setSelectedFile("");
                        showWallet();
                    } else {
                        ipcRenderer.send('Snackbar::Relay', "ERROR", "Error occurred: " + JSON.stringify(result.data));
                    }
                });

                ipcRenderer.send('File::Finalize', JSON.parse(data), (fileOpened + '.finalized'), useGrinJoin);
            }
        });

        ipcRenderer.send('OpenSlateFile', selectedFile);
    }

    function handleSelectFile(_event) {
        ipcRenderer.removeAllListeners('ReceiveFileSelected');
        ipcRenderer.on('ReceiveFileSelected', (event, fileName) => {
            if (fileName != null) {
                setSelectedFile(fileName);
            } else {
                setSelectedFile("");
            }
        });

        ipcRenderer.send('ChooseInputFile');
    }

    return (
        <React.Fragment>
            <form className={classes.form} onSubmit={handleFinalize}>
                <center>
                    <br />
                    <div>
                        <FormControl
                            margin="dense"
                            required
                            fullWidth
                            style={{ width: `calc(100% - 50px)` }}
                        >
                            <CustomTextField
                                name="FinalizeFile"
                                type="text"
                                id="FinalizeFile"
                                value={selectedFile}
                                placeholder='Transaction File'
                            />
                        </FormControl>
                        <IconButton color='secondary' onClick={handleSelectFile} className={classes.fileChooserButton}>
                            <OpenIcon />
                        </IconButton>
                    </div>

                    <br />
                </center>
                <Typography align='right'>
                    
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={useGrinJoin}
                                onChange={() => {
                                    var updated = !useGrinJoin;
                                    setUseGrinJoin(updated);
                                }}
                            />
                        }
                        label="Use GrinJoin"
                    />
                    <Button type="submit" style={{ marginLeft: '10px' }} disabled={selectedFile.length == 0} variant="contained" color="primary">
                        Finalize <FinalizeIcon />
                    </Button>
                </Typography>
            </form>
        </React.Fragment>
    );
}

Finalize.propTypes = {
    classes: PropTypes.object.isRequired,
    showWallet: PropTypes.func.isRequired
};

export default withStyles(styles)(Finalize);
