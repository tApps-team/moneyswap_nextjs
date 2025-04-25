import { FeedbackForm } from "@/widgets/feedback-form";
import { ArticleContent } from "@/widgets/strapi";
import { getForPartnersPage } from "@/entities/strapi";

export const ForPartnersPage = async () => {
  const { data } = await getForPartnersPage();
  return (
    <section className="lg:grid lg:grid-cols-[0.6fr,0.4fr] xl:grid-cols-[0.7fr,0.3fr] flex flex-col gap-10">
      <h1 className="sr-only">
        Мы всегда рады новым партнерам. MoneySwap предлагает вам удобный и выгодный способ привлечь
        новых клиентов для вашего обменника.
      </h1>
      <ArticleContent dynamic_content={data.content} />
      <div className="grow-0">
        <FeedbackForm type="partner" />
      </div>
    </section>
  );
};
