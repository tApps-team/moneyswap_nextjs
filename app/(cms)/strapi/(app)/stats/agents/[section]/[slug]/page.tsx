import { notFound } from "next/navigation";
import { AgentPage } from "@/cms/ui/stats/agent-page";
import { isStatSection } from "@/shared/analytics/classify";

export default function Page({ params }: { params: { section: string; slug: string } }) {
  if (!isStatSection(params.section)) notFound();
  return <AgentPage section={params.section} slug={decodeURIComponent(params.slug)} />;
}
