import Head from "next/head";
import Link from "next/link";
import Layout, { siteTitle } from "../../components/layout";
import RepoList from "../../components/github/repoList";
import Icon from "../../components/icon";
import {
  GITHUB,
  GITLAB,
  STACKOVERFLOW,
  CODEWARS,
  LINKEDIN,
  TWITTER,
} from "../../lib/icons";
import styles from "../../styles/utils.module.scss";

export default function Work() {
  return (
    <Layout work>
      <Head>
        <title>{siteTitle} - My work</title>
      </Head>
      <div className={styles.work}>
        <header>
          <h1>My work</h1>
          <h3>Check the links below to find out more about me</h3>
        </header>
        <div>
          <ul className={styles.links}>
            <li>
              <a
                href="http://www.linkedin.com/in/taniapapazaf"
                target="_linkedin"
                title="/in/taniapapazaf"
              >
                <Icon icon={LINKEDIN} />
              </a>
            </li>
            <li>
              <a
                href="https://twitter.com/_Tany_"
                target="_twitter"
                title="@_Tany_"
              >
                <Icon icon={TWITTER} />
              </a>
            </li>
            <li>
              <a
                href="http://stackoverflow.com/story/tany4"
                target="_stackoverflow"
                title="story/tany4"
              >
                <Icon icon={STACKOVERFLOW} />
              </a>
            </li>
          </ul>
          <ul className={styles.git}>
            <li>
              <a
                href="http://www.github.com/altany"
                target="_github"
                title="altany"
              >
                <Icon icon={GITHUB} />
                Github
              </a>
            </li>
            <li>
              <a
                href="https://gitlab.com/brief-challenges"
                target="_gitlab"
                title="altany"
              >
                <Icon icon={GITLAB} />
                Gitlab
              </a>
            </li>
          </ul>
          <section className={styles.codewars}>
            <p>Do you enjoy code challenges? Find me at CodeWars!</p>
            <div>
              <a
                href="https://www.codewars.com/users/altany"
                target="_codewars"
                title="User altany"
              >
                <Icon icon={CODEWARS} />
                <img
                  src="https://www.codewars.com/users/altany/badges/small"
                  alt="codewars profile badge"
                />
              </a>
            </div>
          </section>
        </div>
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
      </div>
    </Layout>
  );
}
