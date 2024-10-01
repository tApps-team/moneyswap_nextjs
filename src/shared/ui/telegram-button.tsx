import Link from "next/link";
import { TelegramIcon } from "../assets";
import { products } from "../router";

export const TelegramButton = () => {
  return (
    <Link
      className="bg-[#27aed6] rounded-full grid grid-flow-col gap-2 p-3 justify-center items-center h-12 hover:scale-[1.01] hover:shadow-[1px_5px_20px_5px_rgba(0,0,0,0.3)] active:scale-[0.995] active:shadow-[1px_5px_20px_5px_rgba(0,0,0,0.4)] transition-all duration-300"
      href={products.telegram_bot}
      target="_blank"
      rel="noopener noreferrer"
    >
      <p className="text-white text-sm uppercase font-medium">moneyswap_robot</p>
      <TelegramIcon width={24} height={24} />
    </Link>
  );
};
