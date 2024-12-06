import { FeedbackForm } from "@/widgets/feedback-form";
import { ArticleContent } from "@/widgets/strapi";
import { getForPartnersPage } from "@/entities/strapi";
import { delay } from "@/shared/lib";

export const ForPartnersPage = async () => {
  const { data } = await getForPartnersPage();
  return (
    <section className="lg:grid  lg:grid-cols-[0.6fr,0.4fr] xl:grid-cols-[0.7fr,0.3fr] flex flex-col gap-10">
      <ArticleContent dynamic_content={data.content} />
      <FeedbackForm />
    </section>
  );
};
