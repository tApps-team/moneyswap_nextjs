import z from "zod";
export const reasons = ["Ошибка", "Проблема с обменником", "Сотрудничество", "Другое"];

export const feedbackFormSchema = z.object({
  username: z
    .string({ required_error: "Это поле обязательно", message: "Это поле обязательно" })
    .min(2, { message: "Это поле обязательно" }),
  email: z
    .string({ required_error: "Это поле обязательно" })
    .min(1, { message: "Это поле обязательно" })
    .refine((val) => val.includes("@"), {
      message: "Введите корректный email или телеграм юзернейм с @ (пример: @username)",
    }),
  reasons: z.enum(["Ошибка", "Проблема с обменником", "Сотрудничество", "Другое"], {
    required_error: "Это поле обязательно",
    invalid_type_error: "Это поле обязательно",
  }),

  description: z
    .string({ required_error: "Это поле обязательно", message: "Это поле обязательно" })
    .min(1, { message: "Это поле обязательно" }),

  agreePrivacy: z.boolean().optional(),
  agreePricingPolicy: z.boolean().optional(),
}).superRefine((data, ctx) => {
  if (data.reasons !== "Сотрудничество") return;
  if (data.agreePrivacy !== true) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Необходимо ознакомиться с политикой конфиденциальности",
      path: ["agreePrivacy"],
    });
  }
  if (data.agreePricingPolicy !== true) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Необходимо ознакомиться с политикой тарификации",
      path: ["agreePricingPolicy"],
    });
  }
});
export type FeedbackFormType = z.infer<typeof feedbackFormSchema>;
