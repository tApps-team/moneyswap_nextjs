import { FC } from "react";
import { YellowQuestionIcon, YoutubeIcon } from "@/shared/assets";
import { SeoTextsBlock } from "@/shared/types";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/shared/ui";

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
              <HoverCard openDelay={0}>
                <HoverCardTrigger asChild>
                  <YellowQuestionIcon width={36} height={36} className="cursor-pointer" />
                </HoverCardTrigger>
                <HoverCardContent className="rounded-2xl border-none shadow-[1px_3px_10px_3px_rgba(0,0,0,0.7)] min-w-[500px] p-8 flex flex-col gap-4 text-sm font-medium text-white bg-[#2d2d2d]">
                  <p>
                    1. ВЫБЕРИТЕ ВАЛЮТУ, КОТОРУЮ ХОТИТЕ ОТДАТЬ И ВАЛЮТУ, КОТОРУЮ ХОТИТЕ ПОЛУЧИТЬ.
                  </p>
                  <p>2. ВЫБЕРИТЕ ГОРОД, В КОТОРОМ ХОТИТЕ СОВЕРШИТЬ ОБМЕН.</p>
                  <p>3. ВЫБЕРИТЕ ОБМЕННИК ИЗ СПИСКА - У ПЕРВОГО ОБМЕННИКА ЛУЧШИЙ КУРС.</p>
                  <p>4. ПЕРЕЙДИТЕ НА САЙТ ОБМЕННИКА И СОЗДАЙТЕ ЗАЯВКУ НА САЙТЕ.</p>
                  <p>5. С ВАМИ СВЯЖЕТСЯ МЕНЕДЖЕР.</p>
                  <p>
                    6. ДОГОВОРИТЕСЬ ПО ВРЕМЕНИ И ПРИЕЗЖАЙТЕ В ОФИС ИЛИ ЗАКАЖИТЕ ДОСТАВКУ НАЛИЧНЫХ.
                  </p>
                  <p>
                    7. ПОДЕЛИТЕСЬ СВОИМ ОПЫТОМ С ДРУГИМИ ПОЛЬЗОВАТЕЛЯМИ, ОСТАВИВ ОТЗЫВ НА MONEYSWAP.
                  </p>
                </HoverCardContent>
              </HoverCard>
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
