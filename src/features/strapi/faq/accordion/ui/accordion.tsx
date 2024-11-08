import parse, { DOMNode, Element } from "html-react-parser";
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
    <Accordion type="single" collapsible className="w-full grid gap-6">
      {data?.map((faq) => (
        <AccordionItem
          value={`Value-${faq?.id}`}
          key={faq?.id}
          className="grid grid-flow-row mobile-xl:rounded-[25px] rounded-xl shadow-[1px_3px_5px_3px_rgba(0,0,0,0.3)] bg-dark-gray px-8 py-4"
        >
          <AccordionTrigger className="text-sm font-medium tracking-wider text-start uppercase color-[#fff] p-0 border-b-0 [&>svg]:-mr-[20px] [&[data-state=open]]:text-white [&[data-state=open]>svg]:stroke-yellow-main hover:text-white leading-4">
            {faq?.question}
          </AccordionTrigger>
          <AccordionContent className="pb-0">
            <div className="mt-6 text-xs font-normal uppercase text-white strapi_styles strapi_fonts_codec">
              {parse(faq?.answer, options)}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};
