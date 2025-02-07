import { HelpBlock } from "@/widgets/strapi";
import { ExchangeType, getPopularValutes, getRandomValutes } from "@/entities/currency";
import { faqTypes, getFaq, getHelpPage } from "@/entities/strapi";

export const HelpPage = async ({ searchParams }: { searchParams?: { article?: boolean } }) => {
  const isArticle = searchParams?.article || false;
  // title and article
  const { data: help } = await getHelpPage();
  const title = help?.title;
  const article = help?.content;

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
