import React from "react";
import { icons } from "../lib/icons";

const Icon = (props) => {
  const iconData = icons[props.icon];
  return (
    <svg viewBox="0 0 1024 1024">
      <path d={iconData.path} fill={iconData.color}></path>
    </svg>
  );
};

export default Icon;
