import { ArticleContent } from "@/widgets/strapi";
import { getForPartnersPage } from "@/entities/strapi";

export const ForPartnersPage = async () => {
  const { data } = await getForPartnersPage();
  return <ArticleContent dynamic_content={data.content} />;
};
