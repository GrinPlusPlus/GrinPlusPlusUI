import React from "react";
import PropTypes from "prop-types";
import { ipcRenderer } from 'electron';
import {Grid, FormControl, IconButton } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import CustomTextField from '../../../../components/CustomTextField';

const styles = theme => ({
    fileChooserButton: {
        marginTop: theme.spacing(1),
        marginLeft: theme.spacing(1),
        padding: '5px'
    },
});

function SendFile(props) {
    const { classes, selected, selectedFile, setSelectedFile } = props;
    
    function handleSelectFile(event) {
        ipcRenderer.removeAllListeners('DestinationSelected');
        ipcRenderer.once('DestinationSelected', (event, file) => {
            if (file != null) {
                setSelectedFile(file);
            }
        });

        ipcRenderer.send('SendFile');
    }

    if (selected != true) {
        return null;
    }

    return (
        <React.Fragment>
            <FormControl
                margin="dense"
                required
                style={{ width: `calc(100% - 50px)`}}
            >
                <CustomTextField
                    name="destinationFile"
                    type="text"
                    id="destinationFile"
                    value={selectedFile}
                    placeholder='Destination File'
                />
            </FormControl>
            <IconButton color='secondary' onClick={handleSelectFile} className={classes.fileChooserButton}>
                <SaveAltIcon />
            </IconButton>
            <br />
        </React.Fragment>
    );
}

SendFile.propTypes = {
    classes: PropTypes.object.isRequired,
    selected: PropTypes.bool,
    selectedFile: PropTypes.string,
    setSelectedFile: PropTypes.func
};

export default withStyles(styles)(SendFile);
