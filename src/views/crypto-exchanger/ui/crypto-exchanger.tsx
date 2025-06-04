import { notFound } from "next/navigation";
import { CryptoDirection } from "@/widgets/exchanger/crypto-direction";
import {
  CryptoExchangerSeoMainText,
  CryptoExchangerSeoText,
} from "@/widgets/exchanger/crypto-exchanger-seo-text";
import { ExchangerInfo } from "@/widgets/exchanger/exchanger-info";
import { ExchangerReviews } from "@/widgets/exchanger/exchanger-reviews";
import { BotBannerSidebar } from "@/features/bot-banner";
import { getPairValute } from "@/entities/currency";
import { getExchangerDetails } from "@/entities/exchanger";
import { reviewsByExchange } from "@/entities/exchanger-review";
import { ExchangerMarker } from "@/shared/types";

export const CryptoExchangerPage = async ({
  params,
  searchParams,
}: {
  params: { exchanger: number };
  searchParams: { grade?: number; page?: number; "exchanger-marker": ExchangerMarker };
}) => {
  // const timeout = new Promise((resolove) => setTimeout(() => resolove(1), 60000));
  // await timeout;
  const reviews_on_page = 10;
  if (!params?.exchanger) {
    return notFound();
  }

  if (!searchParams?.["exchanger-marker"]) {
    return notFound();
  }

  const currentPage = Number(searchParams?.page) || 1;

  const exchangerDetails = await getExchangerDetails({
    exchange_id: params.exchanger,
    exchange_marker: searchParams["exchanger-marker"],
  });

  const [currencyPair, reviews] = await Promise.all([
    getPairValute({
      exchange_id: params.exchanger,
      exchange_marker: searchParams["exchanger-marker"],
    }),
    reviewsByExchange({
      exchange_name: exchangerDetails?.name,
      page: currentPage,
      grade_filter: searchParams?.grade,
      element_on_page: reviews_on_page,
    }),
  ]);

  return (
    <section className="grid grid-flow-row mobile:gap-10 gap-6">
      <CryptoExchangerSeoText exchangerInfo={exchangerDetails} />
      <section className="grid xl:grid-cols-[1fr,0.4fr] lg:grid-cols-[1fr,0.5fr] grid-cols-1 gap-7">
        <div className="grid md:gap-[50px] gap-10">
          <ExchangerInfo exchangerDetails={exchangerDetails} />
          <CryptoExchangerSeoMainText exchangerInfo={exchangerDetails} />
          <ExchangerReviews
            exchanger_name={exchangerDetails?.name}
            reviewCount={exchangerDetails.reviews}
            totalPages={reviews.pages}
            reviews={reviews.content}
            reviews_on_page={reviews_on_page}
          />
        </div>
        <div className="flex flex-col gap-6">
          <CryptoDirection currencyPair={currencyPair} />
          <BotBannerSidebar />
        </div>
      </section>
    </section>
  );
};
