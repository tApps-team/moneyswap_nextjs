export const BlogCategoryPage = async ({ params }: { params: { category: string } }) => {
  const category = params.category;
  return (
    <section>
      BLOG CATEGORY PAGE
      {category}
    </section>
  );
};
