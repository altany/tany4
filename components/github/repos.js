import React from "react";
import styles from "../../styles/utils.module.scss";
import useSWR from "swr";
import fetcher from "../../lib/fetcher";

const Repos = ({ language }) => {
  if (!language) {
    return (
      <div className={styles.instructions}>
        Click on a language to get a list of repos using it
      </div>
    );
  }

  const { data, error } = useSWR(
    `https://github-api-altany.herokuapp.com/repos/language/${language}`,
    fetcher
  );
  if (error)
    return <div className={styles.instructions}>failed to load repos</div>;
  if (!data) return <div className={styles.instructions}>loading repos...</div>;
  return (
    <ul>
      {data.map((repo, index) => (
        <li ley={index}>
          <a target="_blank" href={`https://github.com/altany/${repo}`}>
            {repo}
          </a>
        </li>
      ))}
    </ul>
  );
};

export default Repos;
