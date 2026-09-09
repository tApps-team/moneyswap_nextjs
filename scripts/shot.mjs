/**
 * Скриншоты страниц в нескольких ширинах — инструмент для проверки адаптива.
 * Заодно ловит горизонтальное переполнение и называет виновный элемент.
 *
 * Требует запущенный дев-сервер (npm run dev). Примеры:
 *   npm run shot -- /                          все ширины, первый экран
 *   npm run shot -- / --full                   вся страница целиком
 *   npm run shot -- /exchange --w=375,1440     только эти ширины
 *   npm run shot -- / --w=1440 --hover='a:has-text("Сервисы")'     раскрыть меню
 *   npm run shot -- / --w=375 --click='.lucide-menu; [role="dialog"] button:has-text("Сервисы")'
 *   npm run shot -- / --base=https://moneyswap.online              снять прод
 *
 * Порт по умолчанию 3000, другой — через SITE_URL или --base.
 * Файлы: scripts/data/shots/<страница>/<ширина>[-суффикс].png
 *
 * Важно: --full несовместим с открытым мобильным меню — drawer позиционирован
 * фиксированно и на полностраничном снимке попадёт только его верх.
 */
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { chromium } from "playwright";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SHOTS_DIR = join(__dirname, "data", "shots");

// Ширины под брейкпоинты проекта: mobile-xs 375, mobile-xl 576, md 768, lg 1024, xl 1280, max 1400+
const DEFAULT_WIDTHS = [375, 576, 768, 1024, 1440, 1920];

const args = process.argv.slice(2);
const flags = Object.fromEntries(
  args
    .filter((a) => a.startsWith("--"))
    .map((a) => {
      // Режем только по первому «=»: в селекторах вида [role="dialog"] он тоже встречается
      const raw = a.replace(/^--/, "");
      const eq = raw.indexOf("=");
      return eq === -1 ? [raw, true] : [raw.slice(0, eq), raw.slice(eq + 1)];
    }),
);

const path = args.find((a) => !a.startsWith("--")) ?? "/";
const base = (flags.base ?? process.env.SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
const widths = flags.w ? String(flags.w).split(",").map(Number) : DEFAULT_WIDTHS;
const fullPage = Boolean(flags.full);
const suffix = flags.suffix ? `-${flags.suffix}` : "";

const slug = path === "/" ? "home" : path.replace(/^\/|\/$/g, "").replace(/[/?=&]/g, "-");
const outDir = join(SHOTS_DIR, slug);
mkdirSync(outDir, { recursive: true });

const url = `${base}${path}`;
console.log(`\nСнимаем ${url}`);

const browser = await chromium.launch();
let failed = 0;

for (const width of widths) {
  const context = await browser.newContext({
    // Высота — как у реальных устройств: на узких экранах пропорция даёт слишком низкое окно
    viewport: { width, height: width <= 768 ? 812 : Math.min(Math.round(width * 0.62), 1080) },
    deviceScaleFactor: 1,
    locale: "ru-RU",
    // На узких ширинах эмулируем тач: в проекте включён hoverOnlyWhenSupported,
    // и hover-стили там намеренно не должны срабатывать.
    hasTouch: width <= 768,
    isMobile: width <= 768,
  });
  const page = await context.newPage();

  try {
    const response = await page.goto(url, { waitUntil: "load", timeout: 120000 });
    const status = response?.status() ?? 0;

    if (flags.wait && typeof flags.wait === "string") {
      await page.waitForSelector(flags.wait, { timeout: 15000 });
    }

    // Блоки витрины появляются через IntersectionObserver — до прокрутки они прозрачные.
    if (fullPage) {
      await page.evaluate(async () => {
        const root = document.documentElement;
        const step = window.innerHeight * 0.75;
        for (let y = 0; y < root.scrollHeight; y += step) {
          window.scrollTo({ top: y, behavior: "instant" });
          await new Promise((resolve) => setTimeout(resolve, 200));
        }
        window.scrollTo({ top: 0, behavior: "instant" });
      });
    }

    // Открыть выпадающее меню или бургер перед съёмкой
    if (flags.hover && typeof flags.hover === "string") {
      await page.hover(flags.hover);
      await page.waitForTimeout(500);
    }
    // Несколько кликов подряд разделяются « ; » — например открыть бургер и раскрыть аккордеон
    if (flags.click && typeof flags.click === "string") {
      for (const selector of flags.click.split(";")) {
        await page.click(selector.trim());
        await page.waitForTimeout(600);
      }
    }

    await page.waitForTimeout(700);

    // Горизонтальный скролл — самая частая поломка адаптива
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );

    // Кто именно вылезает за границу экрана
    const culprits =
      overflow > 1
        ? await page.evaluate(() => {
            const limit = document.documentElement.clientWidth;
            return [...document.querySelectorAll("body *")]
              .filter((el) => el.getBoundingClientRect().right > limit + 1)
              .slice(0, 5)
              .map((el) => {
                const rect = el.getBoundingClientRect();
                const cls =
                  typeof el.className === "string" ? el.className.slice(0, 60) : el.tagName;
                return `${el.tagName.toLowerCase()}.${cls} → ${Math.round(rect.right)}px`;
              });
          })
        : [];

    const file = join(outDir, `${width}${suffix}.png`);
    await page.screenshot({ path: file, fullPage });

    const note = overflow > 1 ? `  ⚠ горизонтальный скролл +${overflow}px` : "";
    console.log(`  ${String(width).padStart(4)}px  HTTP ${status}  ${file}${note}`);
    culprits.forEach((c) => console.log(`         ${c}`));
  } catch (error) {
    failed += 1;
    console.error(`  ${String(width).padStart(4)}px  ОШИБКА: ${error.message}`);
  } finally {
    await context.close();
  }
}

await browser.close();
console.log(
  failed ? `\nНе снято: ${failed} из ${widths.length}\n` : `\nГотово: ${widths.length} снимков\n`,
);
process.exit(failed ? 1 : 0);
