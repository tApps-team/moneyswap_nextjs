import { ExchangerInfo } from "@/entities/exchanger";
import { ExchangerMarker } from "@/shared/types";

type CryptoExchangerSeoTextProps = {
  exchangerInfo: ExchangerInfo;
  marker: ExchangerMarker;
};

export const CryptoExchangerSeoText = (props: CryptoExchangerSeoTextProps) => {
  const { exchangerInfo, marker } = props;
  const markerText = marker === ExchangerMarker.cash 
  ? "обмен наличных направлений" 
  : marker === ExchangerMarker.no_cash 
    ? "обмен безналичных направлений" 
    : marker === ExchangerMarker.both 
      ? "обмен наличных и безналичных направлений" 
      : "";

  return (
    <section className="flex flex-col gap-2">
      <p className="unbounded_font font-semibold text-sm text-[#7A7C80] uppercase">
        Обменный пункт 
      </p>
      <h1 className="unbounded_font mobile-xl:text-3xl text-yellow-main text-base font-semibold uppercase">
        {`${exchangerInfo?.name} ${markerText ? `— ${markerText}` : ""}`}
      </h1>
    </section>
  );
};
export const CryptoExchangerSeoMainText = (props: CryptoExchangerSeoTextProps) => {
  const { exchangerInfo, marker } = props;
  const markerText = marker === ExchangerMarker.cash 
  ? "обмен наличных направлений" 
  : marker === ExchangerMarker.no_cash 
    ? "обмен безналичных направлений" 
    : marker === ExchangerMarker.both 
      ? "обмен наличных и безналичных направлений" 
      : "";
  const formattedDate = exchangerInfo.openOnMoneySwap ? new Date(exchangerInfo.openOnMoneySwap).toLocaleDateString('ru-RU') : "___";

  const isAmlActive = true

  return (
    <section className="flex flex-col gap-10">
      <div className="grid grid-flow-row gap-4 lg:text-lg md:text-base text-white text-sm font-normal">
        <p>
        {exchangerInfo.name} — проверенный обменник криптовалют{markerText ? `, совершает ${markerText}` : ""}, размещён на MoneySwap с {formattedDate}. За это время он рекомендовал себя, как стабильный обменный сервис. Сейчас {exchangerInfo.name} активен в {exchangerInfo.exchangeRates || "___"} направлений обмена.
        </p>
        {isAmlActive && (
          <div className="grid grid-flow-row gap-4">
            <p>
              У каждого обменника на платформе указан уровень надёжности — {exchangerInfo.name} имеет <span className={`${exchangerInfo.high_aml ? "text-red-500" : "text-green-500"}`}>{exchangerInfo.high_aml ? "HIGH" : "LOW"}</span> AML-риск. 
            </p>
            <p className="font-bold">Что значит AML-риск?</p>
            <p>
              <span className="font-bold">{exchangerInfo.high_aml ? "High" : "Low"} AML-риск</span> {exchangerInfo.high_aml ? " — есть риск, что платёж может быть отменён, заморожен или для его возврата потребуется верификация. Мы рекомендуем учитывать это при выборе обменника, особенно если вы хотите обменять крупную сумму или важна скорость." : " — низкая вероятность дополнительных проверок и задержек. Обмен, скорее всего, пройдёт быстро и без лишних вопросов."}
            </p>
          </div>
        )}
        <p>
        Также мы тщательно проверяем все площадки и собираем отзывы пользователей, чтобы вы могли выбрать удобный и безопасный способ обмена. Обращайте внимание на отзывы и рейтинги — они формируются на основе опыта реальных пользователей
        </p>
      </div>
      <hr className="w-full mobile-xl:border-[#34363A] mobile-xl:border-[1.5px] border-yellow-main border-[1px] rounded-[5px]" />
      {/* <p className="mobile-xl:block hidden font-semibold md:text-base text-sm">
        Если вы пользовались услугами обменника, оставьте отзыв о нём в комментариях - это поможет
        другим пользователям Moneyswap получить достоверную информацию об услугах обменников.
      </p> */}
    </section>
  );
};
