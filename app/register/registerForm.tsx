
"use client";
import { useActionState, useState } from "react";
import { registerAction } from "./action";
import styles from "./registerForm.module.css";

type RegisterFormState = {
  error?: string;
};

const initialState: RegisterFormState = {};
export default function RegisterForm() {
  const [state, formAction, isPending] = useActionState<
    RegisterFormState,
    FormData
  >(registerAction, initialState);
  const [role, setRole] = useState<"jobseeker" | "recruiter">("jobseeker");

  return (
    <div className={styles.registerShell}>
      <div className={styles.registerPromo}>
        <div className={styles.promoContent}>
          <h1 className={styles.promoTitle}>
            Join HireBridge today
          </h1>
          <p className={styles.promoText}>
            Create an account to apply for jobs, track applications, and grow your career.
          </p>

          <ul className={styles.promoList}>
            <li>✅ One profile, multiple applications</li>
            <li>✅ Real-time application updates</li>
            <li>✅ Secure and private</li>
          </ul>
        </div>
      </div>

      <div className={styles.registerPanel}>
        <div className={styles.registerCard}>
          <div className={styles.registerHeader}>
            <div className={styles.registerBadge}>
              H
            </div>
            <h2 className={styles.registerTitle}>
              Create your account
            </h2>
            <p className={styles.registerSubtitle}>
              Fill in your details to get started
            </p>
          </div>

          <form action={formAction} className={styles.form}>
            <div>
              <label className={styles.fieldLabel}>
                Full name
              </label>
              <input
                disabled={isPending}
                name="name"
                placeholder="Jane Doe"
                className={styles.fieldInput}
                required
              />
            </div>

            <div>
              <label className={styles.fieldLabel}>
                Email address
              </label>
              <input
                disabled={isPending}
                name="email"
                type="email"
                placeholder="you@company.com"
                className={styles.fieldInput}
                required
              />
            </div>

            <div>
              <label className={styles.fieldLabel}>
                Password
              </label>
              <input
                disabled={isPending}
                name="password"
                type="password"
                placeholder="••••••••"
                className={styles.fieldInput}
                required
              />
            </div>

            <div>
              <label className={styles.fieldLabel}>
                Account type
              </label>
              <select
                disabled={isPending}
                name="role"
                value={role}
                onChange={(event) =>
                  setRole(event.target.value as "jobseeker" | "recruiter")
                }
                className={styles.fieldInput}
              >
                <option value="jobseeker">Job Seeker</option>
                <option value="recruiter">Recruiter</option>
              </select>
            </div>

            {role === "recruiter" ? (
              <div>
                <label className={styles.fieldLabel}>
                  Company name
                </label>
                <input
                  disabled={isPending}
                  name="company"
                  placeholder="Acme Inc."
                  className={styles.fieldInput}
                  required
                />
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isPending}
              className={styles.submitButton}
            >
              {isPending ? "Creating account..." : "Create account"}
            </button>

            <div
              className={`${styles.errorBanner} ${state?.error ? styles.errorActive : styles.errorIdle}`}
            >
              {state?.error || " "}
            </div>
          </form>

          <p className={styles.registerFooter}>
            Already have an account?{" "}
            <a href="/login" className={styles.registerLink}>
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
