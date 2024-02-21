import { Post } from "@/shared/types";
import styles from "./postCard.module.scss";
import { FC } from "react";
import Link from "next/link";

interface PostCardProps {
  post: Post;
}

export const PostCard: FC<PostCardProps> = (props) => {
  const { post } = props;
  return (
    <Link className={`link ${styles.todo}`} href={`/${post.id}`}>
      <h3>
        {post.id}. {post.title}
      </h3>
      <p>{post.body}</p>
    </Link>
  );
};
