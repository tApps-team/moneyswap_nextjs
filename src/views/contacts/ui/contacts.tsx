import { FeedbackForm } from "@/widgets/feedback-form";
import { ArticleContent } from "@/widgets/strapi";
import { getAboutPage } from "@/entities/strapi";

export const ContactsPage = async () => {
  const { data } = await getAboutPage();
  return (
    <section className="lg:grid lg:grid-cols-[0.6fr,0.4fr] xl:grid-cols-[0.7fr,0.3fr] flex flex-col gap-10">
      <ArticleContent dynamic_content={data?.content} />
      <div className="grow-0"><FeedbackForm type="user" /></div>
    </section>
  );
};
