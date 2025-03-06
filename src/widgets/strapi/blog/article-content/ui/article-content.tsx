import parse, { DOMNode, Element } from "html-react-parser";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import { ComponentPosition, DynamicContentItem, DynamicContentType } from "@/entities/strapi";
import { SwitcherIcon } from "@/shared/assets";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/shared/ui";

interface ArticleContentProps {
  dynamic_content: DynamicContentItem[];
}

const options = {
  replace: (domNode: DOMNode) => {
    // Проверяем, является ли узел элементом и его типом является img
    if (domNode instanceof Element && domNode.name === "img") {
      const { src, alt } = domNode.attribs;
      return (
        <Image
          src={src}
          alt={alt || "image"}
          width={500}
          height={500}
          layout="responsive"
          // priority
        />
      );
    }
    if (domNode instanceof Element && domNode.name === "br") {
      return <hr />;
    }
  },
};

export const ArticleContent: FC<ArticleContentProps> = ({ dynamic_content }) => {
  return (
    <div className="grid grid-flow-row gap md:gap-[30px] gap-[15px]">
      {dynamic_content?.map((item, index) => {
        // Проверка на paragraph
        if (item.content_type === DynamicContentType.paragraph && item.paragraph) {
          return (
            <div
              key={index}
              className={`md:px-8 md:py-10 mobile-xl:px-6 mobile-xl:py-6 px-4 py-5 bg-new-dark-grey mobile-xl:rounded-[20px] rounded-[15px] strapi_styles strapi_fonts_codec md:text-lg mobile:text-sm text-xs`}
            >
              {item.paragraph.title && (
                <h2
                  id={item?.paragraph?.title_id ? item?.paragraph?.title_id : ""}
                  className={`main_font ${item.paragraph.title_position === ComponentPosition.center ? "md:text-center text-center" : item.paragraph.title_position === ComponentPosition.right ? "md:text-right text-center" : "md:text-left text-center"}`}
                >
                  {item.paragraph.title}
                </h2>
              )}
              <div>{parse(item.paragraph.content, options)}</div>
            </div>
          );
        }

        // Проверка на quote
        if (item.content_type === DynamicContentType.quote && item.quote) {
          const buttonTypeClass = `strapi_custom_quote--${item.quote.button_type || "grey_color"}`;
          return (
            <div
              key={index}
              className={`bg-new-dark-grey mobile-xl:rounded-[20px] rounded-[15px] md:[&>svg]:w-[100px] [&>svg]:w-[66px] strapi_custom_quote strapi_styles main_font md:text-base mobile:text-sm text-xs ${buttonTypeClass}`}
            >
              <SwitcherIcon height={"auto"} fill="#B9B9B9" />
              <p>{parse(item.quote.content, options)}</p>
              {item.quote.button_name && (
                <Link href={item.quote.button_url!} target={item.quote.target}>
                  <button className="hover:scale-[1.01] transition-all duration-300">
                    {item.quote.button_name}
                  </button>
                </Link>
              )}
            </div>
          );
        }

        // Проверка на custom_button
        if (item.content_type === DynamicContentType.custom_button && item?.custom_button) {
          const buttonTypeClass = `strapi_custom_btn--${item?.custom_button?.button_type || "grey_color"}`;
          return (
            <div
              key={index}
              className={`${item?.custom_button?.button_position === ComponentPosition.center ? "justify-center" : item?.custom_button?.button_position === ComponentPosition.right ? "justify-end" : ""} ${buttonTypeClass} strapi_custom_btn strapi_styles main_font md:text-base mobile:text-sm text-xs`}
            >
              <Link href={item.custom_button.button_url!} target={item?.custom_button?.target}>
                <button className="hover:scale-[1.01] transition-all duration-300">
                  {item?.custom_button?.button_name}
                </button>
              </Link>
            </div>
          );
        }

        // Проверка на custom_accordion
        if (item.content_type === DynamicContentType.custom_accordion && item.accordion) {
          return (
            <div key={index} className={` grid grid-flow-row md:gap-6 gap-4`}>
              {item.accordion.title && (
                <div className="main_font md:text-lg mobile:text-sm text-xs text-white font-normal uppercase md:pl-8 pl-0 md:text-start text-center">
                  {item.accordion.title}
                </div>
              )}
              <Accordion
                type="single"
                collapsible
                className="bg-new-dark-grey rounded-[10px] w-full mobile-xl:px-8 mobile-xl:pr-10 mobile-xl:py-4 px-4 pr-8 py-3"
              >
                <AccordionItem value={`Value-${item.accordion.question}`} className="">
                  <AccordionTrigger className="main_font text-yellow-main uppercase mobile-xl:text-sm text-xs font-normal color-[#fff] p-0 border-b-0 [&>svg]:-mr-[20px] [&[data-state=open]]:text-white [&[data-state=open]>svg]:stroke-white leading-6 flex justify-between [&>svg]:w-5 [&>svg]:h-5 [&>svg]:stroke-[2px] [&>svg]:stroke-white [&>svg]:border-[1px] [&>svg]:border-white [&>svg]:rounded-[5px]">
                    {item.accordion.question}
                  </AccordionTrigger>
                  <AccordionContent className="pb-0">
                    <div
                      className={`strapi_fonts_codec mt-6 md:mb-[20px] mb-[10px] text-sm font-light text-light-gray strapi_styles blog-custom-accordion-answer`}
                    >
                      {parse(item.accordion.answer, options)}
                    </div>
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
