import { VcReview, VcReviewRating } from "../api/vc-dto";

const ratingScoreMap: Record<VcReviewRating, number> = {
  positive: 5,
  neutral: 3,
  negative: 1,
};

export function getVcRating(reviews: VcReview[]) {
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
