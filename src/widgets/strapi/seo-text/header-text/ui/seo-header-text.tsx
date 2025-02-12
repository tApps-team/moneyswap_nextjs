import parse, { DOMNode, Element } from "html-react-parser";
import Image from "next/image";
import { FC } from "react";
import { BotBannerNew } from "@/features/bot-banner";
import { YoutubeGreyIcon } from "@/shared/assets";
import { SeoTextsBlock } from "@/shared/types";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/shared/ui";

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

interface SeoHeaderText extends SeoTextsBlock {
  giveCurrency?: string;
  getCurrency?: string;
  location?: string;
  isExchange?: true;
}

export const SeoHeaderText: FC<SeoHeaderText> = async ({
  data,
  giveCurrency,
  getCurrency,
  location,
  isExchange,
}) => {
  return (
    <>
      {data.length > 0 && (
        <section className="grid lg:grid-cols-[1fr_1fr] grid-cols-1 justify-between ">
          <div className="grid grid-flow-row lg:gap-10 mobile-xl:gap-[30px] gap-3">
            <div className="grid grid-cols-2 mobile-xl:gap-5 gap-2.5 w-fit uppercase lg:text-sm mobile-xl:text-xs text-2xs font-normal">
              <div className="flex justify-center items-center lg:px-4 lg:py-3 mobile-xl:px-2.5 mobile-xl:py-2 px-1.5 py-0.5 mobile-xl:border-[1px] border-[0.5px] mobile-xl:rounded-[10px] rounded-[5px] border-[#7A7C80] text-[#7A7C80] leading-none">
                <p className="truncate">как совершить обмен?</p>
              </div>
              <div className="flex justify-center items-center lg:px-4 lg:py-3 mobile-xl:px-2.5 mobile-xl:py-2 px-1.5 py-0.5 mobile-xl:border-[1px] border-[0.5px] mobile-xl:rounded-[10px] rounded-[5px] border-[#7A7C80] text-[#7A7C80] leading-none">
                <div className="mobile-xl:[&>svg]:w-10 [&>svg]:w-3 mobile-xl:mr-0 mr-1.5">
                  <YoutubeGreyIcon />
                </div>
                <p className="leading-none truncate">видеоинструкция</p>
              </div>
            </div>
            <h1 className="text-yellow-main uppercase flex flex-col lg:gap-5 mobile-xl:gap-1">
              <span className="xl:text-[44px] lg:text-3xl md:text-2xl mobile-xl:text-xl mobile:text-base mobile-xs:text-sm text-xs mobile-xl:font-bold font-medium leading-none">
                обмен
              </span>
              <span className="inline-flex mobile-xl:gap-4 gap-2 items-start justify-items-start xl:text-2xl lg:text-xl md:text-2xl mobile-xl:text-xl mobile:text-base mobile-xs:text-sm text-xs font-medium">
                <span className="max-w-[43vw] truncate">{giveCurrency}</span>
                <span className="mobile-xl:text-white text-yellow-main lg:text-[30px] md:text-[26px] mobile-xl:text-[22px] mobile:text-[18px] text-sm leading-none xl:mt-0.5 lg:mt-0 mobile-xl:mt-0.5 mt-0 h-full flex justify-center items-center">
                  ⇄
                </span>
                <span className="max-w-[43vw] truncate">{getCurrency}</span>
              </span>
              {location && (
                <span className="xl:text-2xl lg:text-xl text-2xl font-medium text-white">
                  {location}
                </span>
              )}
            </h1>
            <h3 className="lg:block hidden max-w-[90%] leading-5 font-normal xl:text-sm text-xs text-white">
              {parse(data[0]?.header_description, options)}
            </h3>
            <div className="mobile-xl:grid hidden lg:grid-cols-2 grid-cols-1 lg:gap-4 gap-0 justify-stretch justify-items-stretch w-fit">
              <BotBannerNew isExchange={isExchange} />
              <div className="lg:block hidden">
                <HoverCard openDelay={0}>
                  <HoverCardTrigger asChild>
                    <div className="cursor-pointer w-full h-full uppercase px-4 py-3 rounded-[10px] border-[1px] border-white grid justify-items-stretch justify-stretch items-center">
                      <p className="lx:text-sm text-xs text-center font-normal">
                        как совершить обмен?
                      </p>
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent className="rounded-[10px] border-none min-w-[500px] p-8 flex flex-col gap-5 text-white bg-new-dark-grey">
                    <p className="grid grid-cols-[30px_1fr] gap-5 items-start justify-start">
                      <span className="font-medium w-[30px] h-[30px] flex justify-center items-center text-xs text-black rounded-[5px] bg-yellow-main">
                        1
                      </span>
                      <span className="text-sm font-light text-white">
                        Выберите валюту, которую хотите отдать и валюту, которую хотите получить.
                      </span>
                    </p>
                    <p className="grid grid-cols-[30px_1fr] gap-5 items-start justify-start">
                      <span className="font-medium w-[30px] h-[30px] flex justify-center items-center text-xs text-black rounded-[5px] bg-yellow-main">
                        2
                      </span>
                      <span className="text-sm font-light text-white">
                        Выберите город, в котором хотите совершить обмен.
                      </span>
                    </p>
                    <p className="grid grid-cols-[30px_1fr] gap-5 items-start justify-start">
                      <span className="font-medium w-[30px] h-[30px] flex justify-center items-center text-xs text-black rounded-[5px] bg-yellow-main">
                        3
                      </span>
                      <span className="text-sm font-light text-white">
                        Перейдите на сайт обменника или в чат с менеджером по обмену для создания
                        заявки.
                      </span>
                    </p>
                    <p className="grid grid-cols-[30px_1fr] gap-5 items-start justify-start">
                      <span className="font-medium w-[30px] h-[30px] flex justify-center items-center text-xs text-black rounded-[5px] bg-yellow-main">
                        4
                      </span>
                      <span className="text-sm font-light text-white">
                        Договоритесь по времени и приезжайте в офис или закажите доставку наличных.
                      </span>
                    </p>
                    <p className="grid grid-cols-[30px_1fr] gap-5 items-start justify-start">
                      <span className="font-medium w-[30px] h-[30px] flex justify-center items-center text-xs text-black rounded-[5px] bg-yellow-main">
                        5
                      </span>
                      <span className="text-sm font-light text-white">
                        Поделитесь своим опытом с другими пользователями, оставив отзыв на
                        MoneySwap.
                      </span>
                    </p>
                  </HoverCardContent>
                </HoverCard>
              </div>
            </div>
          </div>
          <div className="lg:block hidden relative">
            <div className="absolute w-full h-full min-w-[340px] right-0 bg-[url(/redesign/exchange_currencies.png)] bg-contain bg-no-repeat bg-right"></div>
          </div>
        </section>
      )}
    </>
  );
};
