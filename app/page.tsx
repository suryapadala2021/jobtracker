import "./page.css";

export default function HomePage() {
  return (
    <main className="home">
      {/* Navbar */}
      <header className="nav">
        <div className="brand">
          HireBridge
        </div>

        <div className="navLinks">
          <a
            href="/login"
            className="navLink"
          >
            Login
          </a>
          <a
            href="/register"
            className="navPrimary"
          >
            Get Started
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <h1 className="heroTitle">
          Find the right job.  
          <span>
            Hire the right talent.
          </span>
        </h1>

        <p className="heroText">
          A simple platform for job seekers and recruiters to connect, apply,
          and hire faster — built with modern tech.
        </p>

        <div className="heroActions">
          <a
            href="/register"
            className="heroPrimary"
          >
            Join as Job Seeker
          </a>
          <a
            href="/register"
            className="heroSecondary"
          >
            Join as Recruiter
          </a>
        </div>
      </section>

      {/* Features */}
      <section className="features">
        <div className="featuresGrid">
          <div className="featureCard">
            <h3 className="featureTitle">
              For Job Seekers
            </h3>
            <p className="featureText">
              Discover jobs, apply easily, and track your applications in one place.
            </p>
          </div>

          <div className="featureCard">
            <h3 className="featureTitle">
              For Recruiters
            </h3>
            <p className="featureText">
              Post jobs, review candidates, and manage hiring workflows.
            </p>
          </div>

          <div className="featureCard">
            <h3 className="featureTitle">
              Built for Speed
            </h3>
            <p className="featureText">
              Modern stack with Next.js & MongoDB for fast and scalable hiring.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        © {new Date().getFullYear()} HireBridge. All rights reserved.
      </footer>
    </main>
  );
}
