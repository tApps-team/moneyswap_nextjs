import Link from "next/link";
import { DzenIcon, TelegramIcon, VCRUIcon } from "@/shared/assets";
import { products } from "@/shared/router";

export const SocialNetworks = () => {
  return (
    <section className="grid grid-flow-col justify-center items-center justify-items-center gap-4">
      <Link
        className="relative bg-[#27aed6] rounded-full h-12 w-12 hover:scale-[1.05] active:scale-[0.95] transition-all duration-300"
        href={products.telegram_bot}
        target="_blank"
        rel="noopener noreferrer"
      >
        <TelegramIcon
          width={24}
          height={24}
          className="absolute top-[50%] -translate-y-[50%] left-[50%] -translate-x-[54%]"
        />
      </Link>
      <Link href={products.dzen_ru} target="_blank">
        <DzenIcon className="w-12 h-12" />
      </Link>
      <Link href={products.vc_ru} target="_blank">
        <VCRUIcon className="w-12 h-12" />
      </Link>
    </section>
  );
};
