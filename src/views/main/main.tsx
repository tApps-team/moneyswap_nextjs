import { getPosts } from "@/shared/api";
import { PostsList } from "@/widgets/postsList/ui/postsList";

export const Main = async () => {
  const posts = await getPosts();
  return (
    <section>
      <h1>POSTS PAGE</h1>
      <PostsList posts={posts} />
    </section>
  );
};
