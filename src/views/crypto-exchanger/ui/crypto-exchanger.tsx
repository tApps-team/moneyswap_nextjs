import { CryptoDirection } from "@/widgets/exchanger/crypto-direction";
import { CryptoExchangerSeoText } from "@/widgets/exchanger/crypto-exchanger-seo-text";
import { ExchangerInfo } from "@/widgets/exchanger/exchanger-info";

export const CryptoExchangerPage = async ({ params }: { params: { exchanger: string } }) => {
  console.log(params.exchanger);
  return (
    <section className="grid grid-cols-3 gap-8">
      <div className="col-span-2 grid gap-8">
        <CryptoExchangerSeoText />
        <ExchangerInfo />
      </div>
      <CryptoDirection />
    </section>
  );
};
{
  /* // seoText
            //info
            //sidebar
            //reviews */
}
