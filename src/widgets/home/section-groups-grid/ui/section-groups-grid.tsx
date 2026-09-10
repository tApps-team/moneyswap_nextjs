import { NAV_ENTRIES } from "@/shared/consts";
import { Reveal } from "@/shared/ui";
import { SectionGroupCard } from "./section-group-card";

/** Витрина направлений: не ходит в сеть, поэтому попадает в первый чанк HTML. */
export const SectionGroupsGrid = () => {
  return (
    // id — цель кнопки из шапки страницы
    <Reveal id="sections" className="grid gap-5 min-w-0 scroll-mt-[130px]">
      <div className="grid gap-1.5 min-w-0">
        <h2 className="unbounded_font uppercase text-yellow-main mobile-xl:text-xl text-base font-semibold leading-tight">
          Направления
        </h2>
        <p className="text-light-gray mobile-xl:text-sm text-xs leading-snug max-w-2xl">
          Все сервисы MoneySwap собраны по задачам: обмен криптовалюты, платежи за рубеж, карты,
          сервисы для поездок, займы и кредиты.
        </p>
      </div>

      {/* Шесть карточек: 3 колонки на широких экранах дают ровные два ряда */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mobile-xl:gap-5 min-w-0">
        {NAV_ENTRIES.map((entry, index) => (
          <SectionGroupCard key={entry.key} entry={entry} index={index} />
        ))}
      </div>
    </Reveal>
  );
};
