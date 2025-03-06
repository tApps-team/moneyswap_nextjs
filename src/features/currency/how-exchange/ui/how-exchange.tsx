import { FC } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/shared/ui";
import { HowExchangeContent } from "./content";

interface HowExchangeProps {
  hover?: true;
}

export const HowExchange: FC<HowExchangeProps> = ({ hover }) => {
  return (
    <>
      {hover ? (
        <HoverCard openDelay={0}>
          <HoverCardTrigger asChild>
            <div className="cursor-pointer w-full h-full uppercase px-4 py-3 rounded-[10px] border-[1px] border-white grid justify-items-stretch justify-stretch items-center">
              <p className="xl:text-sm text-xs text-center font-normal">как совершить обмен?</p>
            </div>
          </HoverCardTrigger>
          <HoverCardContent className="rounded-[10px] border-none min-w-[500px] p-8 flex flex-col gap-5 text-white bg-new-dark-grey">
            <HowExchangeContent />
          </HoverCardContent>
        </HoverCard>
      ) : (
        <AlertDialog>
          <AlertDialogTrigger
            asChild
            className="cursor-pointer flex justify-center items-center mobile-xl:border-[1px] border-[0.5px] mobile-xl:rounded-[10px] rounded-[5px] border-[#7A7C80] text-[#7A7C80] leading-none"
          >
            <div className="lg:px-4 lg:py-1.5 mobile-xl:px-2.5 mobile-xl:py-2 px-1.5 py-0.5">
              <p className="mobile-xl:text-xs mobile:text-2xs text-[9px] font-semibold leading-none truncate">
                как совершить обмен?
              </p>
            </div>
          </AlertDialogTrigger>
          <AlertDialogContent className="rounded-[10px] border-none mobile-xl:w-full w-[90vw] p-8 flex flex-col gap-5 text-white bg-new-dark-grey">
            <AlertDialogHeader className="sr-only">
              <AlertDialogTitle className="sr-only"></AlertDialogTitle>
              <AlertDialogDescription className="sr-only"></AlertDialogDescription>
            </AlertDialogHeader>
            <div className="lg:pb-8 lg:pt-4 pb-4 pt-2 font-medium text-yellow-main lg:text-xl md:text-base mobile-xl:text-sm text-xs uppercase text-center">
              как совершить обмен?
            </div>
            <HowExchangeContent />
            <AlertDialogFooter className="lg:pt-8 pt-4">
              <AlertDialogAction className="rounded-[6px] bg-yellow-main text-dark-gray">
                Понятно
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
};
