import Link from "next/link";
import { footerItems } from "../model/footerItems";

export const Footer = () => {
  return (
    <footer className="flex items-center p-4 justify-center h-[300px] bg-black">
      <ul className="flex gap-10">
        {footerItems.map((item, index) => (
          <li key={item.value + index}>
            <Link href={item.href}>{item.value}</Link>
          </li>
        ))}
      </ul>
    </footer>
  );
};
