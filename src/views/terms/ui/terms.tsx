import { ArticleContent } from "@/widgets/strapi";
import { termsMockData } from "./terms-mock";

export const TermsPage = async () => {
  const terms = termsMockData;

  return (
    <section className="">
      <h1 className="sr-only">
        Пользовательское соглашение
      </h1>
      <h2 className="sr-only">
        Настоящее Пользовательское соглашение (далее — «Соглашение») регулирует отношения между сайтом MoneySwap - https://www.moneyswap.online (далее — «Сайт») и любым посетителем сайта (далее — «Пользователь»).
      </h2>
      <ArticleContent dynamic_content={terms} />
    </section>
  );
};
