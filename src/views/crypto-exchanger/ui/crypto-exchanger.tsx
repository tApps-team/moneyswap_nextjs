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
  params: { exchanger: string };
  searchParams: { grade?: number; page?: number; };
}) => {
  // const timeout = new Promise((resolove) => setTimeout(() => resolove(1), 60000));
  // await timeout;
  const reviews_on_page = 10;
  if (!params?.exchanger) {
    return notFound();
  }

  const [exchangerId, marker] = params.exchanger.split('__');

  if (!exchangerId || !marker) {
    return notFound();
  }

  const currentPage = Number(searchParams?.page) || 1;

  try {
    const exchangerDetails = await getExchangerDetails({
      exchange_id: Number(exchangerId),
      exchange_marker: marker as ExchangerMarker,
    });

    if (!exchangerDetails) {
      return notFound();
    }

    const [currencyPair, reviews] = await Promise.all([
      getPairValute({
        exchange_id: Number(exchangerId),
        exchange_marker: marker as ExchangerMarker,
      }),
      reviewsByExchange({
        exchange_name: exchangerDetails?.exchangerName.ru,
        page: currentPage,
        grade_filter: searchParams?.grade,
        element_on_page: reviews_on_page,
      }),
    ]);

    return (
      <section className="grid grid-flow-row mobile:gap-10 gap-6">
        <CryptoExchangerSeoText exchangerInfo={exchangerDetails} marker={marker as ExchangerMarker} />
        <section className="grid xl:grid-cols-[1fr,0.4fr] lg:grid-cols-[1fr,0.5fr] grid-cols-1 gap-7">
          <div className="grid md:gap-[50px] gap-10">
            <ExchangerInfo exchangerDetails={exchangerDetails} />
            <CryptoExchangerSeoMainText exchangerInfo={exchangerDetails} marker={marker as ExchangerMarker} />
            <ExchangerReviews
              exchanger_name={exchangerDetails?.exchangerName.ru}
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
  } catch (error) {
    console.error('Error in CryptoExchangerPage:', error);
    return notFound();
  }
};
