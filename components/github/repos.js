import React from "react";
import useSWR from "swr";
import fetcher from "../../lib/fetcher";

const Repos = ({ language }) => {

  const { data , error} = useSWR(language ? `https://github-api-altany.herokuapp.com/repos/language/${language}`: null, fetcher)

  if (!language || error || !data) return null;
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
