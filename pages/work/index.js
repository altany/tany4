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
      </section>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Github API Playground</h2>
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
