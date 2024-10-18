import { Skeleton } from "@/shared/ui";

export const TelegramBannerSkeleton = () => {
  return (
    <Skeleton className="w-full h-auto overflow-hidden rounded-[20px] cursor-pointer bg-[rgba(45,45,45,0.6)] bg-[#9d9d9d] text-[#9d9d9d]"></Skeleton>
  );
};
