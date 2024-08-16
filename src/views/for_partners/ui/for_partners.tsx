import { getForPartnersArticle } from "@/shared/api";

export const ForPartnersPage = async () => {
  const { data } = await getForPartnersArticle();
  return (
    <section>
      <div className="strapi_styles" dangerouslySetInnerHTML={{ __html: data?.content }} />
    </section>
  );
};
