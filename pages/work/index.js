import Head from "next/head";
import Link from "next/link";
import Layout, { siteTitle } from "../../components/layout";
import RepoList from "../../components/github/repoList";
import utilStyles from "../../styles/utils.module.scss";

export default function Work() {
  return (
    <Layout github>
      <Head>
        <title>{siteTitle} - My work</title>
      </Head>
      <section>
        <a href="http://www.github.com/altany">Github</a>
        <br />
        <a href="https://gitlab.com/brief-challenges">Gitlab</a>
        <br />
        <a href="http://stackoverflow.com/story/tany4">StackOverlow</a>
        <br />
        If you like code challenges, find me at CodeWars:
        <a href="https://www.codewars.com/users/altany" target="_codewars">
          <img
            src="https://www.codewars.com/users/altany/badges/small"
            alt="codewars profile badge"
          />
        </a>
      </section>
      <section>
        <h4>Github Languages pie chart</h4>
        <img
          src="github languages pie chart.png"
          alt="Github Languages pie chart"
        />
      </section>
      <section>
        <h4>Github API Playground</h4>
        <p>
          {
            "This page contains a list of my Github repos. All the data is retrieved through the "
          }
          <a href="https://developer.github.com/v3/">Github API v3</a>
        </p>
        <RepoList />
      </section>
    </Layout>
  );
}
