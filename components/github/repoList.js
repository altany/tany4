import React, { useState } from "react";
import Repo from "../../components/github/repo";
import useSWR from "swr";

export default function RepoList() {
  const fetcher = (url) => fetch(url).then((r) => r.json());

  const [toggleStatus, setToggleStatus] = useState(0);
  const { data, error } = useSWR(
    "https://github-api-altany.herokuapp.com/repos",
    fetcher
  );

  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;
  return (
    <div className="repos-container">
      <a id="toggleAllRepos" onClick={() => setToggleStatus(!toggleStatus)}>
        {toggleStatus ? "collapse" : "expand"} all
      </a>
      {data.map(({ name, id }) => (
        <Repo key={id} name={name} toggleStatus={toggleStatus} />
      ))}
    </div>
  );
}
