import { Send } from "lucide-react";
import Link from "next/link"
import { FC } from "react"

interface AddCommentProps {
    exchanger_id: number;
    review_id: number;
}

export const AddComment: FC<AddCommentProps> = ({ exchanger_id, review_id }) => {
    const url = `${process.env.NEXT_PUBLIC_TGBOT_BASE_URL}?start=new_comment__${exchanger_id}__${review_id}`;
    return (
        <Link 
            target="_blank" 
            href={url} 
            className="text-yellow-main mobile-xl:text-sm text-xs font-medium uppercase truncate flex items-center gap-2"
        >
            Ответить
            <Send className="mobile-xl:size-5 size-4 stroke-[2px]" />
        </Link>
    )
}