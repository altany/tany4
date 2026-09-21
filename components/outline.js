import { useEffect, useRef, useState } from "react";
import styles from "../styles/page.module.scss";

// How far below the top of the window a section counts as the one being read
const READING_LINE = 120;

// The section currently being read: the last one whose top has passed the reading line,
// or the last section once the page is scrolled to the bottom
export function currentSection(ids, { tops, scrollY, viewport, pageHeight }) {
  if (ids.length === 0) return null;
  if (scrollY + viewport >= pageHeight - 2) return ids[ids.length - 1];
  let current = ids[0];
  ids.forEach((id, i) => {
    if (tops[i] !== null && tops[i] <= READING_LINE) current = id;
  });
  return current;
}

// An editor-style outline that follows the reader down the page
export default function Outline({ items }) {
  const [active, setActive] = useState(items[0]?.id ?? null);
  // After a click, keep the clicked section highlighted until the reader scrolls themselves;
  // near the bottom of a page the scroll position alone would pick the last section
  const clicked = useRef(false);

  useEffect(() => {
    const ids = items.map((i) => i.id);
    let frame = null;
    const update = () => {
      frame = null;
      if (clicked.current) return;
      const tops = ids.map((id) => document.getElementById(id)?.getBoundingClientRect().top ?? null);
      setActive(
        currentSection(ids, {
          tops,
          scrollY: window.scrollY,
          viewport: window.innerHeight,
          pageHeight: document.documentElement.scrollHeight,
        })
      );
    };
    const onScroll = () => {
      if (frame === null) frame = requestAnimationFrame(update);
    };
    const release = () => {
      clicked.current = false;
    };
    const userScrolls = ["wheel", "touchmove", "keydown"];
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    userScrolls.forEach((e) => window.addEventListener(e, release, { passive: true }));
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      userScrolls.forEach((e) => window.removeEventListener(e, release));
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, [items]);

  return (
    <ul className={styles.outline}>
      {items.map(({ id, text }) => (
        <li key={id}>
          <a
            href={`#${id}`}
            className={active === id ? styles.outlineOn : undefined}
            aria-current={active === id ? "location" : undefined}
            onClick={() => {
              clicked.current = true;
              setActive(id);
            }}
          >
            {text}
          </a>
        </li>
      ))}
    </ul>
  );
}
