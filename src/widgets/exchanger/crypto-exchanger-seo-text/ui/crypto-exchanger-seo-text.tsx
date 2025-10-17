import { ExchangerDetail } from "@/entities/exchanger";
import { ExchangerStatus, SegmentMarker } from "@/shared/types";

type CryptoExchangerSeoTextProps = {
  exchangerInfo: ExchangerDetail;
};

export const CryptoExchangerSeoText = (props: CryptoExchangerSeoTextProps) => {
  const { exchangerInfo } = props;
  const markerText = exchangerInfo.segment_marker === SegmentMarker.cash
    ? "обмен наличных направлений"
    : exchangerInfo.segment_marker === SegmentMarker.no_cash
      ? "обмен безналичных направлений"
      : exchangerInfo.segment_marker === SegmentMarker.both
        ? "обмен наличных и безналичных направлений"
        : "обмен наличных и безналичных направлений";

  const formattedClosedDate = exchangerInfo.closedOnMoneySwap ? new Date(exchangerInfo.closedOnMoneySwap).toLocaleDateString('ru-RU') : "___";

  return (
    <section className="flex flex-col gap-2">
      <p className="unbounded_font font-semibold text-sm text-[#7A7C80] uppercase">
        Обменный пункт
      </p>
      <h1 className={`unbounded_font xl:text-3xl mobile-xl:text-xl text-base font-semibold uppercase ${exchangerInfo?.workStatus === ExchangerStatus.disabled ? "text-font-light-grey" : "text-yellow-main"}`}>
        {`${exchangerInfo?.exchangerName.ru} ${markerText ? `— ${markerText}` : ""}`}
      </h1>
      {exchangerInfo?.workStatus === ExchangerStatus.disabled && <h2 className="unbounded_font uppercase lg:text-base mobile-xl:text-sm text-xs text-white font-medium">Обменный пункт <span className="text-yellow-main font-semibold">{exchangerInfo.exchangerName.ru}</span> с <span className="text-yellow-main font-semibold">{formattedClosedDate}</span> отключён и больше не отображается на мониторинге MoneySwap.</h2>}
    </section>
  );
};

export const CryptoExchangerSeoMainText = (props: CryptoExchangerSeoTextProps) => {
  const { exchangerInfo } = props;
  const markerText = exchangerInfo.segment_marker === SegmentMarker.cash
    ? "обмен наличных направлений"
    : exchangerInfo.segment_marker === SegmentMarker.no_cash
      ? "обмен безналичных направлений"
      : exchangerInfo.segment_marker === SegmentMarker.both
        ? "обмен наличных и безналичных направлений"
        : "обмен наличных и безналичных направлений";
  const formattedDate = exchangerInfo.openOnMoneySwap ? new Date(exchangerInfo.openOnMoneySwap).toLocaleDateString('ru-RU') : "___";

  const isAmlActive = exchangerInfo?.workStatus === ExchangerStatus.active && true;

  return (
    <section className="flex flex-col gap-10">
      {exchangerInfo?.workStatus === ExchangerStatus.inactive && (
        <div className="grid grid-flow-row mobile-xl:gap-6 gap-4 bg-new-dark-grey rounded-[15px] mobile-xl:p-6 p-3">
          <h3 className="text-font-light-grey font-semibold mobile-xl:text-base text-sm">
            В данный момент обменник {exchangerInfo.exchangerName.ru} <span className="font-semibold underline">временно недоступен</span>. Это может быть связано с техническими причинами, среди которых:
          </h3>
          <ul className="space-y-2 mobile-xl:text-base text-sm font-medium">
            <li>— обновление или технические работы</li>
            <li>— перебои в работе сайта или API</li>
            <li>— DDoS-атаки или перегрузка сервера</li>
            <li>— проблемы с резервами или передачей данных в мониторинг</li>
          </ul>
          <p className="text-yellow-main font-semibold mobile-xl:text-base text-sm">
            После устранения неполадок {exchangerInfo.exchangerName.ru} снова появится в списке активных.
          </p>
        </div>
      )}

      {exchangerInfo?.workStatus === ExchangerStatus.disabled ? (
        <div className="flex flex-col gap-10 mobile-xl:text-base text-white text-sm font-normal">
          <div className="grid grid-flow-row mobile-xl:gap-6 gap-4 bg-new-dark-grey rounded-[15px] mobile-xl:p-6 p-3">
            <h3 className="text-font-light-grey font-semibold mobile-xl:text-base text-sm">
              Причины могут быть разные:
            </h3>
            <ul className="space-y-2 mobile-xl:text-base text-sm font-medium">
              <li>— рост числа жалоб от пользователей</li>
              <li>— некорректное предоставление курсов</li>
              <li>— частые технические сбои или полное прекращение работы</li>
              <li>— отказ администрации от сотрудничества</li>
              <li>— ошибки в фиксации сделок, пользовательских переходов, или расчете партнерских вознаграждений</li>
              <li>— закрытие партнёрской программы и удаление личного кабинета</li>
            </ul>
            <p className="text-yellow-main font-semibold mobile-xl:text-base text-sm">
              <span className="font-semibold">Важно:</span> отключение не означает, что сервис стал мошенническим. Это решение связано с внутренними правилами и политикой мониторинга.
            </p>
          </div>
          
          <p>
          Лучше работать только с обменниками, которые имеют активный статус на платформе — это гарантирует их актуальность и соответствие нашим требованиям.
          </p>

          <p>
          Мы рекомендуем дополнительно проверять информацию об <span className="text-yellow-main font-semibold">{exchangerInfo.exchangerName.ru}</span> через независимые источники, так как с момента отключения мониторинг не сможет оказать помощь или выступить посредником в случае спорных ситуаций.
          </p>
        </div>
      ) : (
        <div className="grid grid-flow-row gap-4 lg:text-lg md:text-base text-white text-sm font-normal">
          <h2>
            <span className="text-yellow-main font-semibold">{exchangerInfo.exchangerName.ru}</span> — проверенный обменник криптовалют{markerText ? `, совершает ${markerText}` : ""}, размещён на MoneySwap с {formattedDate}. За это время он рекомендовал себя, как стабильный обменный сервис. Сейчас {exchangerInfo.exchangerName.ru} активен в {exchangerInfo.exchangeRates || "___"} направлений обмена.
          </h2>

          {isAmlActive && (
            <div className="grid grid-flow-row gap-4">
              <p>
                У каждого обменника на платформе указан уровень надёжности — {exchangerInfo.exchangerName.ru} имеет <span className={`${exchangerInfo.high_aml ? "text-red-500" : "text-green-500"}`}>{exchangerInfo.high_aml ? "HIGH" : "LOW"}</span> AML-риск.
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
      )}

      <hr className="w-full mobile-xl:border-[#34363A] mobile-xl:border-[1.5px] border-yellow-main border-[1px] rounded-[5px]" />
    </section>
  );
};
