import { ArrowRight } from "lucide-react";
import { Exchanger, ExchangerMarker } from "..";

type ExchangerCardProps = {
  exchanger: Exchanger;
};
export const ExchangerCard = (props: ExchangerCardProps) => {
  const { exchanger } = props;
  return (
    <div className="shadow-[1px_2px_8px_3px_rgba(0,0,0,0.5)] grid grid-cols-1 gap-4 p-4 rounded-3xl bg-dark-gray   ">
      <div>
        <h2 className="font-bold">{exchanger.name.ru}</h2>
        <div className="flex items-center justify-between">
          <p className="uppercase text-2xs text-yellow-main">
            {exchanger.exchange_marker === ExchangerMarker.cash
              ? `в г. ${exchanger.location?.name.ru}`
              : "Онлайн обмен"}
          </p>
          <div className="rounded-full border border-light-gray  gap-2 flex justify-between items-center p-1 text-2xs">
            <p>ОТЗЫВЫ</p>
            <div className="flex gap-1 items-center">
              <p className="text-yellow-main">{exchanger.review_count.positive}</p>
              <p>|</p>
              <p className="text-light-gray">{exchanger.review_count.negative}</p>
            </div>
          </div>
        </div>
      </div>
      <hr className="-mx-4 bg-light-gray" />
      <div>
        <div className="flex text-xs items-center gap-2">
          <div className="flex gap-2  items-center">
            <p className="font-bold">{exchanger.in_count}</p>
            <p>{exchanger.valute_from}</p>
          </div>
          <ArrowRight className="size-4 min-h-4 min-w-4" />
          <div className="flex gap-2  items-center">
            <p className="font-bold">{exchanger.out_count}</p>
            <p>{exchanger.valute_to}</p>
          </div>
        </div>
        <div>
          <p className="text-xs text-yellow-main">
            Обмен от {exchanger.min_amount} до {exchanger.max_amount}
          </p>
        </div>
      </div>
    </div>
  );
};
