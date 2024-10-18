import "@/shared/styles/globals.scss";
import { ForPartnersSkeleton } from "@/views/for-partners";

export default function Loading() {
  return (
    <section className="">
      <ForPartnersSkeleton />
    </section>
  );
}
