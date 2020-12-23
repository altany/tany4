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
          <section className={styles.git}>
            <div className={styles.label}>GIT</div>
            <div className={styles.curly}>{"{"}</div>
            <ul>
              <li>
                <a
                  href="http://www.github.com/altany"
                  target="_github"
                  title="altany"
                >
                  <b>Hub</b>
                  <Icon icon={GITHUB} />
                  altany
                </a>
              </li>

              <li>
                <a
                  href="https://gitlab.com/brief-challenges"
                  target="_gitlab"
                  title="altany"
                >
                  <b>Lab</b>
                  <Icon icon={GITLAB} />
                  altany
                </a>
              </li>
            </ul>
          </section>
          <ul className={styles.links}>
            <li>
              <a
                href="https://twitter.com/_Tany_"
                target="_twitter"
                title="Twitter profile - @_Tany_"
              >
                <Icon icon={TWITTER} />
                @_Tany_
              </a>
            </li>
            <li>
              <a
                href="http://www.linkedin.com/in/taniapapazaf"
                target="_linkedin"
                title="Linkedin profile - in/taniapapazaf"
              >
                <Icon icon={LINKEDIN} />
                /taniapapazaf
              </a>
            </li>
            <li>
              <a
                href="http://stackoverflow.com/story/tany4"
                target="_stackoverflow"
                title="StackOverflow story - tany4"
              >
                <Icon icon={STACKOVERFLOW} />
                tany4
              </a>
            </li>
          </ul>
          <section className={styles.codewars}>
            Do you enjoy code challenges? Find me at CodeWars!
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
