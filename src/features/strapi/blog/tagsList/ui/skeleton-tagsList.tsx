import { ScrollArea, Skeleton } from "@/shared/ui";

export const TagsListSkeleton = () => {
  const tags = [
    7, 5, 6, 12, 8, 7, 6, 10, 9, 13, 5, 8, 7, 6, 9, 12, 8, 12, 8, 5, 9, 12, 9, 10, 5, 8, 7, 6,
  ];
  return (
    <ScrollArea className="max-h-[35svh] rounded-[20px] bg-black py-4 px-3">
      <div className="grid grid-flow-row gap-3">
        <div className="px-3">
          <h3 className="uppercase text-yellow-main font-semibold text-md truncate">
            Популярные хэштеги
          </h3>
        </div>
        <section className="flex flex-wrap gap-1 px-3">
          {tags?.map((tag, index) => (
            <Skeleton
              className={`bg-skeleton-gray text-skeleton-gray mr-2 cursor-pointer text-xs leading-2 uppercase w-[${tag}vw] max-w-[120px] min-w-[50px]`}
              key={index}
            >
              ...
            </Skeleton>
          ))}
        </section>
      </div>
    </ScrollArea>
  );
};
