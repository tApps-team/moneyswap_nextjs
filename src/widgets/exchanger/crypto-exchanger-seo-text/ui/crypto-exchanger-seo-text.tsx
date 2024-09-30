import { ExchnagerInfo } from "@/entities/exchanger";

type CryptoExchangerSeoTextProps = {
  exchangerInfo: ExchnagerInfo;
};

export const CryptoExchangerSeoText = (props: CryptoExchangerSeoTextProps) => {
  const { exchangerInfo } = props;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-4xl font-medium">ОБМЕННЫЙ ПУНКТ {exchangerInfo?.name}</h1>
      <p>
        ОБМЕННИК КРИПТОВАЛЮТЫ {exchangerInfo?.name} НАХОДИТСЯ В РЕЙТИНГАХ MONEYSWAP С{" "}
        {exchangerInfo?.openOnMoneySwap || "22.22.22"}. ЗА ЭТО ВРЕМЯ ОН ЗАРЕКОМЕНДОВАЛ СЕБЯ, КАК
        ПОСТАВЩИК УСЛУГ СО СРЕДНЕЙ ОЦЕНКОЙ. ОБ ОБМЕННИКЕ ЕСТЬ {exchangerInfo.reviews.positive}{" "}
        ПОЛОЖИТЕЛЬНЫХ И {exchangerInfo.reviews.negative} ОТРИЦАТЕЛЬНЫХ ОТЗЫВОВ.{" "}
        {exchangerInfo?.name} НА ДАННЫЙ МОМЕНТ УЧАСТВУЕТ В {exchangerInfo.exchangeRates} КУРСАХ
        ОБМЕНА И ИМЕЕТ ОБЩУЮ СУММУ РЕЗЕРВОВ НА{" "}
        {exchangerInfo?.amountReserves?.replace("$", "") || 0} ДОЛЛАРОВ. ЕСЛИ ВЫ ПОЛЬЗОВАЛИСЬ
        УСЛУГАМИ ОБМЕННИКА ОСТАВЬТЕ ОТЗЫВ О НЕМ В КОММЕНТАРИЯХ - ЭТО ПОМОЖЕТ ДРУГИМ ПОЛЬЗОВАТЕЛЯМ
        MONEYSWAP ПОЛУЧИТЬ ДОСТОВЕРНУЮ ИНФОРМАЦИЮ ОБ УСЛУГАХ ОБМЕННИКОВ.
      </p>
    </div>
  );
};
