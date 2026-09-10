/** Компактная шапка витрины обмена: на главной её место занимает герой рейтингов. */
export const ExchangeTop = () => {
  return (
    <section className="grid gap-3 lg:mb-10 mb-6">
      <h1 className="unbounded_font text-yellow-main uppercase xl:text-3xl mobile-xl:text-2xl text-xl font-semibold leading-tight max-w-3xl">
        Обмен валюты
      </h1>
      <p className="text-light-gray text-sm mobile-xl:text-base max-w-3xl">
        Выберите пару валют и город — MoneySwap покажет актуальные курсы проверенных обменников
        и отзывы о каждом из них.
      </p>
    </section>
  );
};
