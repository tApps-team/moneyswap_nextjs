import { Suspense } from "react";
import { TopCoins } from "@/widgets/about/top-coins";
import { TopExchangers, getTopExchangers } from "@/widgets/about/top-exchngers";
import { ArticleContent } from "@/widgets/strapi";

import { getAboutPage } from "@/entities/strapi";

export const AboutPage = async () => {
  const { data } = await getAboutPage();
  return (
    <section className="grid grid-cols-[0.7fr,0.3fr] gap-10">
      <ArticleContent dynamic_content={data?.content} />
      <aside className="flex flex-col gap-6">
        <Suspense fallback={<div>TopCoinsLoading</div>}>
          <TopCoins />
        </Suspense>
        <TopExchangers />
      </aside>
    </section>
  );
};
