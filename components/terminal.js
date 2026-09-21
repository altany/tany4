import styles from "../styles/page.module.scss";

const Prompt = () => <span className={styles.prompt}>tania@tany4</span>;

// One terminal block per page: each step is a command and what it printed.
// A final empty prompt with a blinking caret unless `caret` is false.
export default function Terminal({ steps, caret = true, compact = false, label }) {
  return (
    <div className={`${styles.term} ${compact ? styles.termCompact : ""}`} aria-label={label}>
      {steps.map(({ command, output = [] }) => (
        <div key={command}>
          <div>
            <Prompt /> ~ % {command}
          </div>
          {output.map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </div>
      ))}
      {caret && (
        <div>
          <Prompt /> ~ % <span className={styles.caret} />
        </div>
      )}
    </div>
  );
}

// "›" in the warm accent, for list-like output
export const Mark = () => <span className={styles.mark}>›</span>;
