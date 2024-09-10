import { BitcoinIcon } from "lucide-react";
import Link from "next/link";

export const ExchangerInfo = () => {
  return (
    <section className="rounded-2xl w-full grid gap-4  bg-[#2d2d2d] p-6 shadow-[1px_3px_10px_3px_rgba(0,0,0,0.7)]">
      <h2 className="text-xl font-medium ">ОБЩАЯ ИНФОРМАЦИЯ ОБ ОБМЕННИКЕ</h2>
      <hr className="mx-[-1.5rem]" />
      <div className="grid grid-cols-6 grid-rows-2 gap-4">
        <div className="rounded-full border-2 border-[#ddd] flex items-center bg-black justify-center row-span-2 col-span-2 w-[80%] h-[100%]">
          <BitcoinIcon width={72} height={72} />
        </div>
        <Link href={"/"}>
          <div className="rounded-2xl border h-full flex flex-col items-center justify-center p-4 ">
            <p className="font-medium">ПЕРЕЙТИ НА САЙТ</p>
          </div>
        </Link>
        <div className="rounded-2xl border flex flex-col items-center justify-center p-4">
          <p className="text-xs font-medium">СТАТУС</p>
          <p className="text-[#f6ff5f] font-medium">АКТИВЕН</p>
        </div>
        <div className="rounded-2xl border flex flex-col items-center justify-center p-4">
          <p className="font-medium text-xs">ОТЗЫВЫ</p>
          <p className="flex gap-1 text-lg">
            <span className="text-[#f6ff5f] font-medium">45</span>
            <span>/</span>
            <span className="text-red-600 font-medium">1</span>
          </p>
        </div>
        <div className="rounded-2xl border flex flex-col items-center justify-center p-4">
          <p className="font-medium text-xs">СТРАНА</p>
          <p className="text-[#f6ff5f] font-medium">РОССИЯ</p>
        </div>
        <div className="grid grid-cols-3 col-span-4  grid-rows-1 gap-4">
          <div className="rounded-2xl border flex flex-col items-center justify-center p-4  ">
            <p className="font-medium text-xs">КУРСОВ ОБМЕНА</p>
            <p className="text-[#f6ff5f] font-medium">588</p>
          </div>
          <div className="rounded-2xl border  flex flex-col items-center justify-center p-4">
            <p className="font-medium text-xs">ОТКРЫТ</p>
            <p className="text-[#f6ff5f] font-medium">09.08.2022</p>
          </div>
          <div className="rounded-2xl border  flex flex-col items-center justify-center p-4">
            <p className="font-medium text-xs">НА MONEYSWAP С</p>
            <p className="text-[#f6ff5f] font-medium">13.09.2024</p>
          </div>
        </div>
      </div>
    </section>
  );
};
