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
        className="grid shadow-[1px_3px_10px_3px_rgba(0,0,0,0.3)] bg-dark-gray md:rounded-2xl p-6 rounded-3xl items-start gap-6 grid-cols-1"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <p className="text-white uppercase md:text-lg text-base font-medium text-center">
          Форма для обратной связи
        </p>
        <div className="flex flex-col gap-3">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    className="text-base bg-black placeholder:text-white text-white border-none rounded-3xl px-4 uppercase focus:outline-none placeholder:transition-opacity placeholder:duration-400 focus:placeholder:opacity-0 placeholder:opacity-1"
                    placeholder="ИМЯ"
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
                    className="text-base bg-black placeholder:text-white text-white border-none rounded-3xl px-4 uppercase focus:outline-none placeholder:transition-opacity placeholder:duration-400 focus:placeholder:opacity-0 placeholder:opacity-1"
                    placeholder="ПОЧТА"
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
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  className="bg-black resize-none h-52 p-4 placeholder:uppercase placeholder:text-white text-white border-none rounded-3xl focus:outline-none placeholder:transition-opacity placeholder:duration-400 focus:placeholder:opacity-0 placeholder:opacity-1 text-base"
                  placeholder="Напишите текст..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className="bg-yellow-main uppercase rounded-full text-center w-full text-black h-[54px]"
          type="submit"
        >
          {form.formState.isSubmitting ? <Loader className="animate-spin" /> : "Отправить"}
        </Button>
        <p className="text-center text-sm font-medium uppercase">НАШИ СОЦИАЛЬНЫЕ СЕТИ</p>
        <SocialNetworks />
      </form>
    </Form>
  );
};
