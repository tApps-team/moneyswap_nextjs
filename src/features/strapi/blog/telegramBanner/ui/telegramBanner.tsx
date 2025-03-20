import Image from "next/image";
import Link from "next/link";
import { products } from "@/shared/router";

export const TelegramBanner = () => {
  return (
    <Link
      href={products.telegram_channel}
      target="_blank"
      className="w-full h-auto overflow-hidden rounded-[10px] cursor-pointer"
    >
      <Image
        className="w-full h-full object-cover hover:scale-[1.03] transition-all duration-500"
        src="/telegram_banner_new.png"
        alt="banner"
        width={500}
        height={500}
      />
    </Link>
  );
};
