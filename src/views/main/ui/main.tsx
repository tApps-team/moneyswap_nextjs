import { CurrecnySelectForm } from "@/widgets/currency-select-form";
import { MainFAQ } from "@/widgets/main-faq";
import { SeoFooterText, SeoHeaderText } from "@/widgets/seo-text";
import { getSpecificValute } from "@/entities/currency";
import { getSeoTexts } from "@/shared/api";
import { directions, pageTypes } from "@/shared/types";

export const Main = async () => {
  // const seoTexts = await getSeoTexts({ page: pageTypes.main });
  const giveCurrency = await getSpecificValute({ codeName: "BTC" });
  const getCurrency = await getSpecificValute({ codeName: "SBERRUB" });
  return (
    <section>
      {/* <SeoHeaderText data={seoTexts.data} /> */}
      <CurrecnySelectForm />
      <div>main</div>
      <MainFAQ />
      {/* <SeoFooterText data={seoTexts.data} /> */}
    </section>
  );
};
