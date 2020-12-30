import React from "react";
import styles from "../../styles/utils.module.scss";
import fetcher from "../../lib/fetcher";
import useSWR from "swr";

const Tooltip = ({ active, payload, ...rest }) => {
  if (active) {
    const label = payload[0]?.name;
    const value = payload[0]?.value;
    const { data, error } = useSWR(
      `https://github-api-altany.herokuapp.com/repos/language/${label}`,
      fetcher
    );

    return (
      <div className={styles.tooltip}>
        {error && "failed to load repos"}
        {!data && `loading repos with ${label}...`}
        {(data || []).length && (
          <>
            <p>Repos with {label}:</p>
            <ul>
              {data.map((repo) => (
                <li key={repo}>{repo}</li>
              ))}
            </ul>
          </>
        )}
      </div>
    );
  }

  return null;
};

export default Tooltip;
