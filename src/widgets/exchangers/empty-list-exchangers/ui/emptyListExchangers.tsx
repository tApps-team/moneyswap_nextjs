import { ChevronRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getSimilarDirections } from "@/entities/exchanger";
import { GetSimilarDirectionDtoRequset } from "@/entities/exchanger/api/exchanger-api-dto";
import { Button } from "@/shared/ui";
type EmptyListExchangersProps = GetSimilarDirectionDtoRequset;
// img alt prop
export const EmptyListExchangers = async (props: EmptyListExchangersProps) => {
  const { valuteFrom, valuteTo, city, exchangeMarker, limit } = props;
  const data = await getSimilarDirections({ valuteFrom, valuteTo, city, exchangeMarker, limit });
  console.log(data);
  const createUrl = (valuteFrom: string, valuteTo: string) => {
    if (city) {
      return `/exchange/${valuteFrom}-to-${valuteTo}/${city}`;
    } else {
      return `/exchange/${valuteFrom}-to-${valuteTo}`;
    }
  };
  return (
    <div className="shadow-[1px_3px_10px_3px_rgba(0,0,0,0.7)] mt-12 flex flex-col w-full rounded-3xl text-white bg-[#2d2d2d]">
      {data?.map((exchanger) => (
        <div
          className="flex justify-between items-center px-4 py-4 border-b last:border-none"
          key={exchanger.valute_from.code_name}
        >
          <div className="flex items-center gap-2">
            <Image src={exchanger.valute_from.icon_url} alt={`image`} width={32} height={32} />
            <p>{exchanger.valute_from.code_name}</p>
            <ChevronRightIcon color="white" height={32} width={32} />
            <Image src={exchanger.valute_to.icon_url} alt={`image`} width={32} height={32} />
            <p>{exchanger.valute_to.code_name}</p>
          </div>
          <Link href={createUrl(exchanger.valute_from.code_name, exchanger.valute_to.code_name)}>
            <button className="border rounded-full px-5 py-3">ПОКАЗАТЬ ОБМЕННИКИ</button>
          </Link>
        </div>
      ))}
    </div>
  );
};
