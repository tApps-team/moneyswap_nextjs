type CryptoExchangerSeoTextProps = {
  exchangerInfo?: unknown;
};

export const CryptoExchangerSeoText = (props: CryptoExchangerSeoTextProps) => {
  const { exchangerInfo } = props;
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-4xl font-medium">ОБМЕННЫЙ ПУНКТ INSIGT</h1>
      <p>
        ОБМЕННИК КРИПТОВАЛЮТЫ INSIGHT НАХОДИТСЯ В РЕЙТИНГАХ MONEYSWAP С 13.04.2023. ЗА ЭТО ВРЕМЯ ОН
        ЗАРЕКОМЕНДОВАЛ СЕБЯ, КАК ПОСТАВЩИК УСЛУГ СО СРЕДНЕЙ ОЦЕНКОЙ. ОБ ОБМЕННИКЕ ЕСТЬ 2435
        ПОЛОЖИТЕЛЬНЫХ И 0 ОТРИЦАТЕЛЬНЫХ ОТЗЫВОВ. INSIGHT НА ДАННЫЙ МОМЕНТ УЧАСТВУЕТ В 588 КУРСАХ
        ОБМЕНА И ИМЕЕТ ОБЩУЮ СУММУ РЕЗЕРВОВ НА 21 225 744.605 ДОЛЛАРОВ. ЕСЛИ ВЫ ПОЛЬЗОВАЛИСЬ
        УСЛУГАМИ ОБМЕННИКА ОСТАВЬТЕ ОТЗЫВ О НЕМ В КОММЕНТАРИЯХ - ЭТО ПОМОЖЕТ ДРУГИМ ПОЛЬЗОВАТЕЛЯМ
        MONEYSWAP ПОЛУЧИТЬ ДОСТОВЕРНУЮ ИНФОРМАЦИЮ ОБ УСЛУГАХ ОБМЕННИКОВ.
      </p>
    </div>
  );
};
