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
    <Accordion type="single" collapsible className="w-full grid lg:gap-6 mobile-xl:gap-4 gap-3">
      {data?.map((faq) => (
        <AccordionItem
          value={`Value-${faq?.id}`}
          key={faq?.id}
          className="grid grid-flow-row mobile-xl:rounded-[15px] rounded-[5px] bg-new-grey md:py-6 md:pl-8 md:pr-12 p-4"
        >
          <AccordionTrigger className="md:text-base mobile:text-xs text-[11px] mobile-xl:font-normal font-light [&[data-state=open]]:text-yellow-main text-start color-[#fff] p-0 border-b-0 md:[&>svg]:-mr-7 mobile-xl:[&[data-state=open]]:text-white [&[data-state=open]>svg]:stroke-yellow-main hover:text-white mobile-xl:leading-6 leading-4 [&>svg]:w-5 [&>svg]:h-5 [&>svg]:stroke-[2px] [&>svg]:border-[1px] [&>svg]:border-white [&>svg]:rounded-[5px]">
            {faq?.question}
          </AccordionTrigger>
          <AccordionContent className="pb-0">
            <div className="mobile-xl:mt-6 mt-6 font-light text-font-light-grey strapi_styles strapi_fonts_codec">
              {parse(faq?.answer, options)}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};
