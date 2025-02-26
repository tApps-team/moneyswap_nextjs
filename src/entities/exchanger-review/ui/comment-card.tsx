import { formatDate } from "@/shared/lib";
import { Comment } from "..";

type CommentCardProps = {
  comment: Comment;
};

export const CommentCard = (props: CommentCardProps) => {
  const { comment } = props;
  return (
    <div className="grid gap-3 bg-transparent pt-5">
      <div className="grid gap-1.5">
        <p className="text-yellow-main mobile-xl:text-sm text-xs font-light">
          {comment?.role === "admin" ? "Ответ от администрации" : "Ответ от пользователя"}
        </p>
        <div className="grid grid-cols-[1fr_auto] justify-between items-center gap-2">
          <p className="truncate uppercase mobile-xl:text-sm text-xs font-bold text-white">
            {comment?.role === "admin" ? "MONEYSWAP" : "ПОЛЬЗОВАТЕЛЬ"}
          </p>
          <p className="text-yellow-main justify-self-end font-medium uppercase mobile-xl:text-sm text-xs">
            {formatDate(comment?.comment_date)} / {comment?.comment_time}
          </p>
        </div>
      </div>
      <div className="relative">
        <div className="pl-3">
          <p className="text-white mobile-xl:text-sm text-xs">{comment?.text}</p>
          <span className="absolute left-0 top-0 w-[1px] rounded-md bg-font-light-grey h-full"></span>
        </div>
      </div>
    </div>
  );
};
