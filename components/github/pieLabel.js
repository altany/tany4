import React from "react";
import styles from "../../styles/utils.module.scss";

const RADIAN = Math.PI / 180;
const PieLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
  name,
}) => {
  const radius = outerRadius + 15;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text
      x={x}
      y={y}
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      className={styles.label}
    >
      {`${name} ${(percent * 100).toFixed(1)}%`}
    </text>
  );
};

export default PieLabel;
