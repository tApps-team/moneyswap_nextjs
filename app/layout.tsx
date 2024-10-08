import "@/shared/styles/globals.scss";
import Providers from "@/app/providers/react-query";
import { Footer } from "@/widgets/footer";
import { Header } from "@/widgets/header";

export const metadata = {
  title: "Next.js",
  description: "Generated by Next.js",
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className="flex flex-col min-h-screen">
        <Header />
        <Providers>
          <main className="flex-grow max-w-[1300px] mx-[auto] w-full py-[40px] pt-[130px]">
            {children}
          </main>
        </Providers>
        <Footer />
      </body>
    </html>
  );
}
