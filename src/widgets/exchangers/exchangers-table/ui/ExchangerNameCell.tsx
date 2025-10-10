"use client";

import { Clock, Calendar, Check, X } from "lucide-react";
import Link from "next/link";
import { Exchanger, AMLTooltip } from "@/entities/exchanger";
import { defaultUserId, increaseLinkCount } from "@/entities/user";
import { useYandexMetrika } from "@/shared/hooks";

interface ExchangerNameCellProps {
  exchanger: Exchanger;
}

export const ExchangerNameCell = ({ exchanger }: ExchangerNameCellProps) => {
  const { exchangeRedirect } = useYandexMetrika();
  
  const handleClick = (exchanger: Exchanger) => {
    if (defaultUserId) {
      const increaseincreaseLinkCountReq = {
        user_id: defaultUserId,
        exchange_id: exchanger?.exchange_id,
        exchange_direction_id: exchanger?.exchange_direction_id,
      };
      increaseLinkCount({
        ...increaseincreaseLinkCountReq,
        direction_marker: exchanger?.direction_marker,
      });
      exchangeRedirect();
    }
  };

  return (
    <Link
      onClick={() => handleClick(exchanger)}
      href={exchanger.partner_link || "/"}
      target="_blank"
      className="flex flex-col gap-0.5"
    >
      <p className="font-bold xl:text-lg text-base truncate max-w-[20vw]">{exchanger?.name?.ru}</p>
      <AMLTooltip isHighRisk={exchanger?.info?.high_aml ?? false} />
      {(exchanger?.info?.office || exchanger?.info?.delivery || exchanger?.info?.weekdays || exchanger?.info?.weekends || exchanger?.info?.working_days) && (
        <span className="xl:text-[12px] text-[10px] font-medium inline-flex truncate gap-1 items-center justify-start leading-none">
          {(exchanger.info?.weekdays?.time_from || exchanger.info?.weekdays?.time_to) && (
            <div className="flex gap-1 items-center">
              <Clock className="size-2.5" color="#B9B9B9" />
              <p className="text-font-light-grey">
                {exchanger.info?.weekdays?.time_from} - {exchanger.info?.weekdays?.time_to}
              </p>
            </div>
          )}
          {Object.values(exchanger.info?.working_days || {}).some((value) => value === true) && (
            <div className="flex items-center gap-1">
              <Calendar className="size-2.5" color="#B9B9B9" />
              <div className="text-font-light-grey">
                {(() => {
                  const daysMapping: Record<string, string> = {
                    'ПН': 'Пн',
                    'ВТ': 'Вт',
                    'СР': 'Ср',
                    'ЧТ': 'Чт',
                    'ПТ': 'Пт',
                    'СБ': 'Сб',
                    'ВС': 'Вс'
                  };
                  
                  const daysOrder = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];
                  const workingDays = Object.entries(exchanger.info?.working_days || {})
                    .filter(([_, isWorking]) => isWorking)
                    .map(([day]) => day);

                  // Если работают все 7 дней
                  if (workingDays.length === 7) {
                    return <span>Пн - Вс</span>;
                  }

                  let result = [];
                  let sequence = [];

                  for (let i = 0; i < daysOrder.length; i++) {
                    const day = daysOrder[i];
                    if (workingDays.includes(day)) {
                      sequence.push(day);
                    } else if (sequence.length > 0) {
                      if (sequence.length >= 3) {
                        result.push(`${daysMapping[sequence[0]]} - ${daysMapping[sequence[sequence.length - 1]]}`);
                      } else {
                        result.push(...sequence.map(d => daysMapping[d]));
                      }
                      sequence = [];
                    }
                  }

                  // Обработка последней последовательности
                  if (sequence.length > 0) {
                    if (sequence.length >= 3) {
                      result.push(`${daysMapping[sequence[0]]} - ${daysMapping[sequence[sequence.length - 1]]}`);
                    } else {
                      result.push(...sequence.map(d => daysMapping[d]));
                    }
                  }

                  return <span>{result.join(' ')}</span>;
                })()}
              </div>
            </div>
          )}
          <div className="flex items-center gap-1 text-font-light-grey">
            {exchanger.info?.delivery ? (
              <Check className="size-2.5" />
            ) : (
              <X className="size-2.5" />
            )}
            <p>Доставка</p>
          </div>
          <div className="flex items-center gap-1 text-font-light-grey">
            {exchanger.info?.office ? (
              <Check className="size-2.5" />
            ) : (
              <X className="size-2.5" />
            )}
            <p>Офис</p>
          </div>
        </span>
      )}
    </Link>
  );
};
