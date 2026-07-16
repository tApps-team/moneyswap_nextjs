import Link from "next/link";
import { FC } from "react";
import { routes } from "@/shared/router";
import { Button } from "@/shared/ui";

interface VedPageHeaderProps {
  title: string;
}

export const VedPageHeader: FC<VedPageHeaderProps> = ({ title }) => {
  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
      <h1 className="unbounded_font text-yellow-main uppercase xl:text-3xl mobile-xl:text-2xl text-xl font-semibold leading-tight max-w-3xl">
        {title}
      </h1>
      <div className="flex w-full lg:w-auto mobile-xl:gap-3 gap-2 shrink-0">
        {/* <Button
          asChild
          variant="outline"
          className="flex-1 lg:flex-none border-[#575A62] bg-transparent text-white hover:bg-new-grey hover:text-white uppercase whitespace-nowrap text-[11px] mobile-xl:text-sm rounded-[10px] px-3 mobile-xl:px-4 py-2.5 mobile-xl:py-3.5 h-auto"
        >
          <Link href={routes.blacklist} className="pointer-events-none">Черный список</Link>
        </Button>
        <Button
          asChild
          className="flex-1 lg:flex-none bg-yellow-main hover:bg-yellow-main/90 text-black uppercase whitespace-nowrap text-[11px] mobile-xl:text-sm rounded-[10px] px-3 mobile-xl:px-4 py-2.5 mobile-xl:py-3.5 h-auto"
        >
          <Link href={routes.partners}>Добавить агента</Link>
        </Button> */}
      </div>
    </div>
  );
};
