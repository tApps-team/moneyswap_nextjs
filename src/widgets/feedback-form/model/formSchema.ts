import z from "zod";
export const reasons = ["Ошибка", "Проблемма с обменником", "Сотрудничество", "Другое"];

export const feedbackFormSchema = z.object({
  username: z
    .string({ required_error: "Это поле обязательно", message: "Это поле обязательно" })
    .min(2, { message: "Это поле обязательно" }),
  email: z
    .string({ required_error: "Это поле обязательно" })
    .email({ message: "Это поле обязательно" })
    .min(1, { message: "Это поле обязательно" }),
  reasons: z.enum(["Ошибка", "Проблемма с обменником", "Сотрудничество", "Другое"]),

  description: z
    .string({ required_error: "Это поле обязательно", message: "Это поле обязательно" })
    .min(1, { message: "Это поле обязательно" }),
});
export type FeedbackFormType = z.infer<typeof feedbackFormSchema>;
