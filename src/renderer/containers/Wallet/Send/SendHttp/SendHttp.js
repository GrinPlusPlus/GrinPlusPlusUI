import React from "react";
import PropTypes from "prop-types";
import { FormControl } from "@material-ui/core";
import CustomTextField from '../../../../components/CustomTextField';

function SendHttp(props) {
    const { selected, address, setAddress } = props;

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
                    value={address}
                    onChange={(event) => { setAddress(event.target.value) }}
                    placeholder='Address'
                />
            </FormControl>
            <br />
        </React.Fragment>
    );
}

SendHttp.propTypes = {
    selected: PropTypes.bool,
    address: PropTypes.string,
    setAddress: PropTypes.func
};

export default SendHttp;
