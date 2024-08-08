import { FC } from "react";
import { YellowQuestionIcon, YoutubeIcon } from "@/shared/assets";
import { SeoTextsBlock } from "@/shared/types";

export const SeoHeaderText: FC<SeoTextsBlock> = ({ data }) => {
  return (
    <>
      {data.length > 0 && (
        <div className="grid gap-[20px]">
          <div className="relative">
            <div
              className="text-[28px] strapi_styles max-w-[90%]"
              dangerouslySetInnerHTML={{ __html: data[0]?.header_title }}
            />
            <div className="absolute top-0 right-0 grid grid-flow-col gap-4 justify-center items-center">
              <YellowQuestionIcon width={36} height={36} className="cursor-pointer" />
              {/* <YoutubeIcon width={36} height={36} /> */}
              <img src="/youtube.svg" alt="" width={37} height={37} className="cursor-pointer" />
            </div>
          </div>
          <div
            className="strapi_styles text-sm"
            dangerouslySetInnerHTML={{ __html: data[0]?.header_description }}
          />
        </div>
      )}
    </>
  );
};
