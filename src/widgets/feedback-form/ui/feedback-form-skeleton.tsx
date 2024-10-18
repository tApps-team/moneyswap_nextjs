import { Skeleton } from "@/shared/ui";

export const FeedbackFormSkeleton = () => {
  return (
    <aside>
      <Skeleton className="h-[720px] rounded-2xl bg-[#9d9d9d] text-[#9d9d9d]" />
    </aside>
  );
};
