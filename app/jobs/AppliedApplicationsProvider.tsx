"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { ClientApplication } from "../commonFunction/convertClientApplication";

type AppliedApplicationsResponse = {
  appliedJobIds: string[];
  applications: ClientApplication[];
};

type AppliedApplicationsContextValue = {
  isLoading: boolean;
  applications: ClientApplication[];
  isJobApplied: (jobId: string) => boolean;
  getAppliedJobId: (jobId: string) => string;
  refreshAppliedData: () => Promise<void>;
};

const AppliedApplicationsContext = createContext<AppliedApplicationsContextValue | null>(null);

type AppliedApplicationsProviderProps = {
  children: ReactNode;
};

export function AppliedApplicationsProvider({ children }: AppliedApplicationsProviderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [applications, setApplications] = useState<ClientApplication[]>([]);
  const [appliedJobIds, setAppliedJobIds] = useState<string[]>([]);

  const refreshAppliedData = useCallback(async () => {
    try {
      const response = await fetch("/api/applications", { cache: "no-store" });
      if (!response.ok) {
        setApplications([]);
        setAppliedJobIds([]);
        setIsLoading(false);
        return;
      }

      const data = (await response.json()) as AppliedApplicationsResponse;
      setApplications(Array.isArray(data.applications) ? data.applications : []);
      setAppliedJobIds(Array.isArray(data.appliedJobIds) ? data.appliedJobIds : []);
    } catch {
      setApplications([]);
      setAppliedJobIds([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshAppliedData();
  }, [refreshAppliedData]);

  const appliedJobIdSet = useMemo(() => new Set(appliedJobIds), [appliedJobIds]);

  const contextValue = useMemo<AppliedApplicationsContextValue>(() => {
    return {
      isLoading,
      applications,
      isJobApplied: (jobId: string) => appliedJobIdSet.has(jobId),
      getAppliedJobId: (jobId: string) => (appliedJobIdSet.has(jobId) ? jobId : ""),
      refreshAppliedData,
    };
  }, [applications, appliedJobIdSet, isLoading, refreshAppliedData]);

  return (
    <AppliedApplicationsContext.Provider value={contextValue}>
      {children}
    </AppliedApplicationsContext.Provider>
  );
}

export function useAppliedApplications() {
  const context = useContext(AppliedApplicationsContext);
  if (!context) {
    throw new Error("useAppliedApplications must be used inside AppliedApplicationsProvider.");
  }
  return context;
}
