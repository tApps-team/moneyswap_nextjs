import { getPost } from "@/shared/api";

interface PostProps {
  params: {
    id: string;
  };
}

export const Post = async (props: PostProps) => {
  const { id } = props.params;
  const post = await getPost(id);
  return (
    <section>
      <h1>
        {post.id}. {post.title}
      </h1>
    </section>
  );
};
