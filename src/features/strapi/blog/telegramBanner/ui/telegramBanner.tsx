import Image from "next/image";
import Link from "next/link";
import { products } from "@/shared/router";

export const TelegramBanner = () => {
  return (
    <Link
      href={products.telegram_bot}
      target="_blank"
      className="w-full h-auto overflow-hidden rounded-[20px] cursor-pointer bg-[rgba(45,45,45,0.6)]"
    >
      <Image
        className="w-full h-full object-cover hover:scale-[1.03] transition-all duration-500"
        src="/telegram_banner.png"
        alt="banner"
        width={500}
        height={500}
      />
    </Link>
  );
};
