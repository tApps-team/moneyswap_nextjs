import Link from "next/link";
import { FC } from "react";
import { ComponentPosition, DynamicContentItem, DynamicContentType } from "@/entities/strapi";
import { SwitcherIcon } from "@/shared/assets";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/shared/ui";

interface ArticleContentProps {
  dynamic_content: DynamicContentItem[];
}

export const ArticleContent: FC<ArticleContentProps> = ({ dynamic_content }) => {
  return (
    <div>
      {dynamic_content?.map((item, index) => {
        // Проверка на paragraph
        if (item.content_type === DynamicContentType.paragraph && item.paragraph) {
          return (
            <div key={index} className="mb-[30px] strapi_styles strapi_fonts text-sm">
              {item.paragraph.title && (
                <h2
                  id={item?.paragraph?.title_id ? item?.paragraph?.title_id : ""}
                  className={`${item.paragraph.title_position === ComponentPosition.center ? "text-center" : item.paragraph.title_position === ComponentPosition.right ? "text-right" : "text-left"}`}
                >
                  {item.paragraph.title}
                </h2>
              )}
              <div dangerouslySetInnerHTML={{ __html: item.paragraph.content }} />
            </div>
          );
        }

        // Проверка на quote
        if (item.content_type === DynamicContentType.quote && item.quote) {
          const buttonTypeClass = `strapi_custom_quote--${item.quote.button_type || "grey_color"}`;
          return (
            <div
              key={index}
              className={`mb-[30px] strapi_custom_quote strapi_styles strapi_fonts text-sm ${buttonTypeClass}`}
            >
              <SwitcherIcon width={100} height={"auto"} fill="#2d2d2d" />
              <p dangerouslySetInnerHTML={{ __html: item.quote.content }} />
              {item.quote.button_name && (
                <Link href={item.quote.button_url!} target={item.quote.target}>
                  <button className="hover:shadow-[1px_3px_10px_1px_rgba(0,0,0,0.7)] hover:scale-[1.01] transition-all duration-300 truncate">
                    {item.quote.button_name}
                  </button>
                </Link>
              )}
            </div>
          );
        }

        // Проверка на custom_button
        if (item.content_type === DynamicContentType.custom_button && item.custom_button) {
          const buttonTypeClass = `strapi_custom_btn--${item.custom_button.button_type || "grey_color"}`;
          return (
            <div
              key={index}
              className={`mb-[30px] ${item.custom_button.button_position === ComponentPosition.center ? "justify-center" : item.custom_button.button_position === ComponentPosition.right ? "justify-end" : ""} ${buttonTypeClass} strapi_custom_btn strapi_styles strapi_fonts text-sm`}
            >
              <Link href={item.custom_button.button_url!} target={item.custom_button.target}>
                <button className="hover:shadow-[1px_3px_10px_1px_rgba(0,0,0,0.7)] hover:scale-[1.01] transition-all duration-300">
                  {item.custom_button.button_name}
                </button>
              </Link>
            </div>
          );
        }

        if (item.content_type === DynamicContentType.custom_accordion && item.accordion) {
          return (
            <div key={index} className="mb-[30px] grid grid-flow-row gap-6">
              {item.accordion.title && (
                <div className="text-xl text-[#fff] font-semibold uppercase pl-8">
                  {item.accordion.title}
                </div>
              )}
              <Accordion
                type="single"
                collapsible
                className="w-full rounded-[25px] shadow-[1px_3px_5px_3px_rgba(0,0,0,0.3)] bg-[#2d2d2d] px-8 py-4"
              >
                <AccordionItem value={`Value-${item.accordion.question}`} className="">
                  <AccordionTrigger className="text-sm font-medium text-start uppercase color-[#fff] p-0 border-b-0 [&>svg]:-mr-[20px] [&[data-state=open]]:text-[#fff] [&[data-state=open]>svg]:stroke-[#f6ff5f] hover:text-[#fff] leading-4">
                    {item.accordion.question}
                  </AccordionTrigger>
                  <AccordionContent className="pb-0">
                    <div
                      className="mt-6 mb-[20px] text-sm font-normal uppercase text-[#bbb] strapi_styles"
                      dangerouslySetInnerHTML={{ __html: item.accordion.answer }}
                    />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          );
        }

        // Возврат null если тип не соответствует ни одному из вышеуказанных
        return null;
      })}
    </div>
  );
};
