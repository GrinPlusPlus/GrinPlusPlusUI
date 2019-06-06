import React from "react";
import PropTypes from "prop-types";
import { ipcRenderer } from 'electron';
import {FormControl, Input, InputLabel } from "@material-ui/core";

function SendHttp(props) {
    const { selected, httpAddress, setHttpAddress } = props;

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
                <InputLabel htmlFor="URL">Address (eg. http(s)://12.34.56.78:3415)</InputLabel>
                <Input
                    name="URL"
                    type="text"
                    id="URL"
                    value={httpAddress}
                    onChange={(event) => { setHttpAddress(event.target.value) }}
                />
            </FormControl>
            <br />
        </React.Fragment>
    );
}

SendHttp.propTypes = {
    selected: PropTypes.bool,
    httpAddress: PropTypes.string,
    setHttpAddress: PropTypes.func
};

export default SendHttp;
