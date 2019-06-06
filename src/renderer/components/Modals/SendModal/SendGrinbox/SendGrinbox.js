import React from "react";
import PropTypes from "prop-types";
import { ipcRenderer } from 'electron';
import {FormControl, Input, InputLabel } from "@material-ui/core";

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
                <InputLabel htmlFor="Grinbox">Address (eg. gVvGhkjf...)</InputLabel>
                <Input
                    name="Grinbox"
                    type="text"
                    id="Grinbox"
                    value={grinboxAddress}
                    onChange={(event) => { setGrinboxAddress(event.target.value) }}
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
