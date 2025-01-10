import { Loader } from "lucide-react";
import { Suspense } from "react";
import { TopCoins } from "@/widgets/about/top-coins";
import { TopExchangers, getTopExchangers } from "@/widgets/about/top-exchngers";
import { ArticleContent } from "@/widgets/strapi";
import { getAboutPage } from "@/entities/strapi";

export const AboutPage = async () => {
  const { data } = await getAboutPage();
  return (
    <section className="flex flex-col xl:grid xl:grid-cols-[0.7fr,0.3fr] gap-10">
      <h1 className="sr-only">
        MoneySwap — ваш проводник в мире обмена, переводов и платежных решений
      </h1>
      <ArticleContent dynamic_content={data?.content} />
      <aside className="flex flex-col gap-6">
        <Suspense fallback={<Loader className="animate-spin h-6" />}>
          <TopCoins />
        </Suspense>
        <TopExchangers />
      </aside>
    </section>
  );
};
