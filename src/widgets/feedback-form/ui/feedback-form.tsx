"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { SocialNetworks } from "@/features/social-networks";
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  RadioGroup,
  RadioGroupItem,
  Textarea,
} from "@/shared/ui";
import { postFeedbackForm } from "../api/feedback-form-api";
import { FeedbackFormType, feedbackFormSchema, reasons } from "../model/formSchema";

export const FeedbackForm = () => {
  const form = useForm<FeedbackFormType>({
    resolver: zodResolver(feedbackFormSchema),
    defaultValues: {
      reasons: "Сотрудничество",
      description: "",
      email: "",
      username: "",
    },
  });

  const onSubmit = async (data: FeedbackFormType) => {
    //clear form data
    await postFeedbackForm(data);
    console.log(data);
  };
  return (
    <Form {...form}>
      <form
        className="grid  bg-new-dark-grey md:rounded-2xl p-6 rounded-[9px] items-start gap-6 grid-cols-1"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <p className="text-white uppercase md:text-lg text-base font-normal text-center">
          <span className="text-yellow-main font-semibold">Форма</span>
          <br />
          для обратной связи
        </p>
        <div className="flex flex-col gap-3">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    className="text-base  bg-[#D9D9D9] placeholder:text-[#373737] text-black border-none rounded-[9px] px-4  focus:outline-none placeholder:transition-opacity placeholder:duration-400 focus:placeholder:opacity-0 placeholder:opacity-1 font-light"
                    placeholder="Имя"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="email"
                    className="text-base bg-[#D9D9D9] placeholder:text-[#373737]  text-black border-none rounded-[9px] px-4  focus:outline-none placeholder:transition-opacity placeholder:duration-400 focus:placeholder:opacity-0 placeholder:opacity-1 font-light"
                    placeholder="Почта"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
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
                          className="w-6 h-6 checked:bg-yellow-main border-white border-2"
                          value={reason}
                        />
                      </FormControl>
                      <FormLabel className="font-light">{reason}</FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  className="bg-[#D9D9D9] resize-none h-52 p-4  placeholder:text-[#373737] text-black border-none rounded-[9px] focus:outline-none placeholder:transition-opacity placeholder:duration-400 focus:placeholder:opacity-0 placeholder:opacity-1 text-base font-light"
                  placeholder="Напишите текст..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className="bg-yellow-main  font-semibold rounded-[9px] text-center w-full text-black h-[54px] "
          type="submit"
        >
          {form.formState.isSubmitting ? <Loader className="animate-spin" /> : "Отправить"}
        </Button>
        <p className="text-center text-sm font-normal ">НАШИ СОЦИАЛЬНЫЕ СЕТИ</p>
        <SocialNetworks />
      </form>
    </Form>
  );
};
