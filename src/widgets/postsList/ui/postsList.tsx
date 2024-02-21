import { PostCard } from "@/entities/postCard";
import { Post } from "@/shared/types";
import { FC } from "react";
import styles from "./postsList.module.scss";

interface PostListProps {
  posts: Post[];
}

export const PostsList: FC<PostListProps> = (props) => {
  const { posts } = props;
  return (
    <section className={styles.posts}>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </section>
  );
};
