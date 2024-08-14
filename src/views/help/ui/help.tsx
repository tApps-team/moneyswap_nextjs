import { HelpBlock } from "@/widgets/help";
import { TopExchange } from "@/widgets/top-exchange/top-exchange-help-page";
import { ExchangeType, getPopularValutes, getRandomValutes } from "@/entities/currency";
import { getFaq, getHelpArticle, getHelpTitle } from "@/shared/api";
import { faqTypes } from "@/shared/types";

export const HelpPage = async () => {
  // title and article
  const { data: title } = await getHelpTitle();
  const { data: article } = await getHelpArticle();
  console.log(article);

  // faqs
  const { data: basic } = await getFaq(faqTypes.basic);
  const { data: from_users } = await getFaq(faqTypes.from_users);
  const { data: cash } = await getFaq(faqTypes.cash);
  const { data: noncash } = await getFaq(faqTypes.noncash);
  const { data: for_partners } = await getFaq(faqTypes.for_partners);
  const userFaqs = [
    { title: "Общие вопросы", faqs: basic },
    { title: "Вопросы от пользователей", faqs: from_users },
    { title: "Вопросы по наличному обмену", faqs: cash },
    { title: "Вопросы по безналичному обмену", faqs: noncash },
  ];
  const partnerFaqs = [{ title: "Вопросы от партнеров", faqs: for_partners }];

  // top directions
  const popularNoncashDirections = await getPopularValutes({
    exchange_marker: ExchangeType.no_cash,
    limit: 6,
  });
  const randomNoncashDirections = await getRandomValutes({
    exchange_marker: ExchangeType.no_cash,
    limit: 6,
  });

  return (
    <section className="grid grid-cols-[1fr_auto] items-start gap-8">
      <div>
        <div className="grid grid-flow-row gap-4">
          <h1 className="text-3xl">Часто задаваемые вопросы</h1>
          <h2
            className="text-sm text-[#bbb] strapi_styles"
            dangerouslySetInnerHTML={{ __html: title?.content }}
          />
        </div>
        <HelpBlock article={article?.content} userFaqs={userFaqs} partnerFaqs={partnerFaqs} />
      </div>
      <div className="w-full p-6 pb-10 bg-[#2d2d2d] shadow-[1px_3px_10px_3px_rgba(0,0,0,0.7)] rounded-2xl">
        <TopExchange
          popularNoncashDirections={popularNoncashDirections}
          randomNoncashDirections={randomNoncashDirections}
        />
      </div>
    </section>
  );
};
