import { CryptoDirection } from "@/widgets/exchanger/crypto-direction";
import { CryptoExchangerSeoText } from "@/widgets/exchanger/crypto-exchanger-seo-text";
import { ExchangerInfo } from "@/widgets/exchanger/exchanger-info";
import { ExchangerReviews } from "@/widgets/exchanger/exchanger-reviews";
import { BotBannerSidebar } from "@/features/bot-banner-in-sidebar";
import { reviewsByExchange } from "@/entities/exchanger-review";
import { ExchangerMarker } from "@/entities/exchanger-review/api/exchanger-review-api-dto";

export const CryptoExchangerPage = async ({
  params,
  searchParams,
}: {
  params: { exchanger: number };
  searchParams?: { grade: string; page: number };
}) => {
  console.log(params.exchanger);
  console.log(searchParams?.grade);
  console.log(searchParams?.page);
  const reviews = await reviewsByExchange({
    exchange_id: params.exchanger,
    exchange_marker: ExchangerMarker.cash,
    page: 1,
  });

  return (
    <section className="grid grid-cols-3 gap-8">
      <div className="col-span-2 grid gap-8">
        <CryptoExchangerSeoText />
        <ExchangerInfo />
        <ExchangerReviews reviews={reviews.content} />
      </div>
      <div className="flex flex-col gap-6">
        <CryptoDirection />
        <BotBannerSidebar />
      </div>
    </section>
  );
};
