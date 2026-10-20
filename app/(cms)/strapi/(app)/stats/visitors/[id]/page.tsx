import { VisitorPage } from "@/cms/ui/stats/sessions-pages";

export default function Page({ params }: { params: { id: string } }) {
  return <VisitorPage id={params.id} />;
}
