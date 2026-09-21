import styles from "../styles/page.module.scss";

// A main pane with an optional side pane, like a split editor. The side pane stays in view
// while the page scrolls; turn that off when it's taller than a screen, or its end stays hidden
export default function SplitPage({ children, side, stickySide = true }) {
  return (
    <div className={styles.split}>
      <section className={styles.pane}>{children}</section>
      {side && (
        <aside className={`${styles.pane} ${styles.side}`}>
          <div className={stickySide ? styles.sticky : undefined}>{side}</div>
        </aside>
      )}
    </div>
  );
}
