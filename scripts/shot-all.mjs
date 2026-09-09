/**
 * Регресс-прогон адаптива: снимает ключевые страницы во всех ширинах и
 * сводит в отчёт горизонтальное переполнение.
 *
 * Требует запущенный дев-сервер:
 *   npm run dev
 *   npm run shot:all
 *
 * Свой набор страниц — через аргументы:
 *   npm run shot:all -- /ratings /credit-cards
 */
import { spawn } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Страницы, которые ломаются чаще всего: витрина, обмен, хаб и по одному
// представителю списка и детальной карточки рейтинга.
const DEFAULT_PAGES = [
  "/",
  "/exchange",
  "/ratings",
  "/crypto-exchangers",
  "/credit-cards",
  "/microloans",
];

const pages = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const extraFlags = process.argv.slice(2).filter((a) => a.startsWith("--"));
const targets = pages.length ? pages : DEFAULT_PAGES;

const run = (args) =>
  new Promise((resolve) => {
    const child = spawn("node", [join(__dirname, "shot.mjs"), ...args], {
      stdio: ["ignore", "pipe", "inherit"],
    });
    let out = "";
    child.stdout.on("data", (chunk) => {
      out += chunk;
      process.stdout.write(chunk);
    });
    child.on("close", (code) => resolve({ code, out }));
  });

const problems = [];

for (const page of targets) {
  const { out } = await run([page, "--full", ...extraFlags]);
  for (const line of out.split("\n")) {
    if (line.includes("горизонтальный скролл")) {
      problems.push(`${page} — ${line.trim()}`);
    }
  }
}

console.log("\n" + "─".repeat(60));
if (problems.length) {
  console.log(`Переполнение найдено на ${problems.length} экранах:`);
  problems.forEach((p) => console.log("  " + p));
  process.exit(1);
} else {
  console.log(`Переполнения нет ни на одной из ${targets.length} страниц.`);
}
