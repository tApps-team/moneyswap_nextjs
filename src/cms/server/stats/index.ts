import { isStatSection } from "@/shared/analytics/classify";
import { agentReport, agentsTable } from "./agents";
import { filtersReport, funnel } from "./behavior";
import { exchangeReport } from "./exchange";
import { devicesBreakdown, overview, sourcesBreakdown } from "./overview";
import { blogReport, eventsReport, pagesReport } from "./pages";
import { parseFilters } from "./query";
import { parseSessionFilters, realtime, sessionDetail, sessionsList, visitorDetail } from "./sessions";

/** Отчёты по имени из адреса /strapi/api/stats/<report>. */
export async function runReport(report: string, params: URLSearchParams): Promise<unknown> {
  const f = parseFilters(params);
  switch (report) {
    case "overview":
      return overview(f);
    case "agents":
      return { rows: await agentsTable(f) };
    case "agent": {
      const section = params.get("section");
      const slug = params.get("slug");
      if (!isStatSection(section) || !slug) return null;
      return agentReport(f, section, slug);
    }
    case "exchange":
      return exchangeReport(f);
    case "funnel":
      return funnel(f);
    case "filters":
      return filtersReport(f);
    case "pages": {
      const group = params.get("group");
      return { rows: await pagesReport(f, group === "type" || group === "entity" ? group : "path", params.get("pageType") ?? undefined) };
    }
    case "sources": {
      const [types, hosts, utm, devices, os, browsers] = await Promise.all([
        sourcesBreakdown(f, "type"),
        sourcesBreakdown(f, "host"),
        sourcesBreakdown(f, "utm"),
        devicesBreakdown(f, "device"),
        devicesBreakdown(f, "os"),
        devicesBreakdown(f, "browser"),
      ]);
      return { types, hosts, utm, devices, os, browsers };
    }
    case "blog":
      return blogReport(f);
    case "events":
      return eventsReport(f);
    case "sessions":
      return sessionsList(f, parseSessionFilters(params));
    case "session":
      return sessionDetail(params.get("id") ?? "");
    case "visitor":
      return visitorDetail(params.get("id") ?? "");
    case "realtime":
      return realtime(f.includeStaff);
    default:
      return undefined;
  }
}
