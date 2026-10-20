import { Suspense } from "react";
import { CollectionEntryPage } from "@/cms/ui/form/entry-page";

export default function CmsEntryPage({ params }: { params: { collection: string; id: string } }) {
  return (
    <Suspense>
      <CollectionEntryPage slug={params.collection} idParam={params.id} />
    </Suspense>
  );
}
