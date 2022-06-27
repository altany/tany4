import Head from "next/head";
import Link from "next/link";
import Layout from "../../components/layout";
import { SITE_TITLE } from "../../lib/constants";
import Icon from "../../components/icon";
import Chart from "../../components/github/chart";
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
        <title>{SITE_TITLE} - My work</title>
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
                  title="Github profile - altany"
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
                  title="Gitlab profile - altany"
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
                href="https://stackoverflow.com/users/2075902/tany4"
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
              title="Codewars - altany"
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
          <p className={styles.chartInfo}>
            You can interact with the chart to get information about languages
            and repos for my{" "}
            <a
              href="http://www.github.com/altany"
              target="_github"
              title="Github profile - altany"
            >
              Github account
            </a>
            . It is built using the Github API and it's running in{" "}
            <a
              href="https://github-api-altany.herokuapp.com/"
              title="API data"
              target="_blank"
            >
              Heroku
            </a>
            . The source is available on a{" "}
            <a
              href="https://github.com/altany/docker-github-api"
              title="Github repo for the server"
              target="_blank"
            >
              github repo
            </a>{" "}
            and the docker container is also available{" "}
            <a
              href="https://hub.docker.com/r/altany/github-api-docker"
              title="Docker container running a server for fetching data for the 'altany' repo"
              target="_blank"
            >
              here
            </a>
            .
          </p>
          <Chart />
        </section>
      </div>
    </Layout>
  );
}
