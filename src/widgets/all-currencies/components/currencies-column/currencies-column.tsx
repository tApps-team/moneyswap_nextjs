import { Currency, CurrencyFromCard, CurrencyResponse } from "@/entities/currency";
import { cn } from "@/shared/lib";
import { Name } from "@/shared/types";
import { AccordionContent } from "@/shared/ui";
import { Search } from "../search/search";

interface CurrenciesColumnProps {
  searchValue: string;
  setSearchValue: (value: string) => void;
  currencies: CurrencyResponse[];
  currencyInfo?: Currency | null;
  type: "give" | "get";
  setCurrencyInfo: (currency: Currency | null) => void;
  selectedCurrency: Currency | null;
}

export const CurrenciesColumn = (props: CurrenciesColumnProps) => {
  const {
    searchValue,
    setSearchValue,
    currencies,
    currencyInfo,
    type,
    setCurrencyInfo,
    selectedCurrency,
  } = props;

  /**
   * 1️⃣ Собираем все валюты в один массив с указанием категории
   */
  const allCurrencies = currencies.flatMap((category) =>
    category.currencies.map((currency) => ({
      ...currency,
      categoryId: category.id,
      categoryName: {
        ru: category.name?.ru,
        en: category.name?.en,
      },
    }))
  );

  /**
   * 2️⃣ Делим массив на две части
   */
  const visibleCurrencies = allCurrencies.slice(0, 10);
  const hiddenCurrencies = allCurrencies.slice(10);

  /**
   * 3️⃣ Группируем обратно по категориям
   */
  const groupByCategory = (items: typeof allCurrencies) => {
    const grouped: Record<string, { name: Name; currencies: typeof allCurrencies }> = {};
    for (const item of items) {
      if (!grouped[item.categoryId]) {
        grouped[item.categoryId] = { name: item.categoryName, currencies: [] };
      }
      grouped[item.categoryId].currencies.push(item);
    }
    return Object.entries(grouped).map(([id, data]) => ({
      id,
      name: data.name,
      currencies: data.currencies,
    }));
  };

  const visibleCategories = groupByCategory(visibleCurrencies);
  const hiddenCategories = groupByCategory(hiddenCurrencies);

  /**
   * 4️⃣ Проверяем, есть ли категория и в visible, и в hidden
   *     Если да — скрываем её название в hiddenCategories
   */
  const hiddenCategoriesWithFlag = hiddenCategories.map((hiddenCat) => {
    const duplicateInVisible = visibleCategories.find((v) => v.id === hiddenCat.id);
    return {
      ...hiddenCat,
      hideCategoryName: !!duplicateInVisible, // если категория уже есть в visible — скрываем имя
    };
  });

  /**
   * 5️⃣ Функция рендера категории
   */
  const renderCategoryBlock = (
    category: CurrencyResponse & { hideCategoryName?: boolean },
    index: number
  ) => (
    <div key={category.id}>
      {!category.hideCategoryName && (
        <div className={cn("flex justify-center items-center py-2", index === 0 ? "pt-5" : "pt-2")}>
          <p className="text-center md:text-base mobile-xl:text-sm text-xs uppercase font-bold text-yellow-main truncate">
            {category.name?.ru}
          </p>
        </div>
      )}
      {category.currencies.map((currency) => (
        <div key={currency.id}>
          <CurrencyFromCard
            currencyCurrent={currency}
            type={type}
            currencyInfo={currencyInfo}
            setCurrencyInfo={setCurrencyInfo}
            selectedCurrency={selectedCurrency}
          />
        </div>
      ))}
    </div>
  );

  return (
    <div className="col-span-1">
      <Search
        placeholder={type === "give" ? "Отдаю..." : "Получаю..."}
        value={searchValue}
        onChange={(value) => setSearchValue(value)}
      />

      {/* первые 10 */}
      {visibleCategories.map((category, index) => renderCategoryBlock(category, index))}

      {/* остальное в аккордеоне */}
      {hiddenCategoriesWithFlag.length > 0 && (
        <AccordionContent className="p-0">
          {hiddenCategoriesWithFlag.map((category, index) =>
            renderCategoryBlock(category, index + visibleCategories.length)
          )}
        </AccordionContent>
      )}
    </div>
  );
};
