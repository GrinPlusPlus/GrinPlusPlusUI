import React from "react";
import PropTypes from "prop-types";
import { ipcRenderer } from 'electron';
import { FormControl } from "@material-ui/core";
import CustomTextField from '../../../../components/CustomTextField';

function SendGrinbox(props) {
    const { selected, grinboxAddress, setGrinboxAddress } = props;

    if (selected != true) {
        return null;
    }

    return (
        <React.Fragment>
            <FormControl
                margin="dense"
                required
                fullWidth
            >
                <CustomTextField
                    name="Grinbox"
                    type="text"
                    id="Grinbox"
                    value={grinboxAddress}
                    onChange={(event) => { setGrinboxAddress(event.target.value) }}
                    placeholder='Address (eg. gVvGhkjf...)'
                />
            </FormControl>
            <br />
        </React.Fragment>
    );
}

SendGrinbox.propTypes = {
    selected: PropTypes.bool,
    grinboxAddress: PropTypes.string,
    setGrinboxAddress: PropTypes.func
};

export default SendGrinbox;
