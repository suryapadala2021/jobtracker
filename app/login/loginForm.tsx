"use client";

import { useActionState } from "react";
import { loginAction } from "./action";
import styles from "./loginForm.module.css";

type LoginFormState = {
  error?: string;
};

const initialState: LoginFormState = {};
export default function LoginPage() {
  const [state, formAction, isPending] = useActionState<
    LoginFormState,
    FormData
  >(loginAction, initialState);
  return (
    <div className={styles.loginShell}>
      {/* Left panel unchanged */}

      <div className={styles.loginPanel}>
        <div className={styles.loginCard}>
          <div className={styles.loginHeader}>
            <div className={styles.loginBadge}>
              H
            </div>
            <h2 className={styles.loginTitle}>
              Sign in to your account
            </h2>
            <p className={styles.loginSubtitle}>
              Enter your credentials to continue
            </p>
          </div>
          <div
            className={`${styles.errorBanner} ${state?.error ? styles.errorActive : styles.errorIdle}`}
            role="alert"
            aria-live="assertive"
          >
            {state?.error || " "}
          </div>


          <form action={formAction} className={styles.form} key={state?.error}>
            {/* Email */}
            <div>
              <label className={styles.fieldLabel}>
                Email address
              </label>
              <input
                disabled={isPending}
                type="email"
                name="email"
                required
                className={styles.fieldInput}
              />
            </div>

            {/* Password */}
            <div>
              <label className={styles.fieldLabel}>
                Password
              </label>
              <input
                disabled={isPending}
                type="password"
                name="password"
                required
                className={styles.fieldInput}
              />
            </div>

            {/* Role */}
            <select
              disabled={isPending}
              name="role"
              defaultValue="jobseeker"
              className={styles.roleSelect}
            >
              <option value="jobseeker">Job Seeker</option>
              <option value="recruiter">Recruiter</option>
            </select>

            {/* Submit */}
            <button
              type="submit"
              disabled={isPending}
              className={styles.submitButton}
            >
              {isPending ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className={styles.loginFooter}>
            Don’t have an account?{" "}
            <a href="/register" className={styles.loginLink}>
              Create one
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
