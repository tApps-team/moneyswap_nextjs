import { createStandardHeaders, logRequestHeaders } from "@/shared/lib/debug-headers";
import {
  GetCommentsByReviewDtoRequest,
  GetCommentsByReviewDtoResponse,
  ReviewsByExchangeDTORequest,
  ReviewsByExchangeDTOResponse,
} from "./exchanger-review-api-dto";

export const reviewsByExchange = async (
  props: ReviewsByExchangeDTORequest,
): Promise<ReviewsByExchangeDTOResponse> => {
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v2/reviews/reviews_by_exchange`;
  
  const headers = createStandardHeaders({
    "Moneyswap": "true",
  });
  
  const queryParams = new URLSearchParams();
  Object.entries(props).forEach(([key, value]) => {
    if (value !== undefined) {
      queryParams.append(key, value.toString());
    }
  });
  
  const fullUrl = `${url}?${queryParams.toString()}`;
  logRequestHeaders(fullUrl, headers);
  
  const result = await fetch(fullUrl, {
    method: "GET",
    headers,
    next: {
      revalidate: 10,
      tags: ["reviews_by_exchange", String(props.exchange_id)],
    },
  });

  if (!result.ok) {
    throw new Error("Failed to fetch reviews by exchange");
  }

  return result.json();
};

export const getCommentsByReview = async (
  props: GetCommentsByReviewDtoRequest,
): Promise<GetCommentsByReviewDtoResponse> => {
  const { reviewId } = props;
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v2/reviews/get_comments_by_review?review_id=${reviewId}`;
  
  const headers = createStandardHeaders({
    "Moneyswap": "true",
  });
  
  logRequestHeaders(url, headers);
  
  const result = await fetch(url, {
    method: "GET",
    headers,
    next: {
      revalidate: 10,
      tags: ["comments_by_review", String(reviewId)],
    },
  });

  if (!result.ok) {
    throw new Error("Failed to fetch comments by review");
  }

  return result.json();
};
