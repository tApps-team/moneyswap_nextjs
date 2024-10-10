import { apiClient } from "@/shared/api";
import { PostFeedbackFormDtoRequest, PostFeedbackFormDtoResponse } from "./feredback-form-api-dto";

export const postFeedbackForm = async (props: PostFeedbackFormDtoRequest) => {
  const url = "/api/feedback_form";
  const response = await apiClient.post<PostFeedbackFormDtoResponse>(url, props);
  return response;
};
