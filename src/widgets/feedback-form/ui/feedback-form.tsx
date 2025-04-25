"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { SocialNetworks } from "@/features/social-networks";
import { useToast } from "@/shared/hooks";
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

type FeedbackFormProps = {
  type: "partner" | "user";
};

export const FeedbackForm = ({ type }: FeedbackFormProps) => {
  const { toast } = useToast();
  const form = useForm<FeedbackFormType>({
    resolver: zodResolver(feedbackFormSchema),
    defaultValues: {
      reasons: type === "partner" ? "Сотрудничество" : "Ошибка",
      description: "",
      email: "",
      username: "",
    },
  });

  const onSubmit = async (data: FeedbackFormType) => {
    try {
      const response = await postFeedbackForm(data);
      
      if (response.status === "locked" || response.status === "423") {
        toast({
          title: "Ваша заявка уже отправлена",
          description: "Многократный спам может привести к автоблокировке. Мы обязательно рассмотрим ваш запрос и свяжемся с вами в ближайшее время.",
          variant: "destructive",
          className: "!p-4",
        });
      } else {
        toast({
          title: "Заявка успешно отправлена",
          description: "Мы обязательно рассмотрим ваш запрос и свяжемся с вами в ближайшее время.",
          variant: "default",
          className: "!p-4",
        });
      }
    } catch (error) {
      toast({
        title: "Ошибка при отправке заявки...",
        description: "Попробуйте позже",
        variant: "destructive",
        className: "!p-4",
      });
    } finally {
      form.reset();
    }
  };

  return (
    <Form {...form}>
      <form
        className="grid  bg-new-dark-grey md:rounded-2xl p-6 rounded-[9px] items-start gap-6 grid-cols-1"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <p className="text-white uppercase md:text-lg text-base font-normal text-center">
          <span className="text-yellow-main font-bold">Форма</span>
          <br />
          для {type === "user" ? "обратной связи" : "сотрудничества"}
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
                    type="text"
                    className="text-base bg-[#D9D9D9] placeholder:text-[#373737]  text-black border-none rounded-[9px] px-4  focus:outline-none placeholder:transition-opacity placeholder:duration-400 focus:placeholder:opacity-0 placeholder:opacity-1 font-light"
                    placeholder="Телеграм / почта для связи"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {type === "user" && (
          <FormField
            control={form.control}
            name="reasons"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <RadioGroup
                    defaultValue={"Ошибка"}
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
        )}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  className="bg-[#D9D9D9] resize-none h-52 p-4  placeholder:text-[#373737] text-black border-none rounded-[9px] focus:outline-none placeholder:transition-opacity placeholder:duration-400 focus:placeholder:opacity-0 placeholder:opacity-1 text-base font-light"
                  placeholder="Напишите текст..."
                  maxLength={1000}
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
