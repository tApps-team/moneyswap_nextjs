import { Skeleton } from "@/shared/ui";

export const TagsListSkeleton = () => {
  const tags = [
    7, 5, 6, 12, 8, 7, 6, 10, 9, 13, 5, 8, 7, 6, 9, 12, 8, 12, 8, 5, 9, 12, 9, 10, 5, 8, 7, 6,
  ];
  return (
    <div className="rounded-[10px] bg-new-light-grey lg:py-4 lg:px-3 py-3 px-2">
      <div className="grid grid-flow-row gap-3">
        <div className="px-3">
          <h3 className="text-yellow-main font-normal xl:text-base lg:text-sm text-xs truncate lg:min-w-auto md:min-w-[24vw] lg:min-w-fit min-w-auto">
            Популярные хэштеги
          </h3>
        </div>
        <section className="flex flex-wrap gap-1.5 px-3 overflow-y-auto max-h-[180px] h-[calc(100vw_/_6)]">
          {tags?.map((tag, index) => (
            <Skeleton
              className={`bg-skeleton-gray text-skeleton-gray mr-2 cursor-pointer lg:text-xs text-2xs leading-2 uppercase w-[${tag}vw] max-w-[120px] min-w-[60px]`}
              key={index}
            >
              ...
            </Skeleton>
          ))}
        </section>
      </div>
    </div>
  );
};
