import React from "react";
import styles from "../../styles/utils.module.scss";
import useSWR from "swr";
import fetcher from "../../lib/fetcher";

const Repos = ({ language }) => {
  if (!language) {
    return null;
  }

  const { data, error } = useSWR(
    `https://github-api-altany.herokuapp.com/repos/language/${language}`,
    fetcher
  );
  if (error || !data) return null;
  return (
    <>
      <h4>
        Repos with <span>{language}</span>
      </h4>
      <ul>
        {data.map((repo, index) => (
          <li key={index}>
            <a target="_blank" href={`https://github.com/altany/${repo}`}>
              {repo}
            </a>
          </li>
        ))}
      </ul>
    </>
  );
};

export default Repos;
