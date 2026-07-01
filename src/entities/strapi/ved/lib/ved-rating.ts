import { VedReview, VedReviewRating } from "../api/ved-dto";

const ratingScoreMap: Record<VedReviewRating, number> = {
  positive: 5,
  neutral: 3,
  negative: 1,
};

export function getVedAgentRating(reviews: VedReview[]) {
  const reviewCount = reviews.length;

  if (reviewCount === 0) {
    return { ratingValue: 0, reviewCount: 0 };
  }

  const totalScore = reviews.reduce((sum, review) => {
    return sum + (ratingScoreMap[review.rating] ?? 3);
  }, 0);

  return {
    ratingValue: Math.round((totalScore / reviewCount) * 10) / 10,
    reviewCount,
  };
}

export function getVedReviewBreakdown(reviews: VedReview[]) {
  return reviews.reduce(
    (acc, review) => {
      if (review.rating === "positive") acc.positive += 1;
      else if (review.rating === "negative") acc.negative += 1;
      else acc.neutral += 1;
      return acc;
    },
    { positive: 0, neutral: 0, negative: 0 },
  );
}

export function formatVedLimit(value: string | null | undefined) {
  if (value == null || value === "") return "—";
  const numeric = Number(value.replace(/\s/g, ""));
  if (Number.isNaN(numeric)) return value;
  return new Intl.NumberFormat("ru-RU").format(numeric);
}
