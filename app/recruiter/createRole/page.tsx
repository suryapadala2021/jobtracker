"use client"
import { createRoleAction } from "./action";
import "./page.css";
import { useActionState } from "react";

type CreateRoleState = {
    error?: string;
    success?: string
};
const initialState: CreateRoleState = {};
export default function CreateRolePage() {
    const [state, formAction, isPending] = useActionState<CreateRoleState, FormData>(createRoleAction, initialState)

    return (
        <main className="createRole">
            <header className="pageHeader">
                <div>
                    <p className="eyebrow">Recruiter</p>
                    <h1 className="title">Create a job</h1>
                    <p className="subtitle">Fill in details that match your job model.</p>
                </div>
            </header>

            <form className="formCard" action={formAction}>
                <div className="field">
                    <label className="label">Job title</label>
                    <input className="input" name="title" placeholder="Senior Frontend Engineer" disabled={isPending} />
                </div>

                <div className="fieldRow">
                    <div className="field">
                        <label className="label">Location</label>
                        <input className="input" name="location" placeholder="Remote / Bengaluru" disabled={isPending} />
                    </div>
                </div>

                <div className="field">
                    <label className="label">Role description</label>
                    <textarea className="textarea" name="description" placeholder="Short overview of the role." disabled={isPending} />
                </div>

                <div className="field">
                    <label className="label">Skills (comma separated)</label>
                    <input className="input" name="skills" placeholder="React, TypeScript, UI systems" disabled={isPending} />
                    <p className="helper">Matches the `skills` array in the job model.</p>
                </div>

                <div className="fieldRow">
                    <div className="field">
                        <label className="label">Experience min (years)</label>
                        <input className="input" name="experienceMin" type="number" min="0" placeholder="2" disabled={isPending} />
                    </div>
                    <div className="field">
                        <label className="label">Experience max (years)</label>
                        <input className="input" name="experienceMax" type="number" min="0" placeholder="5" disabled={isPending} />
                    </div>
                </div>

                <div className="fieldRow">
                    <div className="field">
                        <label className="label">Salary min</label>
                        <input className="input" name="salaryMin" type="number" min="0" placeholder="1200000" disabled={isPending} />
                    </div>
                    <div className="field">
                        <label className="label">Salary max</label>
                        <input className="input" name="salaryMax" type="number" min="0" placeholder="1800000" disabled={isPending} />
                    </div>
                </div>

                <div className="fieldRow">
                    <div className="field">
                        <label className="label">Company name</label>
                        <input className="input" name="companyName" placeholder="Acme Inc." disabled={isPending} />
                    </div>
                    <div className="field">
                        <label className="label">Company logo URL</label>
                        <input className="input" name="companyLogo" placeholder="https://..." disabled={isPending} />
                    </div>
                </div>

                <div className="actions">
                    <button className="ghostButton" type="button" disabled={isPending}>Cancel</button>
                    <button className="primaryButton" type="submit" disabled={isPending}>Publish job</button>
                </div>
            </form>
        </main>
    );
}
