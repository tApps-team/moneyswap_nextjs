import { SingleTypePage } from "@/cms/ui/form/entry-page";

export default function CmsSingleTypePage({ params }: { params: { type: string } }) {
  return <SingleTypePage slug={params.type} />;
}
