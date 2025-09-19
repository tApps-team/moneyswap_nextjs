import { ArticleContent } from "@/widgets/strapi";
import { blacklistTermsMockData } from "./blacklist-terms-mock";

export const BlacklistTermsPage = async () => {
  const blacklistTerms = blacklistTermsMockData;

  return (
    <section className="">
      <h1 className="sr-only">
        Положение о Чёрном списке
      </h1>
      <h2 className="sr-only">
        Настоящее Положение о Чёрном списке (далее — «Положение») определяет порядок формирования, размещения и обновления информации о недобросовестных или потенциально небезопасных обменных пунктах на сайте MoneySwap - https://www.moneyswap.online (далее — «Сайт»). Положение разработано в целях повышения информированности пользователей и не является юридическим обвинением или утверждением о нарушении законодательства со стороны указанных обменных пунктов.
      </h2>
      <ArticleContent dynamic_content={blacklistTerms} />
    </section>
  );
};
