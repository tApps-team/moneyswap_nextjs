import { Send } from "lucide-react";
import Link from "next/link"
import { FC } from "react"

interface AddCommentProps {
    exchanger_name: string;
    review_id: number;
}

export const AddComment: FC<AddCommentProps> = ({ exchanger_name, review_id }) => {
    const url = `${process.env.NEXT_PUBLIC_TGBOT_BASE_URL}?start=comment__${exchanger_name}__${review_id}`;
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