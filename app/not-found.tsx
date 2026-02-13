import Link from "next/link";
import "./not-found.css";

export default function NotFound() {
  return (
    <div className="notFound">
      <div className="notFoundInner">
        <div className="notFoundCard">
          <div className="glowTop" />
          <div className="glowBottom" />
          <div className="headerRow">
            <div className="alertBadge">
              !
            </div>
            <div>
              <h1 className="title">
                Page not found
              </h1>
              <p className="subtitle">
                The page you’re looking for doesn’t exist or was moved.
              </p>
            </div>
          </div>

          <div className="actions">
            <Link
              href="/jobs"
              className="primaryLink"
            >
              Browse all jobs
            </Link>
            <Link
              href="/"
              className="secondaryLink"
            >
              Go to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
