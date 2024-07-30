import { FC } from "react";
import { SeoTextsBlock } from "@/shared/types";

export const SeoFooterText: FC<SeoTextsBlock> = ({ data }) => {
  return (
    <>
      {data.length > 0 && (
        <div className="grid gap-[20px] pb-[50px]">
          <div
            className="text-lg strapi_styles"
            dangerouslySetInnerHTML={{ __html: data[0]?.footer_title }}
          />
          <div
            className="text-lg strapi_styles"
            dangerouslySetInnerHTML={{ __html: data[0]?.footer_description }}
          />
        </div>
      )}
    </>
  );
};
