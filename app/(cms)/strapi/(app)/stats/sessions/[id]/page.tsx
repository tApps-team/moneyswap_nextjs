import { SessionPage } from "@/cms/ui/stats/sessions-pages";

export default function Page({ params }: { params: { id: string } }) {
  return <SessionPage id={params.id} />;
}
