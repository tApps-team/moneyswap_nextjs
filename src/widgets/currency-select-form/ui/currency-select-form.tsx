"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CurrecnySwitcher, CurrencySelect } from "@/features/currency";
import { Currency, CurrencyResponse, getAvailableValutes } from "@/entities/currency";
import { cn } from "@/shared/lib";
import { directions } from "@/shared/types";
import { Button, Form } from "@/shared/ui";
const formSchema = z.object({
  valuteFrom: z.string().optional(),
  valuteTo: z.string().optional(),
  tab: z.string().optional(),
});
export const CurrecnySelectForm = () => {
  const [tabValue, setTabValue] = useState<directions.cash | directions.noncash>(directions.cash);

  const [giveCurrencies, setGiveCurrencies] = useState<CurrencyResponse[]>();
  const [getCurrencies, setGetCurrencies] = useState<CurrencyResponse[]>();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });
  useEffect(() => {
    getAvailableValutes({ base: "all" }).then((data) => setGiveCurrencies(data));
  }, []);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };
  return (
    <Form {...form}>
      <form
        className="text-white h-72 py-4 px-7 bg-[#16192e] rounded-lg"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className=" flex items-center justify-between">
          <p>Выберите направление обмена</p>
          <div className="flex gap-4 bg-[#2d3049] rounded-[4px] p-1">
            <Button
              type="button"
              role="tab"
              id="changeCash"
              className={cn(
                "bg-transparent rounded-[4px] py-2 px-6 hover:brightness-125 ",
                tabValue === directions.cash && "bg-[#16192e]",
              )}
              onClick={() => setTabValue(directions.cash)}
            >
              Обмен наличных
            </Button>
            <Button
              type="button"
              role="tab"
              id="changeOnline"
              className={cn(
                "bg-transparent rounded-[4px] py-2 px-6 hover:brightness-125",
                tabValue === directions.noncash && "bg-[#16192e]",
              )}
              onClick={() => setTabValue(directions.noncash)}
            >
              Обмен онлайн
            </Button>
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between">
            <CurrencySelect currencies={giveCurrencies} label="Отдаете" />
            <CurrecnySwitcher />
            <CurrencySelect currencies={getCurrencies} label="Получаете" />
          </div>
        </div>
        <Button>Submit</Button>
      </form>
    </Form>
  );
};
