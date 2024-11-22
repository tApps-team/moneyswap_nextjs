import { CryptoDirection } from "@/widgets/exchanger/crypto-direction";
import { CryptoExchangerSeoText } from "@/widgets/exchanger/crypto-exchanger-seo-text";
import { ExchangerInfo } from "@/widgets/exchanger/exchanger-info";
import { ExchangerReviews } from "@/widgets/exchanger/exchanger-reviews";
import { BotBannerSidebar } from "@/features/bot-banner-in-sidebar";
import { getPairValute } from "@/entities/currency";
import { getExchangerDetails } from "@/entities/exchanger";
import { Grade, reviewsByExchange } from "@/entities/exchanger-review";
import { ExchangerMarker } from "@/shared/types";

export const CryptoExchangerPage = async ({
  params,
  searchParams,
}: {
  params: { exchanger: number };
  searchParams: { grade?: number; page?: number; "exchanger-marker": ExchangerMarker };
}) => {
  const currentPage = Number(searchParams?.page) || 1;

  const reviews = await reviewsByExchange({
    exchange_id: params.exchanger,
    exchange_marker: searchParams["exchanger-marker"],
    page: currentPage,
    grade_filter: searchParams?.grade,
    element_on_page: 7,
  });
  const exchangerDetails = await getExchangerDetails({
    exchange_id: params.exchanger,
    exchange_marker: searchParams["exchanger-marker"],
  });
  const currencyPair = await getPairValute({
    exchange_id: params.exchanger,
    exchange_marker: searchParams["exchanger-marker"],
  });

  return (
    <section className="grid grid-cols-1 mobile-xl:grid-cols-3 gap-8">
      <div className="mobile-xl:col-span-2 grid gap-8">
        <CryptoExchangerSeoText exchangerInfo={exchangerDetails} />
        <ExchangerInfo exchangerDetails={exchangerDetails} />
        <ExchangerReviews
          reviewCount={exchangerDetails.reviews}
          totalPages={reviews.pages}
          reviews={reviews.content}
        />
      </div>
      <div className="flex flex-col gap-6">
        <CryptoDirection currencyPair={currencyPair} />
        <BotBannerSidebar />
      </div>
    </section>
  );
};
