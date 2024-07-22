import { FAQ } from "@/widgets/faq";
import { SeoFooterText, SeoHeaderText } from "@/widgets/seo-text";

export const Main = async () => {
  return (
    <section>
      <SeoHeaderText />
      <div>main</div>
      <FAQ />
      <SeoFooterText />
    </section>
  );
};
