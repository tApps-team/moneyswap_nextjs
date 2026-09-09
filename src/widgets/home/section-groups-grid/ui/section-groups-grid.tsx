import { SECTION_GROUPS } from "@/shared/consts";
import { Reveal } from "@/shared/ui";
import { SectionGroupCard } from "./section-group-card";

/** Витрина направлений: не ходит в сеть, поэтому попадает в первый чанк HTML. */
export const SectionGroupsGrid = () => {
  return (
    <Reveal className="grid gap-5 min-w-0">
      <div className="grid gap-1.5 min-w-0">
        <h2 className="unbounded_font uppercase text-yellow-main mobile-xl:text-xl text-base font-semibold leading-tight">
          Направления
        </h2>
        <p className="text-light-gray mobile-xl:text-sm text-xs leading-snug max-w-2xl">
          Все сервисы MoneySwap собраны по задачам: обмен валют, платежи за рубеж, сервисы для
          поездок и продукты банков.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mobile-xl:gap-5 min-w-0">
        {SECTION_GROUPS.map((group, index) => (
          <SectionGroupCard key={group.key} group={group} index={index} />
        ))}
      </div>
    </Reveal>
  );
};
