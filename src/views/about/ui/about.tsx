import { ArticleContent } from "@/widgets/strapi";
import { getAboutPage } from "@/entities/strapi";

export const AboutPage = async () => {
  const { data } = await getAboutPage();
  return <ArticleContent dynamic_content={data?.content} />;
};
