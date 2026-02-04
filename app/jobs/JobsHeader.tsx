"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type FilterDraft = {
  search: string;
  minSalary: number;
  exp: string;
  status: "open" | "closed";
};

function getDraftFromQuery(query: string): FilterDraft {
  const params = new URLSearchParams(query);
  return {
    search: params.get("search") ?? "",
    minSalary: Number(params.get("minSalary")) || 0,
    exp: params.get("exp") ?? "",
    status: params.get("status") === "closed" ? "closed" : "open",
  };
}

export default function JobsHeader() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.toString();

  const [draft, setDraft] = useState<FilterDraft>(() => getDraftFromQuery(query));
  const [maxSalaryBound, setMaxSalaryBound] = useState(0);

  useEffect(() => {
    setDraft(getDraftFromQuery(query));
  }, [query]);

  useEffect(() => {
    let isCancelled = false;

    async function fetchFilters() {
      try {
        const response = await fetch("/api/filters");
        if (!response.ok) return;

        const data = await response.json();
        if (!isCancelled) {
          setMaxSalaryBound(Number(data?.maxSalary) || 0);
        }
      } catch {
        if (!isCancelled) {
          setMaxSalaryBound(0);
        }
      }
    }

    fetchFilters();
    return () => {
      isCancelled = true;
    };
  }, []);

  function applyFilters(e: FormEvent) {
    e.preventDefault();

    const params = new URLSearchParams(query);

    if (draft.search) params.set("search", draft.search);
    else params.delete("search");

    if (draft.minSalary > 0) params.set("minSalary", String(draft.minSalary));
    else params.delete("minSalary");

    if (draft.exp) params.set("exp", draft.exp);
    else params.delete("exp");

    params.set("status", draft.status);
    params.delete("page");

    const nextQuery = params.toString();
    router.push(nextQuery ? `/jobs?${nextQuery}` : "/jobs");
  }

  return (
    <header className="header compact">
      <div className="headerTop">
        <div>
          <h1 className="title">Job Feed</h1>
          <p className="subtitle">Browse roles quickly</p>
        </div>
      </div>

      <form
        onKeyDown={(e) => {
          if (e.key === "Enter") e.preventDefault();
        }}
        onSubmit={applyFilters}
        className="filterBar"
      >
        <div className="filterLeft">
          <input
            className="filterInput"
            placeholder="Search by title, skills, company, location"
            type="search"
            value={draft.search}
            onChange={(e) => setDraft((prev) => ({ ...prev, search: e.target.value }))}
          />

          <div className="filterBlock">
            <label>Salary (LPA)</label>
            <div className="rangeRow">
              <span>{draft.minSalary / 100000}+ LPA</span>
              <input
                type="range"
                min={0}
                max={maxSalaryBound}
                step={100000}
                value={draft.minSalary}
                onChange={(e) =>
                  setDraft((prev) => ({ ...prev, minSalary: Number(e.target.value) }))
                }
              />
            </div>
          </div>

          <div className="filterBlock experienceFilter">
            <label htmlFor="experienceRange">Experience (years)</label>
            <select
              id="experienceRange"
              className="experienceSelect"
              value={draft.exp}
              onChange={(e) => setDraft((prev) => ({ ...prev, exp: e.target.value }))}
            >
              <option value="">Any experience</option>
              <option value="0-3">0-3</option>
              <option value="3-5">3-5</option>
              <option value="5-10">5-10</option>
              <option value="10-15">10-15</option>
              <option value="15-20">15-20</option>
              <option value="20">20+</option>
            </select>
          </div>

          <div className="statusFilter">
            <label className="statusHeading" htmlFor="statusSwitch">
              Job status
            </label>
            <label className="statusSwitch" htmlFor="statusSwitch">
              <span className="statusText">{draft.status === "closed" ? "Closed" : "Open"}</span>
              <input
                id="statusSwitch"
                className="statusInput"
                type="checkbox"
                checked={draft.status === "closed"}
                onChange={(e) =>
                  setDraft((prev) => ({
                    ...prev,
                    status: e.target.checked ? "closed" : "open",
                  }))
                }
              />
              <span className="statusSlider" aria-hidden />
            </label>
          </div>
        </div>

        <button type="submit" className="filterApplyBtn">
          Apply
        </button>
      </form>
    </header>
  );
}
