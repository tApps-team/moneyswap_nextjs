import { Skeleton } from "@/shared/ui";

export const CategoryCardSkeleton = ({ isLong }: { isLong?: boolean }) => {
  console.log(isLong);
  return (
    <Skeleton
      className={`${isLong ? "mobile-xl:py-3 mobile-xl:px-8 p-3 px-5" : "mobile-xl:py-3 mobile-xl:px-8 p-3"} leading-none mobile-xl:rounded-[10px] rounded-[7px] bg-new-grey text-new-grey mobile-xl:w-full w-fit text-center md:text-sm mobile:text-xs text-2xs font-normal`}
    >
      {"...................."}
    </Skeleton>
  );
};
