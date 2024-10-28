import { NextResponse } from "next/server";
import { baseUrl } from "@/shared/consts";

export async function GET() {
  try {
    const sitemaps = [
      `${baseUrl}sitemap.xml`,
      `${baseUrl}crypto-exchangers/sitemap.xml`,
      `${baseUrl}exchange/sitemap.xml`,
    ];

    const sitemapIndexXML = await buildSitemapIndex(sitemaps);
    return new NextResponse(sitemapIndexXML, {
      headers: {
        "Content-Type": "application/xml",
        "Content-Length": Buffer.byteLength(sitemapIndexXML).toString(),
      },
    });
  } catch (error) {
    console.error(error, "route sitemap");
    return NextResponse.error();
  }
}

async function buildSitemapIndex(sitemaps: string[]) {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

  for (const sitemapURL of sitemaps) {
    xml += "<url>";
    xml += `<loc>${sitemapURL}</loc>`;
    xml += "</url>";
  }

  xml += "</urlset>";
  return xml;
}
