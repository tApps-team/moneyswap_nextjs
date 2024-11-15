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
      title: direction === ExchangerMarker.cash ? "По наличному обмену" : "По безналичному обмену",
      faqs: filteredFaqs,
    },
    { title: "Общие вопросы", faqs: basicFaqs },
  ];

  return (
    <div className="grid mobile-xl:grid-cols-2 mobile-xl:py-[50px] py-8 mobile-xl:gap-[5%] gap-6 w-full">
      {faqs?.map((block) => (
        <div className="w-full" key={block?.title}>
          <div className="mobile-xl:mb-0 mb-6 mobile-xl:pb-6 pb-6 mobile-xl:pl-8 mobile-xl:border-none border-b-2 border-light-gray">
            <h3 className="mobile-xl:text-xl mobile:text-base text-sm text-yellow-main font-semibold uppercase mobile-xl:truncate">
              {block?.title}
            </h3>
          </div>
          <AccordionList data={block.faqs?.data} />
        </div>
      ))}
    </div>
  );
};
