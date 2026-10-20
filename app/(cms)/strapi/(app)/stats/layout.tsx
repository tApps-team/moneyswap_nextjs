import { ReactNode } from "react";
import { StatsLayout } from "@/cms/ui/stats/stats-layout";

export default function Layout({ children }: { children: ReactNode }) {
  return <StatsLayout>{children}</StatsLayout>;
}
