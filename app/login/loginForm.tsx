"use client";

import { useActionState } from "react";
import { loginAction } from "./action";

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
    <div className="loginShell">
      {/* Left panel unchanged */}

      <div className="loginPanel">
        <div className="loginCard">
          <div className="loginHeader">
            <div className="loginBadge">
              H
            </div>
            <h2 className="loginTitle">
              Sign in to your account
            </h2>
            <p className="loginSubtitle">
              Enter your credentials to continue
            </p>
          </div>
          <div
            className={`errorBanner ${state?.error ? "errorActive" : "errorIdle"}`}
            role="alert"
            aria-live="assertive"
          >
            {state?.error || " "}
          </div>


          <form action={formAction} className="form" key={state?.error}>
            {/* Email */}
            <div>
              <label className="fieldLabel">
                Email address
              </label>
              <input
                disabled={isPending}
                type="email"
                name="email"
                required
                className="fieldInput"
              />
            </div>

            {/* Password */}
            <div>
              <label className="fieldLabel">
                Password
              </label>
              <input
                disabled={isPending}
                type="password"
                name="password"
                required
                className="fieldInput"
              />
            </div>

            {/* Role */}
            <select
              disabled={isPending}
              name="role"
              defaultValue="jobseeker"
              className="roleSelect"
            >
              <option value="jobseeker">Job Seeker</option>
              <option value="recruiter">Recruiter</option>
            </select>

            {/* Submit */}
            <button
              type="submit"
              disabled={isPending}
              className="submitButton"
            >
              {isPending ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="loginFooter">
            Don’t have an account?{" "}
            <a href="/register" className="loginLink">
              Create one
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
