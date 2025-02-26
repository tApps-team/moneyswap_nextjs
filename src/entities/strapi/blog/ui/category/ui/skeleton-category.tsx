import { Skeleton } from "@/shared/ui";

export const CategoryCardSkeleton = () => {
  return (
    <Skeleton
      className={`leading-none mobile-xl:rounded-[10px] rounded-[7px] bg-new-grey text-new-grey mobile-xl:w-full w-fit text-center md:text-sm mobile:text-xs text-2xs font-normal mobile-xl:py-3 mobile-xl:px-8 p-3`}
    >
      {"...................."}
    </Skeleton>
  );
};
