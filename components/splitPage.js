import styles from "../styles/page.module.scss";

// A main pane with an optional side pane, like a split editor
export default function SplitPage({ children, side }) {
  return (
    <div className={styles.split}>
      <section className={styles.pane}>{children}</section>
      {side && (
        <aside className={`${styles.pane} ${styles.side}`}>
          <div className={styles.sticky}>{side}</div>
        </aside>
      )}
    </div>
  );
}
