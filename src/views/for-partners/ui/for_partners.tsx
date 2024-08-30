import { getForPartnersPage } from "@/shared/api";

export const ForPartnersPage = async () => {
  const { data } = await getForPartnersPage();
  return (
    <section>
      <div className="strapi_styles" dangerouslySetInnerHTML={{ __html: data?.content }} />
    </section>
  );
};
