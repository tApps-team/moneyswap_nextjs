import { NextResponse } from "next/server";
import { baseUrl } from "@/shared/consts";
import { routes } from "@/shared/router";

export async function GET() {
  try {
    const sitemaps = [
      `${baseUrl}/sitemap.xml`,
      `${baseUrl}/crypto-exchangers/sitemap.xml`,
      `${baseUrl}/exchange/sitemap.xml`,
      `${baseUrl}${routes.blog}${routes.article}/sitemap.xml`,
      `${baseUrl}${routes.blog}${routes.category}/sitemap.xml`,
      `${baseUrl}${routes.blog}${routes.tag}/sitemap.xml`,
    ];

    const sitemapIndexXML = await buildSitemapIndex(sitemaps);
    return new NextResponse(sitemapIndexXML, {
      headers: {
        "Content-Type": "text/xml",
        "Content-Length": Buffer.byteLength(sitemapIndexXML).toString(),
      },
    });
  } catch (error) {
    console.error(error, "route sitemap");
    return NextResponse.error();
  }
}

async function buildSitemapIndex(sitemaps: string[]) {
  const currentDate = new Date().toISOString();
  
  let xml = '<?xml version="1.0" encoding="UTF-8"?>';
  xml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

  for (const sitemapURL of sitemaps) {
    xml += "<sitemap>";
    xml += `<loc>${sitemapURL}</loc>`;
    xml += `<lastmod>${currentDate}</lastmod>`;
    xml += "</sitemap>";
  }

  xml += "</sitemapindex>";
  return xml;
}
