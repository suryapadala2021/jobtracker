import Link from "next/link";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <div className={styles.notFound}>
      <div className={styles.notFoundInner}>
        <div className={styles.notFoundCard}>
          <div className={styles.glowTop} />
          <div className={styles.glowBottom} />
          <div className={styles.headerRow}>
            <div className={styles.alertBadge}>
              !
            </div>
            <div>
              <h1 className={styles.title}>
                Page not found
              </h1>
              <p className={styles.subtitle}>
                The page you’re looking for doesn’t exist or was moved.
              </p>
            </div>
          </div>

          <div className={styles.actions}>
            <Link
              href="/jobs"
              className={styles.primaryLink}
            >
              Browse all jobs
            </Link>
            <Link
              href="/"
              className={styles.secondaryLink}
            >
              Go to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
