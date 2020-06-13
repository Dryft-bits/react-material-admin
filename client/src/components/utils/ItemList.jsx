import React from "react";
import PropTypes from "prop-types";
import "./util.css";
const ItemList = props => {
  return (
    <ul className='courseSearch' >
      {Object.keys(props.items).map(item => {
        return (
          <div
            className='courseItem'
            style={{display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14}}
            key={item}
            id={item}
            onClick={props.action}
          >
            {item} {props.items[item]["name"]}
          </div>
        );
      })}
    </ul>
  );
};

ItemList.propTypes = {
  items: PropTypes.object.isRequired
};

export default ItemList;
