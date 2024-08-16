import Link from "next/link";
import { navbarItems } from "../model/navbarItems";

export const Navbar = () => {
  return (
    <nav className="">
      <ul className="flex gap-10">
        {navbarItems.map((item, index) => (
          <li
            key={item.value + index}
            className="text-sm hover:text-[#f6ff5f] transition-all duration-300"
          >
            <Link href={item.href}>{item.value}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};
