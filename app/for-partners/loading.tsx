import { ForPartnersSkeleton } from "@/views/for-partners";
import { LoaderAnimation } from "@/shared/assets";
import "@/shared/styles/globals.scss";

export default function Loading() {
  return (
    // <ForPartnersSkeleton />
    <div className="min-h-[90svh]">
      <LoaderAnimation />
    </div>
  );
}
