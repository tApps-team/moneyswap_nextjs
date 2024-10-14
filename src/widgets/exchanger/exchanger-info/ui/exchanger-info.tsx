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
    <section className="rounded-2xl w-full grid gap-4    bg-gradient-to-r from-light-gray from-0% to-20% to-[#2d2d2d] p-6 shadow-[1px_3px_10px_3px_rgba(0,0,0,0.7)]">
      <h2 className="text-xl font-medium ">ОБЩАЯ ИНФОРМАЦИЯ ОБ ОБМЕННИКЕ</h2>
      <hr className="mx-[-1.5rem]" />
      <div className="grid grid-cols-[0.3fr,0.8fr]  gap-4 ">
        <div className="rounded-full border-2 border-[#ddd] flex items-center  bg-black justify-center h-full w-full  ">
          {exchangerDetails.iconUrl ? (
            <Image
              width={320}
              height={320}
              src={exchangerDetails.iconUrl}
              alt={`icon exchnager ${exchangerDetails.name}`}
            />
          ) : (
            <BitcoinIcon className="object-contain" width={72} height={72} />
          )}
        </div>

        <div className="grid gap-4 grid-cols-4  grid-rows-2">
          <Link
            target="_blank"
            href={exchangerDetails.url}
            className="rounded-2xl shadow-[1px_3px_10px_3px_rgba(0,0,0,0.7)] flex justify-center items-center text-center bg-[#2d2d2d] text-[#f6ff5f]  p-4 "
          >
            <p className="font-medium ">ПЕРЕЙТИ НА САЙТ</p>
          </Link>
          <div className="rounded-2xl shadow-[1px_3px_10px_3px_rgba(0,0,0,0.7)] bg-[#2d2d2d] flex flex-col items-center justify-center p-4">
            <p className="text-xs font-medium">СТАТУС</p>
            <p className="text-[#f6ff5f] font-medium text-center">
              {exchangerDetails.workStatus ? "АКТИВЕН" : "НЕ АКТИВЕН"}
            </p>
          </div>
          <div className="rounded-2xl shadow-[1px_3px_10px_3px_rgba(0,0,0,0.7)] bg-[#2d2d2d] flex flex-col items-center justify-center p-4">
            <p className="font-medium text-xs">ОТЗЫВЫ</p>
            <p className="flex gap-1 text-lg">
              <span className="text-[#f6ff5f] font-medium">
                {exchangerDetails.reviews.positive}
              </span>
              <span>/</span>
              <span className="text-red-600 font-medium">{exchangerDetails.reviews.negative}</span>
            </p>
          </div>
          <div className="rounded-2xl shadow-[1px_3px_10px_3px_rgba(0,0,0,0.7)] bg-[#2d2d2d]  flex flex-col items-center justify-center p-4">
            <p className="font-medium text-xs uppercase">СТРАНА</p>
            <p className="text-[#f6ff5f] font-medium">{exchangerDetails.country}</p>
          </div>
          <div className="grid grid-cols-3 col-span-4 bg-[#2d2d2d]  gap-4">
            <div className="rounded-2xl shadow-[1px_3px_10px_3px_rgba(0,0,0,0.7)]  flex flex-col items-center justify-center p-4  ">
              <p className="font-medium text-xs">КУРСОВ ОБМЕНА</p>
              <p className="text-[#f6ff5f] font-medium">{exchangerDetails.exchangeRates}</p>
            </div>
            <div className="rounded-2xl shadow-[1px_3px_10px_3px_rgba(0,0,0,0.7)]  bg-[#2d2d2d]  flex flex-col items-center justify-center p-4">
              <p className="font-medium text-xs">ОТКРЫТ</p>
              <p className="text-[#f6ff5f] font-medium text-center">
                {exchangerDetails.open || "09.08.2022"}
              </p>
            </div>
            <div className="rounded-2xl  shadow-[1px_3px_10px_3px_rgba(0,0,0,0.7)] bg-[#2d2d2d] flex flex-col items-center justify-center p-4">
              <p className="font-medium text-xs">НА MONEYSWAP С</p>
              <p className="text-[#f6ff5f] font-medium">
                {exchangerDetails.openOnMoneySwap || "13.09.2024"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
