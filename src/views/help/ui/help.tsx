import { HelpBlock } from "@/widgets/strapi";
import { ExchangeType, getPopularValutes, getRandomValutes } from "@/entities/currency";
import { faqTypes, getFaq, getHelpPage } from "@/entities/strapi";

export const HelpPage = async ({ searchParams }: { searchParams?: { article?: boolean } }) => {
  const isArticle = searchParams?.article || false;

  // Выполняем все запросы параллельно
  const [
    helpResponse,
    basicFaq,
    fromUsersFaq,
    cashFaq,
    noncashFaq,
    forPartnersFaq,
    popularNoncashDirections,
    randomNoncashDirections
  ] = await Promise.all([
    getHelpPage(),
    getFaq(faqTypes.basic),
    getFaq(faqTypes.from_users),
    getFaq(faqTypes.cash),
    getFaq(faqTypes.noncash),
    getFaq(faqTypes.for_partners),
    getPopularValutes({
      exchange_marker: ExchangeType.no_cash,
      limit: 6,
    }),
    getRandomValutes({
      exchange_marker: ExchangeType.no_cash,
      limit: 6,
    })
  ]);

  const { data: help } = helpResponse;
  const title = help?.title;
  const article = help?.content;

  const { data: basic } = basicFaq;
  const { data: from_users } = fromUsersFaq;
  const { data: cash } = cashFaq;
  const { data: noncash } = noncashFaq;
  const { data: for_partners } = forPartnersFaq;

  // faqs
  const userFaqs = [
    { title: "Общие вопросы", faqs: basic },
    { title: "Вопросы от пользователей", faqs: from_users },
    { title: "Вопросы по наличному обмену", faqs: cash },
    { title: "Вопросы по безналичному обмену", faqs: noncash },
  ];
  const partnerFaqs = [{ title: "Вопросы от партнеров", faqs: for_partners }];

  return (
    <section className="grid grid-flow-row gap-6 lg:gap-8">
      <HelpBlock
        isArticle={isArticle}
        title={title}
        article={article}
        userFaqs={userFaqs}
        partnerFaqs={partnerFaqs}
        popularNoncashDirections={popularNoncashDirections}
        randomNoncashDirections={randomNoncashDirections}
      />
    </section>
  );
};
