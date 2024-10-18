import { FeedbackForm, FeedbackFormSkeleton } from "@/widgets/feedback-form";
import { Skeleton } from "@/shared/ui";

export const ForPartnersSkeleton = () => {
  return (
    <section className="grid grid-cols-[0.7fr,0.3fr] gap-10">
      <Skeleton className="h-[383px] w-full bg-[#9d9d9d] text-[#9d9d9d]" />

      <FeedbackFormSkeleton />
    </section>
  );
};
