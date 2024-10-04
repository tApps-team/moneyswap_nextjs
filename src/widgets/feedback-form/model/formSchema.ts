import z from "zod";
export const reasons = ["Ошибка", "Проблемма с обменником", "Сотрудничество", "Другое"];

export const feedbackFormSchema = z.object({
  username: z.string(),
  email: z.string().email(),
  //   reasons: z.array(z.string()).refine((value) => value.some((item) => item), {
  //     message: "Вы должны выбрать причину обращения",
  //   }),
  reasons: z.enum(["Ошибка", "Проблемма с обменником", "Сотрудничество", "Другое"]),

  decription: z.string(),
});
export type FeedbackFormType = z.infer<typeof feedbackFormSchema>;
