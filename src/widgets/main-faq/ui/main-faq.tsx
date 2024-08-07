import { getFaq } from "@/shared/api";
import { directions, mainFaqTypes } from "@/shared/types";
import { AccordionList } from "../accordion";

export const MainFAQ = async () => {
  // надо знать какое направление выбрано cash/noncash
  const direction = directions.cash;

  // const filteredFaqs = await getFaq(
  //   direction === directions.cash ? mainFaqTypes.cash : mainFaqTypes.noncash,
  // );
  // const basicFaqs = await getFaq(mainFaqTypes.basic);

  return (
    <div className="grid grid-cols-2 py-[50px] gap-[5%] w-full">
      <div className="w-full">
        <div className="pb-6 border-b-[#bbbbbb] border-b-[1.5px]">
          <h3 className="text-xl text-[#f6ff5f] font-[900] uppercase truncate">
            {direction === directions.cash
              ? "Вопросы по наличному обмену"
              : "Вопросы по безналичному обмену"}
          </h3>
        </div>
        {/* <AccordionList data={filteredFaqs.data} /> */}
      </div>
      <div className="w-full">
        <div className="pb-6 border-b-[#bbbbbb] border-b-[1.5px]">
          <h3 className="text-xl text-[#f6ff5f] font-[900] uppercase truncate">Общие вопросы</h3>
        </div>
        {/* <AccordionList data={basicFaqs.data} /> */}
      </div>
    </div>
  );
};
