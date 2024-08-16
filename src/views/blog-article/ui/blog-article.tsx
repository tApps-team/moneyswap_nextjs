export const BlogArticlePage = async ({ params }: { params: { article: string } }) => {
  const article = params.article;
  return (
    <section>
      BLOG ARTICLE PAGE
      {article}
    </section>
  );
};
