import React, { FC } from "react";
import { MainFaqs } from "@/entities/strapi";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/shared/ui";

export const AccordionList: FC<MainFaqs> = ({ data }) => {
  return (
    <Accordion type="single" collapsible className="w-full">
      {data?.map((faq) => (
        <AccordionItem
          value={`Value-${faq?.id}`}
          key={faq?.id}
          className="border-b-[#bbbbbb] border-b-[1.5px]"
        >
          <AccordionTrigger className="text-sm font-semibold text-start uppercase">
            {faq?.question}
          </AccordionTrigger>
          <AccordionContent>
            <div
              className="text-sm font-normal uppercase text-[#bbb] strapi_styles"
              dangerouslySetInnerHTML={{ __html: faq?.answer }}
            />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};
