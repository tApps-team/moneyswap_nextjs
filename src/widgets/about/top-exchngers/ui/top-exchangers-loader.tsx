import { ScrollArea, Skeleton } from "@/shared/ui";
const mockArray = Array.from(Array(6).keys());

export const TopExchangersLoader = () => {
  return (
    <aside className="bg-dark-gray grid grid-cols-1 gap-4 shadow-[1px_3px_10px_3px_rgba(0,0,0,0.7)] p-6 rounded-2xl">
      <Skeleton className="w-2/3 h-5" /> {/* Заголовок */}
      <ScrollArea className="max-h-96 pr-4">
        <div className="flex flex-col gap-4">
          {mockArray.map((_, index) => (
            <div key={index} className="flex justify-between items-center w-full">
              <div className="flex items-center gap-3">
                {/* Флаг */}
                <Skeleton className="size-8 md:size-12 rounded-full" />
                <div className="flex flex-col gap-1">
                  {/* Название */}
                  <Skeleton className="w-20 md:w-29 md:h-6 h-4" />
                  <div className="flex items-center gap-2 text-xs">
                    {/* Отзывы */}
                    <Skeleton className="w-10 md:h-6 h-4" />
                    <Skeleton className="size-4 md:size-6" />
                    <span>/</span>
                    <Skeleton className="size-4 md:size-6" />
                  </div>
                </div>
              </div>
              {/* Кнопка "Перейти" */}
              <Skeleton className="w-10 md:w-20 md:h-8 h-6" />
            </div>
          ))}
        </div>
      </ScrollArea>
    </aside>
  );
};
