import { useMemo } from "react";
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

  const allCurrencies = useMemo(
    () =>
      currencies.flatMap((category) =>
        category.currencies.map((currency) => ({
          ...currency,
          categoryId: category.id,
          categoryName: {
            ru: category.name?.ru,
            en: category.name?.en,
          },
        }))
      ),
    [currencies]
  );

  const visibleCurrencies = allCurrencies.slice(0, 10);
  const hiddenCurrencies = allCurrencies.slice(10);

  const groupByCategory = (items: typeof allCurrencies) => {
    const grouped: Record<string, { name: Name; currencies: typeof allCurrencies; categoryId: number }> = {};
    for (const item of items) {
      const categoryKey = String(item.categoryId);
      if (!grouped[categoryKey]) {
        grouped[categoryKey] = { name: item.categoryName, currencies: [], categoryId: item.categoryId as number };
      }
      grouped[categoryKey].currencies.push(item);
    }
    return Object.values(grouped).map((data) => ({
      id: data.categoryId,
      name: data.name,
      currencies: data.currencies,
    }));
  };

  const visibleCategories = groupByCategory(visibleCurrencies);
  const hiddenCategories = groupByCategory(hiddenCurrencies);

  const hiddenCategoriesWithFlag = hiddenCategories.map((hiddenCat) => {
    const duplicateInVisible = visibleCategories.find((v) => v.id === hiddenCat.id);
    return {
      ...hiddenCat,
      hideCategoryName: !!duplicateInVisible,
    };
  });

  const renderCategoryBlock = (
    category: CurrencyResponse & { hideCategoryName?: boolean },
    index: number
  ) => (
    <div key={category.id}>
      {!category.hideCategoryName && (
        <div className={cn("flex justify-center items-center py-2", index === 0 ? "pt-5" : "pt-2")}>
          <p className="text-center md:text-base text-sm uppercase font-bold text-yellow-main">
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
            currencies={currencies}
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
