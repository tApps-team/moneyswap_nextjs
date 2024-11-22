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
    <section className="rounded-2xl w-full grid gap-4 bg-dark-gray    mobile-xl:bg-gradient-to-r mobile-xl:from-light-gray mobile-xl:from-0% mobile-xl:to-20% mobile-xl:to-dark-gray p-6 shadow-[1px_3px_10px_3px_rgba(0,0,0,0.7)]">
      <h2 className="mobile-xl:text-xl text-sm text-center font-medium ">
        ОБЩАЯ ИНФОРМАЦИЯ ОБ ОБМЕННИКЕ
      </h2>
      <hr className="mx-[-1.5rem]" />
      <div className="grid grid-cols-1 mobile-xl:grid-cols-[0.3fr,0.8fr]  gap-4 ">
        <div className="rounded-full  flex items-center   justify-center h-full w-full  ">
          {exchangerDetails.iconUrl ? (
            <Image
              width={224}
              height={224}
              className="mobile-xl:size-56 size-32 "
              src={exchangerDetails.iconUrl}
              alt={`icon exchnager ${exchangerDetails.name}`}
            />
          ) : (
            <BitcoinIcon className="object-contain" width={72} height={72} />
          )}
        </div>

        <div className="grid gap-4 grid-cols-2 grid-rows-4  mobile-xl:grid-cols-4  mobile-xl:grid-rows-2">
          <Link
            target="_blank"
            href={exchangerDetails.url}
            className="rounded-2xl shadow-[1px_3px_10px_3px_rgba(0,0,0,0.7)] flex justify-center items-center text-center bg-dark-gray text-yellow-main  p-4 "
          >
            <p className=" mobile-xl:text-sm text-sm font-medium">ПЕРЕЙТИ НА САЙТ</p>
          </Link>
          <div className="rounded-2xl shadow-[1px_3px_10px_3px_rgba(0,0,0,0.7)] bg-dark-gray flex flex-col items-center justify-center p-4">
            <p className=" mobile-xl:text-sm text-xs font-medium">СТАТУС</p>
            <p className="text-yellow-main text-sm mobile-xl:text-base font-medium text-center">
              {exchangerDetails.workStatus ? "АКТИВЕН" : "НЕ АКТИВЕН"}
            </p>
          </div>
          <div className="rounded-2xl shadow-[1px_3px_10px_3px_rgba(0,0,0,0.7)] bg-dark-gray flex flex-col items-center justify-center p-4">
            <p className=" mobile-xl:text-sm text-xs font-medium">ОТЗЫВЫ</p>
            <p className="flex gap-1 mobile-xl:text-lg text-base">
              <span className="text-yellow-main  font-medium">
                {exchangerDetails.reviews?.positive}
              </span>
              <span>/</span>
              <span className="text-red-600 font-medium">{exchangerDetails.reviews?.negative}</span>
            </p>
          </div>
          <div className="rounded-2xl shadow-[1px_3px_10px_3px_rgba(0,0,0,0.7)] bg-dark-gray  flex flex-col items-center justify-center p-4">
            <p className="font-medium text-xs uppercase">СТРАНА</p>
            <p className="text-yellow-main text-sm mobile-xl:text-base font-medium">
              {exchangerDetails.country}
            </p>
          </div>
          {/* <div className="grid grid-cols-3 col-span-4 bg-dark-gray  gap-4"> */}
          <div className="rounded-2xl shadow-[1px_3px_10px_3px_rgba(0,0,0,0.7)]  flex flex-col items-center justify-center p-4  ">
            <p className=" mobile-xl:text-sm text-xs text-center font-medium">КУРСОВ ОБМЕНА</p>
            <p className="text-yellow-main text-sm mobile-xl:text-base font-medium">
              {exchangerDetails.exchangeRates}
            </p>
          </div>
          <div className="rounded-2xl shadow-[1px_3px_10px_3px_rgba(0,0,0,0.7)]  bg-dark-gray  flex flex-col items-center justify-center p-4">
            <p className=" mobile-xl:text-sm text-xs font-medium">ОТКРЫТ</p>
            <p className="text-yellow-main text-sm mobile-xl:text-base font-medium text-center">
              {exchangerDetails.open || "09.08.2022"}
            </p>
          </div>
          <div className="rounded-2xl col-span-2  shadow-[1px_3px_10px_3px_rgba(0,0,0,0.7)] bg-dark-gray flex flex-col items-center justify-center p-4">
            <p className=" mobile-xl:text-sm text-xs font-medium">НА MONEYSWAP С</p>
            <p className="text-yellow-main font-medium">
              {exchangerDetails.openOnMoneySwap || "13.09.2024"}
            </p>
          </div>
        </div>
        {/* </div> */}
      </div>
    </section>
  );
};
