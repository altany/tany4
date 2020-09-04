import Head from "next/head";
import Link from "next/link";
import Layout, { siteTitle } from "../../components/layout";
import RepoList from "../../components/github/repoList";
import utilStyles from "../../styles/utils.module.scss";

export default function Github() {
  return (
    <Layout github>
      <Head>
        <title>{siteTitle} - Github API</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p className="intro">
          {"Check out my Github profile on "}
          <a href="http://www.github.com/altany">
            <img
              src="https://github.githubassets.com/images/modules/logos_page/Octocat.png"
              title="github.com/altany"
            />
          </a>
        </p>
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
