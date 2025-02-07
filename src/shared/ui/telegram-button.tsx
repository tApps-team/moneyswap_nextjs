import Link from "next/link";
import { TelegramIcon } from "../assets";
import { products } from "../router";

export const TelegramButton = () => {
  return (
    <Link
      className="relative bg-[#039BE5] rounded-full xl:h-11 xl:w-11 h-10 w-10 hover:scale-[1.05] active:scale-[0.95] transition-all duration-300"
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
  );
};
