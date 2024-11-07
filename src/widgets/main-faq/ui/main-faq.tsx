import { FC } from "react";
import { AccordionList } from "@/features/strapi";
import { faqTypes, getFaq } from "@/entities/strapi";
import { ExchangerMarker, directions } from "@/shared/types";

interface MainFAQProps {
  direction: ExchangerMarker;
}

export const MainFAQ: FC<MainFAQProps> = async ({ direction }) => {
  const filteredFaqs = await getFaq(
    direction === ExchangerMarker.cash ? faqTypes.cash : faqTypes.noncash,
  );
  const basicFaqs = await getFaq(faqTypes.basic);

  const faqs = [
    {
      title:
        direction === ExchangerMarker.cash
          ? "Вопросы по наличному обмену"
          : "Вопросы по безналичному обмену",
      faqs: filteredFaqs,
    },
    { title: "Общие вопросы", faqs: basicFaqs },
  ];

  return (
    <div className="grid mobile-xl:grid-cols-2 py-[50px] gap-[5%] w-full">
      {faqs?.map((block) => (
        <div className="w-full" key={block.title}>
          <div className="pb-6 mobile-xl:pl-8">
            <h3 className="mobile-xl:text-xl text-base text-yellow-main font-semibold uppercase mobile-xl:truncate">
              {block.title}
            </h3>
          </div>
          <AccordionList data={block.faqs?.data} />
        </div>
      ))}
    </div>
  );
};
