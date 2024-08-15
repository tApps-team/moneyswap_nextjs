export const BlogTagPage = async ({ params }: { params: { tag: string } }) => {
  const tag = params.tag;

  return (
    <section>
      BLOG TAG PAGE
      {tag}
    </section>
  );
};
