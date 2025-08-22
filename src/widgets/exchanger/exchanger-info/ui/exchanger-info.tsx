import { BitcoinIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ExchangerInfo as ExchangerInfoType } from "@/entities/exchanger";
import { ExchangerStatus } from "@/shared/types";
type ExchangerInfoProps = {
  exchangerDetails: ExchangerInfoType;
};
export const ExchangerInfo = async (props: ExchangerInfoProps) => {
  const { exchangerDetails } = props;
  const formattedDate = exchangerDetails.openOnMoneySwap ? new Date(exchangerDetails.openOnMoneySwap).toLocaleDateString('ru-RU') : "---";
  const formattedClosedDate = exchangerDetails.closedOnMoneySwap ? new Date(exchangerDetails.closedOnMoneySwap).toLocaleDateString('ru-RU') : "___";

  return (
    <section className="rounded-[15px] w-full grid grid-row-[auto,1fr] xl:gap-[50px] gap-[20px] bg-new-dark-grey xl:p-10 md:p-5 mobile:pb-7 mobile:px-6 mobile:pt-11 pb-5 pt-7 px-3">
      <h2 className="hidden md:block text-xl text-center md:text-start font-semibold">
        Общая информация об обменнике
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-[auto,1fr] gap-10 justify-start">
        <div className="flex md:flex-col flex-row items-center md:justify-between justify-start h-full w-full md:gap-0 mobile:gap-6 gap-3">
          {exchangerDetails.iconUrl && (
            <Image
              width={224}
              height={224}
              className="md:size-32 mobile-xl:size-24 size-16 rounded-full"
              src={exchangerDetails.iconUrl}
              alt={`icon exchnager ${exchangerDetails?.name}`}
            />
          )}
          <div className="grid grid-flow-row gap-3 md:content-normal content-center justify-start">
            <p className="unbounded_font font-semibold md:text-xl mobile-xl:text-3xl mobile:text-xl text-base md:text-white text-yellow-main truncate md:max-w-[10vw] max-w-full">
              {exchangerDetails?.name}
            </p>
            <h2 className="block md:hidden mobile-xl:text-base mobile:text-sm text-xs font-semibold">
              Общая информация об обменнике
            </h2>
          </div>
        </div>

        <div className="grid gap-4 grid-cols-2 grid-rows-4  md:grid-cols-4  md:grid-rows-2">
          <Link
            target="_blank"
            href={exchangerDetails?.url}
            className="rounded-[12px] flex justify-center items-center text-center bg-new-grey text-yellow-main  p-4"
          >
            <p className=" md:text-base text-sm font-semibold underline">Перейти на сайт</p>
          </Link>
          <div className="rounded-[12px] bg-new-grey flex flex-col items-center justify-center p-4">
            <p className=" md:text-base text-[#84868A] text-xs font-semibold">Статус</p>
            <p className="text-yellow-main text-sm uppercase md:text-base font-semibold text-center">
              {exchangerDetails?.workStatus === ExchangerStatus.active ? "Активен" : exchangerDetails?.workStatus === ExchangerStatus.disabled ? "Отключен" : "Неактивный"}
            </p>
          </div>
          <div className="rounded-[12px] bg-new-grey flex flex-col items-center justify-center p-4">
            <p className=" md:text-base text-xs font-semibold text-[#84868A]">Отзывы</p>
            <p className="flex gap-1 md:text-lg text-base">
              <span className="text-yellow-main font-semibold">
                {exchangerDetails?.reviews?.positive}
              </span>
              <span className="text-[#84868A]">|</span>
              <span className="text-[#84868A] font-semibold">
                {exchangerDetails?.reviews?.neutral}
              </span>
              <span className="text-[#84868A]">|</span>
              <span className="text-red-600 font-semibold">
                {exchangerDetails?.reviews?.negative}
              </span>
            </p>
          </div>
          <div className="rounded-[12px] bg-new-grey flex flex-col items-center justify-center p-4">
            <p className="font-semibold md:text-base text-sm  text-[#84868A]">Страна</p>
            <p className="text-yellow-main text-sm md:text-base font-semibold">
              {exchangerDetails?.country || "---"}
            </p>
          </div>
          <div className="bg-new-grey rounded-[12px] flex flex-col items-center justify-center p-4">
            <p className=" md:text-base text-xs text-[#84868A] text-center font-semibold">
              Курсов обмена
            </p>
            <p className="text-yellow-main text-sm md:text-base font-semibold">
              {exchangerDetails?.exchangeRates || "---"}
            </p>
          </div>
          <div className="rounded-[12px] bg-new-grey flex flex-col items-center justify-center p-4">
            <p className=" md:text-base text-xs text-[#84868A] font-semibold">Открыт</p>
            <p className="text-yellow-main text-sm md:text-base font-semibold text-center">
              {exchangerDetails?.open || "---"}
            </p>
          </div>
          <div className="rounded-[12px] col-span-2 bg-new-grey flex flex-col items-center justify-center p-4">
            <p className="md:text-base text-xs text-[#84868A] font-semibold">{exchangerDetails?.workStatus === ExchangerStatus.disabled ? "отключён от MONEYSWAP с" : "на MONEYSWAP с"}</p>
            <p className="text-yellow-main font-semibold">
              {exchangerDetails?.workStatus === ExchangerStatus.disabled ? formattedClosedDate : formattedDate || "---"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
