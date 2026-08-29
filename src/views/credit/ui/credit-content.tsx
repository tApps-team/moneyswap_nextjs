import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import { CreditSpecsTable } from "@/widgets/credits/credit-specs-table";
import { DynamicContent } from "@/widgets/strapi/dynamic-content";
import { BankCredit, orDash } from "@/entities/strapi";

interface CreditContentProps {
  credit: BankCredit;
}

export const CreditContent: FC<CreditContentProps> = ({ credit }) => {
  const about = credit.about ?? [];

  return (
    <div className="grid gap-6 min-w-0">
      <div className="grid gap-[30px] md:gap-[40px] lg:gap-8 lg:grid-cols-[1fr_minmax(320px,360px)] lg:items-start min-w-0">
        <div className="grid gap-[30px] md:gap-[40px] lg:gap-[50px] lg:col-start-1 lg:row-start-1 min-w-0">
          <CreditHero credit={credit} />
        </div>

        <div className="lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:self-start lg:sticky lg:top-[120px] min-w-0">
          <CreditSpecsTable credit={credit} />
        </div>

        {about.length > 0 ? (
          <div className="lg:col-start-1 lg:row-start-2 min-w-0">
            <DynamicContent dynamic_content={about} />
          </div>
        ) : null}
      </div>
    </div>
  );
};

function CreditHero({ credit }: { credit: BankCredit }) {
  const logo = credit.logo ?? credit.bank?.logo ?? null;
  const bankTitle = credit.bank?.title ?? credit.name;

  return (
    <div className="bg-new-dark-grey rounded-[15px] mobile-xl:rounded-[20px] p-5 mobile-xl:p-8 grid gap-6 min-w-0">
      <div className="flex flex-col md:flex-row md:items-center gap-6 justify-between min-w-0">
        <div className="flex items-center gap-4 min-w-0">
          {logo ? (
            <Image
              src={logo}
              alt={bankTitle}
              width={64}
              height={64}
              className="w-12 h-12 mobile-xl:w-16 mobile-xl:h-16 rounded-full object-contain bg-new-grey shrink-0"
            />
          ) : (
            <div className="flex items-center justify-center w-12 h-12 mobile-xl:w-16 mobile-xl:h-16 rounded-full bg-new-grey text-yellow-main font-semibold text-xl mobile-xl:text-2xl shrink-0">
              {bankTitle.charAt(0)}
            </div>
          )}
          <div className="grid gap-2 min-w-0">
            <h1 className="unbounded_font text-yellow-main uppercase text-base mobile-xl:text-2xl font-semibold">
              Кредит «{credit.name}» — {bankTitle}
            </h1>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs mobile-xl:text-sm text-light-gray">
              <span>
                Ставка: <span className="text-white">{orDash(credit.rate)}</span>
              </span>
              <span>
                Сумма: <span className="text-white">{orDash(credit.amount)}</span>
              </span>
              <span>
                Срок: <span className="text-white">{orDash(credit.term)}</span>
              </span>
            </div>
          </div>
        </div>

        <Link
          href={credit.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center w-full md:w-fit shrink-0 px-5 mobile-xl:px-6 py-2.5 mobile-xl:py-3 rounded-[10px] bg-yellow-main hover:scale-[1.02] active:scale-[0.98] transition-transform text-black font-medium uppercase text-xs mobile-xl:text-sm"
        >
          Оформить
        </Link>
      </div>

      {credit.description ? (
        <p className="text-light-gray text-sm mobile-xl:text-base">{credit.description}</p>
      ) : null}
    </div>
  );
}
