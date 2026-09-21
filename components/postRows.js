import Link from "next/link";
import Date from "./date";
import styles from "../styles/page.module.scss";

// A plain list of posts: title, optional excerpt, then date and topics in mono
export default function PostRows({ posts, withExcerpt = false }) {
  return (
    <ul className={styles.rows}>
      {posts.map(({ id, title, date, categories = [], description, new: isNew }) => (
        <li key={id}>
          <Link href={`/blog/posts/${id}`}>
            <span className={styles.rowTitle}>{title}</span>
            {withExcerpt && description && <span className={styles.rowText}>{description}</span>}
            <span className={styles.rowMeta}>
              <Date dateString={date} format="MMM yyyy" />
              {isNew && (
                <>
                  {" · "}
                  <i>new</i>
                </>
              )}
              {categories.length > 0 && ` · ${categories.map((c) => c.toLowerCase()).join(", ")}`}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
