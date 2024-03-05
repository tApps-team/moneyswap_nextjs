import { Montserrat } from "next/font/google";
import "@/shared/styles/globals.scss";
import { Footer } from "@/widgets/footer";
import { Header } from "@/widgets/header";
import { SideBar } from "@/widgets/sideBar";

export const metadata = {
  title: "Next.js",
  description: "Generated by Next.js",
};

const montserrat = Montserrat({
  weight: "400",
  subsets: ["latin"],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={montserrat.className}>
      <body className="container">
        <Header />
        <main>
          <SideBar />
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
