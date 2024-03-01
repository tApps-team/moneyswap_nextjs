import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import { ArrowRightIcon } from "@/shared/assets";
import { Card, CardContent, CardHeader, CardTitle, Separator } from "@/shared/ui";
import { Exchanger } from "../model/types/exchanger";

interface ExchangerCardProps {
  exchanger: Exchanger;
}

export const ExchangerCard: FC<ExchangerCardProps> = (props) => {
  const { exchanger } = props;
  return (
    <Link href={exchanger.partner_link} target="_blank">
      <Card className="rounded-3xl ">
        <CardHeader>
          <CardTitle>{exchanger?.name?.ru}</CardTitle>
        </CardHeader>
        <Separator orientation="horizontal" />
        <CardContent className="flex mt-4 gap-4 items-center">
          <div className="flex gap-1 items-center">
            <div className="text-xl">{exchanger.in_count}</div>
            <Image
              src={exchanger.icon_valute_from}
              alt={`Exchanger ${exchanger.icon_valute_from}`}
              width={32}
              height={32}
            />
          </div>
          <ArrowRightIcon className="size-6" />
          <div className="flex gap-1 items-center ">
            <div className="text-xl">{exchanger?.out_count}</div>
            <Image
              src={exchanger?.icon_valute_to}
              alt={`Exchanger ${exchanger.icon_valute_to}`}
              width={32}
              height={32}
            />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
