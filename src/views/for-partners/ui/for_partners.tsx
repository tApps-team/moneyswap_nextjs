import { FeedbackForm } from "@/widgets/feedback-form";
import { ArticleContent } from "@/widgets/strapi";
import { getForPartnersPage } from "@/entities/strapi";

export const ForPartnersPage = async () => {
  const { data } = await getForPartnersPage();
  return (
    <section className="grid grid-cols-[0.7fr,0.3fr] gap-10">
      <ArticleContent dynamic_content={data.content} />
      <FeedbackForm />
    </section>
  );
};
