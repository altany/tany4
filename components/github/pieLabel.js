import React from "react";
import styles from "../../styles/utils.module.scss";
import useSWR from "swr";
import fetcher from "../../lib/fetcher";

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
  const { data, error } = useSWR(
    `https://github-api-altany.herokuapp.com/repos/language/${name}`,
    fetcher
  );

  const radius = outerRadius + 15;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <>
      <g>
        <text
          x={x}
          y={y}
          textAnchor={x > cx ? "start" : "end"}
          dominantBaseline="central"
          className={styles.label}
        >
          {`${name} ${(percent * 100).toFixed(1)}%`}
        </text>
      </g>
      <div className={styles.tooltip}>
        {error && "failed to load repos"}
        {!data && `loading repos with ${name}...`}
        {(data || []).length && (
          <>
            <p>Repos with {name}:</p>
            <ul>
              {data.map((repo) => (
                <li key={repo}>{repo}</li>
              ))}
            </ul>
          </>
        )}
      </div>
    </>
  );
};

export default PieLabel;
