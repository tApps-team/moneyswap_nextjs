import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { runReport } from "@/cms/server/stats";
import { isValidCmsToken } from "@/cms/server/stats/auth";
import { CMS_COOKIE } from "@/cms/server/strapi-admin";
import { analyticsEnabled } from "@/shared/analytics/server/db";

export const dynamic = "force-dynamic";

/** Отчёты раздела «Статистика». Данные — из отдельной базы статистики, не из Strapi. */
export async function GET(req: NextRequest, { params }: { params: { report: string } }) {
  if (!(await isValidCmsToken(cookies().get(CMS_COOKIE)?.value))) {
    return NextResponse.json({ message: "Сессия истекла" }, { status: 401 });
  }
  if (!analyticsEnabled()) {
    return NextResponse.json({ message: "База статистики не подключена", code: "disabled" }, { status: 503 });
  }
  try {
    const data = await runReport(params.report, req.nextUrl.searchParams);
    if (data === undefined) return NextResponse.json({ message: "Нет такого отчёта" }, { status: 404 });
    if (data === null) return NextResponse.json({ message: "Не найдено" }, { status: 404 });
    return NextResponse.json(data, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    console.error(`[stats] ${params.report} failed:`, err);
    return NextResponse.json({ message: "Не удалось построить отчёт" }, { status: 500 });
  }
}
