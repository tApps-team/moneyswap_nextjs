import { Coins } from "lucide-react";
import { Navbar } from "../navbar";

export const Header = () => {
  // header background
  return (
    <header className="flex items-center border p-4">
      <Coins width={60} height={60} />
      <Navbar />
    </header>
  );
};
