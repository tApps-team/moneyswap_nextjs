import { FeedbackForm, FeedbackFormSkeleton } from "@/widgets/feedback-form";
import { Skeleton } from "@/shared/ui";

export const ForPartnersSkeleton = () => {
  return (
    <section className="md:grid md:grid-cols-[0.7fr,0.3fr] flex flex-col gap-10">
      <Skeleton className="h-[383px] w-full bg-skeleton-gray text-skeleton-gray" />

      <FeedbackFormSkeleton />
    </section>
  );
};
