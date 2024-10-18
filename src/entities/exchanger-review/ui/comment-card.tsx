import { formatDate } from "@/shared/lib";
import { Comment } from "..";

type CommentCardProps = {
  comment: Comment;
};

export const CommentCard = (props: CommentCardProps) => {
  const { comment } = props;
  return (
    <div className="grid gap-2 bg-transparent pt-3">
      <div className="grid gap-0.5">
        <p className="uppercase text-black font-medium">
          {comment?.role === "admin" ? "ОТВЕТ ОТ АДМИНИСТРАЦИИ" : "ОТВЕТ ОТ ПОЛЬЗОВАТЕЛЯ"}
        </p>
        <div className="grid grid-cols-[1fr_auto] justify-between items-center gap-2">
          <p className="truncate uppercase text-[14px] font-semibold">
            {comment?.role === "admin" ? "MONEYSWAP" : "ПОЛЬЗОВАТЕЛЬ"}
          </p>
          <p className="justify-self-end font-normal uppercase text-sm">
            {formatDate(comment?.comment_date)} / {comment?.comment_time}
          </p>
        </div>
      </div>
      <div className="relative">
        <div className="pl-4">
          <p className="text-black">{comment?.text}</p>
          <span className="absolute left-0 top-0 w-[4px] rounded-md bg-black h-full"></span>
        </div>
      </div>
    </div>
  );
};
