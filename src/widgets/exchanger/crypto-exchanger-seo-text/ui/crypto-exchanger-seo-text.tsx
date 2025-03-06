import { ExchnagerInfo } from "@/entities/exchanger";

type CryptoExchangerSeoTextProps = {
  exchangerInfo: ExchnagerInfo;
};

export const CryptoExchangerSeoText = (props: CryptoExchangerSeoTextProps) => {
  const { exchangerInfo } = props;

  return (
    <section className="flex flex-col gap-2">
      <p className="unbounded_font font-semibold text-sm text-[#7A7C80] uppercase">
        Обменный пункт 
      </p>
      <h1 className="unbounded_font mobile-xl:text-3xl text-yellow-main text-base font-semibold uppercase">
        {exchangerInfo?.name}
      </h1>
    </section>
  );
};
export const CryptoExchangerSeoMainText = (props: CryptoExchangerSeoTextProps) => {
  const { exchangerInfo } = props;
  return (
    <section className="flex flex-col gap-10">
      <p className="md:text-base text-white text-sm font-light">
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
      <hr className="w-full mobile-xl:border-[#34363A] mobile-xl:border-[1.5px] border-yellow-main border-[1px] rounded-[5px]" />
      <p className="mobile-xl:block hidden font-semibold md:text-base text-sm">
        Если вы пользовались услугами обменника, оставьте отзыв о нём в комментариях - это поможет
        другим пользователям Moneyswap получить достоверную информацию об услугах обменников.
      </p>
    </section>
  );
};
