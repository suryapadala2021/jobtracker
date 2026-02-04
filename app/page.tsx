import styles from "./page.module.css";

export default function HomePage() {
  return (
    <main className={styles.home}>
      {/* Navbar */}
      <header className={styles.nav}>
        <div className={styles.brand}>
          HireBridge
        </div>

        <div className={styles.navLinks}>
          <a
            href="/login"
            className={styles.navLink}
          >
            Login
          </a>
          <a
            href="/register"
            className={styles.navPrimary}
          >
            Get Started
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>
          Find the right job.  
          <span>
            Hire the right talent.
          </span>
        </h1>

        <p className={styles.heroText}>
          A simple platform for job seekers and recruiters to connect, apply,
          and hire faster — built with modern tech.
        </p>

        <div className={styles.heroActions}>
          <a
            href="/register"
            className={styles.heroPrimary}
          >
            Join as Job Seeker
          </a>
          <a
            href="/register"
            className={styles.heroSecondary}
          >
            Join as Recruiter
          </a>
        </div>
      </section>

      {/* Features */}
      <section className={styles.features}>
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <h3 className={styles.featureTitle}>
              For Job Seekers
            </h3>
            <p className={styles.featureText}>
              Discover jobs, apply easily, and track your applications in one place.
            </p>
          </div>

          <div className={styles.featureCard}>
            <h3 className={styles.featureTitle}>
              For Recruiters
            </h3>
            <p className={styles.featureText}>
              Post jobs, review candidates, and manage hiring workflows.
            </p>
          </div>

          <div className={styles.featureCard}>
            <h3 className={styles.featureTitle}>
              Built for Speed
            </h3>
            <p className={styles.featureText}>
              Modern stack with Next.js & MongoDB for fast and scalable hiring.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        © {new Date().getFullYear()} HireBridge. All rights reserved.
      </footer>
    </main>
  );
}
