"use client";

import parse, { DOMNode, Element } from "html-react-parser";
import { ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FC, useState } from "react";
import { ArrowRightIcon, HeaderArrow, YellowRightIcon } from "@/shared/assets";
import { products } from "@/shared/router";
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

interface SeoFooterText extends SeoTextsBlock {
  isExchange?: true;
  giveCurrency?: string;
  getCurrency?: string;
  location?: string;
}

export const SeoFooterText: FC<SeoFooterText> = ({
  data,
  isExchange,
  giveCurrency,
  getCurrency,
  location,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      {data.length > 0 && (
        <div className={`grid mobile-xl:gap-[50px] gap-10 mobile-xl:py-[50px] py-10`}>
          <div className="bg-new-dark-grey lg:rounded-[25px] mobile-xl:rounded-[15px] rounded-[10px] md::p-[44px] mobile-xl:p-8 p-5">
            <div className="strapi_styles md:text-lg text-sm strapi_fonts_codec">
              {parse(data[0]?.footer_title, options)}
            </div>
            <div className="mobile-xl:block hidden strapi_styles md:text-lg text-sm strapi_fonts_codec">
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

          {/* footer steps for exchange pages */}
          {isExchange && (
            <section className="grid gap-[30px]">
              <h3 className="text-yellow-main md:text-xl mobile-xl:text-base text-sm lg:font-bold font-medium uppercase">
                {location !== null
                  ? `Как обменять ${giveCurrency} на ${getCurrency}:`
                  : `Как обменять ${giveCurrency} на ${getCurrency} в городе ${location}:`}
              </h3>
              <section className="grid md:grid-flow-col grid-flow-row lg:gap-4 mobile-xl:gap-6 gap-4">
                <div className="grid lg:grid-flow-col grid-flow-row lg:justify-center justify-start lg:justify-items-center justify-items-start content-start lg:gap-[30px] gap-5 items-start h-full bg-new-dark-grey lg:rounded-[25px] mobile-xl:rounded-[15px] rounded-[10px] lg:p-[10%] p-6">
                  <h5 className="text-yellow-main md:text-[50px] mobile-xl:text-[44px] text-[40px] font-bold leading-none">
                    1
                  </h5>
                  <p className="md:text-base mobile-xl:text-sm text-xs lg:font-semibold font-medium uppercase">
                    Введите нужные вам валюты в поля{" "}
                    <span className="text-yellow-main">“Отдаю”</span> и{" "}
                    <span className="text-yellow-main">“Получаю”</span>.
                  </p>
                </div>
                <div className="lg:flex hidden justify-center items-center">
                  <YellowRightIcon className="size-5 fill-yellow-main" />
                </div>
                <div className="grid lg:grid-flow-col grid-flow-row lg:justify-center justify-start lg:justify-items-center justify-items-start content-start lg:gap-[30px] gap-5 items-start h-full bg-new-dark-grey lg:rounded-[25px] mobile-xl:rounded-[15px] rounded-[10px] lg:p-[10%] p-6">
                  <h5 className="text-yellow-main md:text-[50px] mobile-xl:text-[44px] text-[40px] font-bold leading-none">
                    2
                  </h5>
                  <p className="md:text-base mobile-xl:text-sm text-xs lg:font-semibold font-medium uppercase">
                    Подберите подходящий под ваши запросы{" "}
                    <span className="text-yellow-main">обменный пункт</span>.
                  </p>
                </div>
                <div className="lg:flex hidden justify-center items-center">
                  <YellowRightIcon className="size-5 fill-yellow-main" />
                </div>
                <div className="grid lg:grid-flow-col grid-flow-row lg:justify-center justify-start lg:justify-items-center justify-items-start content-start lg:gap-[30px] gap-5 items-start h-full bg-new-dark-grey lg:rounded-[25px] mobile-xl:rounded-[15px] rounded-[10px] lg:p-[10%] p-6">
                  <h5 className="text-yellow-main md:text-[50px] mobile-xl:text-[44px] text-[40px] font-bold leading-none">
                    3
                  </h5>
                  <p className="md:text-base mobile-xl:text-sm text-xs lg:font-semibold font-medium uppercase">
                    Обменяйте {giveCurrency} на {getCurrency}{" "}
                    <span className="text-yellow-main">быстро и безопасно</span>.
                  </p>
                </div>
              </section>
            </section>
          )}

          {/* footer options */}
          <section className="grid mobile-xl:gap-[40px] gap-6 bg-new-dark-grey lg:rounded-[25px] mobile-xl:rounded-[15px] rounded-[10px] mobile-xl:py-[50px] mobile-xl:px-[30px] py-6 px-5">
            <h3 className="text-yellow-main lg:text-xl md:text-lg text-[14px] lg:font-bold md:font-normal font-medium uppercase lg:text-center text-start">
              Преимущества мониторинга
            </h3>
            <div className="grid lg:gap-4 mobile-xl:gap-7 gap-3 lg:grid-flow-col lg:grid-cols-none mobile-xl:grid-cols-2 grid-cols-1 justify-items-stretch">
              <div className="bg-new-grey lg:rounded-[25px] mobile-xl:rounded-[15px] rounded-[10px] grid grid-flow-row mobile-xl:gap-7 gap-3 justify-start items-start content-start justify-items-start lg:py-[36px] lg:px-[28px] mobile-xl:py-8 mobile-xl:px-6 p-5">
                <h5 className="text-yellow-main lg:text-lg md:text-base text-sm font-semibold uppercase">
                  Широкий выбор направлений
                </h5>
                <p className="mobile-xl:text-sm text-xs font-light">
                  В MoneySwap вы сможете обменять, продать или купить наличные, безналичные,
                  криптовалюты, электронные деньги.
                </p>
              </div>
              <div className="bg-new-grey lg:rounded-[25px] mobile-xl:rounded-[15px] rounded-[10px] grid grid-flow-row mobile-xl:gap-7 gap-3 justify-start items-start content-start justify-items-start lg:py-[36px] lg:px-[28px] mobile-xl:py-8 mobile-xl:px-6 p-5">
                <h5 className="text-yellow-main lg:text-lg md:text-base text-sm font-semibold uppercase max-w-[80%]">
                  Выгодные курсы
                </h5>
                <p className="mobile-xl:text-sm text-xs font-light">
                  Здесь вы можете продать и купить активы по выгодным ценам. Информация о стоимости
                  обновляется в реальном времени.
                </p>
              </div>
              <div className="bg-new-grey lg:rounded-[25px] mobile-xl:rounded-[15px] rounded-[10px] grid grid-flow-row mobile-xl:gap-7 gap-3 justify-start items-start content-start justify-items-start lg:py-[36px] lg:px-[28px] mobile-xl:py-8 mobile-xl:px-6 p-5">
                <h5 className="text-yellow-main lg:text-lg md:text-base text-sm font-semibold uppercase">
                  Подбор надежных обменников
                </h5>
                <p className="mobile-xl:text-sm text-xs font-light">
                  Вам не нужно самостоятельно искать сайты, проверять их и сравнивать цены. Мы
                  сделаем это за вас, предоставив список обменников с лучшими курсами. Весь процесс,
                  включая оформление и подтверждение заявки, занимает всего 5–10 минут.
                </p>
              </div>
              <div className="bg-new-grey lg:rounded-[25px] mobile-xl:rounded-[15px] rounded-[10px] grid grid-flow-row mobile-xl:gap-7 gap-3 justify-start items-start content-start justify-items-start lg:py-[36px] lg:px-[28px] mobile-xl:py-8 mobile-xl:px-6 p-5">
                <h5 className="text-yellow-main lg:text-lg md:text-base text-sm font-semibold uppercase">
                  Удобный Telegram-бот
                </h5>
                <p className="mobile-xl:text-sm text-xs font-light">
                  Используйте бот MoneySwap, чтобы найти нужный обменник прямо в своем телефоне за
                  пару минут. Еще удобнее и быстрее, чем искать на сайте.
                </p>
              </div>
            </div>
            <p className="md:text-base mobile-xl:text-sm text-xs font-light lg:text-center text-start">
              Начните подбирать обменный пункт под ваши цели прямо сейчас,{" "}
              <Link
                href={products.telegram_bot}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#41BEFF] underline"
              >
                используя наш Telegram-бот
              </Link>
              . Быстро, удобно и безопасно!
            </p>
          </section>
        </div>
      )}
    </>
  );
};
