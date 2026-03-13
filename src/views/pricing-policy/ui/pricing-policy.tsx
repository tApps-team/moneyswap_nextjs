import { ArticleContent } from "@/widgets/strapi";
import { pricingPolicyMockData } from "./pricing-policy-mock";

export const PricingPolicyPage = async () => {
  const content = pricingPolicyMockData;

  return (
    <section className="">
      <h1 className="sr-only">Политика тарификации</h1>
      <h2 className="sr-only">
        Настоящая Политика тарификации определяет порядок оплаты услуг размещения обменных пунктов на сайте MoneySwap.
      </h2>
      <ArticleContent dynamic_content={content} />
    </section>
  );
};
