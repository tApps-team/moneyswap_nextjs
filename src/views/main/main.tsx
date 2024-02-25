import { PostsList } from "@/widgets/postsList/ui/postsList";
import { getPosts } from "@/shared/api";

export const Main = async () => {
  const posts = await getPosts();
  return (
    <section>
      <h1>POSTS PAGE</h1>
      <PostsList posts={posts} />
    </section>
  );
};
