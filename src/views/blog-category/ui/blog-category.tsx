import { BlogSidebar, PopularArticles } from "@/widgets/blog";
import { CategoriesList } from "@/features/blog";
import { getAllCategories, getCategoryArticles } from "@/entities/blog";

export const BlogCategoryPage = async ({ params }: { params: { category: string } }) => {
  const category = params.category;
  const { data: articles } = await getCategoryArticles({ category });
  const { data: categories } = await getAllCategories();
  return (
    <section className="grid grid-flow-row gap-[40px]">
      <div className="flex justify-center items-center">
        <h1 className="uppercase text-3xl font-semibold text-center max-w-[80%]">
          {articles?.name}
        </h1>
      </div>
      <CategoriesList categories={categories?.categories} selectedCategory={category} />
      <div className="grid grid-cols-[1fr_0.4fr] gap-10 items-start">
        <PopularArticles articles={articles?.articles} />
        <BlogSidebar />
      </div>
    </section>
  );
};
