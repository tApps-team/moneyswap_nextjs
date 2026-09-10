import { Gift } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import { PsSpecsTable } from "@/widgets/payment-services/ps-specs-table";
import { DynamicContent } from "@/widgets/strapi/dynamic-content";
import { PaymentService, formatCommission, formatReviewsCount } from "@/entities/strapi";

interface PaymentServiceContentProps {
  service: PaymentService;
}

export const PaymentServiceContent: FC<PaymentServiceContentProps> = ({ service }) => {
  const about = service.about ?? [];
  const hasPromocodes = (service.promocodes?.length ?? 0) > 0;

  return (
    <div className="grid gap-6 min-w-0">
      <div className="grid gap-[30px] md:gap-[40px] lg:gap-8 lg:grid-cols-[1fr_minmax(320px,360px)] lg:items-start min-w-0">
        <div className="grid gap-[30px] md:gap-[40px] lg:gap-[50px] lg:col-start-1 lg:row-start-1 min-w-0">
          <PaymentServiceHero service={service} />
          {hasPromocodes ? <PaymentServicePromocodes service={service} /> : null}
        </div>

        <div className="lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:self-start lg:sticky lg:top-[120px] min-w-0">
          <PsSpecsTable service={service} />
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

function PaymentServiceHero({ service }: { service: PaymentService }) {
  return (
    <div className="bg-new-dark-grey rounded-[15px] mobile-xl:rounded-[20px] p-5 mobile-xl:p-8 grid gap-6 min-w-0">
      <div className="flex flex-col md:flex-row md:items-center gap-6 justify-between min-w-0">
        <div className="flex items-center gap-4 min-w-0">
          {service.logo ? (
            <Image
              src={service.logo}
              alt={service.name}
              width={64}
              height={64}
              className="w-12 h-12 mobile-xl:w-16 mobile-xl:h-16 rounded-full object-contain bg-new-grey shrink-0"
            />
          ) : (
            <div className="flex items-center justify-center w-12 h-12 mobile-xl:w-16 mobile-xl:h-16 rounded-full bg-new-grey text-yellow-main font-semibold text-xl mobile-xl:text-2xl shrink-0">
              {service.name.charAt(0)}
            </div>
          )}
          <div className="grid gap-2 min-w-0">
            <h1 className="unbounded_font text-yellow-main uppercase text-base mobile-xl:text-2xl font-semibold">
              Сервис оплаты {service.name}
            </h1>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs mobile-xl:text-sm">
              <span className="text-light-gray">
                Комиссия: <span className="text-white">{formatCommission(service)}</span>
              </span>
              {service.rating ? (
                <span className="flex items-center gap-1.5">
                  <span className="text-yellow-main font-semibold">
                    {service.rating.toFixed(1)}
                  </span>
                  {service.reviews_count ? (
                    <span className="text-light-gray">
                      {formatReviewsCount(service.reviews_count)}
                    </span>
                  ) : null}
                </span>
              ) : null}
            </div>
          </div>
        </div>

        <Link
          href={service.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center w-full md:w-fit shrink-0 px-5 mobile-xl:px-6 py-2.5 mobile-xl:py-3 rounded-[10px] bg-yellow-main hover:scale-[1.02] active:scale-[0.98] transition-transform text-black font-medium uppercase text-xs mobile-xl:text-sm"
        >
          Перейти на сайт
        </Link>
      </div>

      {service.description ? (
        <p className="text-light-gray text-sm mobile-xl:text-base">{service.description}</p>
      ) : null}
    </div>
  );
}

function PaymentServicePromocodes({ service }: { service: PaymentService }) {
  return (
    <div className="grid gap-4 min-w-0">
      <h2 className="unbounded_font text-white uppercase text-base mobile-xl:text-2xl font-semibold">
        Промокоды
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {service.promocodes.map((promo, index) => (
          <Link
            key={`${promo.title}-${index}`}
            href={promo.url || service.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-3 bg-new-dark-grey border border-[#575A62]/50 rounded-[15px] p-5 hover:border-yellow-main transition-colors min-w-0"
          >
            <div className="flex items-center justify-center w-10 h-10 shrink-0 rounded-lg bg-yellow-main/15 text-yellow-main">
              <Gift className="w-5 h-5" />
            </div>
            <div className="grid gap-1 min-w-0">
              <span className="font-semibold text-white text-sm mobile-xl:text-base">
                {promo.title}
              </span>
              {promo.description ? (
                <span className="text-xs mobile-xl:text-sm text-light-gray">
                  {promo.description}
                </span>
              ) : null}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
