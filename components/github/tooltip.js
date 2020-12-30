import React from "react";
import styles from "../../styles/utils.module.scss";

const Tooltip = ({ active, payload, ...rest }) => {
  if (active) {
    const label = payload[0]?.name;
    const value = payload[0]?.value;
    return (
      <div className={styles.tooltip}>{`Repos with ${label}: (soon...)`}</div>
    );
  }

  return null;
};

export default Tooltip;
