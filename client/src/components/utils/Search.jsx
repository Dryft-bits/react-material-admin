import React from "react";
import PropTypes from "prop-types";
import TextField from '@material-ui/core/TextField';

const Search = props => {
  return (
    <div className="input-field"style={{padding:"5px"}}>
      <TextField
          id="standard-full-width"
          label="Course"
          placeholder="Search Course"
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
          onChange={props.action}
        />
    </div>
  );
};

Search.propTypes = {
  action: PropTypes.func.isRequired,
};

export default Search;
