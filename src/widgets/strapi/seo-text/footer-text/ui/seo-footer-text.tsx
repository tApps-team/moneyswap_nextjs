"use client";

import parse, { DOMNode, Element } from "html-react-parser";
import { ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";
import { FC, useState } from "react";
import { SeoTextsBlock } from "@/shared/types";

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

export const SeoFooterText: FC<SeoTextsBlock> = ({ data }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      {data.length > 0 && (
        <div className={`grid gap-5 mobile-xl:py-[50px] pb-0 pt-[50px]`}>
          <div className="strapi_styles mobile-xl:text-xl text-sm strapi_fonts_codec">
            {parse(data[0]?.footer_title, options)}
          </div>
          <div className="mobile-xl:block hidden strapi_styles mobile-xl:text-xl text-sm strapi_fonts_codec">
            {parse(data[0]?.footer_description, options)}
          </div>
          <div className="block mobile-xl:hidden">
            {isOpen ? (
              <div className="strapi_styles mobile-xl:text-xl text-sm strapi_fonts_codec">
                {parse(data[0]?.footer_description, options)}
              </div>
            ) : (
              <div
                onClick={() => setIsOpen(true)}
                className="cursor-pointer flex justify-end items-center gap-1 text-yellow-main text-2xs uppercase font-medium text-right [&>svg]:w-4 [&>svg]:h-4 [&>svg]:stroke-yellow-main [&>svg]:mb-[2px] leading-none"
              >
                <ChevronDown /> <p>Показать полный текст</p>
              </div>
            )}
            {isOpen && (
              <div
                onClick={() => setIsOpen(false)}
                className="cursor-pointer flex justify-end items-center gap-1 text-yellow-main text-2xs uppercase font-medium text-right [&>svg]:w-4 [&>svg]:h-4 [&>svg]:stroke-yellow-main [&>svg]:mb-[2px] leading-none"
              >
                <ChevronUp /> <p>Скрыть полный текст</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
