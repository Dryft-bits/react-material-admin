import React from "react";
import PropTypes from "prop-types";

const Search = props => {
  return (
    <div className="input-field">
      <input type="text" placeholder="Search Course" onChange={props.action} />
    </div>
  );
};

Search.propTypes = {
  action: PropTypes.func.isRequired,
};

export default Search;
