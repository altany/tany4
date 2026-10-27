import Link from "next/link";
import { PAGES } from "../lib/constants";
import styles from "../styles/page.module.scss";

// The way on to the next page in the menu, as a terminal line you can click.
// `children` is the sentence that ties this page to the next one. The last
// page in the menu has no next page, so it shows nothing.
export default function NextPage({ from, children }) {
  const index = PAGES.findIndex(({ label }) => label === from);
  const next = index === -1 ? undefined : PAGES[index + 1];
  if (!next) return null;

  return (
    <div className={styles.nextPage}>
      <p className={`${styles.lede} ${styles.inline}`}>{children}</p>
      <Link href={next.href} className={styles.termLink} aria-label={`Next page: ${next.label}`}>
        <span className={styles.termLinkCommand}>
          <span className={styles.prompt}>tania@tany4</span> ~/{from} % cd ../{next.label}
        </span>
        <span className={styles.termLinkTarget}>
          <span aria-hidden="true">→</span> {next.label}
        </span>
      </Link>
    </div>
  );
}
