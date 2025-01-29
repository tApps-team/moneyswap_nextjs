import parse, { DOMNode, Element } from "html-react-parser";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Suspense } from "react";
import { CryptoSeoText } from "@/widgets/crypto-exchangers/crypto-seo-text";
// import { CryptoTable } from "@/widgets/crypto-exchangers/crypto-table";
import { CurrencySelectForm } from "@/widgets/currency-select-form";
import { BotBanner } from "@/features/bot-banner";
import { getActualCourse, getSpecificValute } from "@/entities/currency";
import { getExchangerList } from "@/entities/exchanger";
import { getCryptoExchangersPage } from "@/entities/strapi";
import { ExchangerMarker, directions } from "@/shared/types";
export const revalidate = 60;
const options = {
  replace: (domNode: DOMNode) => {
    // Проверяем, является ли узел элементом и его типом является img
    if (domNode instanceof Element && domNode.name === "img") {
      const { src, alt } = domNode.attribs;
      return <Image src={src} alt={alt || "image"} width={500} height={500} layout="responsive" />;
    }
    if (domNode instanceof Element && domNode.name === "br") {
      return <hr />;
    }
  },
};

const CryptoTable = dynamic(
  () => import("@/widgets/crypto-exchangers/crypto-table").then((mod) => mod.default),
  {
    suspense: true,
  },
);
export const CryptoExchangersPage = async ({ params }: { params: { exchanger: string[] } }) => {
  const giveCurrency = await getSpecificValute({
    codeName: "BTC",
  });
  const getCurrency = await getSpecificValute({
    codeName: "SBERRUB",
  });
  const actualCourse = await getActualCourse({ valuteFrom: "BTC", valuteTo: "SBERRUB" });

  // strapi texts
  const { data } = await getCryptoExchangersPage();
  const { title, header_description, footer_description } = data;
  const cryptoExchangers = await getExchangerList();
  return (
    <section>
      <h1 className="uppercase xl:text-[28px] lg:text-2xl md:text-xl mobile-xl:text-base text-sm md:text-start text-center font-medium">
        {title}
      </h1>
      <div className="lg:mt-6 mt-4 mobile-xl:block hidden">
        <h2 className="md:text-lg text-sm strapi_styles strapi_fonts_codec">
          {parse(header_description, options)}
        </h2>
      </div>
      <BotBanner />
      <CurrencySelectForm
        urlDirection={ExchangerMarker.no_cash}
        actualCourse={actualCourse}
        urlGetCurrency={getCurrency}
        urlGiveCurrency={giveCurrency}
      />
      <Suspense fallback={<div>loading</div>}>
        <CryptoTable data={cryptoExchangers} />
      </Suspense>
      <div className="md:text-lg text-sm strapi_styles strapi_fonts_codec mt-8">
        {parse(footer_description, options)}
      </div>
    </section>
  );
};
