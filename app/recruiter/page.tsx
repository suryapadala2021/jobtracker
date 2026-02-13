import { Types } from "mongoose";
import getCurrentUser from "@/lib/auth/getCurrentUser";
import "./page.css";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function RecruiterPage() {
    // const params = await searchParams;
    // const { } = params || {};
  return (
    <main className="recruiterPage">
      <header className="topBar">
        <div className="brand">
          HireBridge
          <span className="brandTag">Recruiter</span>
        </div>
        <Link className="primaryButton" href = {"/recruiter/createRole"}>Create role</Link>
      </header>

      <section className="hero">
        <h1 className="heroTitle">Recruiter dashboard</h1>
        <p className="heroText">
          A simple view to keep roles and candidates moving forward.
        </p>
        <div className="heroActions">
          <button className="secondaryButton" type="button">Review candidates</button>
          <button className="ghostButton" type="button">Schedule interviews</button>
        </div>
      </section>

      <section className="stats">
        <div className="statCard">
          <p className="statLabel">Open roles</p>
          <p className="statValue">3</p>
        </div>
        <div className="statCard">
          <p className="statLabel">Active candidates</p>
          <p className="statValue">48</p>
        </div>
        <div className="statCard">
          <p className="statLabel">Interviews this week</p>
          <p className="statValue">11</p>
        </div>
      </section>

      <section className="list">
        <h2 className="listTitle">Today</h2>
        <ul className="listItems">
          <li>Finalize Frontend role brief</li>
          <li>Review Data Analyst shortlist</li>
          <li>Send PM interview invites</li>
        </ul>
      </section>

      <footer className="footer">© {new Date().getFullYear()} HireBridge.</footer>
    </main>
  );
}
