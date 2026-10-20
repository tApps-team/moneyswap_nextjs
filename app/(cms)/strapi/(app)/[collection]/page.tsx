import { Suspense } from "react";
import { CollectionPage } from "@/cms/ui/list/collection-page";

export default function CmsCollectionPage({ params }: { params: { collection: string } }) {
  return (
    // Состояние списка читается из URL (useSearchParams) — нужна граница Suspense
    <Suspense>
      <CollectionPage slug={params.collection} />
    </Suspense>
  );
}
