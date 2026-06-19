import { VedReview, VedReviewRating } from "../api/ved-dto";
import { VedReviewDisplay, VedReviewFilter } from "../model/ved-review-display";

const sentimentStarsMap: Record<VedReviewRating, number> = {
  positive: 5,
  neutral: 3,
  negative: 2,
};

function formatReviewDate(date?: string) {
  if (!date) return "";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function mapVedReviewToDisplay(review: VedReview): VedReviewDisplay {
  return {
    id: review.id,
    username: review.username,
    stars: sentimentStarsMap[review.rating] ?? 3,
    sentiment: review.rating,
    text: review.text,
    date: formatReviewDate(review.review_date) || "—",
  };
}

export function getVedAgentReviewsDisplay(apiReviews: VedReview[]): VedReviewDisplay[] {
  const fromApi = apiReviews.map(mapVedReviewToDisplay);

  return fromApi;
}

export function filterVedReviews(reviews: VedReviewDisplay[], filter: VedReviewFilter) {
  if (filter === "all") return reviews;
  return reviews.filter((review) => review.sentiment === filter);
}
