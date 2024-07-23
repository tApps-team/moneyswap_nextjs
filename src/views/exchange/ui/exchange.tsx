import { FAQ } from "@/widgets/faq";
import { SeoFooterText, SeoHeaderText } from "@/widgets/seo-text";

export const ExchnagePage = ({ params }: { params: { slug: string[] } }) => {
  return (
    <div>
      <SeoHeaderText />
      ExchnagePage
      <FAQ />
      <SeoFooterText />
    </div>
  );
};
