"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { TelegramCircleIcon } from "@/shared/assets/icons/telegram-circle-icon";
import {
  Button,
  Checkbox,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  Input,
  RadioGroup,
  RadioGroupItem,
  Textarea,
} from "@/shared/ui";
import { FeedbackFormType, feedbackFormSchema, reasons } from "../model/formSchema";

export const FeedbackForm = () => {
  const form = useForm<FeedbackFormType>({
    resolver: zodResolver(feedbackFormSchema),
    defaultValues: {
      reasons: "Сотрудничество",
      decription: "",
      email: "",
      username: "",
    },
  });
  const onSubmit = (data: FeedbackFormType) => {
    console.log(data);
  };
  return (
    <Form {...form}>
      <form
        className="grid shadow-[1px_3px_10px_3px_rgba(0,0,0,0.7)] rounded-2xl p-6  items-start gap-6 grid-cols-1 "
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <p className="text-white uppercase text-lg font-medium text-center">
          Форма для обратной связи
        </p>
        <div className="flex flex-col gap-3">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <Input
                className="bg-black placeholder:text-white text-white border-none rounded-3xl"
                placeholder="ИМЯ"
                {...field}
              />
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <Input
                type="email"
                className="bg-black placeholder:text-white text-white border-none rounded-3xl"
                placeholder="ПОЧТА"
                {...field}
              />
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="reasons"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <RadioGroup
                  defaultValue="Сотрудничество"
                  className="flex flex-col gap-2 uppercase"
                  onValueChange={field.onChange}
                >
                  {reasons.map((reason) => (
                    <FormItem className="flex space-y-0 items-center gap-4 " key={reason}>
                      <FormControl>
                        <RadioGroupItem
                          className="w-6 h-6 checked:bg-[#f6ff5f] border-white border-2"
                          value={reason}
                        />
                      </FormControl>
                      <FormLabel>{reason}</FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="decription"
          render={({ field }) => (
            <Textarea
              className="bg-black resize-none h-52 p-4 placeholder:uppercase placeholder:text-white text-white border-none rounded-3xl"
              placeholder="Напишите текст..."
              {...field}
            />
          )}
        />
        <Button
          className="bg-[#f6ff5f] uppercase rounded-full text-center w-full text-black"
          type="submit"
        >
          Отправить
        </Button>
        <div>
          <p className="text-center text-xs">НАШИ СОЦИАЛЬНЫЕ СЕТИ</p>
          <TelegramCircleIcon className="w-12 h-12" />
        </div>
      </form>
    </Form>
  );
};
