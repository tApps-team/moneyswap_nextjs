import parse, { DOMNode, Element } from "html-react-parser";
import { Info } from "lucide-react";
import Image from "next/image";
import { FC } from "react";
import { YellowQuestionIcon, YoutubeIcon } from "@/shared/assets";
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

interface SeoHeaderText extends SeoTextsBlock {}

export const SeoHeaderText: FC<SeoHeaderText> = ({ data }) => {
  return (
    <>
      {data.length > 0 && (
        <div className="grid gap-5">
          <div className="relative flex items-start gap-1">
            <div
              className={`mobile-xl:text-center text-start text-xs mobile-xs:text-sm mobile:text-base mobile-xl:text-[28px] strapi_styles mobile-xl:max-w-[90%] max-w-full`}
            >
              {parse(data[0]?.header_title, options)}
            </div>
            <div className="mobile-xl:hidden mobile-xl:mt-6 mt-0 flex gap-2">
              <Dialog>
                <DialogTrigger className="">
                  <Info className="size-8" />
                </DialogTrigger>
                <DialogContent className="w-[90%]  border-none shadow-[1px_3px_10px_3px_rgba(0,0,0,0.7)] h-[70%] flex flex-col items-center p-3 gap-10 rounded-3xl bg-dark-gray">
                  <Image
                    src={"/logofull.svg"}
                    className="mt-10"
                    alt="logo"
                    width={300}
                    height={300}
                  />
                  <h2 className="uppercase text-sm font-bold">как совершить обмен?</h2>
                  <p className="uppercase text-xs leading-2 flex flex-col gap-2 overflow-scroll">
                    <p>
                      1. Выберите валюту, которую хотите отдать и валюту, которую хотите получить.
                    </p>
                    <p>2. Выберите город, в котором хотите совершить обмен.</p>
                    <p>3. Выберите обменник из списка - у первого обменника лучший курс.</p>
                    <p>4. Перейдите на сайт обменника и создайте заявку на сайте.</p>
                    <p>5. С вами свяжется менеджер.</p>
                    <p>
                      6. Договоритесь по времени и приезжайте в офис или закажите доставку наличных.
                    </p>
                    <p>
                      7. Поделитесь своим опытом с другими пользователями, оставив отзыв на Exnode.
                    </p>
                  </p>
                </DialogContent>
              </Dialog>
              <Dialog>
                <DialogTrigger className="">
                  <YellowQuestionIcon className="size-8" />
                </DialogTrigger>
                <DialogContent className="w-[90%]  border-none shadow-[1px_3px_10px_3px_rgba(0,0,0,0.7)] h-[70%] flex flex-col items-center p-3 gap-10 rounded-3xl bg-dark-gray">
                  <Image
                    className="mt-10"
                    src={"/logofull.svg"}
                    alt="logo"
                    width={300}
                    height={300}
                  />
                  <h2 className="uppercase text-sm font-bold">что такое moneyswap?</h2>
                  <p className="uppercase text-xs leading-2 overflow-scroll">
                    MONEYSWAP - мониторинг обменников криптовалют. На сайте собран список
                    проверенных обменников криптовалют, с помощью которых вы можете обменять
                    криптовалюту быстро и безопасно. На MONEYSWAP размещены лучшие криптообменники с
                    самыми выгодными курсами.
                  </p>
                </DialogContent>
              </Dialog>
              {/* <Dialog>
                <DialogTrigger className="text-xs">
                  
                </DialogTrigger>
                <DialogContent className="w-[80%] h-[80%] rounded-3xl">asdfasdf</DialogContent>
              </Dialog> */}
            </div>
            <div className="max-[567px]:sr-only  absolute top-0 right-0 grid grid-flow-col gap-4 justify-center items-center">
              <HoverCard openDelay={0}>
                <HoverCardTrigger asChild>
                  <YellowQuestionIcon width={36} height={36} className="cursor-pointer" />
                </HoverCardTrigger>
                <HoverCardContent className="rounded-2xl border-none shadow-[1px_3px_10px_3px_rgba(0,0,0,0.7)] min-w-[500px] p-8 flex flex-col gap-4 text-sm font-medium text-white bg-dark-gray">
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
              <Image src="/youtube.svg" alt="" width={37} height={37} className="cursor-pointer" />
            </div>
          </div>
          <div className="sr-only mobile-xl:not-sr-only strapi_styles text-sm">
            {parse(data[0]?.header_description, options)}
          </div>
        </div>
      )}
    </>
  );
};
