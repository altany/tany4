import React from "react";

const Icon = (props) => {
  return (
    <svg
      width={`${props.size}px`}
      height={`${props.size}px`}
      viewBox="0 0 1024 1024"
    >
      <path d={props.icon}></path>
    </svg>
  );
};

Icon.defaultProps = {
  size: 25,
};

export default Icon;
