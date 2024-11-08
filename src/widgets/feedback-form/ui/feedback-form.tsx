"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
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
        className="grid shadow-[1px_3px_10px_3px_rgba(0,0,0,0.7)] bg-dark-gray rounded-2xl p-6  items-start gap-6 grid-cols-1 "
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
              <FormItem>
                <FormControl>
                  <Input
                    className="bg-black placeholder:text-white text-white border-none rounded-3xl"
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
                    className="bg-black placeholder:text-white text-white border-none rounded-3xl"
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
                  className="bg-black resize-none h-52 p-4 placeholder:uppercase placeholder:text-white text-white border-none rounded-3xl"
                  placeholder="Напишите текст..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className="bg-yellow-main uppercase rounded-full text-center w-full text-black"
          type="submit"
        >
          {form.formState.isSubmitting ? <Loader className="animate-spin" /> : "Отправить"}
        </Button>
        <div>
          <p className="text-center text-xs">НАШИ СОЦИАЛЬНЫЕ СЕТИ</p>
          <TelegramCircleIcon className="w-12 h-12" />
        </div>
      </form>
    </Form>
  );
};
