
"use client";
import { useActionState, useState } from "react";
import { registerAction } from "./action";

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
    <div className="registerShell">
      <div className="registerPromo">
        <div className="promoContent">
          <h1 className="promoTitle">
            Join HireBridge today
          </h1>
          <p className="promoText">
            Create an account to apply for jobs, track applications, and grow your career.
          </p>

          <ul className="promoList">
            <li>✅ One profile, multiple applications</li>
            <li>✅ Real-time application updates</li>
            <li>✅ Secure and private</li>
          </ul>
        </div>
      </div>

      <div className="registerPanel">
        <div className="registerCard">
          <div className="registerHeader">
            <div className="registerBadge">
              H
            </div>
            <h2 className="registerTitle">
              Create your account
            </h2>
            <p className="registerSubtitle">
              Fill in your details to get started
            </p>
          </div>

          <form action={formAction} className="form" key={state?.error}>
            <div>
              <label className="fieldLabel">
                Full name
              </label>
              <input
                disabled={isPending}
                name="name"
                placeholder="Jane Doe"
                className="fieldInput"
                required
              />
            </div>

            <div>
              <label className="fieldLabel">
                Email address
              </label>
              <input
                disabled={isPending}
                name="email"
                type="email"
                placeholder="you@company.com"
                className="fieldInput"
                required
              />
            </div>

            <div>
              <label className="fieldLabel">
                Password
              </label>
              <input
                disabled={isPending}
                name="password"
                type="password"
                placeholder="••••••••"
                className="fieldInput"
                required
              />
            </div>

            <div>
              <label className="fieldLabel">
                Account type
              </label>
              <select
                disabled={isPending}
                name="role"
                value={role}
                onChange={(event) =>
                  setRole(event.target.value as "jobseeker" | "recruiter")
                }
                className="fieldInput"
              >
                <option value="jobseeker">Job Seeker</option>
                <option value="recruiter">Recruiter</option>
              </select>
            </div>

            {role === "recruiter" ? (
              <div>
                <label className="fieldLabel">
                  Company name
                </label>
                <input
                  disabled={isPending}
                  name="company"
                  placeholder="Acme Inc."
                  className="fieldInput"
                  required
                />
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isPending}
              className="submitButton"
            >
              {isPending ? "Creating account..." : "Create account"}
            </button>

            <div
              className={`errorBanner ${state?.error ? "errorActive" : "errorIdle"}`}
            >
              {state?.error || " "}
            </div>
          </form>

          <p className="registerFooter">
            Already have an account?{" "}
            <a href="/login" className="registerLink">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
