import type { ReactNode } from "react";
import "./loadingmodule.css";

type JobDetailsLayoutProps = {
  children: ReactNode;
};

export default function JobDetailsLayout({ children }: JobDetailsLayoutProps) {
  return <>{children}</>;
}
