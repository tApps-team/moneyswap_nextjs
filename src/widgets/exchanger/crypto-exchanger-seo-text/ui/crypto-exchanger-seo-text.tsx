import { ExchnagerInfo } from "@/entities/exchanger";

type CryptoExchangerSeoTextProps = {
  exchangerInfo: ExchnagerInfo;
};

export const CryptoExchangerSeoText = (props: CryptoExchangerSeoTextProps) => {
  const { exchangerInfo } = props;

  return (
    <section className="flex flex-col gap-4">
      <h1 className="mobile-xl:text-3xl text-base font-normal uppercase">
        Обменный пункт {exchangerInfo?.name}
      </h1>
      <p className="md:text-base text-sm strapi_fonts_codec">
        Обменник криптовалюты {exchangerInfo?.name} находится в рейтингах Moneyswap{" "}
        {exchangerInfo?.openOnMoneySwap || "22.01.23"}. За это время он рекомендовал себя, как
        поставщик со средней оценкой. Об обменнике есть {exchangerInfo.reviews?.positive}{" "}
        положительных и {exchangerInfo.reviews?.negative} отрицательных отзывов.{" "}
        {exchangerInfo?.name} на данный момент участвует в {exchangerInfo?.exchangeRates} курсах
        обмена и имеет общую сумму резервов на{" "}
        {exchangerInfo?.amountReserves?.replace("$", "") || 0} долларов. Если вы пользовались
        услугами обменника, оставьте отзыв о нём в комментариях - это поможет другим пользователям
        Moneyswap получить достоверную информацию об услугах обменников.
      </p>
    </section>
  );
};
