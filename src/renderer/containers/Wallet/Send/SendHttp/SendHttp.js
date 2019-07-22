import React from "react";
import PropTypes from "prop-types";
import { FormControl } from "@material-ui/core";
import CustomTextField from '../../../../components/CustomTextField';

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
                <CustomTextField
                    name="URL"
                    type="text"
                    id="URL"
                    value={httpAddress}
                    onChange={(event) => { setHttpAddress(event.target.value) }}
                    placeholder='Address (eg. http(s)://12.34.56.78:3415)'
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
