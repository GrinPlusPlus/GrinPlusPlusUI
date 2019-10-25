import React from "react";
import PropTypes from "prop-types";
import { ipcRenderer } from 'electron';
import {
    Button, FormControl, IconButton, Typography
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
    const { classes } = props;
    const [selectedFile, setSelectedFile] = React.useState("");
    
    function clear() {
        setSelectedFile("");
    }

    function handleFinalize(e) {
        e.preventDefault();

        ipcRenderer.removeAllListeners('SlateOpened');
        ipcRenderer.on('SlateOpened', (event, fileOpened, data) => {
            if (data !== null) {
                var result = ipcRenderer.sendSync('Finalize', data);
                if (result !== null && result.status_code == 200) {
                    ipcRenderer.send('SaveToFile', (fileOpened + '.finalized'), JSON.stringify(result.tx));
                    ipcRenderer.send('Snackbar::Relay', "SUCCESS", "Saving response slate to: " + fileName + ".response");
                    setSelectedFile("");
                } else {
                    ipcRenderer.send('Snackbar::Relay', "ERROR", "Unknown error occurred!");
                }
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

        ipcRenderer.send('ReceiveFile');
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
                    <Button type="submit" style={{ marginLeft: '10px' }} disabled={selectedFile.length == 0} variant="contained" color="primary">
                        Finalize <FinalizeIcon />
                    </Button>
                </Typography>
            </form>
        </React.Fragment>
    );
}

Finalize.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Finalize);
