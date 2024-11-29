import { ScrollArea, Skeleton } from "@/shared/ui";

const mockArray = Array.from(Array(6).keys());

export const TopCoinsLoader = () => {
  return (
    <div className="bg-dark-gray grid grid-cols-1 gap-4 shadow-[1px_3px_10px_3px_rgba(0,0,0,0.7)] p-6 rounded-2xl">
      {/* Заголовок */}
      <Skeleton className="w-1/3 h-5" />
      <ScrollArea className="max-h-96 pr-4">
        <div className="flex flex-col gap-4">
          {mockArray.map((_, index) => (
            <div
              key={index}
              className="flex pb-3 border-b last:border-none justify-between items-center"
            >
              <div className="flex gap-2 items-center">
                {/* Иконка монеты */}
                <Skeleton className="size-8 md:size-12 rounded-full" />
                <div className="flex flex-col gap-1">
                  {/* Код монеты */}
                  <Skeleton className="w-20 h-4" />
                  {/* Название монеты */}
                  <Skeleton className="w-20 h-3" />
                </div>
              </div>
              <div className="text-end">
                {/* Цена монеты */}
                <Skeleton className="w-16 h-4" />
                <div className="text-xs flex items-center justify-end gap-2">
                  {/* Изменение процента */}
                  <Skeleton className="w-4 h-4 rounded-full" />
                  <Skeleton className="w-10 h-3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
