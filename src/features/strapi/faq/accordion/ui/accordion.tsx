import parse, { DOMNode, Element } from "html-react-parser";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import React, { FC } from "react";
import { MainFaqs } from "@/entities/strapi";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/shared/ui";

const options = {
  replace: (domNode: DOMNode) => {
    // Проверяем, является ли узел элементом и его типом является img
    if (domNode instanceof Element && domNode.name === "img") {
      const { src, alt } = domNode.attribs;
      return <Image src={src} alt={alt || "image"} width={500} height={500} layout="responsive" />;
    }
    if (domNode instanceof Element && domNode.name === "br") {
      return <hr />;
    }
  },
};

export const AccordionList: FC<MainFaqs> = ({ data }) => {
  return (
    <Accordion type="single" collapsible className="w-full grid mobile-xl:gap-6 gap-6">
      {data?.map((faq) => (
        <AccordionItem
          value={`Value-${faq?.id}`}
          key={faq?.id}
          className="grid grid-flow-row mobile-xl:rounded-[25px] rounded-none mobile-xl:shadow-[1px_3px_5px_3px_rgba(0,0,0,0.3)] shadow-none mobile-xl:bg-dark-gray bg-transparent mobile-xl:px-8 mobile-xl:py-4 p-0 pb-6 mobile-xl:border-none border-b-2 border-light-gray"
        >
          <AccordionTrigger className="mobile-xl:text-sm mobile:text-xs text-2xs mobile-xl:font-semibold font-medium [&[data-state=open]]:text-yellow-main tracking-wider text-start uppercase color-[#fff] p-0 border-b-0 mobile-xl:[&>svg]:-mr-5 mobile-xl:[&[data-state=open]]:text-white [&[data-state=open]>svg]:stroke-yellow-main hover:text-white mobile-xl:leading-6 leading-4 [&>svg]:w-6 [&>svg]:h-6 [&>svg]:stroke-[3px]">
            {faq?.question}
            {/* <ChevronDown className="transition-all duration-300 shrink-0" /> */}
          </AccordionTrigger>
          <AccordionContent className="pb-0">
            <div className="mobile-xl:mt-6 mt-6 font-normal uppercase text-white strapi_styles strapi_fonts_codec">
              {parse(faq?.answer, options)}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};
