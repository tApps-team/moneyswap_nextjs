import { ArticleContent } from "@/widgets/strapi";
import { privacyMockData } from "./privacy-mock";

export const PrivacyPage = async () => {
  const privacy = privacyMockData;

  return (
    <section className="">
      <h1 className="sr-only">
        Политика конфиденциальности
      </h1>
      <h2 className="sr-only">
        Настоящая Политика конфиденциальности (далее — «Политика») определяет порядок сбора,  использования и защиты персональной и иной информации Пользователей сайта MoneySwap -  https://www.moneyswap.online (далее — «Сайт»).
      </h2>
      <ArticleContent dynamic_content={privacy} />
    </section>
  );
};
