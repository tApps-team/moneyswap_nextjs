import { Skeleton } from "@/shared/ui";

export const FeedbackFormSkeleton = () => {
  return (
    <aside>
      <Skeleton className="h-[720px] rounded-2xl bg-skeleton-gray text-skeleton-gray" />
    </aside>
  );
};
