"use client";

import { Star } from "lucide-react";
import { FC, useEffect, useRef, useState } from "react";
import { cn } from "@/shared/lib";
import { VedReviewDisplay } from "../model/ved-review-display";

const TEXT_CLAMP_LINES = 4;

interface VedReviewCardProps {
  review: VedReviewDisplay;
  onReply?: () => void;
}

function getStarStyles(stars: number) {
  if (stars >= 5) return { icon: "text-green-400 fill-green-400", text: "text-green-400" };
  if (stars >= 4) return { icon: "text-yellow-main fill-yellow-main", text: "text-yellow-main" };
  if (stars >= 3) return { icon: "text-light-gray fill-light-gray", text: "text-light-gray" };
  return { icon: "text-[#e8a090] fill-[#e8a090]", text: "text-[#e8a090]" };
}

export const VedReviewCard: FC<VedReviewCardProps> = ({ review, onReply }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [canExpand, setCanExpand] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const checkOverflow = () => {
      if (!textRef.current) return;
      setCanExpand(textRef.current.scrollHeight > textRef.current.clientHeight);
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [review.text, isExpanded]);

  const starStyles = getStarStyles(review.stars);

  return (
    <article className="flex flex-col gap-4 bg-new-dark-grey border border-[#575A62]/50 rounded-[15px] mobile-xl:rounded-[20px] p-5 mobile-xl:p-6 h-full">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <Star className={cn("w-5 h-5 shrink-0", starStyles.icon)} />
          <span className={cn("font-semibold text-lg leading-none", starStyles.text)}>
            {review.stars}
          </span>
        </div>
        <div className="text-right min-w-0">
          <p className="font-semibold text-white truncate">{review.username}</p>
          <p className="text-sm text-light-gray">{review.date}</p>
        </div>
      </div>

      <div className="relative flex-1">
        <p
          ref={textRef}
          className="text-sm text-light-gray leading-relaxed"
          style={
            !isExpanded
              ? {
                  display: "-webkit-box",
                  WebkitLineClamp: TEXT_CLAMP_LINES,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }
              : undefined
          }
        >
          {review.text}
        </p>
        {(canExpand || isExpanded) && (
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="mt-2 text-sm text-[#5eb8f0] hover:text-[#039BE5] transition-colors"
          >
            {isExpanded ? "Свернуть" : "Еще"}
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={onReply}
        className="text-sm text-[#5eb8f0] hover:text-[#039BE5] w-fit transition-colors"
      >
        Ответить
      </button>
    </article>
  );
};
