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
    <section className="rounded-2xl w-full grid gap-4 bg-dark-gray p-6 shadow-[1px_3px_10px_3px_rgba(0,0,0,0.5)]">
      {/* md:bg-gradient-to-r md:from-light-gray md:from-10% md:to-45% md:to-dark-gray */}
      <h2 className="md:text-xl text-sm text-center font-normal uppercase">
        Общая информация об обменнике
      </h2>
      <hr className="mx-[-1.5rem]" />
      <div className="grid grid-cols-1 md:grid-cols-[0.3fr,0.8fr]  gap-4 ">
        <div className="rounded-full  flex items-center   justify-center h-full w-full  ">
          {exchangerDetails.iconUrl ? (
            <Image
              width={224}
              height={224}
              className="md:size-56 size-32 "
              src={exchangerDetails.iconUrl}
              alt={`icon exchnager ${exchangerDetails.name}`}
            />
          ) : (
            <BitcoinIcon className="object-contain" width={72} height={72} />
          )}
        </div>

        <div className="grid gap-4 grid-cols-2 grid-rows-4  md:grid-cols-4  md:grid-rows-2">
          <Link
            target="_blank"
            href={exchangerDetails.url}
            className="rounded-2xl shadow-[1px_3px_10px_3px_rgba(0,0,0,0.3)] flex justify-center items-center text-center bg-dark-gray text-yellow-main  p-4"
          >
            <p className=" md:text-sm text-sm font-normal">ПЕРЕЙТИ НА САЙТ</p>
          </Link>
          <div className="rounded-2xl shadow-[1px_3px_10px_3px_rgba(0,0,0,0.3)] bg-dark-gray flex flex-col items-center justify-center p-4">
            <p className=" md:text-sm text-xs font-normal">СТАТУС</p>
            <p className="text-yellow-main text-sm md:text-base font-normal text-center">
              {exchangerDetails.workStatus ? "Активен" : "Не активен"}
            </p>
          </div>
          <div className="rounded-2xl shadow-[1px_3px_10px_3px_rgba(0,0,0,0.3)] bg-dark-gray flex flex-col items-center justify-center p-4">
            <p className=" md:text-sm text-xs font-normal">ОТЗЫВЫ</p>
            <p className="flex gap-1 md:text-lg text-base">
              <span className="text-yellow-main font-normal">
                {exchangerDetails.reviews?.positive}
              </span>
              <span>/</span>
              <span className="text-red-600 font-normal">{exchangerDetails.reviews?.negative}</span>
            </p>
          </div>
          <div className="rounded-2xl shadow-[1px_3px_10px_3px_rgba(0,0,0,0.3)] bg-dark-gray  flex flex-col items-center justify-center p-4">
            <p className="font-normal text-sm uppercase">СТРАНА</p>
            <p className="text-yellow-main text-sm md:text-base font-normal">
              {exchangerDetails.country}
            </p>
          </div>
          <div className="bg-dark-gray rounded-2xl shadow-[1px_3px_10px_3px_rgba(0,0,0,0.3)] flex flex-col items-center justify-center p-4">
            <p className=" md:text-sm text-xs text-center font-normal">КУРСОВ ОБМЕНА</p>
            <p className="text-yellow-main text-sm md:text-base font-normal">
              {exchangerDetails.exchangeRates}
            </p>
          </div>
          <div className="rounded-2xl shadow-[1px_3px_10px_3px_rgba(0,0,0,0.3)] bg-dark-gray  flex flex-col items-center justify-center p-4">
            <p className=" md:text-sm text-xs font-normal">ОТКРЫТ</p>
            <p className="text-yellow-main text-sm md:text-base font-normal text-center">
              {exchangerDetails.open || "09.08.2022"}
            </p>
          </div>
          <div className="rounded-2xl col-span-2 shadow-[1px_3px_10px_3px_rgba(0,0,0,0.3)] bg-dark-gray flex flex-col items-center justify-center p-4">
            <p className="md:text-sm text-xs font-normal">НА MONEYSWAP С</p>
            <p className="text-yellow-main font-normal">
              {exchangerDetails.openOnMoneySwap || "13.09.2024"}
            </p>
          </div>
        </div>
        {/* </div> */}
      </div>
    </section>
  );
};
