import { FC } from "react";
import { SeoTextsBlock } from "@/shared/types";

export const SeoHeaderText: FC<SeoTextsBlock> = ({ data }) => {
  return (
    <>
      {data.length > 0 && (
        <div className="grid gap-[20px] py-[50px]">
          <div
            className="text-3xl strapi_styles"
            dangerouslySetInnerHTML={{ __html: data[0]?.header_title }}
          />
          <div
            className="text-lg strapi_styles"
            dangerouslySetInnerHTML={{ __html: data[0]?.header_description }}
          />
        </div>
      )}
    </>
  );
};
