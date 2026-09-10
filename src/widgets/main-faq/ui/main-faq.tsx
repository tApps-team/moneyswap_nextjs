import { FC } from "react";
import { AccordionList } from "@/features/strapi";
import { faqTypes, getFaq } from "@/entities/strapi";
import { SegmentMarker } from "@/shared/types";

interface MainFAQProps {
  /** Страницы обмена показывают вопросы по своему направлению. */
  direction?: Omit<SegmentMarker, SegmentMarker.both>;
  /**
   * Первый блок, если он не про обмен: витрине сервисов вопросы про наличный
   * и безналичный обмен ни к чему, ей нужны вопросы от пользователей.
   */
  primary?: { type: faqTypes; title: string };
}

export const MainFAQ: FC<MainFAQProps> = async ({ direction, primary }) => {
  const primaryType =
    primary?.type ?? (direction === SegmentMarker.cash ? faqTypes.cash : faqTypes.noncash);
  const primaryTitle =
    primary?.title ??
    (direction === SegmentMarker.cash ? "По наличному обмену" : "По безналичному обмену");

  const [filteredFaqs, basicFaqs] = await Promise.all([
    getFaq(primaryType),
    getFaq(faqTypes.basic),
  ]);

  const faqs = [
    { title: primaryTitle, faqs: filteredFaqs },
    { title: "Общие вопросы", faqs: basicFaqs },
  ];

  return (
    <div className="bg-new-dark-grey mobile-xl:rounded-[15px] rounded-[10px] grid lg:grid-cols-2 lg:py-[50px] mobile-xl:px-[30px] mobile-xl:py-10 px-5 py-6 mobile-xl:gap-14 gap-10 w-full">
      {faqs?.map((block) => (
        <div className="w-full" key={block?.title}>
          <div className="mobile-xl:mb-0 mobile-xl:pb-10 pb-4 mobile-xl:pl-8">
            <h3 className="xl:text-xl md:text-lg text-base text-yellow-main font-bold uppercase mobile-xl:truncate">
              {block?.title}
            </h3>
          </div>
          <AccordionList data={block.faqs?.data} />
        </div>
      ))}
    </div>
  );
};
