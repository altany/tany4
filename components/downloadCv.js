import { CV_PDF_URL } from "../lib/constants";
import styles from "../styles/page.module.scss";

// The CV as a PDF, as a terminal line you can click. `compact` is the sidebar's
// narrower version; the wide one sits at the end of the CV itself.
export default function DownloadCv({ compact = false }) {
  return (
    <a
      href={CV_PDF_URL}
      target="_cv"
      rel="noopener noreferrer"
      className={`${styles.cvDownload} ${compact ? styles.cvDownloadCompact : ""}`}
      aria-label="Download the CV as a PDF"
    >
      <span className={styles.cvDownloadCommand}>
        <span className={styles.prompt}>tania@tany4</span> ~ % open cv.pdf
      </span>
      <span className={styles.cvDownloadFile}>
        <span aria-hidden="true">↓</span> {compact ? "CV.pdf" : "TaniaPapazafeiropoulou-CV.pdf"}
        {/* One blinking caret on the page is enough: the side pane's copy sits
            next to the CV itself and would be a second thing flashing */}
        {!compact && <span className={styles.caret} aria-hidden="true" />}
      </span>
    </a>
  );
}
