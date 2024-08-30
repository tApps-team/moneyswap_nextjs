import { FC } from "react";
import { AccordionList } from "@/features/strapi";
import { faqTypes, getFaq } from "@/entities/strapi";
import { directions } from "@/shared/types";

interface MainFAQProps {
  direction: directions;
}

export const MainFAQ: FC<MainFAQProps> = async ({ direction }) => {
  const filteredFaqs = await getFaq(
    direction === directions.cash ? faqTypes.cash : faqTypes.noncash,
  );
  const basicFaqs = await getFaq(faqTypes.basic);

  const faqs = [
    {
      title:
        direction === directions.cash
          ? "Вопросы по наличному обмену"
          : "Вопросы по безналичному обмену",
      faqs: filteredFaqs,
    },
    { title: "Общие вопросы", faqs: basicFaqs },
  ];

  return (
    <div className="grid grid-cols-2 py-[50px] gap-[5%] w-full">
      {faqs?.map((block) => (
        <div className="w-full" key={block.title}>
          <div className="pb-6 border-b-[#bbbbbb] border-b-[1.5px]">
            <h3 className="text-[20px] text-[#f6ff5f] font-semibold uppercase truncate">
              {block.title}
            </h3>
          </div>
          <AccordionList data={block.faqs?.data} />
        </div>
      ))}
    </div>
  );
};
