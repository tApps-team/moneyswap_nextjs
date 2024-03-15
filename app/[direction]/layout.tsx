import { SideBar } from "@/widgets/sideBar";
import { ReactNode } from "react";

export default function ExchangerLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {/* <SideBar /> */}
      {children}
    </>
  );
}
