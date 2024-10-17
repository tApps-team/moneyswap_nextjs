import { Skeleton } from "@/shared/ui";

export const BotBannerSidebarSkeleton = () => {
  return (
    <section className="grid grid-flow-row gap-4 justify-center items-center w-full px-10 py-6 bg-dark-gray shadow-[1px_2px_8px_3px_rgba(0,0,0,0.5)] rounded-3xl">
      <Skeleton className="w-80 h-8" />
      <Skeleton className="h-[70px]  w-80 rounded-full" />
    </section>
  );
};
