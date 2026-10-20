/** Грубый разбор User-Agent — для разрезов «устройство / браузер / ОС», без библиотек. */

// Роботы, которые ходят на сайт: по логам прокси это в основном ИИ-краулеры
// (PerplexityBot, ClaudeBot, meta-externalagent и т. п.) и SEO-сервисы.
const BOT = /bot|crawl|spider|slurp|bingpreview|facebookexternalhit|externalagent|externalfetcher|perplexity|chatgpt-user|oai-searchbot|headless|lighthouse|pagespeed|pingdom|uptime|monitor|curl|wget|python|httpclient|axios|node-fetch|go-http|java\/|scrapy|phantom|selenium|puppeteer|playwright|websiphon|lexplore|research-scan/i;

export const isBot = (ua: string) => !ua || BOT.test(ua);

export function parseUa(ua: string): { device: string; browser: string | null; os: string | null } {
  const device = /iPad|Tablet|PlayBook|Silk|Android(?!.*Mobile)/i.test(ua)
    ? "tablet"
    : /Mobi|iPhone|iPod|Android.*Mobile|Opera Mini|IEMobile/i.test(ua)
      ? "mobile"
      : "desktop";

  const browser = /YaBrowser|YaSearchBrowser/.test(ua)
    ? "Яндекс Браузер"
    : /SamsungBrowser/.test(ua)
      ? "Samsung Internet"
      : /Edg\//.test(ua)
        ? "Edge"
        : /OPR\/|Opera/.test(ua)
          ? "Opera"
          : /Firefox\/|FxiOS/.test(ua)
            ? "Firefox"
            : /Chrome\/|CriOS/.test(ua)
              ? "Chrome"
              : /Safari\//.test(ua)
                ? "Safari"
                : null;

  const os = /Windows/.test(ua)
    ? "Windows"
    : /iPhone|iPad|iPod/.test(ua)
      ? "iOS"
      : /Android/.test(ua)
        ? "Android"
        : /Mac OS X|Macintosh/.test(ua)
          ? "macOS"
          : /Linux|X11/.test(ua)
            ? "Linux"
            : null;

  return { device, browser, os };
}
