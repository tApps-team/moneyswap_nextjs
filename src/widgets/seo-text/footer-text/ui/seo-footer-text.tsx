import { FC } from "react";
import { SeoTextsBlock } from "@/shared/types";

export const SeoFooterText: FC<SeoTextsBlock> = ({ data }) => {
  return (
    <>
      {data.length > 0 && (
        <div className="grid gap-[20px] py-[50px]">
          <div
            className="strapi_styles text-sm"
            dangerouslySetInnerHTML={{ __html: data[0]?.footer_title }}
          />
          <div
            className="strapi_styles text-sm"
            dangerouslySetInnerHTML={{ __html: data[0]?.footer_description }}
          />
        </div>
      )}
    </>
  );
};
