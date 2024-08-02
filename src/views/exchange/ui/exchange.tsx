import { usePathname } from "next/navigation";
import { CurrecnySelectForm } from "@/widgets/currency-select-form";
import { columns, ExchangersTable } from "@/widgets/exchangers";
import { DataTableDemo } from "@/widgets/exchangers/exchangers-table/ui/table";
import { FAQ } from "@/widgets/faq";
import { SeoFooterText, SeoHeaderText } from "@/widgets/seo-text";

import { getSpecificValute } from "@/entities/currency";
import { getExchangers } from "@/entities/exchanger";
import { getSpecificCity } from "@/entities/location";

export const ExchnagePage = async ({ params }: { params: { slug: string[] } }) => {
  const slug = params.slug[0];
  const city = params.slug[1];

  const [valute_from, valute_to] = slug.split("-to-").map((str) => str.toLowerCase());
  console.log(params);
  const exchangers = await getExchangers({ valute_from, valute_to, city: city });
  const giveCurrency = await getSpecificValute({ codeName: valute_from });
  const getCurrency = await getSpecificValute({ codeName: valute_to });
  const location = await getSpecificCity({ codeName: city });
  console.log(giveCurrency);
  console.log(getCurrency);
  console.log(location);

  return (
    <div>
      <SeoHeaderText />
      <CurrecnySelectForm />
      <ExchangersTable columns={columns} data={exchangers} />

      <FAQ />
      <SeoFooterText />
    </div>
  );
};
