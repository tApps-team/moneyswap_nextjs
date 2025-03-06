"use client";

import Image from "next/image";
import Link from "next/link";
import { TelegramIcon } from "@/shared/assets";
import { products, routes } from "@/shared/router";

export const ShareSocialNetworks = ({ article_url }: { article_url: string }) => {
  const shareLinks = {
    telegram: `https://t.me/share/url?url=${routes.blog}${routes.article}/${article_url}`,
    vc: `https://vc.ru/share?url=${routes.blog}${routes.article}/${article_url}`,
    dzen: `https://dzen.ru/share?url=${routes.blog}${routes.article}/${article_url}`,
  };

  return (
    <section className="grid grid-flow-col justify-center items-center justify-items-center gap-4">
      <Link
        className="relative bg-[#27aed6] rounded-[7px] h-10 w-10 hover:scale-[1.05] active:scale-[0.95] transition-all duration-300"
        href={shareLinks.telegram}
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
        <Image src="/dzen.png" alt="dzen.ru icon" width={150} height={150} className="size-10" />
      </Link>
      <Link href={products.vc_ru} target="_blank">
        <Image src="/vcru.png" alt="vc.ru icon" width={150} height={150} className="size-10" />
      </Link>
    </section>
  );
};
