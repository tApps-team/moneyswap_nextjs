import { FC } from "react";
import { AccordionList } from "@/features/strapi";
import { faqTypes, getFaq } from "@/entities/strapi";
import { ExchangerMarker, directions } from "@/shared/types";

interface MainFAQProps {
  direction: ExchangerMarker;
}

export const MainFAQ: FC<MainFAQProps> = async ({ direction }) => {
  const [filteredFaqs, basicFaqs] = await Promise.all([
    getFaq(direction === ExchangerMarker.cash ? faqTypes.cash : faqTypes.noncash),
    getFaq(faqTypes.basic),
  ]);

  const faqs = [
    {
      title: direction === ExchangerMarker.cash ? "По наличному обмену" : "По безналичному обмену",
      faqs: filteredFaqs,
    },
    { title: "Общие вопросы", faqs: basicFaqs },
  ];

  return (
    <div className="bg-new-dark-grey mobile-xl:rounded-[15px] rounded-[10px] grid lg:grid-cols-2 lg:py-[50px] mobile-xl:px-[30px] mobile-xl:py-10 px-5 py-6 mobile-xl:gap-14 gap-10 w-full">
      {faqs?.map((block) => (
        <div className="w-full" key={block?.title}>
          <div className="mobile-xl:mb-0 mobile-xl:pb-10 pb-4 mobile-xl:pl-8">
            <h3 className="xl:text-xl md:text-lg mobile-xl:text-base text-sm text-yellow-main font-medium uppercase mobile-xl:truncate">
              {block?.title}
            </h3>
          </div>
          <AccordionList data={block.faqs?.data} />
        </div>
      ))}
    </div>
  );
};
