import React, { FC } from "react";
import { MainFaqs } from "@/entities/strapi";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/shared/ui";

export const AccordionList: FC<MainFaqs> = ({ data }) => {
  return (
    <Accordion type="single" collapsible className="w-full grid gap-6">
      {data?.map((faq) => (
        <AccordionItem
          value={`Value-${faq?.id}`}
          key={faq?.id}
          className="grid grid-flow-row rounded-[25px] shadow-[1px_3px_5px_3px_rgba(0,0,0,0.3)] bg-[#2d2d2d] px-8 py-4"
        >
          <AccordionTrigger className="text-sm font-medium tracking-wider text-start uppercase color-[#fff] p-0 border-b-0 [&>svg]:-mr-[20px] [&[data-state=open]]:text-[#fff] [&[data-state=open]>svg]:stroke-[#f6ff5f] hover:text-[#fff] leading-4">
            {faq?.question}
          </AccordionTrigger>
          <AccordionContent className="pb-0">
            <div
              className="mt-6 text-xs font-normal uppercase text-[#fff] strapi_styles"
              dangerouslySetInnerHTML={{ __html: faq?.answer }}
            />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};
