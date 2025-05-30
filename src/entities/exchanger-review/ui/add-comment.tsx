import { Send } from "lucide-react";
import Link from "next/link"
import { FC } from "react"
import { ExchangerMarker } from "@/shared/types"

interface AddCommentProps {
    exchanger_marker: ExchangerMarker;
    exchanger_id: number;
    review_id: number;
}

export const AddComment: FC<AddCommentProps> = ({ exchanger_marker, exchanger_id, review_id }) => {
    return (
        <Link 
            target="_blank" 
            href={`${process.env.TGBOT_BASE_URL}?start=comment__${exchanger_marker}__${exchanger_id}__${review_id}`} 
            className="text-yellow-main mobile-xl:text-sm text-xs font-medium uppercase truncate flex items-center gap-2"
        >
            Ответить
            <Send className="mobile-xl:size-5 size-4 stroke-[2px]" />
        </Link>
    )
}