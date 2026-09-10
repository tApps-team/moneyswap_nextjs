import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import { MfoSpecsTable } from "@/widgets/microloans/mfo-specs-table";
import { DynamicContent } from "@/widgets/strapi/dynamic-content";
import {
  Microloan,
  formatMicroloanLimit,
  formatMicroloanTerm,
  orDash,
} from "@/entities/strapi";

interface MicroloanContentProps {
  loan: Microloan;
}

export const MicroloanContent: FC<MicroloanContentProps> = ({ loan }) => {
  const about = loan.about ?? [];

  return (
    <div className="grid gap-6 min-w-0">
      <div className="grid gap-[30px] md:gap-[40px] lg:gap-8 lg:grid-cols-[1fr_minmax(320px,360px)] lg:items-start min-w-0">
        <div className="grid gap-[30px] md:gap-[40px] lg:gap-[50px] lg:col-start-1 lg:row-start-1 min-w-0">
          <MicroloanHero loan={loan} />
        </div>

        <div className="lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:self-start lg:sticky lg:top-[120px] min-w-0">
          <MfoSpecsTable loan={loan} />
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

function MicroloanHero({ loan }: { loan: Microloan }) {
  return (
    <div className="bg-new-dark-grey rounded-[15px] mobile-xl:rounded-[20px] p-5 mobile-xl:p-8 grid gap-6 min-w-0">
      <div className="flex flex-col md:flex-row md:items-center gap-6 justify-between min-w-0">
        <div className="flex items-center gap-4 min-w-0">
          {loan.logo ? (
            <Image
              src={loan.logo}
              alt={loan.name}
              width={64}
              height={64}
              className="w-12 h-12 mobile-xl:w-16 mobile-xl:h-16 rounded-full object-contain bg-new-grey shrink-0"
            />
          ) : (
            <div className="flex items-center justify-center w-12 h-12 mobile-xl:w-16 mobile-xl:h-16 rounded-full bg-new-grey text-yellow-main font-semibold text-xl mobile-xl:text-2xl shrink-0">
              {loan.name.charAt(0)}
            </div>
          )}
          <div className="grid gap-2 min-w-0">
            <h1 className="unbounded_font text-yellow-main uppercase text-base mobile-xl:text-2xl font-semibold">
              {loan.name} — займ онлайн
            </h1>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs mobile-xl:text-sm text-light-gray">
              <span>
                Лимит: <span className="text-white">{formatMicroloanLimit(loan)}</span>
              </span>
              <span>
                Срок: <span className="text-white">{formatMicroloanTerm(loan)}</span>
              </span>
              <span>
                Ставка: <span className="text-white">{orDash(loan.rate)}</span> в день
              </span>
            </div>
          </div>
        </div>

        <Link
          href={loan.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center w-full md:w-fit shrink-0 px-5 mobile-xl:px-6 py-2.5 mobile-xl:py-3 rounded-[10px] bg-yellow-main hover:scale-[1.02] active:scale-[0.98] transition-transform text-black font-medium uppercase text-xs mobile-xl:text-sm"
        >
          Получить займ
        </Link>
      </div>

      {loan.description ? (
        <p className="text-light-gray text-sm mobile-xl:text-base">{loan.description}</p>
      ) : null}
    </div>
  );
}
