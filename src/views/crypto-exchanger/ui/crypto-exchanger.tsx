import { CryptoDirection } from "@/widgets/exchanger/crypto-direction";
import { CryptoExchangerSeoText } from "@/widgets/exchanger/crypto-exchanger-seo-text";
import { ExchangerInfo } from "@/widgets/exchanger/exchanger-info";
import { ExchangerReviews } from "@/widgets/exchanger/exchanger-reviews";
import { BotBannerSidebar } from "@/features/bot-banner-in-sidebar";

export const CryptoExchangerPage = async ({
  params,
  searchParams,
}: {
  params: { exchanger: string };
  searchParams?: { grade: string; page: number };
}) => {
  console.log();
  return (
    <section className="grid grid-cols-3 gap-8">
      <div className="col-span-2 grid gap-8">
        <CryptoExchangerSeoText />
        <ExchangerInfo />
        <ExchangerReviews />
      </div>
      <div className="flex flex-col gap-6">
        <CryptoDirection />
        <BotBannerSidebar />
      </div>
    </section>
  );
};
