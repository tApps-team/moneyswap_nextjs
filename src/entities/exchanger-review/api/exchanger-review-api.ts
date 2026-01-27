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
  
  try {
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
      console.error(`Failed to fetch reviews by exchange: ${result.status} ${result.statusText}`);
      return {
        page: props.page,
        element_on_page: props.element_on_page || 10,
        content: [],
        pages: 0,
      };
    }

    return result.json();
  } catch (error) {
    console.error("Error fetching reviews by exchange:", error);
    return {
      page: props.page,
      element_on_page: props.element_on_page || 10,
      content: [],
      pages: 0,
    };
  }
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
