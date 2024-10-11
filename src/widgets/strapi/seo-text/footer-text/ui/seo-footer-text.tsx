import parse, { DOMNode, Element } from "html-react-parser";
import Image from "next/image";
import { FC } from "react";
import { SeoTextsBlock } from "@/shared/types";

const options = {
  replace: (domNode: DOMNode) => {
    // Проверяем, является ли узел элементом и его типом является img
    if (domNode instanceof Element && domNode.name === "img") {
      const { src, alt } = domNode.attribs;
      return <Image src={src} alt={alt || "image"} width={500} height={500} layout="responsive" />;
    }
  },
};

export const SeoFooterText: FC<SeoTextsBlock> = ({ data }) => {
  return (
    <>
      {data.length > 0 && (
        <div className="grid gap-[20px] py-[50px]">
          {/* <div
            className="strapi_styles text-sm"
            dangerouslySetInnerHTML={{ __html: data[0]?.footer_title }}
          /> */}
          <div className="strapi_styles text-sm">{parse(data[0]?.footer_title, options)}</div>
          {/* <div
            className="strapi_styles text-sm"
            dangerouslySetInnerHTML={{ __html: data[0]?.footer_description }}
            /> */}
          <div className="strapi_styles text-sm">{parse(data[0]?.footer_description, options)}</div>
        </div>
      )}
    </>
  );
};
