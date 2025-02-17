import { BitcoinIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ExchangerMarker, ExchnagerInfo, getExchangerDetails } from "@/entities/exchanger";
type ExchangerInfoProps = {
  exchangerDetails: ExchnagerInfo;
};
export const ExchangerInfo = async (props: ExchangerInfoProps) => {
  const { exchangerDetails } = props;

  return (
    <section className="rounded-2xl w-full grid gap-4 bg-new-dark-grey p-10 ">
      <h2 className="md:text-xl text-sm text-center md:text-start  font-semibold ">
        Общая информация об обменнике
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-[0.2fr,0.8fr]  gap-4 ">
        <div className="  flex  flex-col items-center    justify-between h-full w-full  ">
          {exchangerDetails.iconUrl && (
            <Image
              width={224}
              height={224}
              className="md:size-32 size-32 "
              src={exchangerDetails.iconUrl}
              alt={`icon exchnager ${exchangerDetails.name}`}
            />
          )}
          {/* ) : (
            <BitcoinIcon className="object-contain" width={72} height={72} />
          )} */}
          <p className="font-semibold text-xl">{exchangerDetails.name}</p>
        </div>

        <div className="grid gap-4 grid-cols-2 grid-rows-4  md:grid-cols-4  md:grid-rows-2">
          <Link
            target="_blank"
            href={exchangerDetails.url}
            className="rounded-2xl  flex justify-center items-center text-center bg-new-grey text-yellow-main  p-4"
          >
            <p className=" md:text-base text-sm font-semibold underline">Перейти на сайт</p>
          </Link>
          <div className="rounded-2xl  bg-new-grey flex flex-col items-center justify-center p-4">
            <p className=" md:text-base text-[#84868A] text-xs font-semibold">Статус</p>
            <p className="text-yellow-main text-sm uppercase md:text-base font-semibold text-center">
              {exchangerDetails.workStatus ? "Активен" : "Не активен"}
            </p>
          </div>
          <div className="rounded-2xl  bg-new-grey flex flex-col items-center justify-center p-4">
            <p className=" md:text-base text-xs font-semibold text-[#84868A]">Отзывы</p>
            <p className="flex gap-1 md:text-lg text-base">
              <span className="text-yellow-main font-semibold">
                {exchangerDetails.reviews?.positive}
              </span>
              <span>/</span>
              <span className="text-red-600 font-semibold">
                {exchangerDetails.reviews?.negative}
              </span>
            </p>
          </div>
          <div className="rounded-2xl  bg-new-grey  flex flex-col items-center justify-center p-4">
            <p className="font-semibold md:text-base text-sm  text-[#84868A]">Страна</p>
            <p className="text-yellow-main text-sm md:text-base font-semibold">
              {exchangerDetails.country}
            </p>
          </div>
          <div className="bg-new-grey rounded-2xl  flex flex-col items-center justify-center p-4">
            <p className=" md:text-base text-xs text-[#84868A] text-center font-semibold">
              Курсов обемна
            </p>
            <p className="text-yellow-main text-sm md:text-base font-semibold">
              {exchangerDetails.exchangeRates}
            </p>
          </div>
          <div className="rounded-2xl  bg-new-grey  flex flex-col items-center justify-center p-4">
            <p className=" md:text-base text-xs text-[#84868A] font-semibold">Открыт</p>
            <p className="text-yellow-main text-sm md:text-base font-semibold text-center">
              {exchangerDetails.open || "09.08.2022"}
            </p>
          </div>
          <div className="rounded-2xl col-span-2  bg-new-grey flex flex-col items-center justify-center p-4">
            <p className="md:text-base text-xs text-[#84868A] font-semibold">на MONEYSWAP с</p>
            <p className="text-yellow-main font-semibold">
              {exchangerDetails.openOnMoneySwap || "13.09.2024"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
