import parse, { DOMNode, Element } from "html-react-parser";
import { Info } from "lucide-react";
import Image from "next/image";
import { FC } from "react";
import { BotBannerNew } from "@/features/bot-banner-new";
import {
  ExchangeArrowIcon,
  YellowQuestionIcon,
  YoutubeGreyIcon,
  YoutubeIcon,
} from "@/shared/assets";
import { delay } from "@/shared/lib";
import { SeoTextsBlock } from "@/shared/types";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/shared/ui";

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
        // <div className="grid gap-5">
        //   <div className="relative flex items-start justify-between gap-1">
        //     <h1
        //       className={`[&>b]:leading-normal text-start text-xs mobile-xs:text-sm mobile:text-base md:text-lg lg:text-2xl xl:text-[28px] strapi_styles mobile-xl:max-w-[90%] max-w-full`}
        //     >
        //       {parse(data[0]?.header_title, options)}
        //     </h1>
        //     <div className="mobile-xl:hidden mobile-xl:mt-6 mt-0 flex gap-2">
        //       <Dialog>
        //         <DialogTrigger className="">
        //           <Info className="size-8" />
        //         </DialogTrigger>
        //         <DialogContent className="w-[90%] border-none shadow-[1px_3px_10px_3px_rgba(0,0,0,0.7)] h-[50svh] flex flex-col items-center px-10 py-4 gap-10 rounded-3xl bg-dark-gray">
        //           <Image
        //             className="mt-10"
        //             src={"/logofull.svg"}
        //             alt="logo"
        //             width={180}
        //             height={180}
        //           />
        //           <div className="uppercase tracking-widest text-2xs leading-2 overflow-scroll font-normal text-start">
        //             {parse(data[0]?.header_description, options)}
        //           </div>
        //         </DialogContent>
        //       </Dialog>
        //       <Dialog>
        //         <DialogTrigger className="">
        //           <YellowQuestionIcon className="size-8" />
        //         </DialogTrigger>
        //         <DialogContent className="w-[90%] border-none shadow-[1px_3px_10px_3px_rgba(0,0,0,0.7)] h-auto max-h-[80svh] flex flex-col items-center px-6 py-4 gap-8 rounded-3xl bg-dark-gray pb-10">
        //           <Image
        //             src={"/logofull.svg"}
        //             className="mt-8"
        //             alt="logo"
        //             width={180}
        //             height={180}
        //           />
        //           <h3 className="uppercase text-sm font-medium tracking-widest">
        //             как совершить обмен?
        //           </h3>
        //           <p className="text-2xs leading-2 flex flex-col gap-4 overflow-scroll px-4 tracking-widest">
        //             <p>
        //               1. Выберите валюту, которую хотите отдать и валюту, которую хотите получить.
        //             </p>
        //             <p>2. Выберите город, в котором хотите совершить обмен.</p>
        //             <p>
        //               3. Перейдите на сайт обменника или в чат с менеджером по обмену для создания
        //               заявки
        //             </p>
        //             <p>
        //               4. Договоритесь по времени и приезжайте в офис или закажите доставку наличных.
        //             </p>
        //             <p>
        //               5. Поделитесь своим опытом с другими пользователями, оставив отзыв на
        //               MoneySwap.
        //             </p>
        //           </p>
        //         </DialogContent>
        //       </Dialog>
        //     </div>
        //     <div className="max-[575px]:sr-only  absolute top-0 right-0 grid grid-flow-col gap-4 justify-center items-center">
        //       <HoverCard openDelay={0}>
        //         <HoverCardTrigger asChild>
        //           <YellowQuestionIcon width={36} height={36} className="cursor-pointer" />
        //         </HoverCardTrigger>
        //         <HoverCardContent className="rounded-2xl border-none shadow-[1px_3px_10px_3px_rgba(0,0,0,0.7)] min-w-[500px] p-8 flex flex-col gap-4 text-sm text-white bg-dark-gray">
        //           <p>
        //             1. Выберите валюту, которую хотите отдать и валюту, которую хотите получить.
        //           </p>
        //           <p>2. Выберите город, в котором хотите совершить обмен.</p>
        //           <p>
        //             3. Перейдите на сайт обменника или в чат с менеджером по обмену для создания
        //             заявки
        //           </p>
        //           <p>
        //             4. Договоритесь по времени и приезжайте в офис или закажите доставку наличных.
        //           </p>
        //           <p>
        //             5. Поделитесь своим опытом с другими пользователями, оставив отзыв на MoneySwap.
        //           </p>
        //         </HoverCardContent>
        //       </HoverCard>
        //       <Image src="/youtube.svg" alt="" width={37} height={37} className="cursor-pointer" />
        //     </div>
        //   </div>
        //   <div className="sr-only mobile-xl:not-sr-only lg:text-sm md:text-xs text-2xs strapi_styles">
        //     {parse(data[0]?.header_description, options)}
        //   </div>
        // </div>

        <section className="grid xl:grid-cols-[1fr_0.7fr] lg:grid-cols-[1fr_0.5fr] grid-cols-1 justify-between ">
          <div className="grid grid-flow-row lg:gap-10 gap-[30px]">
            <div className="grid grid-cols-2 gap-5 w-fit uppercase lg:text-sm text-xs font-normal">
              <div className="flex justify-center items-center lg:px-4 lg:py-3 px-2.5 py-2 border-[1px] rounded-[10px] border-[#7A7C80] text-[#7A7C80] leading-none">
                как совершить обмен?
              </div>
              <div className="lg:px-4 lg:py-3 px-2.5 py-2 flex items-center gap-2 border-[1px] border-[#7A7C80] rounded-[10px] text-[#7A7C80]">
                <div className="[&>svg]:w-10">
                  <YoutubeGreyIcon />
                </div>
                <p className="leading-none">видеоинструкция</p>
              </div>
            </div>
            <h1 className="text-yellow-main uppercase flex flex-col lg:gap-5 gap-1">
              <span className="xl:text-[44px] lg:text-3xl text-2xl font-bold leading-none">
                обмен
              </span>
              <span className="grid grid-flow-col gap-4 justify-start items-center justify-items-start xl:text-2xl lg:text-xl text-2xl font-medium">
                <span>{giveCurrency}</span>
                <span className="text-white lg:text-[38px] md:text-[32px] text-[28px] leading-none mt-0.5">
                  ⇄
                </span>
                <span>{getCurrency}</span>
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
            <div className="grid lg:grid-cols-2 grid-cols-1 lg:gap-4 gap-0 justify-stretch justify-items-stretch w-fit">
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
            <div className="absolute w-full h-full right-0 bg-[url(/redesign/exchange_currencies.png)] bg-contain bg-no-repeat bg-right"></div>
          </div>
        </section>
      )}
    </>
  );
};
