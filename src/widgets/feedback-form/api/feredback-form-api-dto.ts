import { FeedbackFormType } from "../model/formSchema";

export type PostFeedbackFormDtoResponse = {
  status: string;
  details: string;
};
export type PostFeedbackFormDtoRequest = FeedbackFormType;
